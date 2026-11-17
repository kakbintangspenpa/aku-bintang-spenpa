import {
  User,
  ClassRoom,
  JournalEntry,
  HabitId,
  TeacherCoaching,
  ParentFeedback,
  AppreciationBadge,
  AuditLog,
  GoogleDriveConfig,
  SchoolInfo,
  HabitTimeRuleConfig
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CLASSES,
  INITIAL_JOURNALS,
  INITIAL_COACHING,
  INITIAL_FEEDBACKS,
  INITIAL_BADGES,
  INITIAL_AUDIT_LOGS,
  INITIAL_DRIVE_CONFIG
} from '../data/initialData';
import { TUJUH_KEBIASAAN, HABIT_TIME_RESTRICTIONS } from '../data/constants';
import {
  supabase,
  mapUserFromDb,
  mapUserToDb,
  mapClassFromDb,
  mapClassToDb,
  mapJournalFromDb,
  mapJournalToDb,
  mapCoachingFromDb,
  mapCoachingToDb,
  mapFeedbackFromDb,
  mapFeedbackToDb,
  mapBadgeFromDb,
  mapBadgeToDb,
  mapAuditLogFromDb,
  mapAuditLogToDb,
  mapSchoolInfoFromDb,
  mapSchoolInfoToDb,
  mapHabitTimeRuleFromDb,
  mapHabitTimeRuleToDb
} from '../lib/supabaseClient';

const STORAGE_KEYS = {
  USERS: '7k_users_v1',
  CLASSES: '7k_classes_v1',
  JOURNALS: '7k_journals_v1',
  COACHING: '7k_coaching_v1',
  FEEDBACKS: '7k_feedbacks_v1',
  BADGES: '7k_badges_v1',
  AUDIT_LOGS: '7k_audit_logs_v1',
  SCHOOL_INFOS: '7k_school_infos_v1',
  HABIT_TIME_RULES: '7k_habit_time_rules_v1',
  DRIVE_CONFIG: '7k_drive_config_v1',
  CURRENT_USER: '7k_current_user_v1'
};

export function formatTimeRuleLabel(rule: HabitTimeRuleConfig): string {
  const sH = String(rule.startHour).padStart(2, '0');
  const sM = String(rule.startMinute).padStart(2, '0');
  const eH = String(rule.endHour).padStart(2, '0');
  const eM = String(rule.endMinute).padStart(2, '0');
  const tz = rule.timezoneLabel?.trim() ? ` ${rule.timezoneLabel.trim()}` : '';
  return `${sH}.${sM} - ${eH}.${eM}${tz}`;
}

export function getDefaultHabitTimeRules(): HabitTimeRuleConfig[] {
  return TUJUH_KEBIASAAN.map(h => {
    const preset = HABIT_TIME_RESTRICTIONS[h.id];
    if (preset) {
      return {
        habitId: h.id,
        habitName: h.title,
        enabled: true,
        startHour: preset.startHour,
        startMinute: preset.startMinute,
        endHour: preset.endHour,
        endMinute: preset.endMinute,
        timezoneLabel: 'WIB',
        lockOutsideWindow: true
      };
    }
    return {
      habitId: h.id,
      habitName: h.title,
      enabled: false,
      startHour: 5,
      startMinute: 0,
      endHour: 21,
      endMinute: 0,
      timezoneLabel: 'WIB',
      lockOutsideWindow: true
    };
  });
}

let idCounter = 0;
const generateId = (prefix: string) => {
  idCounter = (idCounter + 1) % 10000;
  return `${prefix}-${Date.now()}-${idCounter}-${Math.random().toString(36).slice(2, 7)}`;
};

export interface SupabaseSyncStatus {
  connected: boolean;
  permissionError: boolean;
  lastSyncedAt?: string;
  lastError?: string;
}

class StorageService {
  private syncListeners: (() => void)[] = [];
  private supabaseStatus: SupabaseSyncStatus = {
    connected: false,
    permissionError: false
  };
  private infoTableMissing = false;
  private timeRulesTableMissing = false;

  subscribeSync(listener: () => void): () => void {
    this.syncListeners.push(listener);
    return () => {
      this.syncListeners = this.syncListeners.filter(l => l !== listener);
    };
  }

  private notifySync(): void {
    this.syncListeners.forEach(fn => fn());
  }

  getSupabaseStatus(): SupabaseSyncStatus {
    return this.supabaseStatus;
  }

