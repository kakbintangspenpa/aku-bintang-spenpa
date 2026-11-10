import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Role,
  ClassRoom,
  JournalEntry,
  AuditLog,
  GoogleDriveConfig
} from '../types';
import { storageService } from '../services/storageService';
import { googleWebhookService } from '../services/googleWebhookService';
import { DRIVE_FOLDER_STRUCTURE, SHEETS_SCHEMA } from '../data/constants';
import { GOOGLE_APPS_SCRIPT_CODE } from '../data/googleScriptTemplate';
import {
  Shield,
  Users,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Edit2,
  Key,
  Camera,
  CheckCircle2,
  HardDrive,
  Activity,
  Layers,
  Server,
  FolderTree,
  FileSpreadsheet,
  Code,
  BookOpen,
  Copy,
  Check,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Info,
  GraduationCap,
  UserCheck,
  HeartHandshake,
  Search,
  UserPlus,
  Trash2,
  Phone,
  Mail,
  AlertCircle,
  X,
  Filter
} from 'lucide-react';

const ROLE_AVATAR_PRESETS = [
  { label: 'Siswa Putra', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80' },
  { label: 'Siswa Putri', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80' },
  { label: 'Guru Pria', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
  { label: 'Guru Wanita', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80' },
  { label: 'Orang Tua', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80' },
  { label: 'Admin', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80' }
];

interface AdminDashboardProps {
  currentUser: User;
  users: User[];
  classes: ClassRoom[];
  journals: JournalEntry[];
  auditLogs: AuditLog[];
  driveConfig: GoogleDriveConfig;
  onRefreshData: () => void;
  onOpenGuide: () => void;
  activeSubTab?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  users,
  classes,
  journals,
  auditLogs,
  driveConfig,
  onRefreshData,
  onOpenGuide,
  activeSubTab = 'dashboard'
}) => {
  const [adminTab, setAdminTab] = useState<'overview' | 'users' | 'classes' | 'drive' | 'docs' | 'audit'>(
    activeSubTab === 'users' ? 'users' :
    activeSubTab === 'classes' ? 'classes' :
    activeSubTab === 'drive_sync' ? 'drive' :
    activeSubTab === 'docs' ? 'docs' :
    activeSubTab === 'audit_logs' ? 'audit' : 'overview'
  );

  useEffect(() => {
    if (activeSubTab === 'docs') setAdminTab('docs');
    else if (activeSubTab === 'users') setAdminTab('users');
    else if (activeSubTab === 'classes') setAdminTab('classes');
    else if (activeSubTab === 'drive_sync') setAdminTab('drive');
    else if (activeSubTab === 'audit_logs') setAdminTab('audit');
    else if (activeSubTab === 'dashboard') setAdminTab('overview');
  }, [activeSubTab]);

  // User form states
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarUploadError, setAvatarUploadError] = useState('');
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const [role, setRole] = useState<Role>('siswa');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nisnNip, setNisnNip] = useState('');
  const [kelasId, setKelasId] = useState('');
  const [selectedChildId, setSelectedChildId] = useState('');
  const [assignedGuruId, setAssignedGuruId] = useState('');
  const [relationship, setRelationship] = useState('Ayah Kandung');
  const [userPassword, setUserPassword] = useState('password123');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // User table filter & search
  const [userFilterRole, setUserFilterRole] = useState<'all' | Role>('all');
  const [userFilterClass, setUserFilterClass] = useState<string>('all');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Overview quick student search & class filter
  const [quickStudentSearch, setQuickStudentSearch] = useState('');
  const [quickClassFilter, setQuickClassFilter] = useState('all');

  // Delete user state
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Class management states
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);
  const [classNameInput, setClassNameInput] = useState('');
  const [classGradeInput, setClassGradeInput] = useState<number>(7);
  const [classWaliInput, setClassWaliInput] = useState('');
  const [classYearInput, setClassYearInput] = useState('2026/2027');
  const [classSearchQuery, setClassSearchQuery] = useState('');
  const [classGradeFilter, setClassGradeFilter] = useState<'all' | 7 | 8 | 9>('all');
  const [classToDelete, setClassToDelete] = useState<ClassRoom | null>(null);
  const [classBatchMessage, setClassBatchMessage] = useState('');
  const [classFormError, setClassFormError] = useState('');

  // Password reset state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [targetResetUser, setTargetResetUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');

  // Drive sync state
  const [webhookUrl, setWebhookUrl] = useState(driveConfig.sheetWebhookUrl);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Documentation sub-tab state inside admin page
  const [docsSubTab, setDocsSubTab] = useState<'arsitektur' | 'drive' | 'sheets' | 'apps_script' | 'panduan'>('arsitektur');
  const [copiedCode, setCopiedCode] = useState(false);

  const totalSiswa = users.filter(u => u.role === 'siswa').length;
  const totalGuru = users.filter(u => u.role === 'guru').length;
  const totalOrtu = users.filter(u => u.role === 'orang_tua').length;
  const totalAdmin = users.filter(u => u.role === 'admin').length;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleOpenAddUser = (targetRole: Role = 'siswa') => {
    setEditingUser(null);
    setRole(targetRole);
    setFullName('');
    setUsername('');
    setAvatarUrl('');
    setAvatarUploadError('');
    setEmail('');
    setPhone('');
    setNisnNip('');
    setKelasId(classes[0]?.id || '');
    const firstStudent = users.find(u => u.role === 'siswa');
    setSelectedChildId(firstStudent?.id || '');
    const firstTeacher = users.find(u => u.role === 'guru');
    setAssignedGuruId(firstTeacher?.id || '');
    setRelationship('Ayah Kandung');
    setUserPassword('password123');
    setFormError('');
    setFormSuccess('');
    setShowUserModal(true);
  };

  const handleOpenEditUser = (user: User) => {
    setEditingUser(user);
    setFullName(user.fullName);
    setUsername(user.username);
    setRole(user.role);
    setAvatarUrl(user.avatarUrl || '');
    setAvatarUploadError('');
    setEmail(user.email || '');
    setPhone(user.phone || '');
    setNisnNip(user.nisn || user.nip || '');
    setKelasId(user.kelasId || classes[0]?.id || '');
    setSelectedChildId(user.siswaId || '');
    setAssignedGuruId(user.assignedGuruId || '');
    setRelationship(user.relationship || 'Ayah Kandung');
    setUserPassword('');
    setFormError('');
    setFormSuccess('');
    setShowUserModal(true);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarUploadError('Harap pilih berkas foto yang valid (JPG, PNG, atau WEBP).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setAvatarUploadError('Ukuran file foto maksimal 3 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatarUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAutoGenerateUsername = () => {
    if (!fullName.trim()) return;
    const cleanName = fullName.toLowerCase().replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.').replace(/^\.|\.$/g, '');
    const firstWord = cleanName.split('.')[0] || 'user';
    const randomSuffix = Math.floor(10 + Math.random() * 89);
    
    if (role === 'siswa') {
      setUsername(`siswa.${firstWord}`);
    } else if (role === 'guru') {
      setUsername(`guru.${firstWord}`);
    } else if (role === 'orang_tua') {
      if (selectedChildId) {
        const student = users.find(u => u.id === selectedChildId);
        const childWord = student ? student.fullName.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '') : firstWord;
        setUsername(`ortu.${childWord}`);
      } else {
        setUsername(`ortu.${firstWord}`);
      }
    } else {
      setUsername(`admin.${firstWord}${randomSuffix}`);
    }
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim()) {
      setFormError('Nama lengkap wajib diisi.');
      return;
    }
    if (!username.trim()) {
      setFormError('Username pengguna wajib diisi.');
      return;
    }

    // Check username uniqueness
    const duplicate = users.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && u.id !== editingUser?.id
    );
    if (duplicate) {
      setFormError(`Username "${username.trim()}" sudah digunakan oleh ${duplicate.fullName}. Silakan tentukan username yang berbeda.`);
      return;
    }

    if (role === 'orang_tua' && !selectedChildId) {
      setFormError('Harap pilih data siswa / anak yang terhubung.');
      return;
    }

    if (editingUser) {
      storageService.updateUser(
        editingUser.id,
        {
          fullName: fullName.trim(),
          username: username.trim(),
          role,
          avatarUrl: avatarUrl.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          nisn: role === 'siswa' ? nisnNip.trim() : undefined,
          nip: role === 'guru' ? nisnNip.trim() : undefined,
          kelasId: (role === 'siswa' || role === 'guru') ? kelasId : undefined,
          assignedGuruId: role === 'siswa' ? assignedGuruId : undefined,
          siswaId: role === 'orang_tua' ? selectedChildId : undefined,
          linkedSiswaIds: role === 'orang_tua' && selectedChildId ? [selectedChildId] : undefined,
          relationship: role === 'orang_tua' ? relationship : undefined,
        },
        currentUser.fullName,
        'admin'
      );
    } else {
      storageService.addUser(
        {
          fullName: fullName.trim(),
          username: username.trim(),
          password: userPassword.trim() || 'password123',
          role,
          status: 'active',
          avatarUrl: avatarUrl.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          nisn: role === 'siswa' ? nisnNip.trim() : undefined,
          nip: role === 'guru' ? nisnNip.trim() : undefined,
          kelasId: (role === 'siswa' || role === 'guru') ? kelasId : undefined,
          assignedGuruId: role === 'siswa' ? assignedGuruId : undefined,
          siswaId: role === 'orang_tua' ? selectedChildId : undefined,
          linkedSiswaIds: role === 'orang_tua' && selectedChildId ? [selectedChildId] : undefined,
          relationship: role === 'orang_tua' ? relationship : undefined,
        },
        currentUser.fullName,
        'admin'
      );
    }

    setShowUserModal(false);
    onRefreshData();
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    storageService.deleteUser(userToDelete.id, currentUser.fullName, 'admin');
    setUserToDelete(null);
    onRefreshData();
  };

  // Class action handlers
  const handleOpenAddClass = (suggestedGrade: number = 7) => {
    setEditingClass(null);
    setClassGradeInput(suggestedGrade);
    const existingInGrade = classes.filter(c => c.grade === suggestedGrade);
    const nextNum = existingInGrade.length < 11 ? existingInGrade.length + 1 : existingInGrade.length + 1;
    setClassNameInput(`Kelas ${suggestedGrade}.${nextNum}`);
    setClassWaliInput('');
    setClassYearInput('2026/2027');
    setClassFormError('');
    setShowClassModal(true);
  };

  const handleOpenEditClass = (cls: ClassRoom) => {
    setEditingClass(cls);
    setClassNameInput(cls.name);
    setClassGradeInput(cls.grade);
    setClassWaliInput(cls.waliKelasId || '');
    setClassYearInput(cls.academicYear || '2026/2027');
    setClassFormError('');
    setShowClassModal(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    setClassFormError('');
    if (!classNameInput.trim()) {
      setClassFormError('Nama kelas wajib diisi.');
      return;
    }

    // Check duplicate
    const duplicate = classes.find(
      c => c.name.toLowerCase() === classNameInput.trim().toLowerCase() && c.id !== editingClass?.id
    );
    if (duplicate) {
      setClassFormError(`Kelas dengan nama "${classNameInput.trim()}" sudah terdaftar.`);
      return;
    }

    if (editingClass) {
      storageService.updateClass(
        editingClass.id,
        {
          name: classNameInput.trim(),
          grade: Number(classGradeInput),
          waliKelasId: classWaliInput,
          academicYear: classYearInput.trim() || '2026/2027'
        },
        currentUser.fullName,
        'admin'
      );
    } else {
      storageService.addClass(
        {
          name: classNameInput.trim(),
          grade: Number(classGradeInput),
          waliKelasId: classWaliInput,
          totalSiswa: 0,
          academicYear: classYearInput.trim() || '2026/2027'
        },
        currentUser.fullName,
        'admin'
      );
    }

    setShowClassModal(false);
    onRefreshData();
  };

  const handleDeleteClass = () => {
    if (!classToDelete) return;
    storageService.deleteClass(classToDelete.id, currentUser.fullName, 'admin');
    setClassToDelete(null);
    onRefreshData();
  };

  const handleBatchGenerateSMPClasses = (grades: number[] = [7, 8, 9]) => {
    const result = storageService.generateSMPClasses(grades, currentUser.fullName, 'admin');
    if (result.addedCount > 0) {
      setClassBatchMessage(`✅ Berhasil menambahkan ${result.addedCount} rombel kelas SMP (${grades.map(g => `${g}.1-${g}.11`).join(', ')})! Total rombel saat ini: ${result.existingCount}.`);
    } else {
      setClassBatchMessage(`ℹ️ Seluruh rombel kelas ${grades.map(g => `${g}.1-${g}.11`).join(', ')} sudah tersedia lengkap (${result.existingCount} kelas).`);
    }
    setTimeout(() => setClassBatchMessage(''), 4500);
    onRefreshData();
  };

  const handleToggleUserStatus = (user: User) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    storageService.updateUser(user.id, { status: nextStatus }, currentUser.fullName, 'admin');
    onRefreshData();
  };

  const handleOpenResetPassword = (user: User) => {
    setTargetResetUser(user);
    setNewPassword('password123');
    setShowPasswordModal(true);
  };

  const handleExecuteResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetResetUser || !newPassword.trim()) return;

    storageService.updateUser(targetResetUser.id, { password: newPassword.trim() }, currentUser.fullName, 'admin');
    storageService.addAuditLog(currentUser.fullName, 'admin', 'RESET_PASSWORD', `Mereset kata sandi akun ${targetResetUser.username}`);
    setShowPasswordModal(false);
    onRefreshData();
  };

  const handleSaveDriveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = webhookUrl.trim();
    storageService.saveDriveConfig({
      ...driveConfig,
      sheetWebhookUrl: cleanUrl,
      status: cleanUrl ? 'connected' : 'mock_mode'
    });

    if (cleanUrl) {
      googleWebhookService.ping(cleanUrl);
      setSyncStatusMsg('✅ Pengaturan tersimpan! Webhook Google Apps Script siap digunakan.');
    } else {
      setSyncStatusMsg('Pengaturan disimpan (Mode Lokal).');
    }

    setTimeout(() => setSyncStatusMsg(''), 4000);
    onRefreshData();
  };

  const handleTriggerManualSync = async () => {
    const cleanUrl = webhookUrl.trim() || driveConfig.sheetWebhookUrl;
    if (!cleanUrl) {
      setSyncStatusMsg('⚠️ Harap masukkan dan simpan URL Webhook Google Apps Script Anda terlebih dahulu.');
      setTimeout(() => setSyncStatusMsg(''), 5000);
      return;
    }

    setIsSyncing(true);
    setSyncStatusMsg('⏳ Mengirim data cadangan ke Google Drive (/ARSIP-ADMIN) dan Google Sheets...');

    try {
      const fullData = JSON.parse(storageService.exportFullDatabase());
      await googleWebhookService.syncAll(cleanUrl, fullData);

      storageService.saveDriveConfig({
        ...driveConfig,
        sheetWebhookUrl: cleanUrl,
        status: 'connected',
        lastSyncTime: new Date().toISOString()
      });
      storageService.addAuditLog(currentUser.fullName, 'admin', 'SYNC_DRIVE', 'Sinkronisasi cadangan ke Google Drive berhasil.');
      setSyncStatusMsg('✅ Sukses terkirim! File cadangan telah dibuat di Google Drive /ARSIP-ADMIN dan data tercatat di Google Sheets.');
    } catch (err: any) {
      setSyncStatusMsg('Gagal menyinkronkan: ' + (err?.message || 'Periksa URL Webhook'));
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatusMsg(''), 6000);
      onRefreshData();
    }
  };

  const handleDownloadBackup = () => {
    const jsonStr = storageService.exportFullDatabase();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BACKUP_7_KEBIASAAN_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const res = storageService.importFullDatabase(reader.result as string);
      alert(res.message);
      if (res.success) onRefreshData();
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Admin Hero Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 rounded-2xl sm:rounded-3xl text-white p-4 sm:p-7 shadow-md shadow-purple-200/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] sm:text-xs font-bold text-purple-200">
              <Shield className="w-3 h-3" />
              Administrator Sekolah
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
              Pusat Kendali & Dokumentasi Sistem
            </h1>
            <p className="text-xs text-purple-100 hidden sm:block mt-0.5">
              Kelola master data, arsitektur sistem, Google Drive, Google Sheets, dan jejak audit.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleOpenAddUser('siswa')}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title="Tambah Data Pengguna Baru (Siswa, Guru, Orang Tua)"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Pengguna</span>
            </button>
            <button
              onClick={() => setAdminTab('docs')}
              className="px-3 py-2 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>Dokumentasi</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Pills as Clean KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3.5 mt-3 border-t border-white/20 text-xs">
          <div
            onClick={() => { setAdminTab('users'); setUserFilterRole('siswa'); }}
            className="bg-white/10 hover:bg-white/15 rounded-xl p-2.5 border border-white/10 flex flex-col justify-between cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-purple-200 block">Siswa Aktif</span>
              <GraduationCap className="w-3.5 h-3.5 text-emerald-300" />
            </div>
            <span className="text-lg font-black text-white mt-1">{totalSiswa} Siswa</span>
            <div className="mt-2 text-[10px] font-bold text-emerald-200 group-hover:text-white flex items-center gap-1 transition-colors">
              <span>Kelola Siswa</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => { setAdminTab('users'); setUserFilterRole('guru'); }}
            className="bg-white/10 hover:bg-white/15 rounded-xl p-2.5 border border-white/10 flex flex-col justify-between cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-purple-200 block">Guru & Pembina</span>
              <UserCheck className="w-3.5 h-3.5 text-blue-300" />
            </div>
            <span className="text-lg font-black text-white mt-1">{totalGuru} Guru</span>
            <div className="mt-2 text-[10px] font-bold text-blue-200 group-hover:text-white flex items-center gap-1 transition-colors">
              <span>Kelola Guru</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => { setAdminTab('users'); setUserFilterRole('orang_tua'); }}
            className="bg-white/10 hover:bg-white/15 rounded-xl p-2.5 border border-white/10 flex flex-col justify-between cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-purple-200 block">Orang Tua / Wali</span>
              <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <span className="text-lg font-black text-white mt-1">{totalOrtu} Orang</span>
            <div className="mt-2 text-[10px] font-bold text-amber-200 group-hover:text-white flex items-center gap-1 transition-colors">
              <span>Kelola Ortu</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => setAdminTab('classes')}
            className="bg-white/10 hover:bg-white/15 rounded-xl p-2.5 border border-white/10 flex flex-col justify-between cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-purple-200 block">Rombongan Belajar</span>
              <Layers className="w-3.5 h-3.5 text-purple-300" />
            </div>
            <span className="text-lg font-black text-white mt-1">{classes.length} Kelas</span>
            <div className="mt-2 text-[10px] font-bold text-purple-200 group-hover:text-white flex items-center gap-1 transition-colors">
              <span>Kelola Kelas</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Admin Sub-Navigation Tabs (Rata Tengah) */}
      <div className="flex items-center justify-start sm:justify-center border border-slate-200 bg-white rounded-2xl p-1.5 gap-1.5 shadow-2xs overflow-x-auto no-scrollbar text-xs font-bold">
        <button
          onClick={() => setAdminTab('overview')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'overview' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Aktivitas</span>
        </button>
        <button
          onClick={() => setAdminTab('docs')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'docs' ? 'bg-amber-600 text-white shadow-2xs' : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
          }`}
        >
          <Server className="w-3.5 h-3.5 text-amber-500" />
          <span>Arsitektur & Skema (Dokumentasi)</span>
        </button>
        <button
          onClick={() => setAdminTab('users')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'users' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Pengguna ({users.length})</span>
        </button>
        <button
          onClick={() => setAdminTab('classes')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'classes' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Kelas ({classes.length})</span>
        </button>
        <button
          onClick={() => setAdminTab('drive')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'drive' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>Drive & Sheets</span>
        </button>
        <button
          onClick={() => setAdminTab('audit')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            adminTab === 'audit' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Audit Log ({auditLogs.length})</span>
        </button>
      </div>

      {/* 3. DOKUMENTASI TEKNIS & RANCANGAN SISTEM (Ditempatkan Langsung di Halaman Admin) */}
      {adminTab === 'docs' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-0 text-slate-800">
          {/* Docs Header */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-300 block">
                  Dokumentasi Teknis & Rancangan Sistem Lengkap
                </span>
                <h2 className="text-base sm:text-lg font-bold">
                  Arsitektur, Google Drive & Skema Google Sheets
                </h2>
              </div>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs shrink-0"
            >
              {copiedCode ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Kode Apps Script</span>
                </>
              )}
            </button>
          </div>

          {/* Docs Sub-tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-3 sm:px-6 overflow-x-auto no-scrollbar gap-1 text-xs font-bold">
            <button
              onClick={() => setDocsSubTab('arsitektur')}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                docsSubTab === 'arsitektur'
                  ? 'border-blue-600 text-blue-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>1. Arsitektur Sistem</span>
            </button>
            <button
              onClick={() => setDocsSubTab('drive')}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                docsSubTab === 'drive'
                  ? 'border-blue-600 text-blue-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>2. Folder Google Drive</span>
            </button>
            <button
              onClick={() => setDocsSubTab('sheets')}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                docsSubTab === 'sheets'
                  ? 'border-blue-600 text-blue-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>3. Skema Google Sheets</span>
            </button>
            <button
              onClick={() => setDocsSubTab('apps_script')}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                docsSubTab === 'apps_script'
                  ? 'border-blue-600 text-blue-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>4. Kode Apps Script (Code.gs)</span>
            </button>
            <button
              onClick={() => setDocsSubTab('panduan')}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                docsSubTab === 'panduan'
                  ? 'border-blue-600 text-blue-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>5. Panduan 4 Peran & Keamanan</span>
            </button>
          </div>

          {/* Sub-tab Contents */}
          <div className="p-4 sm:p-6 space-y-5 text-xs sm:text-sm">
            {/* SUB-TAB 1: ARSITEKTUR */}
            {docsSubTab === 'arsitektur' && (
              <div className="space-y-4">
                <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 text-blue-900 space-y-1">
                  <h4 className="font-bold text-sm flex items-center gap-1.5 text-blue-950">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Arsitektur Berkelanjutan & Keamanan Data Sekolah
                  </h4>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    Aplikasi ini mengisolasi akses data publik dengan menggunakan <strong>Role-Based Access Control (RBAC)</strong>. Seluruh proses baca-tulis berkas Google Drive dan Google Sheets dijembatani melalui Webhook Backend (Google Apps Script) milik akun resmi sekolah, sehingga kunci rahasia akun sekolah tidak pernah terekspos di browser pengguna.
                  </p>
                </div>

                {/* ASCII Architecture Flowchart */}
                <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto shadow-inner">
                  <div className="text-emerald-400 font-bold mb-2">// DIAGRAM ALUR DATA SISTEM 7 KEBIASAAN</div>
                  <pre className="leading-relaxed">
{`+-----------------------------------------------------------------------------------+
|                           FRONTEND REACT + TYPESCRIPT                            |
|  [Siswa Dashboard]      [Guru Dashboard]      [Orang Tua View]    [Admin Center]  |
|  - 7 Kartu Hebat        - Verifikasi Jurnal   - Pantauan Anak     - Manajemen User|
|  - Jurnal & Foto        - Pembinaan Edukatif  - Pesan Kasih Sayang- Sinkronisasi  |
+-----------------------------------------------------------------------------------+
                                        |  (Sesi Login & Validasi Peran RBAC)
                                        v
+-----------------------------------------------------------------------------------+
|                        LAPISAN AUTENTIKASI & KEAMANAN                             |
|  - Firebase Authentication / User Identity Mapping                               |
|  - Pemetaan Username -> Identitas Terenkripsi                                    |
|  - Role-Based Access Control (RBAC) & Audit Log Tracker                           |
+-----------------------------------------------------------------------------------+
                                        |  (Permintaan Data Terverifikasi)
                                        v
+-----------------------------------------------------------------------------------+
|                   BACKEND CONNECTOR (Google Apps Script / Webhook)                |
|  - Berjalan atas nama Akun Google Resmi Sekolah (Dedicated School Account)        |
|  - Menyediakan endpoint doPost() & doGet() terenkripsi HTTPS                      |
+-----------------------------------------------------------------------------------+
                   /                                             \\
                  v                                               v
+-----------------------------------+           +-----------------------------------+
|      GOOGLE DRIVE STORAGE         |           |       GOOGLE SHEETS DATABASE      |
|  Root: 7-KEBIASAAN-ANAK-INDONESIA |           |  File: DATABASE_7_KEBIASAAN_HEBAT  |
|  - DOKUMENTASI-SISWA (Foto Bukti) |           |  - TB_PENGGUNA   - TB_KELAS       |
|  - LAPORAN-PERKEMBANGAN (PDF)     |           |  - TB_JURNAL     - TB_PEMBINAAN   |
|  - ARSIP-ADMIN (Backup JSON)      |           |  - TB_TANGGAPAN  - TB_AUDIT_LOG   |
+-----------------------------------+           +-----------------------------------+`}
                  </pre>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="font-bold text-slate-800 block text-xs mb-1">
                      🔒 Penyimpanan Dokumen Privat (Non-Publik)
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Folder Google Drive tidak disetel publik untuk umum. Akses file diproses melalui backend yang memvalidasi identitas pengguna sehingga privasi foto siswa terlindungi.
                    </p>
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="font-bold text-slate-800 block text-xs mb-1">
                      ⚡ Kinerja Cepat & Cadangan Otomatis
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Menggabungkan penyimpanan lokal berkecepatan tinggi dengan sinkronisasi Google Cloud berkala, memungkinkan pengguna mengakses aplikasi tanpa jeda (*zero latency*).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: GOOGLE DRIVE FOLDER */}
            {docsSubTab === 'drive' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 pb-1">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Struktur Folder Resmi di Google Drive Sekolah
                    </h4>
                    <p className="text-xs text-slate-500">
                      Folder dibuat otomatis saat fungsi inisialisasi dijalankan di Google Apps Script.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full">
                    7 Sub-Folder Terstandar
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 bg-white">
                  {DRIVE_FOLDER_STRUCTURE.map((folder, idx) => (
                    <div key={idx} className={`p-3.5 flex items-start gap-3 ${folder.isRoot ? 'bg-blue-50/70' : 'hover:bg-slate-50'}`}>
                      <div className={`p-2 rounded-lg shrink-0 ${folder.isRoot ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        <HardDrive className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold text-xs ${folder.isRoot ? 'text-blue-900 text-sm' : 'text-slate-800'}`}>
                            {folder.name}
                          </span>
                          {folder.isRoot && (
                            <span className="px-1.5 py-0.2 bg-blue-200 text-blue-800 text-[10px] rounded font-bold">
                              ROOT FOLDER
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{folder.desc}</p>
                        {!folder.isRoot && (
                          <div className="text-[10px] text-slate-400 font-mono mt-1">
                            Path: <code>{folder.path}</code>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB 3: GOOGLE SHEETS DATABASE */}
            {docsSubTab === 'sheets' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Skema Relasi Lembar Kerja (Spreadsheet: DATABASE_7_KEBIASAAN_HEBAT)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Master data dan relasi tersimpan rapi dalam lembar kerja Google Sheets sekolah.
                  </p>
                </div>

                <div className="space-y-3">
                  {SHEETS_SCHEMA.map((table, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl p-3.5 bg-white shadow-2xs">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                          <span className="font-mono font-bold text-xs text-slate-900">
                            {table.sheetName}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">{table.description}</span>
                      </div>

                      <div className="bg-slate-50 rounded-lg p-2.5 font-mono text-[11px] text-slate-700 overflow-x-auto border border-slate-200">
                        <div className="flex flex-wrap gap-1.5">
                          {table.columns.map((col, cIdx) => (
                            <span
                              key={cIdx}
                              className={`px-2 py-0.5 rounded border ${
                                col === 'ID' || col.endsWith('ID')
                                  ? 'bg-indigo-100 text-indigo-800 border-indigo-200 font-bold'
                                  : 'bg-white text-slate-700 border-slate-200'
                              }`}
                            >
                              {col}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB 4: APPS SCRIPT CODE */}
            {docsSubTab === 'apps_script' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Kode Sumber Backend Google Apps Script (Code.gs)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Jalankan skrip ini di script.google.com akun sekolah Anda untuk mengaktifkan konektor.
                    </p>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Tersalin ke Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Salin Seluruh Kode</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 5-Min Setup Guide */}
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1.5 text-amber-900">
                  <span className="font-bold block text-sm">📋 Langkah Singkat Pemasangan (5 Menit):</span>
                  <ol className="list-decimal pl-4 space-y-1 text-xs">
                    <li>Buka <strong>https://script.google.com</strong> menggunakan akun Google resmi sekolah.</li>
                    <li>Buat proyek baru, beri judul <code>Backend 7 Kebiasaan Hebat</code>.</li>
                    <li>Hapus kode bawaan dan tempel kode lengkap yang telah disalin di bawah.</li>
                    <li>Pilih fungsi <code>setupInitialStorage</code> lalu klik <strong>Jalankan (Run)</strong> untuk membuat folder Drive & Spreadsheet otomatis.</li>
                    <li>Klik tombol <strong>Terapkan (Deploy) &gt; Penerapan Baru</strong>, pilih jenis <strong>Aplikasi Web</strong>.</li>
                    <li>Atur akses ke <em>"Siapa saja"</em> lalu salin Web App URL yang dihasilkan ke menu <strong>Admin &gt; Drive & Sheets</strong> di aplikasi ini.</li>
                  </ol>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-4">
                  <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto max-h-80 leading-relaxed">
                    {GOOGLE_APPS_SCRIPT_CODE}
                  </pre>
                </div>
              </div>
            )}

            {/* SUB-TAB 5: PANDUAN PENGGUNA */}
            {docsSubTab === 'panduan' && (
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">
                  Panduan Hak Akses & Operasional Berdasarkan 4 Peran
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 space-y-1">
                    <span className="font-bold text-purple-900 block">
                      👑 1. Administrator Sekolah
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-purple-800">
                      <li>Mengelola seluruh akun Siswa, Guru, dan Orang Tua (tambah/edit/nonaktifkan/reset sandi).</li>
                      <li>Mengatur relasi rombongan belajar (kelas) dan wali kelas pembina.</li>
                      <li>Mengonfigurasi penyimpanan Google Drive dan Google Sheets sekolah.</li>
                      <li>Melakukan backup database JSON berkala dan memantau audit aktivitas.</li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1">
                    <span className="font-bold text-blue-900 block">
                      👨‍🏫 2. Guru Pembina
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-blue-800">
                      <li>Memantau jurnal masuk dari seluruh siswa yang menjadi tanggung jawabnya.</li>
                      <li>Memeriksa foto bukti kegiatan dan memberikan apresiasi yang membangun.</li>
                      <li>Menyematkan lencana karakter prestasi harian.</li>
                      <li>Mendokumentasikan catatan pembinaan dan solusi positif bagi siswa binaan.</li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
                    <span className="font-bold text-emerald-900 block">
                      🎒 3. Peserta Didik (Siswa)
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-emerald-800">
                      <li>Melihat kartu 7 kebiasaan dan anjuran waktu pelaksanaan.</li>
                      <li>Mencatat aktivitas kebiasaan harian dan refleksi diri.</li>
                      <li>Mengunggah foto bukti kegiatan secara mudah dari HP.</li>
                      <li>Mengumpulkan rentetan hari konsisten (*streak*) dan mengoleksi lencana guru.</li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1">
                    <span className="font-bold text-amber-900 block">
                      👨‍👩‍👧 4. Orang Tua Siswa
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-amber-800">
                      <li>Melihat perkembangan kebiasaan harian khusus untuk anak kandungnya.</li>
                      <li>Melihat foto dokumentasi kegiatan anak dan catatan guru wali kelas.</li>
                      <li>Mengirimkan pesan doa, rasa bangga, dan observasi perilaku dari rumah.</li>
                      <li>Mengunduh rapor karakter perkembangan berkala.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. OVERVIEW TAB */}
      {adminTab === 'overview' && (
        <div className="space-y-4">
          {/* Quick banner linking to the embedded documentation */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-amber-950">
                  Dokumentasi Teknis, Arsitektur & Skema Google Sheets
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  Telah diletakkan langsung di menu ini! Meliputi diagram arsitektur sistem, 7 struktur folder Google Drive, tabel database Google Sheets, dan kode Google Apps Script.
                </p>
              </div>
            </div>
            <button
              onClick={() => setAdminTab('docs')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>Buka Dokumentasi Teknis</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pusat Pendaftaran Akun Pengguna (Ringkas & Mudah Dipahami) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0 shadow-2xs">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Pusat Pendaftaran Akun Pengguna
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 hidden sm:inline-block">
                    {users.length} Akun Terdaftar
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih peran untuk membuka formulir pendaftaran akun baru, atau kelola seluruh data pengguna.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => handleOpenAddUser('siswa')}
                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Buka formulir pendaftaran Siswa baru"
              >
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>+ Siswa Baru</span>
              </button>
              <button
                onClick={() => handleOpenAddUser('guru')}
                className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-800 border border-blue-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Buka formulir pendaftaran Guru baru"
              >
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>+ Guru Baru</span>
              </button>
              <button
                onClick={() => handleOpenAddUser('orang_tua')}
                className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 active:scale-95 text-amber-800 border border-amber-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Buka formulir pendaftaran Orang Tua baru"
              >
                <HeartHandshake className="w-4 h-4 text-amber-600" />
                <span>+ Orang Tua Baru</span>
              </button>
              <button
                onClick={() => { setAdminTab('users'); setUserFilterRole('all'); }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Kelola Semua ({users.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Search & Filter Bar for Students & Classes (Pencarian Cepat Siswa & Rombel) */}
          {(() => {
            const allStudents = users.filter(u => u.role === 'siswa');
            const filteredQuickStudents = allStudents.filter(s => {
              if (quickClassFilter !== 'all' && s.kelasId !== quickClassFilter) return false;
              if (quickStudentSearch.trim()) {
                const q = quickStudentSearch.toLowerCase().trim();
                const matchName = s.fullName.toLowerCase().includes(q);
                const matchNisn = s.nisn?.toLowerCase().includes(q);
                const matchUser = s.username.toLowerCase().includes(q);
                const clsName = classes.find(c => c.id === s.kelasId)?.name.toLowerCase();
                const matchClass = clsName?.includes(q);
                return matchName || matchNisn || matchUser || matchClass;
              }
              return true;
            });

            return (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <Search className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">
                        Pencarian & Filter Cepat Siswa
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Cari siswa berdasarkan nama, NISN, atau filter rombel kelas untuk pemantauan cepat
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 text-[11px] font-medium">
                      Menampilkan <strong className="text-purple-700 font-extrabold">{filteredQuickStudents.length}</strong> dari {allStudents.length} siswa
                    </span>
                    {(quickStudentSearch || quickClassFilter !== 'all') && (
                      <button
                        onClick={() => { setQuickStudentSearch(''); setQuickClassFilter('all'); }}
                        className="text-[11px] text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer"
                      >
                        Reset Filter
                      </button>
                    )}
                  </div>
                </div>

                {/* Search & Filter Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <div className="sm:col-span-7 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Ketik nama siswa, NISN, atau username..."
                      value={quickStudentSearch}
                      onChange={(e) => setQuickStudentSearch(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                    />
                    {quickStudentSearch && (
                      <button
                        onClick={() => setQuickStudentSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="sm:col-span-5 relative">
                    <select
                      value={quickClassFilter}
                      onChange={(e) => setQuickClassFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-bold text-slate-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
                    >
                      <option value="all">Semua Rombel Kelas ({classes.length} Kelas)</option>
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} (Tingkat {c.grade})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quick Results Grid */}
                <div className="space-y-2 pt-0.5">
                  {filteredQuickStudents.length === 0 ? (
                    <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                      Tidak ada siswa yang cocok dengan kriteria pencarian nama atau kelas yang dipilih.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                      {filteredQuickStudents.slice(0, 9).map(student => {
                        const studentClass = classes.find(c => c.id === student.kelasId);
                        const guruWali = users.find(u => u.id === student.assignedGuruId);
                        return (
                          <div
                            key={student.id}
                            className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-purple-200 hover:shadow-2xs transition-all flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0 flex items-center gap-2">
                              {student.avatarUrl ? (
                                <img
                                  src={student.avatarUrl}
                                  alt={student.fullName}
                                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                                  <GraduationCap className="w-4 h-4" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold text-xs text-slate-900 truncate">
                                    {student.fullName}
                                  </span>
                                  <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black bg-emerald-100 text-emerald-800 shrink-0">
                                    {studentClass?.name || 'Tanpa Kelas'}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                                  NISN: {student.nisn || '-'} {guruWali && `• Wali: ${guruWali.fullName.split(' ')[0]}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleOpenEditUser(student)}
                                className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-purple-700 hover:border-purple-300 transition-colors shadow-2xs cursor-pointer"
                                title="Edit Akun Siswa"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => {
                                  setAdminTab('users');
                                  setUserFilterRole('siswa');
                                  setUserSearchQuery(student.fullName);
                                }}
                                className="px-2 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-[10px] transition-colors cursor-pointer"
                                title="Buka data lengkap di tab Pengguna"
                              >
                                Detail
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {filteredQuickStudents.length > 9 && (
                    <div className="text-center pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setAdminTab('users');
                          setUserFilterRole('siswa');
                          if (quickClassFilter !== 'all') setUserFilterClass(quickClassFilter);
                          if (quickStudentSearch) setUserSearchQuery(quickStudentSearch);
                        }}
                        className="text-xs font-bold text-purple-600 hover:text-purple-800 hover:underline cursor-pointer"
                      >
                        Lihat semua {filteredQuickStudents.length} siswa di tab Pengguna &rarr;
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                Aktivitas Jurnal Terbaru ({journals.length} Total)
              </h3>
            </div>

            <div className="divide-y divide-slate-100">
              {journals.slice(0, 8).map(j => (
                <div key={j.id} className="py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{j.siswaName}</span>
                      <span className="text-[10px] text-slate-400">&bull; {j.date}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                        j.status === 'Sudah Dilaksanakan' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {j.status === 'Sudah Dilaksanakan' ? 'Selesai' : 'Tertunda'}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-1 italic">
                      "{j.activityDescription}"
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-500 sm:text-right shrink-0">
                    {j.guruVerified ? <span className="text-emerald-700 font-bold">✓ Diverifikasi Guru</span> : <span className="text-slate-400">Belum verifikasi</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. USERS TAB */}
      {adminTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          {/* Top Actions: 3 Dedicated Buttons for Siswa, Guru, Ortu */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Manajemen Data Pengguna ({users.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola data akun siswa, guru pembina, orang tua/wali murid, dan administrator sekolah.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleOpenAddUser('siswa')}
                className="px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <GraduationCap className="w-4 h-4" />
                <span>+ Tambah Data Siswa</span>
              </button>
              <button
                onClick={() => handleOpenAddUser('guru')}
                className="px-3 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>+ Tambah Data Guru</span>
              </button>
              <button
                onClick={() => handleOpenAddUser('orang_tua')}
                className="px-3 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-95 rounded-xl flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>+ Tambah Data Orang Tua</span>
              </button>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
            {/* Role Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                onClick={() => setUserFilterRole('all')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  userFilterRole === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({users.length})
              </button>
              <button
                onClick={() => setUserFilterRole('siswa')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1 ${
                  userFilterRole === 'siswa' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-emerald-800 hover:bg-emerald-100/60'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Siswa ({totalSiswa})</span>
              </button>
              <button
                onClick={() => setUserFilterRole('guru')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1 ${
                  userFilterRole === 'guru' ? 'bg-blue-600 text-white shadow-2xs' : 'text-blue-800 hover:bg-blue-100/60'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Guru ({totalGuru})</span>
              </button>
              <button
                onClick={() => setUserFilterRole('orang_tua')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1 ${
                  userFilterRole === 'orang_tua' ? 'bg-amber-600 text-white shadow-2xs' : 'text-amber-800 hover:bg-amber-100/60'
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Orang Tua ({totalOrtu})</span>
              </button>
              <button
                onClick={() => setUserFilterRole('admin')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1 ${
                  userFilterRole === 'admin' ? 'bg-purple-600 text-white shadow-2xs' : 'text-purple-800 hover:bg-purple-100/60'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin ({totalAdmin})</span>
              </button>
            </div>

            {/* Class Dropdown Filter & Search Input */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 lg:max-w-md">
              <select
                value={userFilterClass}
                onChange={(e) => setUserFilterClass(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-bold text-slate-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer sm:w-48"
              >
                <option value="all">Semua Rombel ({classes.length} Kelas)</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Tingkat {c.grade})
                  </option>
                ))}
              </select>

              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama, NISN, username, kelas..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                />
                {userSearchQuery && (
                  <button
                    onClick={() => setUserSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active Filter Indicators */}
          {(() => {
            const hasActiveFilter = userFilterRole !== 'all' || userFilterClass !== 'all' || userSearchQuery.trim().length > 0;
            const currentClassName = classes.find(c => c.id === userFilterClass)?.name;

            return (
              hasActiveFilter && (
                <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-500 font-semibold">Filter Aktif:</span>
                    {userFilterRole !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800">
                        Peran: {userFilterRole}
                        <button onClick={() => setUserFilterRole('all')} className="hover:opacity-75 cursor-pointer">×</button>
                      </span>
                    )}
                    {userFilterClass !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">
                        Kelas: {currentClassName}
                        <button onClick={() => setUserFilterClass('all')} className="hover:opacity-75 cursor-pointer">×</button>
                      </span>
                    )}
                    {userSearchQuery.trim() && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-800">
                        Kata Kunci: "{userSearchQuery}"
                        <button onClick={() => setUserSearchQuery('')} className="hover:opacity-75 cursor-pointer">×</button>
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setUserFilterRole('all');
                      setUserFilterClass('all');
                      setUserSearchQuery('');
                    }}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                  >
                    Reset Semua Filter
                  </button>
                </div>
              )
            );
          })()}

          {/* User List: Mobile Cards */}
          {(() => {
            const filteredUsers = users.filter(u => {
              if (userFilterRole !== 'all' && u.role !== userFilterRole) return false;
              if (userFilterClass !== 'all' && u.kelasId !== userFilterClass) return false;
              if (userSearchQuery.trim()) {
                const q = userSearchQuery.toLowerCase().trim();
                const matchName = u.fullName.toLowerCase().includes(q);
                const matchUser = u.username.toLowerCase().includes(q);
                const matchNisn = u.nisn?.toLowerCase().includes(q);
                const matchNip = u.nip?.toLowerCase().includes(q);
                const matchPhone = u.phone?.toLowerCase().includes(q);
                const matchEmail = u.email?.toLowerCase().includes(q);
                const cls = classes.find(c => c.id === u.kelasId)?.name.toLowerCase();
                const matchClass = cls?.includes(q);
                return matchName || matchUser || matchNisn || matchNip || matchPhone || matchEmail || matchClass;
              }
              return true;
            });

            if (filteredUsers.length === 0) {
              return (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold">Tidak ada pengguna yang cocok dengan filter atau kata kunci pencarian.</p>
                  <button
                    onClick={() => { setUserFilterRole('all'); setUserFilterClass('all'); setUserSearchQuery(''); }}
                    className="mt-2 text-xs font-bold text-purple-600 hover:underline cursor-pointer"
                  >
                    Reset Filter
                  </button>
                </div>
              );
            }

            return (
              <>
                {/* Mobile Cards */}
                <div className="sm:hidden space-y-2.5">
                  {filteredUsers.map(u => {
                    const uClass = classes.find(c => c.id === u.kelasId);
                    const child = u.siswaId ? users.find(s => s.id === u.siswaId) : null;
                    const teacher = u.assignedGuruId ? users.find(g => g.id === u.assignedGuruId) : null;

                    return (
                      <div key={u.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {u.avatarUrl ? (
                              <img
                                src={u.avatarUrl}
                                alt={u.fullName}
                                className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 shadow-2xs shrink-0"
                              />
                            ) : (
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                                u.role === 'siswa' ? 'bg-emerald-100 text-emerald-800' :
                                u.role === 'guru' ? 'bg-blue-100 text-blue-800' :
                                u.role === 'orang_tua' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                              }`}>
                                {u.role === 'siswa' && <GraduationCap className="w-4 h-4" />}
                                {u.role === 'guru' && <UserCheck className="w-4 h-4" />}
                                {u.role === 'orang_tua' && <HeartHandshake className="w-4 h-4" />}
                                {u.role === 'admin' && <Shield className="w-4 h-4" />}
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-slate-900 block leading-tight">{u.fullName}</span>
                              <span className="text-[11px] text-slate-500 font-mono block mt-0.5">@{u.username}</span>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase shrink-0 ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            u.role === 'guru' ? 'bg-blue-100 text-blue-800' :
                            u.role === 'siswa' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {u.role.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Role Details */}
                        <div className="text-[11px] text-slate-600 space-y-0.5 pt-1 border-t border-slate-200/60">
                          {u.role === 'siswa' && (
                            <>
                              <div>NISN: <strong className="font-mono text-slate-800">{u.nisn || '-'}</strong> | Kelas: <strong>{uClass?.name || '-'}</strong></div>
                              {teacher && <div className="text-slate-500">Guru Pembina: <strong>{teacher.fullName}</strong></div>}
                            </>
                          )}
                          {u.role === 'guru' && (
                            <>
                              <div>NIP: <strong className="font-mono text-slate-800">{u.nip || '-'}</strong></div>
                              <div>Penugasan: <strong>{uClass ? `Wali Kelas ${uClass.name}` : 'Guru Mata Pelajaran'}</strong></div>
                            </>
                          )}
                          {u.role === 'orang_tua' && (
                            <>
                              <div>Hubungan: <strong>{u.relationship || 'Orang Tua / Wali'}</strong></div>
                              <div>Siswa Terhubung: <strong className="text-amber-800">{child ? `${child.fullName} (${classes.find(c => c.id === child.kelasId)?.name || 'Siswa'})` : '-'}</strong></div>
                            </>
                          )}
                          {u.phone && <div className="text-slate-500 font-mono">WA/HP: {u.phone}</div>}
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                          <button
                            onClick={() => handleToggleUserStatus(u)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.status === 'active' ? 'text-emerald-700 bg-emerald-100/70' : 'text-red-700 bg-red-100/70'
                            }`}
                          >
                            {u.status === 'active' ? '● Aktif' : '○ Nonaktif'}
                          </button>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenResetPassword(u)}
                              className="p-1.5 text-amber-700 hover:bg-amber-100 rounded-lg"
                              title="Reset Kata Sandi"
                            >
                              <Key className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditUser(u)}
                              className="p-1.5 text-blue-700 hover:bg-blue-100 rounded-lg"
                              title="Edit Data"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {u.id !== currentUser.id && (
                              <button
                                onClick={() => setUserToDelete(u)}
                                className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg"
                                title="Hapus Akun"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop View: Rich Table */}
                <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Nama & Identitas</th>
                        <th className="p-3">Username & Kontak</th>
                        <th className="p-3">Peran & Penempatan</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Kelola</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredUsers.map(u => {
                        const uClass = classes.find(c => c.id === u.kelasId);
                        const child = u.siswaId ? users.find(s => s.id === u.siswaId) : null;
                        const teacher = u.assignedGuruId ? users.find(g => g.id === u.assignedGuruId) : null;

                        return (
                          <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                {u.avatarUrl ? (
                                  <img
                                    src={u.avatarUrl}
                                    alt={u.fullName}
                                    className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200 shrink-0 shadow-2xs"
                                  />
                                ) : (
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                                    u.role === 'siswa' ? 'bg-emerald-100 text-emerald-800' :
                                    u.role === 'guru' ? 'bg-blue-100 text-blue-800' :
                                    u.role === 'orang_tua' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                                  }`}>
                                    {u.role === 'siswa' && <GraduationCap className="w-4 h-4" />}
                                    {u.role === 'guru' && <UserCheck className="w-4 h-4" />}
                                    {u.role === 'orang_tua' && <HeartHandshake className="w-4 h-4" />}
                                    {u.role === 'admin' && <Shield className="w-4 h-4" />}
                                  </div>
                                )}
                                <div>
                                  <span className="font-bold text-slate-900 block">{u.fullName}</span>
                                  {u.role === 'siswa' && u.nisn && (
                                    <span className="text-[10px] text-slate-500 font-mono">NISN: {u.nisn}</span>
                                  )}
                                  {u.role === 'guru' && u.nip && (
                                    <span className="text-[10px] text-slate-500 font-mono">NIP: {u.nip}</span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="p-3">
                              <div className="font-mono text-slate-700 font-semibold">@{u.username}</div>
                              {u.phone && <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5"><Phone className="w-2.5 h-2.5" />{u.phone}</div>}
                              {u.email && <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{u.email}</div>}
                            </td>

                            <td className="p-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                u.role === 'guru' ? 'bg-blue-100 text-blue-800' :
                                u.role === 'siswa' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {u.role === 'siswa' && <GraduationCap className="w-3 h-3" />}
                                {u.role === 'guru' && <UserCheck className="w-3 h-3" />}
                                {u.role === 'orang_tua' && <HeartHandshake className="w-3 h-3" />}
                                {u.role === 'admin' && <Shield className="w-3 h-3" />}
                                {u.role.replace('_', ' ')}
                              </span>

                              <div className="text-[11px] text-slate-600 mt-1">
                                {u.role === 'siswa' && (
                                  <span>{uClass ? `Kelas: ${uClass.name}` : 'Belum ada kelas'}</span>
                                )}
                                {u.role === 'guru' && (
                                  <span>{uClass ? `Wali Kelas: ${uClass.name}` : 'Guru Mata Pelajaran'}</span>
                                )}
                                {u.role === 'orang_tua' && (
                                  <span>{child ? `Anak: ${child.fullName}` : 'Belum terhubung'}</span>
                                )}
                                {u.role === 'admin' && <span>Akses Penuh Sistem</span>}
                              </div>
                            </td>

                            <td className="p-3">
                              <button
                                onClick={() => handleToggleUserStatus(u)}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                                  u.status === 'active' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                                }`}
                              >
                                {u.status === 'active' ? '● Aktif' : '○ Nonaktif'}
                              </button>
                            </td>

                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleOpenResetPassword(u)}
                                  className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                  title="Reset Kata Sandi"
                                >
                                  <Key className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenEditUser(u)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit Data"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                {u.id !== currentUser.id && (
                                  <button
                                    onClick={() => setUserToDelete(u)}
                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Hapus Akun"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* 6. GOOGLE DRIVE & SHEETS SETTINGS */}
      {adminTab === 'drive' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-emerald-600" />
              Koneksi Google Drive & Sheets Sekolah
            </h3>
            <button
              onClick={() => setAdminTab('docs')}
              className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200 hover:bg-blue-100"
            >
              Lihat Skema & Kode Apps Script
            </button>
          </div>

          {syncStatusMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{syncStatusMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveDriveConfig} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Webhook URL Google Apps Script:
              </label>
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full text-xs font-mono rounded-lg border border-slate-300 p-2 bg-white"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Salin Web App URL setelah menerapkan kode di tab <strong>Arsitektur & Skema</strong>.
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={handleTriggerManualSync}
                disabled={isSyncing}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center justify-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Proses...' : 'Sinkronkan'}</span>
              </button>
            </div>
          </form>

          {/* Backup buttons */}
          <div className="pt-2 border-t border-slate-200 flex gap-2">
            <button
              onClick={handleDownloadBackup}
              className="flex-1 py-2 bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Cadangkan JSON</span>
            </button>
            <label className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Pulihkan JSON</span>
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>
          </div>
        </div>
      )}

      {/* 7. CLASSES TAB (Manajemen Kelas SMP 7.1-7.11, 8.1-8.11, 9.1-9.11) */}
      {adminTab === 'classes' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          {/* Header & Main Action Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Manajemen Data Rombongan Belajar / Kelas ({classes.length} Kelas)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Kelola rombel kelas SMP (Tingkat 7, 8, dan 9), penetapan wali kelas pembina, dan monitoring jumlah siswa.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBatchGenerateSMPClasses([7, 8, 9])}
                className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 active:scale-95 rounded-xl flex items-center gap-1.5 shadow-2xs transition-all"
                title="Buat Otomatis 33 Kelas SMP Sekaligus (7.1 s/d 7.11, 8.1 s/d 8.11, 9.1 s/d 9.11)"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>+ Inisialisasi Kelas 7.1-7.11, 8.1-8.11, 9.1-9.11</span>
              </button>

              <button
                onClick={() => handleOpenAddClass(7)}
                className="px-3 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 active:scale-95 rounded-xl flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Kelas Baru</span>
              </button>
            </div>
          </div>

          {/* Feedback message banner */}
          {classBatchMessage && (
            <div className="p-3 bg-purple-50 border border-purple-200 text-purple-900 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
              <span>{classBatchMessage}</span>
            </div>
          )}

          {/* Quick Shortcuts to Generate per Grade */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-50 to-purple-50/40 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-bold">
              <span className="text-[11px] uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                Pintasan Massal:
              </span>
              <span>Buat kelas per tingkat sekaligus:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => handleBatchGenerateSMPClasses([7])}
                className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1 transition-colors"
                title="Buat Kelas 7.1 sampai 7.11"
              >
                <Plus className="w-3 h-3 text-emerald-600" />
                <span>Kelas 7.1 - 7.11 (Tingkat 7)</span>
              </button>
              <button
                onClick={() => handleBatchGenerateSMPClasses([8])}
                className="px-2.5 py-1 text-[11px] font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1 transition-colors"
                title="Buat Kelas 8.1 sampai 8.11"
              >
                <Plus className="w-3 h-3 text-blue-600" />
                <span>Kelas 8.1 - 8.11 (Tingkat 8)</span>
              </button>
              <button
                onClick={() => handleBatchGenerateSMPClasses([9])}
                className="px-2.5 py-1 text-[11px] font-bold text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg flex items-center gap-1 transition-colors"
                title="Buat Kelas 9.1 sampai 9.11"
              >
                <Plus className="w-3 h-3 text-purple-600" />
                <span>Kelas 9.1 - 9.11 (Tingkat 9)</span>
              </button>
            </div>
          </div>

          {/* Filter & Search Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Grade Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                onClick={() => setClassGradeFilter('all')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  classGradeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua Kelas ({classes.length})
              </button>
              <button
                onClick={() => setClassGradeFilter(7)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1 ${
                  classGradeFilter === 7 ? 'bg-emerald-600 text-white shadow-2xs' : 'text-emerald-800 hover:bg-emerald-100/60'
                }`}
              >
                <span>Tingkat 7 ({classes.filter(c => c.grade === 7).length})</span>
              </button>
              <button
                onClick={() => setClassGradeFilter(8)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1 ${
                  classGradeFilter === 8 ? 'bg-blue-600 text-white shadow-2xs' : 'text-blue-800 hover:bg-blue-100/60'
                }`}
              >
                <span>Tingkat 8 ({classes.filter(c => c.grade === 8).length})</span>
              </button>
              <button
                onClick={() => setClassGradeFilter(9)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1 ${
                  classGradeFilter === 9 ? 'bg-purple-600 text-white shadow-2xs' : 'text-purple-800 hover:bg-purple-100/60'
                }`}
              >
                <span>Tingkat 9 ({classes.filter(c => c.grade === 9).length})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kelas (misal: 7.1, 8.5)..."
                value={classSearchQuery}
                onChange={(e) => setClassSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 transition-all"
              />
              {classSearchQuery && (
                <button
                  onClick={() => setClassSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Grid of Class Cards */}
          {(() => {
            const filteredClasses = classes.filter(c => {
              if (classGradeFilter !== 'all' && c.grade !== classGradeFilter) return false;
              if (classSearchQuery.trim()) {
                const q = classSearchQuery.toLowerCase().trim();
                const matchName = c.name.toLowerCase().includes(q);
                const wali = users.find(u => u.id === c.waliKelasId);
                const matchWali = wali?.fullName.toLowerCase().includes(q);
                return matchName || matchWali;
              }
              return true;
            });

            // Sort natural order by grade and class number (e.g. 7.1, 7.2 ... 7.10, 7.11)
            filteredClasses.sort((a, b) => {
              if (a.grade !== b.grade) return a.grade - b.grade;
              const numA = parseInt(a.name.replace(/[^0-9]/g, '')) || 0;
              const numB = parseInt(b.name.replace(/[^0-9]/g, '')) || 0;
              return numA - numB;
            });

            if (filteredClasses.length === 0) {
              return (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                  <p className="text-xs text-slate-500 font-semibold">Tidak ada kelas yang sesuai dengan filter atau pencarian.</p>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      onClick={() => handleBatchGenerateSMPClasses([7, 8, 9])}
                      className="text-xs font-bold text-purple-600 hover:text-purple-800 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200"
                    >
                      Inisialisasi 33 Kelas SMP Otomatis
                    </button>
                    <button
                      onClick={() => { setClassGradeFilter('all'); setClassSearchQuery(''); }}
                      className="text-xs font-bold text-slate-600 hover:underline px-2 py-1.5"
                    >
                      Reset Filter
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredClasses.map(c => {
                  const wali = users.find(u => u.id === c.waliKelasId);
                  const classStudents = users.filter(u => u.role === 'siswa' && u.kelasId === c.id);

                  return (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-purple-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-2.5 text-xs"
                    >
                      {/* Top Row: Name and Grade Badge */}
                      <div className="flex items-start justify-between gap-1.5">
                        <div>
                          <span className="font-extrabold text-sm text-slate-900 block tracking-tight">
                            {c.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            TA: {c.academicYear || '2026/2027'}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                          c.grade === 7 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          c.grade === 8 ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          'bg-purple-100 text-purple-800 border border-purple-200'
                        }`}>
                          Tingkat {c.grade}
                        </span>
                      </div>

                      {/* Wali Kelas and Student Count */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="text-slate-500">Wali:</span>
                          <span className={`font-bold truncate ${wali ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                            {wali ? wali.fullName : 'Belum Ditentukan'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="text-slate-500">Siswa Terdaftar:</span>
                          <span className="font-bold text-slate-900">
                            {classStudents.length} Siswa
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                        <button
                          onClick={() => handleOpenEditClass(c)}
                          className="px-2.5 py-1 text-slate-700 hover:text-purple-700 hover:bg-purple-50 rounded-lg font-bold flex items-center gap-1 transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => setClassToDelete(c)}
                          className="px-2 py-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Rombel Kelas"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* 8. AUDIT LOG TAB */}
      {adminTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
            Audit Log Aktivitas ({auditLogs.length})
          </h3>
          <div className="divide-y divide-slate-100">
            {auditLogs.slice(0, 10).map((log, idx) => (
              <div key={`${log.id || 'log'}-${idx}`} className="py-2 space-y-0.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{new Date(log.timestamp).toLocaleTimeString('id-ID')}</span>
                  <span className="font-mono text-purple-700 font-bold">{log.action}</span>
                </div>
                <div className="font-bold text-slate-800 text-[11px]">{log.userName} ({log.role})</div>
                <p className="text-slate-600 text-[11px]">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add / Edit User (Siswa, Guru, Orang Tua, Admin) */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className={`p-4 sm:p-5 text-white flex items-center justify-between shrink-0 ${
              role === 'siswa' ? 'bg-gradient-to-r from-emerald-600 to-teal-700' :
              role === 'guru' ? 'bg-gradient-to-r from-blue-600 to-indigo-700' :
              role === 'orang_tua' ? 'bg-gradient-to-r from-amber-600 to-orange-700' :
              'bg-gradient-to-r from-purple-700 to-indigo-900'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
                  {role === 'siswa' && <GraduationCap className="w-5 h-5 text-white" />}
                  {role === 'guru' && <UserCheck className="w-5 h-5 text-white" />}
                  {role === 'orang_tua' && <HeartHandshake className="w-5 h-5 text-white" />}
                  {role === 'admin' && <Shield className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    {editingUser
                      ? `Edit Data ${role === 'siswa' ? 'Siswa' : role === 'guru' ? 'Guru' : role === 'orang_tua' ? 'Orang Tua' : 'Admin'}`
                      : `Tambah Data ${role === 'siswa' ? 'Siswa Baru' : role === 'guru' ? 'Guru / Pembina Baru' : role === 'orang_tua' ? 'Orang Tua / Wali Baru' : 'Admin Baru'}`}
                  </h3>
                  <span className="text-[11px] text-white/80 block">
                    {editingUser ? `ID: ${editingUser.id}` : 'Isi formulir data di bawah ini secara lengkap'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowUserModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Role Selector Tabs (Only when creating new user) */}
            {!editingUser && (
              <div className="p-3 bg-slate-50 border-b border-slate-200 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Pilih Jenis Peran Pengguna:
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setRole('siswa'); setFormError(''); }}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                      role === 'siswa'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Siswa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRole('guru'); setFormError(''); }}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                      role === 'guru'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Guru</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRole('orang_tua'); setFormError(''); }}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                      role === 'orang_tua'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Orang Tua</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRole('admin'); setFormError(''); }}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                      role === 'admin'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>
            )}

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveUser} className="p-4 sm:p-5 space-y-4 text-xs overflow-y-auto">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* SECTION 1: ROLE-SPECIFIC FIELDS */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block border-b border-slate-100 pb-1">
                  1. Informasi Pokok & Identitas
                </span>

                {/* Full Name */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {role === 'siswa' ? 'Nama Lengkap Siswa *' :
                     role === 'guru' ? 'Nama Lengkap & Gelar Guru *' :
                     role === 'orang_tua' ? 'Nama Lengkap Orang Tua / Wali *' : 'Nama Lengkap Administrator *'}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      role === 'siswa' ? 'Contoh: Bintang Pratama' :
                      role === 'guru' ? 'Contoh: Dewi Ratnasari, S.Pd.' :
                      role === 'orang_tua' ? 'Contoh: Bambang Supriyanto' : 'Contoh: Administrator Sekolah'
                    }
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                    required
                  />
                </div>

                {/* Foto Profil Pengguna (Semua Akun) */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 via-purple-50/30 to-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-purple-600" />
                      <span className="font-extrabold text-xs text-slate-900">
                        Foto Profil Akun ({role === 'siswa' ? 'Siswa' : role === 'guru' ? 'Guru' : role === 'orang_tua' ? 'Orang Tua' : 'Admin'})
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      Opsional
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3.5">
                    {/* Live Preview */}
                    <div className="relative group shrink-0">
                      {avatarUrl ? (
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-purple-500 shadow-md">
                          <img
                            src={avatarUrl}
                            alt="Pratinjau Foto"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setAvatarUrl('')}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer"
                            title="Hapus foto"
                          >
                            <Trash2 className="w-4 h-4 text-red-400 mb-0.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      ) : (
                        <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold text-xs border border-dashed border-slate-300 shadow-2xs ${
                          role === 'siswa' ? 'bg-emerald-50 text-emerald-700' :
                          role === 'guru' ? 'bg-blue-50 text-blue-700' :
                          role === 'orang_tua' ? 'bg-amber-50 text-amber-700' : 'bg-purple-50 text-purple-700'
                        }`}>
                          <Camera className="w-5 h-5 text-slate-400 mb-0.5" />
                          <span className="text-[9px] text-slate-500 font-semibold">Tanpa Foto</span>
                        </div>
                      )}
                    </div>

                    {/* Upload Controls & URL */}
                    <div className="flex-1 space-y-2 w-full">
                      <input
                        type="file"
                        ref={avatarFileInputRef}
                        onChange={handleAvatarFileChange}
                        accept="image/*"
                        className="hidden"
                      />

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => avatarFileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{avatarUrl ? 'Ganti Berkas Foto' : 'Unggah Foto dari HP / Komputer'}</span>
                        </button>

                        {avatarUrl && (
                          <button
                            type="button"
                            onClick={() => setAvatarUrl('')}
                            className="px-2.5 py-1.5 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus Foto</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <input
                          type="url"
                          value={avatarUrl}
                          onChange={(e) => setAvatarUrl(e.target.value)}
                          placeholder="Atau tempel link URL foto langsung (https://...)..."
                          className="w-full text-[11px] rounded-lg border border-slate-200 px-2.5 py-1.5 bg-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-purple-500 font-mono"
                        />
                      </div>

                      {avatarUploadError && (
                        <p className="text-[11px] text-red-600 font-medium">{avatarUploadError}</p>
                      )}
                    </div>
                  </div>

                  {/* Quick Avatar Presets */}
                  <div className="pt-2 border-t border-slate-200/70">
                    <span className="text-[10px] font-bold text-slate-500 block mb-1.5">
                      Pilihan Cepat Foto Karakter / Ilustrasi:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {ROLE_AVATAR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatarUrl(preset.url)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                            avatarUrl === preset.url
                              ? 'bg-purple-600 border-purple-600 text-white shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-3.5 h-3.5 rounded-full object-cover"
                          />
                          <span>{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SISWA SPECIFIC FIELDS */}
                {role === 'siswa' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          NISN (Nomor Induk Siswa):
                        </label>
                        <input
                          type="text"
                          maxLength={12}
                          placeholder="Contoh: 0098765432"
                          value={nisnNip}
                          onChange={(e) => setNisnNip(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 p-2.5 bg-slate-50 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Pilih Rombel / Kelas:
                        </label>
                        <select
                          value={kelasId}
                          onChange={(e) => setKelasId(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 p-2.5 bg-slate-50 font-bold text-slate-800"
                        >
                          {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Guru Pembina / Wali Pendamping:
                      </label>
                      <select
                        value={assignedGuruId}
                        onChange={(e) => setAssignedGuruId(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-2.5 bg-slate-50 font-medium text-slate-800"
                      >
                        <option value="">-- Pilih Guru Pembina --</option>
                        {users.filter(u => u.role === 'guru').map(g => (
                          <option key={g.id} value={g.id}>
                            {g.fullName} {g.nip ? `(NIP: ${g.nip})` : ''}
                          </option>
                        ))}
                      </select>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Guru pembina bertanggung jawab atas verifikasi jurnal dan apresiasi kebiasaan siswa ini.
                      </span>
                    </div>
                  </>
                )}

                {/* GURU SPECIFIC FIELDS */}
                {role === 'guru' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        NIP / NUPTK Pegawai:
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 19850312 201001 2 021"
                        value={nisnNip}
                        onChange={(e) => setNisnNip(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-2.5 bg-slate-50 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Penugasan Wali Kelas:
                      </label>
                      <select
                        value={kelasId}
                        onChange={(e) => setKelasId(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-2.5 bg-slate-50 font-bold text-slate-800"
                      >
                        <option value="">Bukan Wali Kelas (Guru Mapel)</option>
                        {classes.map(c => (
                          <option key={c.id} value={c.id}>Wali Kelas {c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* ORANG TUA SPECIFIC FIELDS */}
                {role === 'orang_tua' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Hubungan Keluarga:
                        </label>
                        <select
                          value={relationship}
                          onChange={(e) => setRelationship(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 p-2.5 bg-slate-50 font-bold text-slate-800"
                        >
                          <option value="Ayah Kandung">Ayah Kandung</option>
                          <option value="Ibu Kandung">Ibu Kandung</option>
                          <option value="Wali Murid">Wali Murid</option>
                          <option value="Keluarga / Kerabat">Keluarga / Kerabat</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Hubungkan ke Siswa / Anak *:
                        </label>
                        <select
                          value={selectedChildId}
                          onChange={(e) => setSelectedChildId(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 p-2.5 bg-slate-50 font-bold text-slate-800"
                          required
                        >
                          <option value="">-- Pilih Anak Terdaftar --</option>
                          {users.filter(u => u.role === 'siswa').map(s => {
                            const sClass = classes.find(c => c.id === s.kelasId);
                            return (
                              <option key={s.id} value={s.id}>
                                {s.fullName} {sClass ? `(${sClass.name})` : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <span className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 block">
                      💡 Akun orang tua ini akan otomatis memiliki hak akses memantau capaian 7 kebiasaan dan memberi dukungan untuk anak yang dipilih.
                    </span>
                  </>
                )}
              </div>

              {/* SECTION 2: LOGIN CREDENTIALS */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block border-b border-slate-100 pb-1">
                  2. Kredensial Masuk Akun
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-800">
                        Username Login *:
                      </label>
                      <button
                        type="button"
                        onClick={handleAutoGenerateUsername}
                        className="text-[10px] font-bold text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-0.5"
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Buat Otomatis</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder={role === 'siswa' ? 'siswa.bintang' : role === 'guru' ? 'guru.dewi' : role === 'orang_tua' ? 'ortu.bintang' : 'admin.utama'}
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                      className="w-full rounded-xl border border-slate-300 p-2.5 bg-slate-50 font-mono text-slate-800 font-bold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      {editingUser ? 'Kata Sandi Baru (Opsional):' : 'Kata Sandi Awal *:'}
                    </label>
                    <input
                      type="text"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      placeholder={editingUser ? 'Kosongkan jika tidak diubah' : 'password123'}
                      className="w-full rounded-xl border border-slate-300 p-2.5 bg-slate-50 font-mono focus:bg-white"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {editingUser ? 'Biarkan kosong untuk mempertahankan kata sandi saat ini' : 'Bawaan standar: password123'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: CONTACT & COMMUNICATION */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block border-b border-slate-100 pb-1">
                  3. Kontak & Komunikasi (Opsional)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>No. WhatsApp / HP:</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="081234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 bg-slate-50 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-500" />
                      <span>Alamat Email:</span>
                    </label>
                    <input
                      type="email"
                      placeholder="contoh@sekolah.sch.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 bg-slate-50"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-white font-extrabold shadow-sm active:scale-95 transition-all flex items-center gap-1.5 ${
                    role === 'siswa' ? 'bg-emerald-600 hover:bg-emerald-700' :
                    role === 'guru' ? 'bg-blue-600 hover:bg-blue-700' :
                    role === 'orang_tua' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {editingUser
                      ? 'Simpan Perubahan'
                      : role === 'siswa'
                      ? 'Daftarkan Siswa'
                      : role === 'guru'
                      ? 'Daftarkan Guru'
                      : role === 'orang_tua'
                      ? 'Daftarkan Orang Tua'
                      : 'Simpan Pengguna'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Pengguna */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 space-y-3 text-xs border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-sm text-slate-900">Hapus Data Pengguna?</h3>
              <p className="text-slate-600">
                Anda akan menghapus akun <strong>{userToDelete.fullName}</strong> (@{userToDelete.username}) yang berperan sebagai <strong>{userToDelete.role.replace('_', ' ')}</strong>.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteUser}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-xs active:scale-95 transition-all"
              >
                Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Class (Kelas 7.1-7.11, 8.1-8.11, 9.1-9.11) */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 sm:p-5 text-white bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    {editingClass ? 'Edit Rombel Kelas' : 'Tambah Rombel Kelas SMP Baru'}
                  </h3>
                  <span className="text-[11px] text-purple-200 block">
                    {editingClass ? `ID: ${editingClass.id}` : 'Format penamaan kelas: 7.1 s/d 7.11, 8.1 s/d 8.11, 9.1 s/d 9.11'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowClassModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveClass} className="p-4 sm:p-5 space-y-4 text-xs overflow-y-auto">
              {classFormError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{classFormError}</span>
                </div>
              )}

              {/* Tingkat Selection */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Tingkat / Jenjang SMP:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[7, 8, 9].map(grade => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => {
                        setClassGradeInput(grade);
                        if (!editingClass) {
                          const existingInGrade = classes.filter(c => c.grade === grade);
                          const nextNum = existingInGrade.length < 11 ? existingInGrade.length + 1 : 1;
                          setClassNameInput(`Kelas ${grade}.${nextNum}`);
                        }
                      }}
                      className={`py-2 px-3 rounded-xl font-extrabold text-xs transition-all ${
                        classGradeInput === grade
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Tingkat {grade}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Preset Selector for 7.1-7.11, 8.1-8.11, 9.1-9.11 */}
              {!editingClass && (
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">
                    Pilih Cepat Nomor Kelas ({classGradeInput}.1 s/d {classGradeInput}.11):
                  </span>
                  <div className="grid grid-cols-6 sm:grid-cols-11 gap-1">
                    {Array.from({ length: 11 }, (_, i) => i + 1).map(num => {
                      const candidateName = `Kelas ${classGradeInput}.${num}`;
                      const isTaken = classes.some(c => c.name.toLowerCase() === candidateName.toLowerCase());
                      const isSelected = classNameInput === candidateName;

                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setClassNameInput(candidateName)}
                          className={`py-1 text-center font-bold text-[11px] rounded-lg border transition-all ${
                            isSelected
                              ? 'bg-purple-600 text-white border-purple-600'
                              : isTaken
                              ? 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-purple-50 hover:border-purple-300'
                          }`}
                          title={isTaken ? `${candidateName} sudah terdaftar` : `Pilih ${candidateName}`}
                        >
                          {classGradeInput}.{num}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Nama Kelas */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Nama Kelas *:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kelas 7.1 atau 7.1"
                  value={classNameInput}
                  onChange={(e) => setClassNameInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 bg-slate-50 font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Wali Kelas */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Wali Kelas Pembina (Opsional):
                </label>
                <select
                  value={classWaliInput}
                  onChange={(e) => setClassWaliInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 bg-slate-50 font-medium text-slate-800"
                >
                  <option value="">-- Belum Ditentukan (Guru Mapel / Belum Ada Wali) --</option>
                  {users.filter(u => u.role === 'guru').map(g => (
                    <option key={g.id} value={g.id}>
                      {g.fullName} {g.nip ? `(NIP: ${g.nip})` : ''}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Guru yang dipilih akan otomatis menjadi pembina dan memantau jurnal siswa di kelas ini.
                </span>
              </div>

              {/* Tahun Ajaran */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Tahun Ajaran:
                </label>
                <input
                  type="text"
                  placeholder="2026/2027"
                  value={classYearInput}
                  onChange={(e) => setClassYearInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 bg-slate-50 font-mono"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingClass ? 'Simpan Perubahan' : 'Simpan Kelas Baru'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Kelas */}
      {classToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 space-y-3 text-xs border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-sm text-slate-900">Hapus Rombel Kelas?</h3>
              <p className="text-slate-600">
                Anda akan menghapus data <strong>{classToDelete.name}</strong> (Tingkat {classToDelete.grade}).
              </p>
              {users.some(u => u.role === 'siswa' && u.kelasId === classToDelete.id) && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] text-left mt-2">
                  ⚠️ Peringatan: Terdapat siswa yang saat ini terdaftar di kelas ini. Anda tetap dapat menghapusnya dan memindahkan siswa ke rombel lain.
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setClassToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteClass}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-xs active:scale-95 transition-all"
              >
                Hapus Kelas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Reset Password */}
      {showPasswordModal && targetResetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-4 space-y-3 text-xs border border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Reset Kata Sandi</h3>
                <span className="text-[11px] text-slate-500 font-mono">@{targetResetUser.username} ({targetResetUser.fullName})</span>
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kata Sandi Baru:</label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 bg-slate-50 font-mono font-bold"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleExecuteResetPassword}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-2xs active:scale-95 transition-all"
              >
                Simpan Sandi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
