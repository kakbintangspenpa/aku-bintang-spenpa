export type Role = 'admin' | 'guru' | 'siswa' | 'orang_tua';

export type HabitId = 
  | 'bangun_pagi'
  | 'beribadah'
  | 'berolahraga'
  | 'makan_sehat'
  | 'gemar_membaca'
  | 'bermasyarakat'
  | 'istirahat_tepat'
  | 'bangun_pagi_ibadah'
  | 'kedisiplinan_umum';

export interface HabitDefinition {
  id: HabitId;
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  guidelines: string[];
  icon: string;
  color: string;
  badgeColor: string;
  bgLight: string;
  borderColor: string;
  suggestedTimes?: string;
  motivationalQuote: string;
}

export type HabitStatus = 'Sudah Dilaksanakan' | 'Belum Dilaksanakan' | 'Tidak Ada Catatan';

export interface User {
  id: string;
  username: string;
  password?: string; // Stored securely
  fullName: string;
  role: Role;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  status: 'active' | 'inactive';
  kelasId?: string; // For siswa & guru wali kelas
  nisn?: string; // For siswa
  nip?: string; // For guru
  siswaId?: string; // For orang tua (links to their child)
  linkedSiswaIds?: string[]; // If parent has multiple children
  assignedGuruId?: string; // Assigned teacher for student
  relationship?: string; // For parent e.g., 'Ayah Kandung', 'Ibu Kandung', 'Wali Murid'
  createdAt: string;
  lastLogin?: string;
}

export interface ClassRoom {
  id: string;
  name: string; // e.g., "Kelas 5A"
  grade: number; // e.g., 5
  waliKelasId: string; // Teacher ID
  totalSiswa: number;
  academicYear: string;
}

export interface JournalEntry {
  id: string;
  siswaId: string;
  siswaName: string;
  kelasId: string;
  habitId: HabitId;
  date: string; // YYYY-MM-DD
  time?: string; // e.g., "05:15"
  activityDescription: string;
  reflection: string;
  photoUrl?: string;
  photoFileName?: string;
  photoDriveFileId?: string;
  status: HabitStatus;
  guruVerified: boolean;
  guruFeedback?: string;
  guruFeedbackAt?: string;
  guruFeedbackBy?: string;
  parentAcknowledged: boolean;
  parentNotes?: string;
  parentAcknowledgedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherCoaching {
  id: string;
  siswaId: string;
  siswaName: string;
  kelasId: string;
  guruId: string;
  guruName: string;
  habitId?: HabitId | 'all';
  date: string; // YYYY-MM-DD
  obstacleNotes: string; // Identifikasi kendala
  positiveSolutionAdvice: string; // Saran solusi positif dan mendidik
  improvementTarget: string; // Target perbaikan
  nextEvaluationDate: string; // Jadwal evaluasi berikutnya
  followUpStatus: 'Dalam Proses' | 'Tercapai' | 'Perlu Pendampingan Lanjutan';
  createdAt: string;
}

export interface ParentFeedback {
  id: string;
  siswaId: string;
  parentId: string;
  parentName: string;
  date: string; // YYYY-MM-DD
  supportMessage: string;
  homeObservations: string;
  createdAt: string;
}

export interface AppreciationBadge {
  id: string;
  siswaId: string;
  guruId: string;
  guruName: string;
  badgeName: string;
  badgeIcon: string;
  message: string;
  date: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: Role;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface GoogleDriveConfig {
  sheetWebhookUrl: string;
  driveFolderId: string;
  schoolGoogleAccount: string;
  lastSyncTime?: string;
  autoSyncEnabled: boolean;
  status: 'connected' | 'disconnected' | 'mock_mode';
}

export interface ReportFilter {
  siswaId?: string;
  kelasId?: string;
  guruId?: string;
  habitId?: string;
  startDate: string;
  endDate: string;
}