  getInfoTableMissing(): boolean {
    return this.infoTableMissing;
  }

  getTimeRulesTableMissing(): boolean {
    return this.timeRulesTableMissing;
  }

  // --- Initialization & Helper ---
  private getItem<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data) as T;
    } catch {
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error saving to localStorage [${key}]:`, err);
    }
  }

  // --- Full Sync From Supabase ---
  async syncFromSupabase(): Promise<SupabaseSyncStatus> {
    try {
      const [
        usersRes,
        classesRes,
        journalsRes,
        coachingsRes,
        feedbacksRes,
        badgesRes,
        logsRes
      ] = await Promise.all([
        supabase.from('users').select('*').order('created_at', { ascending: true }),
        supabase.from('classes').select('*').order('id', { ascending: true }),
        supabase.from('journals').select('*').order('created_at', { ascending: false }),
        supabase.from('teacher_coachings').select('*').order('created_at', { ascending: false }),
        supabase.from('parent_feedbacks').select('*').order('created_at', { ascending: false }),
        supabase.from('appreciation_badges').select('*').order('date', { ascending: false }),
        supabase.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(200)
      ]);

      const firstError =
        usersRes.error ||
        classesRes.error ||
        journalsRes.error ||
        coachingsRes.error ||
        feedbacksRes.error ||
        badgesRes.error ||
        logsRes.error;

      if (firstError) {
        const isPerm =
          firstError.code === '42501' ||
          firstError.message?.toLowerCase().includes('permission denied');
        this.supabaseStatus = {
          connected: false,
          permissionError: isPerm,
          lastError: firstError.message
        };
        this.notifySync();
        return this.supabaseStatus;
      }

      // Seed default admin account if Supabase users table is completely empty
      if (usersRes.data && usersRes.data.length === 0) {
        const defaultAdmin: User = {
          id: 'usr-admin-utama',
          username: 'admin',
          password: 'password123',
          fullName: 'Administrator Sekolah',
          role: 'admin',
          email: 'admin@sekolah.sch.id',
          status: 'active',
          createdAt: new Date().toISOString()
        };
        await supabase.from('users').upsert(mapUserToDb(defaultAdmin), { onConflict: 'id' });
        this.saveUsers([defaultAdmin]);
      } else if (usersRes.data) {
        this.saveUsers(usersRes.data.map(mapUserFromDb));
      }

      // Seed SMP classes (7.1-9.11) into Supabase if classes table is empty
      if (classesRes.data && classesRes.data.length === 0) {
        const cleanInitialClasses = INITIAL_CLASSES.map(c => ({
          ...c,
          waliKelasId: '',
          totalSiswa: 0
        }));
        await supabase.from('classes').upsert(cleanInitialClasses.map(mapClassToDb), { onConflict: 'id' });
        this.saveClasses(cleanInitialClasses);
      } else if (classesRes.data) {
        this.saveClasses(classesRes.data.map(mapClassFromDb));
      }

      if (journalsRes.data) {
        this.saveJournals(journalsRes.data.map(mapJournalFromDb));
      }

      if (coachingsRes.data) {
        this.saveCoachings(coachingsRes.data.map(mapCoachingFromDb));
      }

      if (feedbacksRes.data) {
        this.setItem(STORAGE_KEYS.FEEDBACKS, feedbacksRes.data.map(mapFeedbackFromDb));
      }

      if (badgesRes.data) {
        this.setItem(STORAGE_KEYS.BADGES, badgesRes.data.map(mapBadgeFromDb));
      }

      if (logsRes.data) {
        this.setItem(STORAGE_KEYS.AUDIT_LOGS, logsRes.data.map(mapAuditLogFromDb));
      }

      // Sync school_infos independently so a not-yet-created table never breaks the other 7 tables
      try {
        const infosRes = await supabase
          .from('school_infos')
          .select('*')
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false });

        if (infosRes.error) {
          const msg = (infosRes.error.message || '').toLowerCase();
          const isMissingTable =
            infosRes.error.code === 'PGRST205' ||
            infosRes.error.code === '42P01' ||
            msg.includes('could not find the table') ||
            msg.includes('does not exist');
          if (isMissingTable) {
            this.infoTableMissing = true;
          }
        } else if (infosRes.data) {
          this.infoTableMissing = false;
          this.saveSchoolInfos(infosRes.data.map(mapSchoolInfoFromDb));
        }
      } catch {
        // Keep localStorage fallback silently
      }

      // Sync habit_time_rules independently
      try {
        const rulesRes = await supabase
          .from('habit_time_rules')
          .select('*');

        if (rulesRes.error) {
          const msg = (rulesRes.error.message || '').toLowerCase();
          const isMissingTable =
            rulesRes.error.code === 'PGRST205' ||
            rulesRes.error.code === '42P01' ||
            msg.includes('could not find the table') ||
            msg.includes('does not exist');
          if (isMissingTable) {
            this.timeRulesTableMissing = true;
          }
        } else if (rulesRes.data) {
          this.timeRulesTableMissing = false;
          if (rulesRes.data.length > 0) {
            const dbMapped = rulesRes.data.map(mapHabitTimeRuleFromDb);
            const defaults = getDefaultHabitTimeRules();
            const merged = defaults.map(def => dbMapped.find(r => r.habitId === def.habitId) || def);
            this.setItem(STORAGE_KEYS.HABIT_TIME_RULES, merged);
          }
        }
      } catch {
        // Keep localStorage fallback silently
      }

      this.supabaseStatus = {
        connected: true,
        permissionError: false,
        lastSyncedAt: new Date().toISOString()
      };
      this.notifySync();
      return this.supabaseStatus;
    } catch (err: any) {
      this.supabaseStatus = {
        connected: false,
        permissionError: false,
        lastError: err?.message || 'Gagal terhubung ke Supabase'
      };
      this.notifySync();
      return this.supabaseStatus;
    }
  }

  private async runDbWrite(op: PromiseLike<{ error: any }>): Promise<void> {
    try {
      const { error } = await op;
      if (error) {
        const isPerm =
          error.code === '42501' ||
          error.message?.toLowerCase().includes('permission denied');
        this.supabaseStatus = {
          ...this.supabaseStatus,
          permissionError: isPerm || this.supabaseStatus.permissionError,
          lastError: error.message
        };
      } else {
        this.supabaseStatus = {
          connected: true,
          permissionError: false,
          lastSyncedAt: new Date().toISOString()
        };
      }
    } catch (err: any) {
      console.error('Supabase write failed:', err);
    }
  }

  // --- Users ---
  getUsers(): User[] {
    return this.getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  saveUsers(users: User[]): void {
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  addUser(user: Omit<User, 'id' | 'createdAt'>, actorName: string, actorRole: any): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: generateId('usr'),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    this.saveUsers(users);
    void this.runDbWrite(supabase.from('users').upsert(mapUserToDb(newUser), { onConflict: 'id' }));
    this.addAuditLog(actorName, actorRole, 'TAMBAH_PENGGUNA', `Menambahkan pengguna baru: ${newUser.fullName} (${newUser.role})`);
    return newUser;
  }

  addUsersBulk(newUsersInput: Omit<User, 'id' | 'createdAt'>[], actorName: string, actorRole: any): User[] {
    if (newUsersInput.length === 0) return [];
    const existing = this.getUsers();
    const now = new Date().toISOString();
    const createdUsers: User[] = newUsersInput.map(u => ({
      ...u,
      id: generateId('usr'),
      createdAt: now
    }));
    const combined = [...existing, ...createdUsers];
    this.saveUsers(combined);
    void this.runDbWrite(supabase.from('users').upsert(createdUsers.map(mapUserToDb), { onConflict: 'id' }));
    this.addAuditLog(actorName, actorRole, 'IMPORT_PENGGUNA_MASSAL', `Mengimpor ${createdUsers.length} pengguna baru secara massal melalui file Excel/CSV`);
    return createdUsers;
  }

  updateUser(id: string, updates: Partial<User>, actorName: string, actorRole: any): User | null {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates };
    this.saveUsers(users);
    void this.runDbWrite(supabase.from('users').upsert(mapUserToDb(users[idx]), { onConflict: 'id' }));
    this.addAuditLog(actorName, actorRole, 'UBAH_PENGGUNA', `Memperbarui akun pengguna: ${users[idx].fullName}`);
    return users[idx];
  }

  deleteUser(id: string, actorName: string, actorRole: any): boolean {
    const users = this.getUsers();
    const target = users.find(u => u.id === id);
    if (!target) return false;
    const filtered = users.filter(u => u.id !== id);
    this.saveUsers(filtered);
    void this.runDbWrite(supabase.from('users').delete().eq('id', id));
    this.addAuditLog(actorName, actorRole, 'HAPUS_PENGGUNA', `Menghapus akun pengguna: ${target.fullName}`);
    return true;
  }

  // --- Classes ---
  getClasses(): ClassRoom[] {
    const stored = this.getItem<ClassRoom[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
    const hasSmp = stored.some(c => c.name.includes('7.1') || c.id.includes('7-1'));
    if (!hasSmp && stored.length === 0) {
      this.saveClasses(INITIAL_CLASSES);
      return INITIAL_CLASSES;
    }
    return stored;
  }

  saveClasses(classes: ClassRoom[]): void {
    this.setItem(STORAGE_KEYS.CLASSES, classes);
  }

  addClass(cls: Omit<ClassRoom, 'id'>, actorName: string, actorRole: any): ClassRoom {
    const classes = this.getClasses();
    const newClass: ClassRoom = {
      ...cls,
      id: generateId('kelas')
    };
    classes.push(newClass);
    this.saveClasses(classes);
    void this.runDbWrite(supabase.from('classes').upsert(mapClassToDb(newClass), { onConflict: 'id' }));
    this.addAuditLog(actorName, actorRole, 'TAMBAH_KELAS', `Menambahkan kelas baru: ${newClass.name}`);
    return newClass;
  }

  updateClass(id: string, updates: Partial<ClassRoom>, actorName: string, actorRole: any): ClassRoom | null {
    const classes = this.getClasses();
    const idx = classes.findIndex(c => c.id === id);
    if (idx === -1) return null;
    classes[idx] = { ...classes[idx], ...updates };
    this.saveClasses(classes);
    void this.runDbWrite(supabase.from('classes').upsert(mapClassToDb(classes[idx]), { onConflict: 'id' }));
    this.addAuditLog(actorName, actorRole, 'UBAH_KELAS', `Memperbarui data kelas: ${classes[idx].name}`);
    return classes[idx];
  }

  deleteClass(id: string, actorName: string, actorRole: any): boolean {
    const classes = this.getClasses();
    const target = classes.find(c => c.id === id);
    if (!target) return false;
    const filtered = classes.filter(c => c.id !== id);
    this.saveClasses(filtered);
    void this.runDbWrite(supabase.from('classes').delete().eq('id', id));
    this.addAuditLog(actorName, actorRole, 'HAPUS_KELAS', `Menghapus kelas: ${target.name}`);
    return true;
  }

  generateSMPClasses(gradesToGenerate: number[] = [7, 8, 9], actorName: string = 'Administrator', actorRole: any = 'admin'): { addedCount: number; existingCount: number } {
    const currentClasses = this.getClasses();
    let addedCount = 0;
    const addedRows: ClassRoom[] = [];
    const newClasses = [...currentClasses];

    for (const grade of gradesToGenerate) {
      for (let i = 1; i <= 11; i++) {
        const className = `Kelas ${grade}.${i}`;
        const classAltName = `${grade}.${i}`;
        const id = `kelas-${grade}-${i}`;
        const alreadyExists = newClasses.some(
          c => c.name.toLowerCase() === className.toLowerCase() || c.name.toLowerCase() === classAltName.toLowerCase() || c.id === id
        );

        if (!alreadyExists) {
          const item: ClassRoom = {
            id,
            name: className,
            grade,
            waliKelasId: '',
            totalSiswa: 0,
            academicYear: '2026/2027'
          };
          newClasses.push(item);
          addedRows.push(item);
          addedCount++;
        }
      }
    }

    if (addedCount > 0) {
      this.saveClasses(newClasses);
      void this.runDbWrite(supabase.from('classes').upsert(addedRows.map(mapClassToDb), { onConflict: 'id' }));
      this.addAuditLog(actorName, actorRole, 'TAMBAH_KELAS_MASSAL', `Menambahkan ${addedCount} kelas SMP (${gradesToGenerate.map(g => `${g}.1-${g}.11`).join(', ')})`);
    }

    return { addedCount, existingCount: newClasses.length };
  }

  // --- Journals ---
  getJournals(): JournalEntry[] {
    const raw = this.getItem<JournalEntry[]>(STORAGE_KEYS.JOURNALS, INITIAL_JOURNALS);
    let migrated = false;
    const clean = raw.map(j => {
      if ((j.habitId as string) === 'bangun_pagi_ibadah') {
        migrated = true;
        return { ...j, habitId: 'bangun_pagi' as HabitId };
      }
      if ((j.habitId as string) === 'kedisiplinan_umum') {
        migrated = true;
        return { ...j, habitId: 'beribadah' as HabitId };
      }
      return j;
    });
    if (migrated) {
      this.saveJournals(clean);
    }
    return clean;
  }

  saveJournals(journals: JournalEntry[]): void {
    this.setItem(STORAGE_KEYS.JOURNALS, journals);
  }

  addJournal(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt' | 'guruVerified' | 'parentAcknowledged'>): JournalEntry {
    const journals = this.getJournals();
    const now = new Date().toISOString();
    const newEntry: JournalEntry = {
      ...entry,
      id: generateId('jrn'),
      guruVerified: false,
      parentAcknowledged: false,
      createdAt: now,
      updatedAt: now
    };
    journals.unshift(newEntry);
    this.saveJournals(journals);
    void this.runDbWrite(supabase.from('journals').upsert(mapJournalToDb(newEntry), { onConflict: 'id' }));
    this.addAuditLog(entry.siswaName, 'siswa', 'JURNAL_INPUT', `Mengisi jurnal kebiasaan: ${entry.habitId} (${entry.date})`);
    return newEntry;
  }

  updateJournal(id: string, updates: Partial<JournalEntry>, actorName?: string, actorRole?: any): JournalEntry | null {
    const journals = this.getJournals();
    const idx = journals.findIndex(j => j.id === id);
    if (idx === -1) return null;
    journals[idx] = {
      ...journals[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveJournals(journals);
    void this.runDbWrite(supabase.from('journals').upsert(mapJournalToDb(journals[idx]), { onConflict: 'id' }));
    if (actorName && actorRole) {
      this.addAuditLog(actorName, actorRole, 'JURNAL_UPDATE', `Memperbarui jurnal ID: ${id}`);
    }
    return journals[idx];
  }

  verifyJournalByGuru(id: string, guruName: string, feedback: string): boolean {
    const journals = this.getJournals();
    const idx = journals.findIndex(j => j.id === id);
    if (idx === -1) return false;
    journals[idx].guruVerified = true;
    journals[idx].guruFeedback = feedback;
    journals[idx].guruFeedbackAt = new Date().toISOString();
    journals[idx].guruFeedbackBy = guruName;
    journals[idx].updatedAt = new Date().toISOString();
    this.saveJournals(journals);
    void this.runDbWrite(supabase.from('journals').upsert(mapJournalToDb(journals[idx]), { onConflict: 'id' }));
    this.addAuditLog(guruName, 'guru', 'VERIFIKASI_JURNAL', `Memberi apresiasi/verifikasi untuk siswa ${journals[idx].siswaName}`);
    return true;
  }

  acknowledgeJournalByParent(id: string, parentName: string, notes: string): boolean {
    const journals = this.getJournals();
    const idx = journals.findIndex(j => j.id === id);
    if (idx === -1) return false;
    journals[idx].parentAcknowledged = true;
    journals[idx].parentNotes = notes;
    journals[idx].parentAcknowledgedAt = new Date().toISOString();
    journals[idx].updatedAt = new Date().toISOString();
    this.saveJournals(journals);
    void this.runDbWrite(supabase.from('journals').upsert(mapJournalToDb(journals[idx]), { onConflict: 'id' }));
    this.addAuditLog(parentName, 'orang_tua', 'TANGGAPAN_ORTU', `Orang tua mengonfirmasi & memberi catatan pada jurnal anak`);
    return true;
  }

  // --- Teacher Coaching ---
  getCoachings(): TeacherCoaching[] {
    return this.getItem<TeacherCoaching[]>(STORAGE_KEYS.COACHING, INITIAL_COACHING);
  }

  saveCoachings(coachings: TeacherCoaching[]): void {
    this.setItem(STORAGE_KEYS.COACHING, coachings);
  }

  addCoaching(coaching: Omit<TeacherCoaching, 'id' | 'createdAt'>): TeacherCoaching {
    const list = this.getCoachings();
    const newCoaching: TeacherCoaching = {
      ...coaching,
      id: generateId('cch'),
      createdAt: new Date().toISOString()
    };
    list.unshift(newCoaching);
    this.saveCoachings(list);
    void this.runDbWrite(supabase.from('teacher_coachings').upsert(mapCoachingToDb(newCoaching), { onConflict: 'id' }));
    this.addAuditLog(coaching.guruName, 'guru', 'CATATAN_PEMBINAAN', `Menulis catatan pembinaan untuk siswa ${coaching.siswaName}`);
    return newCoaching;
  }

  updateCoaching(id: string, updates: Partial<TeacherCoaching>, actorName: string): boolean {
    const list = this.getCoachings();
    const idx = list.findIndex(c => c.id === id);
    if (idx === -1) return false;
    list[idx] = { ...list[idx], ...updates };
    this.saveCoachings(list);
    void this.runDbWrite(supabase.from('teacher_coachings').upsert(mapCoachingToDb(list[idx]), { onConflict: 'id' }));
    this.addAuditLog(actorName, 'guru', 'UPDATE_PEMBINAAN', `Memperbarui status pembinaan siswa ${list[idx].siswaName}`);
    return true;
  }

  // --- Parent Feedbacks ---
  getFeedbacks(): ParentFeedback[] {
    return this.getItem<ParentFeedback[]>(STORAGE_KEYS.FEEDBACKS, INITIAL_FEEDBACKS);
  }

  addFeedback(feedback: Omit<ParentFeedback, 'id' | 'createdAt'>): ParentFeedback {
    const list = this.getFeedbacks();
    const newFeedback: ParentFeedback = {
      ...feedback,
      id: generateId('pfb'),
      createdAt: new Date().toISOString()
    };
    list.unshift(newFeedback);
    this.setItem(STORAGE_KEYS.FEEDBACKS, list);
    void this.runDbWrite(supabase.from('parent_feedbacks').upsert(mapFeedbackToDb(newFeedback), { onConflict: 'id' }));
    this.addAuditLog(feedback.parentName, 'orang_tua', 'DUKUNGAN_ORTU', `Mengirim pesan dukungan orang tua untuk siswa ID ${feedback.siswaId}`);
    return newFeedback;
  }

  // --- Badges ---
  getBadges(): AppreciationBadge[] {
    return this.getItem<AppreciationBadge[]>(STORAGE_KEYS.BADGES, INITIAL_BADGES);
  }

  addBadge(badge: Omit<AppreciationBadge, 'id' | 'date'>): AppreciationBadge {
    const badges = this.getBadges();
    const newBadge: AppreciationBadge = {
      ...badge,
      id: generateId('bdg'),
      date: new Date().toISOString().split('T')[0]
    };
    badges.unshift(newBadge);
    this.setItem(STORAGE_KEYS.BADGES, badges);
    void this.runDbWrite(supabase.from('appreciation_badges').upsert(mapBadgeToDb(newBadge), { onConflict: 'id' }));
    this.addAuditLog(badge.guruName, 'guru', 'BERI_APRESIASI', `Memberikan lencana "${badge.badgeName}" kepada siswa ID ${badge.siswaId}`);
    return newBadge;
  }

  // --- Audit Logs ---
  getAuditLogs(): AuditLog[] {
    const rawLogs = this.getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    const seen = new Set<string>();
    let hasDuplicates = false;
    const sanitized = rawLogs.map((log, idx) => {
      if (!log.id || seen.has(log.id)) {
        hasDuplicates = true;
        return {
          ...log,
          id: `${log.id || 'log'}-${idx}-${Math.random().toString(36).slice(2, 6)}`
        };
      }
      seen.add(log.id);
      return log;
    });

    if (hasDuplicates) {
      this.setItem(STORAGE_KEYS.AUDIT_LOGS, sanitized);
    }
    return sanitized;
  }

  addAuditLog(userName: string, role: any, action: string, details: string): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: generateId('log'),
      userId: 'usr-system',
      userName,
      role,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    if (logs.length > 200) logs.pop();
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, logs);
    void this.runDbWrite(supabase.from('audit_logs').upsert(mapAuditLogToDb(newLog), { onConflict: 'id' }));
  }

  // --- School Information / Announcements ---
  getSchoolInfos(): SchoolInfo[] {
    return this.getItem<SchoolInfo[]>(STORAGE_KEYS.SCHOOL_INFOS, []);
  }

  saveSchoolInfos(infos: SchoolInfo[]): void {
    this.setItem(STORAGE_KEYS.SCHOOL_INFOS, infos);
  }

  addSchoolInfo(
    info: Omit<SchoolInfo, 'id' | 'createdAt' | 'updatedAt'>,
    actorName: string,
    actorRole: any
  ): SchoolInfo {
    const list = this.getSchoolInfos();
    const now = new Date().toISOString();
    const newInfo: SchoolInfo = {
      ...info,
      targetRoles: info.targetRoles && info.targetRoles.length > 0 ? info.targetRoles : ['siswa', 'guru', 'orang_tua'],
      id: generateId('inf'),
      createdAt: now,
      updatedAt: now
    };
    list.unshift(newInfo);
    this.saveSchoolInfos(list);
    void this.syncSchoolInfoUpsert(newInfo);
    this.addAuditLog(actorName, actorRole, 'TAMBAH_INFORMASI', `Menerbitkan informasi sekolah: "${newInfo.title}"`);
    return newInfo;
  }

  updateSchoolInfo(
    id: string,
    updates: Partial<SchoolInfo>,
    actorName: string,
    actorRole: any
  ): SchoolInfo | null {
    const list = this.getSchoolInfos();
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return null;
    list[idx] = {
      ...list[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveSchoolInfos(list);
    void this.syncSchoolInfoUpsert(list[idx]);
    this.addAuditLog(actorName, actorRole, 'UBAH_INFORMASI', `Memperbarui informasi sekolah: "${list[idx].title}"`);
    return list[idx];
  }

  deleteSchoolInfo(id: string, actorName: string, actorRole: any): boolean {
    const list = this.getSchoolInfos();
    const target = list.find(item => item.id === id);
    if (!target) return false;
    const filtered = list.filter(item => item.id !== id);
    this.saveSchoolInfos(filtered);
    void this.syncSchoolInfoDelete(id);
    this.addAuditLog(actorName, actorRole, 'HAPUS_INFORMASI', `Menghapus informasi sekolah: "${target.title}"`);
    return true;
  }

  private async syncSchoolInfoUpsert(info: SchoolInfo): Promise<void> {
    try {
      const { error } = await supabase
        .from('school_infos')
        .upsert(mapSchoolInfoToDb(info), { onConflict: 'id' });
      if (error) {
        const msg = (error.message || '').toLowerCase();
        if (error.code === 'PGRST205' || error.code === '42P01' || msg.includes('does not exist') || msg.includes('could not find')) {
          this.infoTableMissing = true;
          this.notifySync();
        }
      } else {
        this.infoTableMissing = false;
      }
    } catch {
      // ignore network failure; localStorage cache keeps data
    }
  }

  private async syncSchoolInfoDelete(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('school_infos').delete().eq('id', id);
      if (error) {
        const msg = (error.message || '').toLowerCase();
        if (error.code === 'PGRST205' || error.code === '42P01' || msg.includes('does not exist') || msg.includes('could not find')) {
          this.infoTableMissing = true;
        }
      }
    } catch {
      // ignore
    }
  }

  // --- Habit Time Rules ---
  getHabitTimeRules(): HabitTimeRuleConfig[] {
    const defaults = getDefaultHabitTimeRules();
    const stored = this.getItem<HabitTimeRuleConfig[]>(STORAGE_KEYS.HABIT_TIME_RULES, []);
    if (!Array.isArray(stored) || stored.length === 0) {
      return defaults;
    }
    return defaults.map(def => {
      const match = stored.find(item => item.habitId === def.habitId);
      return match ? { ...def, ...match, habitName: def.habitName } : def;
    });
  }

  getHabitTimeRule(habitId: HabitId): HabitTimeRuleConfig | undefined {
    return this.getHabitTimeRules().find(r => r.habitId === habitId);
  }

  saveHabitTimeRules(rules: HabitTimeRuleConfig[], actorName?: string, actorRole?: any): void {
    const now = new Date().toISOString();
    const stamped = rules.map(r => ({ ...r, updatedAt: now }));
    this.setItem(STORAGE_KEYS.HABIT_TIME_RULES, stamped);
    void this.syncHabitTimeRulesToDb(stamped);
    if (actorName && actorRole) {
      const activeLabels = stamped
        .filter(r => r.enabled)
        .map(r => `${r.habitName} (${formatTimeRuleLabel(r)})`)
        .join(', ');
      this.addAuditLog(
        actorName,
        actorRole,
        'ATUR_BATAS_WAKTU_JURNAL',
        activeLabels
          ? `Memperbarui batas waktu pengisian jurnal: ${activeLabels}`
          : 'Menonaktifkan seluruh pembatasan jam pengisian jurnal (bebas sepanjang hari)'
      );
    }
  }

  resetHabitTimeRules(actorName: string, actorRole: any): HabitTimeRuleConfig[] {
    const defaults = getDefaultHabitTimeRules();
    this.saveHabitTimeRules(defaults, actorName, actorRole);
    return defaults;
  }

  private async syncHabitTimeRulesToDb(rules: HabitTimeRuleConfig[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('habit_time_rules')
        .upsert(rules.map(mapHabitTimeRuleToDb), { onConflict: 'habit_id' });
      if (error) {
        const msg = (error.message || '').toLowerCase();
        if (error.code === 'PGRST205' || error.code === '42P01' || msg.includes('does not exist') || msg.includes('could not find')) {
          this.timeRulesTableMissing = true;
          this.notifySync();
        }
      } else {
        this.timeRulesTableMissing = false;
      }
    } catch {
      // keep local cache
    }
  }

  // --- Google Drive & Sheets Config ---
  getDriveConfig(): GoogleDriveConfig {
    const config = this.getItem<GoogleDriveConfig>(STORAGE_KEYS.DRIVE_CONFIG, INITIAL_DRIVE_CONFIG);
    if (!config.sheetWebhookUrl) {
      config.sheetWebhookUrl = 'https://script.google.com/macros/s/AKfycbz1IgevdL6eAiIe14dfT7TP9XTAV4DdWRquthhZEAu0fE7U81Z4dfG4nHDQmNMnntk7xA/exec';
      config.status = 'connected';
      this.saveDriveConfig(config);
    }
    return config;
  }

  saveDriveConfig(config: GoogleDriveConfig): void {
    this.setItem(STORAGE_KEYS.DRIVE_CONFIG, config);
  }

  // --- Full Database Export & Import ---
  exportFullDatabase(): string {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      appName: '7 Kebiasaan Anak Indonesia Hebat',
      data: {
        users: this.getUsers(),
        classes: this.getClasses(),
        journals: this.getJournals(),
        coachings: this.getCoachings(),
        feedbacks: this.getFeedbacks(),
        badges: this.getBadges(),
        auditLogs: this.getAuditLogs(),
        schoolInfos: this.getSchoolInfos(),
        driveConfig: this.getDriveConfig()
      }
    };
    return JSON.stringify(payload, null, 2);
  }

  importFullDatabase(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.data) {
        return { success: false, message: 'Format berkas cadangan tidak valid: properti data tidak ditemukan.' };
      }
      const { users, classes, journals, coachings, feedbacks, badges, auditLogs, schoolInfos, driveConfig } = parsed.data;
      if (users) this.setItem(STORAGE_KEYS.USERS, users);
      if (classes) this.setItem(STORAGE_KEYS.CLASSES, classes);
      if (journals) this.setItem(STORAGE_KEYS.JOURNALS, journals);
      if (coachings) this.setItem(STORAGE_KEYS.COACHING, coachings);
      if (feedbacks) this.setItem(STORAGE_KEYS.FEEDBACKS, feedbacks);
      if (badges) this.setItem(STORAGE_KEYS.BADGES, badges);
      if (auditLogs) this.setItem(STORAGE_KEYS.AUDIT_LOGS, auditLogs);
      if (schoolInfos) this.setItem(STORAGE_KEYS.SCHOOL_INFOS, schoolInfos);
      if (driveConfig) this.setItem(STORAGE_KEYS.DRIVE_CONFIG, driveConfig);

      this.addAuditLog('Admin', 'admin', 'RESTORE_DATABASE', 'Memulihkan data sistem dari berkas cadangan JSON');
      return { success: true, message: 'Data cadangan berhasil dipulihkan ke sistem!' };
    } catch (err: any) {
      return { success: false, message: 'Gagal memproses berkas JSON: ' + (err.message || 'Error tidak diketahui') };
    }
  }

  resetToDefaultData(): void {
    this.setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.setItem(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
    this.setItem(STORAGE_KEYS.JOURNALS, INITIAL_JOURNALS);
    this.setItem(STORAGE_KEYS.COACHING, INITIAL_COACHING);
    this.setItem(STORAGE_KEYS.FEEDBACKS, INITIAL_FEEDBACKS);
    this.setItem(STORAGE_KEYS.BADGES, INITIAL_BADGES);
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    this.setItem(STORAGE_KEYS.DRIVE_CONFIG, INITIAL_DRIVE_CONFIG);
  }
}

export const storageService = new StorageService();
