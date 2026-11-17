import { createClient } from '@supabase/supabase-js';
import {
  User,
  ClassRoom,
  JournalEntry,
  TeacherCoaching,
  ParentFeedback,
  AppreciationBadge,
  AuditLog,
  Role,
  HabitId,
  HabitStatus,
  SchoolInfo,
  InfoCategory,
  HabitTimeRuleConfig
} from '../types';

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://yrctxerzvflwwirurqro.supabase.co';
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_WfBTZvRb626IFR09ANpLCw_-GlR-xZ_';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

export const SUPABASE_BUCKET = 'dokumentasi-siswa';

/**
 * Mengunggah foto base64 DataURL ke Supabase Storage bucket `dokumentasi-siswa`
 * dan mengembalikan URL publik foto tersebut.
 */
export async function uploadPhotoToSupabase(
  dataUrl: string,
  folder: string,
  fileName: string
): Promise<string | null> {
  try {
    if (!dataUrl || !dataUrl.startsWith('data:')) {
      return dataUrl || null;
    }

    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const ext = (fileName.split('.').pop() || 'jpg').replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'jpg';
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${folder}/${Date.now()}_${safeName.endsWith(ext) ? safeName : `${safeName}.${ext}`}`;

    const { error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(storagePath, blob, {
        contentType: blob.type || 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error('Gagal mengunggah foto ke Supabase Storage:', error.message);
      return null;
    }

    const { data: publicData } = supabase.storage
      .from(SUPABASE_BUCKET)
      .getPublicUrl(storagePath);

    return publicData?.publicUrl || null;
  } catch (err) {
    console.error('Error uploadPhotoToSupabase:', err);
    return null;
  }
}

// =========================================================================
// MAPPERS: DB (snake_case) <-> App TypeScript (camelCase)
// =========================================================================

export function mapUserFromDb(row: any): User {
  return {
    id: row.id,
    username: row.username,
    password: row.password,
    fullName: row.full_name,
    role: row.role as Role,
    avatarUrl: row.avatar_url || undefined,
    email: row.email || undefined,
    phone: row.phone || undefined,
    status: (row.status || 'active') as 'active' | 'inactive',
    kelasId: row.kelas_id || undefined,
    nisn: row.nisn || undefined,
    nip: row.nip || undefined,
    siswaId: row.siswa_id || undefined,
    linkedSiswaIds: Array.isArray(row.linked_siswa_ids) ? row.linked_siswa_ids : undefined,
    assignedGuruId: row.assigned_guru_id || undefined,
    relationship: row.relationship || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    lastLogin: row.last_login || undefined
  };
}

export function mapUserToDb(user: User) {
  return {
    id: user.id,
    username: user.username,
    password: user.password || 'password123',
    full_name: user.fullName,
    role: user.role,
    avatar_url: user.avatarUrl || null,
    email: user.email || null,
    phone: user.phone || null,
    status: user.status || 'active',
    kelas_id: user.kelasId || null,
    nisn: user.nisn || null,
    nip: user.nip || null,
    siswa_id: user.siswaId || null,
    linked_siswa_ids: user.linkedSiswaIds || [],
    assigned_guru_id: user.assignedGuruId || null,
    relationship: user.relationship || null,
    created_at: user.createdAt || new Date().toISOString(),
    last_login: user.lastLogin || null
  };
}

export function mapClassFromDb(row: any): ClassRoom {
  return {
    id: row.id,
    name: row.name,
    grade: Number(row.grade) || 7,
    waliKelasId: row.wali_kelas_id || '',
    totalSiswa: Number(row.total_siswa) || 0,
    academicYear: row.academic_year || '2026/2027'
  };
}

export function mapClassToDb(cls: ClassRoom) {
  return {
    id: cls.id,
    name: cls.name,
    grade: cls.grade,
    wali_kelas_id: cls.waliKelasId || '',
    total_siswa: cls.totalSiswa || 0,
    academic_year: cls.academicYear || '2026/2027'
  };
}

export function mapJournalFromDb(row: any): JournalEntry {
  return {
    id: row.id,
    siswaId: row.siswa_id,
    siswaName: row.siswa_name,
    kelasId: row.kelas_id,
    habitId: row.habit_id as HabitId,
    date: row.date,
    time: row.time || undefined,
    activityDescription: row.activity_description,
    reflection: row.reflection || '',
    photoUrl: row.photo_url || undefined,
    photoFileName: row.photo_file_name || undefined,
    status: row.status as HabitStatus,
    guruVerified: Boolean(row.guru_verified),
    guruFeedback: row.guru_feedback || undefined,
    guruFeedbackAt: row.guru_feedback_at || undefined,
    guruFeedbackBy: row.guru_feedback_by || undefined,
    parentAcknowledged: Boolean(row.parent_acknowledged),
    parentNotes: row.parent_notes || undefined,
    parentAcknowledgedAt: row.parent_acknowledged_at || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString()
  };
}

export function mapJournalToDb(j: JournalEntry) {
  return {
    id: j.id,
    siswa_id: j.siswaId,
    siswa_name: j.siswaName,
    kelas_id: j.kelasId,
    habit_id: j.habitId,
    date: j.date,
    time: j.time || null,
    activity_description: j.activityDescription,
    reflection: j.reflection || '',
    photo_url: j.photoUrl || null,
    photo_file_name: j.photoFileName || null,
    status: j.status,
    guru_verified: Boolean(j.guruVerified),
    guru_feedback: j.guruFeedback || null,
    guru_feedback_at: j.guruFeedbackAt || null,
    guru_feedback_by: j.guruFeedbackBy || null,
    parent_acknowledged: Boolean(j.parentAcknowledged),
    parent_notes: j.parentNotes || null,
    parent_acknowledged_at: j.parentAcknowledgedAt || null,
    created_at: j.createdAt || new Date().toISOString(),
    updated_at: j.updatedAt || new Date().toISOString()
  };
}

export function mapCoachingFromDb(row: any): TeacherCoaching {
  return {
    id: row.id,
    siswaId: row.siswa_id,
    siswaName: row.siswa_name,
    kelasId: row.kelas_id,
    guruId: row.guru_id,
    guruName: row.guru_name,
    habitId: (row.habit_id || 'all') as HabitId | 'all',
    date: row.date,
    obstacleNotes: row.obstacle_notes || '',
    positiveSolutionAdvice: row.positive_solution_advice || '',
    improvementTarget: row.improvement_target || '',
    nextEvaluationDate: row.next_evaluation_date || '',
    followUpStatus: (row.follow_up_status || 'Dalam Proses') as TeacherCoaching['followUpStatus'],
    createdAt: row.created_at || new Date().toISOString()
  };
}

export function mapCoachingToDb(c: TeacherCoaching) {
  return {
    id: c.id,
    siswa_id: c.siswaId,
    siswa_name: c.siswaName,
    kelas_id: c.kelasId,
    guru_id: c.guruId,
    guru_name: c.guruName,
    habit_id: c.habitId || 'all',
    date: c.date,
    obstacle_notes: c.obstacleNotes,
    positive_solution_advice: c.positiveSolutionAdvice,
    improvement_target: c.improvementTarget,
    next_evaluation_date: c.nextEvaluationDate,
    follow_up_status: c.followUpStatus,
    created_at: c.createdAt || new Date().toISOString()
  };
}

export function mapFeedbackFromDb(row: any): ParentFeedback {
  return {
    id: row.id,
    siswaId: row.siswa_id,
    parentId: row.parent_id,
    parentName: row.parent_name,
    date: row.date,
    supportMessage: row.support_message,
    homeObservations: row.home_observations || '',
    createdAt: row.created_at || new Date().toISOString()
  };
}

export function mapFeedbackToDb(f: ParentFeedback) {
  return {
    id: f.id,
    siswa_id: f.siswaId,
    parent_id: f.parentId,
    parent_name: f.parentName,
    date: f.date,
    support_message: f.supportMessage,
    home_observations: f.homeObservations || '',
    created_at: f.createdAt || new Date().toISOString()
  };
}

export function mapBadgeFromDb(row: any): AppreciationBadge {
  return {
    id: row.id,
    siswaId: row.siswa_id,
    guruId: row.guru_id,
    guruName: row.guru_name,
    badgeName: row.badge_name,
    badgeIcon: row.badge_icon || 'Award',
    message: row.message || '',
    date: row.date
  };
}

export function mapBadgeToDb(b: AppreciationBadge) {
  return {
    id: b.id,
    siswa_id: b.siswaId,
    guru_id: b.guruId,
    guru_name: b.guruName,
    badge_name: b.badgeName,
    badge_icon: b.badgeIcon || 'Award',
    message: b.message || '',
    date: b.date
  };
}

export function mapAuditLogFromDb(row: any): AuditLog {
  return {
    id: row.id,
    userId: row.user_id || 'usr-system',
    userName: row.user_name,
    role: row.role as Role,
    action: row.action,
    details: row.details || '',
    timestamp: row.timestamp || new Date().toISOString()
  };
}

export function mapAuditLogToDb(log: AuditLog) {
  return {
    id: log.id,
    user_id: log.userId || 'usr-system',
    user_name: log.userName,
    role: log.role,
    action: log.action,
    details: log.details,
    timestamp: log.timestamp || new Date().toISOString()
  };
}

export function mapSchoolInfoFromDb(row: any): SchoolInfo {
  const rawTargets = Array.isArray(row.target_roles)
    ? row.target_roles
    : ['siswa', 'guru', 'orang_tua'];
  return {
    id: row.id,
    title: row.title || '',
    content: row.content || '',
    category: (row.category || 'pengumuman') as InfoCategory,
    targetRoles: rawTargets as Role[],
    isActive: row.is_active !== false,
    isPinned: Boolean(row.is_pinned),
    createdBy: row.created_by || 'Administrator Sekolah',
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || row.created_at || new Date().toISOString()
  };
}

export function mapSchoolInfoToDb(info: SchoolInfo) {
  return {
    id: info.id,
    title: info.title,
    content: info.content,
    category: info.category,
    target_roles: info.targetRoles && info.targetRoles.length > 0 ? info.targetRoles : ['siswa', 'guru', 'orang_tua'],
    is_active: Boolean(info.isActive),
    is_pinned: Boolean(info.isPinned),
    created_by: info.createdBy || 'Administrator Sekolah',
    created_at: info.createdAt || new Date().toISOString(),
    updated_at: info.updatedAt || new Date().toISOString()
  };
}

export function mapHabitTimeRuleFromDb(row: any): HabitTimeRuleConfig {
  return {
    habitId: row.habit_id as HabitId,
    habitName: row.habit_name || '',
    enabled: Boolean(row.enabled),
    startHour: Number(row.start_hour ?? 5),
    startMinute: Number(row.start_minute ?? 0),
    endHour: Number(row.end_hour ?? 6),
    endMinute: Number(row.end_minute ?? 0),
    timezoneLabel: row.timezone_label ?? 'WIB',
    lockOutsideWindow: row.lock_outside_window !== false,
    updatedAt: row.updated_at || new Date().toISOString()
  };
}

export function mapHabitTimeRuleToDb(rule: HabitTimeRuleConfig) {
  return {
    habit_id: rule.habitId,
    habit_name: rule.habitName,
    enabled: Boolean(rule.enabled),
    start_hour: Number(rule.startHour),
    start_minute: Number(rule.startMinute),
    end_hour: Number(rule.endHour),
    end_minute: Number(rule.endMinute),
    timezone_label: rule.timezoneLabel ?? 'WIB',
    lock_outside_window: Boolean(rule.lockOutsideWindow),
    updated_at: rule.updatedAt || new Date().toISOString()
  };
}


