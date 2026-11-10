import {
  User,
  ClassRoom,
  JournalEntry,
  HabitId,
  TeacherCoaching,
  ParentFeedback,
  AppreciationBadge,
  AuditLog,
  GoogleDriveConfig
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

const STORAGE_KEYS = {
  USERS: '7k_users_v1',
  CLASSES: '7k_classes_v1',
  JOURNALS: '7k_journals_v1',
  COACHING: '7k_coaching_v1',
  FEEDBACKS: '7k_feedbacks_v1',
  BADGES: '7k_badges_v1',
  AUDIT_LOGS: '7k_audit_logs_v1',
  DRIVE_CONFIG: '7k_drive_config_v1',
  CURRENT_USER: '7k_current_user_v1'
};

let idCounter = 0;
const generateId = (prefix: string) => {
  idCounter = (idCounter + 1) % 10000;
  return `${prefix}-${Date.now()}-${idCounter}-${Math.random().toString(36).slice(2, 7)}`;
};

class StorageService {
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
    this.addAuditLog(actorName, actorRole, 'TAMBAH_PENGGUNA', `Menambahkan pengguna baru: ${newUser.fullName} (${newUser.role})`);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>, actorName: string, actorRole: any): User | null {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates };
    this.saveUsers(users);
    this.addAuditLog(actorName, actorRole, 'UBAH_PENGGUNA', `Memperbarui akun pengguna: ${users[idx].fullName}`);
    return users[idx];
  }

  deleteUser(id: string, actorName: string, actorRole: any): boolean {
    const users = this.getUsers();
    const target = users.find(u => u.id === id);
    if (!target) return false;
    const filtered = users.filter(u => u.id !== id);
    this.saveUsers(filtered);
    this.addAuditLog(actorName, actorRole, 'HAPUS_PENGGUNA', `Menghapus akun pengguna: ${target.fullName}`);
    return true;
  }

  // --- Classes ---
  getClasses(): ClassRoom[] {
    const stored = this.getItem<ClassRoom[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
    // If user's stored classes only have the old 5a/5b and not 7.1, ensure SMP classes are populated
    const hasSmp = stored.some(c => c.name.includes('7.1') || c.id.includes('7-1'));
    if (!hasSmp) {
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
    this.addAuditLog(actorName, actorRole, 'TAMBAH_KELAS', `Menambahkan kelas baru: ${newClass.name}`);
    return newClass;
  }

  updateClass(id: string, updates: Partial<ClassRoom>, actorName: string, actorRole: any): ClassRoom | null {
    const classes = this.getClasses();
    const idx = classes.findIndex(c => c.id === id);
    if (idx === -1) return null;
    classes[idx] = { ...classes[idx], ...updates };
    this.saveClasses(classes);
    this.addAuditLog(actorName, actorRole, 'UBAH_KELAS', `Memperbarui data kelas: ${classes[idx].name}`);
    return classes[idx];
  }

  deleteClass(id: string, actorName: string, actorRole: any): boolean {
    const classes = this.getClasses();
    const target = classes.find(c => c.id === id);
    if (!target) return false;
    const filtered = classes.filter(c => c.id !== id);
    this.saveClasses(filtered);
    this.addAuditLog(actorName, actorRole, 'HAPUS_KELAS', `Menghapus kelas: ${target.name}`);
    return true;
  }

  generateSMPClasses(gradesToGenerate: number[] = [7, 8, 9], actorName: string = 'Administrator', actorRole: any = 'admin'): { addedCount: number; existingCount: number } {
    const currentClasses = this.getClasses();
    let addedCount = 0;
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
          newClasses.push({
            id,
            name: className,
            grade,
            waliKelasId: '',
            totalSiswa: 0,
            academicYear: '2026/2027'
          });
          addedCount++;
        }
      }
    }

    if (addedCount > 0) {
      this.saveClasses(newClasses);
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
    this.saveJournals(journals);
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
    this.saveJournals(journals);
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
    this.addAuditLog(coaching.guruName, 'guru', 'CATATAN_PEMBINAAN', `Menulis catatan pembinaan untuk siswa ${coaching.siswaName}`);
    return newCoaching;
  }

  updateCoaching(id: string, updates: Partial<TeacherCoaching>, actorName: string): boolean {
    const list = this.getCoachings();
    const idx = list.findIndex(c => c.id === id);
    if (idx === -1) return false;
    list[idx] = { ...list[idx], ...updates };
    this.saveCoachings(list);
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
    // Keep max 200 logs
    if (logs.length > 200) logs.pop();
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, logs);
  }

  // --- Google Drive & Sheets Config ---
  getDriveConfig(): GoogleDriveConfig {
    return this.getItem<GoogleDriveConfig>(STORAGE_KEYS.DRIVE_CONFIG, INITIAL_DRIVE_CONFIG);
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
      const { users, classes, journals, coachings, feedbacks, badges, auditLogs, driveConfig } = parsed.data;
      if (users) this.setItem(STORAGE_KEYS.USERS, users);
      if (classes) this.setItem(STORAGE_KEYS.CLASSES, classes);
      if (journals) this.setItem(STORAGE_KEYS.JOURNALS, journals);
      if (coachings) this.setItem(STORAGE_KEYS.COACHING, coachings);
      if (feedbacks) this.setItem(STORAGE_KEYS.FEEDBACKS, feedbacks);
      if (badges) this.setItem(STORAGE_KEYS.BADGES, badges);
      if (auditLogs) this.setItem(STORAGE_KEYS.AUDIT_LOGS, auditLogs);
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
