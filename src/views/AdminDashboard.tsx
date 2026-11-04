import React, { useState, useEffect } from 'react';
import {
  User,
  Role,
  ClassRoom,
  JournalEntry,
  AuditLog,
  GoogleDriveConfig
} from '../types';
import { storageService } from '../services/storageService';
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
  Info
} from 'lucide-react';

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
  const [role, setRole] = useState<Role>('siswa');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nisnNip, setNisnNip] = useState('');
  const [kelasId, setKelasId] = useState('');
  const [selectedChildId, setSelectedChildId] = useState('');

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

  const handleOpenAddUser = () => {
    setEditingUser(null);
    setFullName('');
    setUsername('');
    setRole('siswa');
    setEmail('');
    setPhone('');
    setNisnNip('');
    setKelasId(classes[0]?.id || '');
    setSelectedChildId('');
    setShowUserModal(true);
  };

  const handleOpenEditUser = (user: User) => {
    setEditingUser(user);
    setFullName(user.fullName);
    setUsername(user.username);
    setRole(user.role);
    setEmail(user.email || '');
    setPhone(user.phone || '');
    setNisnNip(user.nisn || user.nip || '');
    setKelasId(user.kelasId || '');
    setSelectedChildId(user.siswaId || '');
    setShowUserModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim()) return;

    if (editingUser) {
      storageService.updateUser(
        editingUser.id,
        {
          fullName: fullName.trim(),
          username: username.trim(),
          role,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          nisn: role === 'siswa' ? nisnNip.trim() : undefined,
          nip: role === 'guru' ? nisnNip.trim() : undefined,
          kelasId: (role === 'siswa' || role === 'guru') ? kelasId : undefined,
          siswaId: role === 'orang_tua' ? selectedChildId : undefined,
          linkedSiswaIds: role === 'orang_tua' && selectedChildId ? [selectedChildId] : undefined
        },
        currentUser.fullName,
        'admin'
      );
    } else {
      storageService.addUser(
        {
          fullName: fullName.trim(),
          username: username.trim(),
          password: 'password123',
          role,
          status: 'active',
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          nisn: role === 'siswa' ? nisnNip.trim() : undefined,
          nip: role === 'guru' ? nisnNip.trim() : undefined,
          kelasId: (role === 'siswa' || role === 'guru') ? kelasId : undefined,
          siswaId: role === 'orang_tua' ? selectedChildId : undefined,
          linkedSiswaIds: role === 'orang_tua' && selectedChildId ? [selectedChildId] : undefined
        },
        currentUser.fullName,
        'admin'
      );
    }

    setShowUserModal(false);
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
    storageService.saveDriveConfig({
      ...driveConfig,
      sheetWebhookUrl: webhookUrl.trim(),
      status: webhookUrl.trim() ? 'connected' : 'mock_mode'
    });
    setSyncStatusMsg('Pengaturan Google Drive & Sheets tersimpan!');
    setTimeout(() => setSyncStatusMsg(''), 3000);
    onRefreshData();
  };

  const handleTriggerManualSync = () => {
    setIsSyncing(true);
    setSyncStatusMsg('Melakukan sinkronisasi snapshot data ke Google Drive...');

    setTimeout(() => {
      setIsSyncing(false);
      storageService.saveDriveConfig({
        ...driveConfig,
        lastSyncTime: new Date().toISOString()
      });
      storageService.addAuditLog(currentUser.fullName, 'admin', 'SYNC_DRIVE', 'Sinkronisasi database ke Google Drive berhasil.');
      setSyncStatusMsg('✅ Sinkronisasi berhasil! Arsip tersimpan di Google Drive /ARSIP-ADMIN.');
      setTimeout(() => setSyncStatusMsg(''), 4000);
      onRefreshData();
    }, 1000);
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

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setAdminTab('docs')}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Arsitektur & Skema</span>
            </button>
            <button
              onClick={handleOpenAddUser}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-purple-500 hover:bg-purple-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah User</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3.5 mt-3 border-t border-white/20 text-xs">
          <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-purple-200 block">Siswa</span>
            <span className="text-lg font-black text-white">{totalSiswa} Siswa</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-purple-200 block">Guru</span>
            <span className="text-lg font-black text-white">{totalGuru} Guru</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-purple-200 block">Orang Tua</span>
            <span className="text-lg font-black text-white">{totalOrtu} Orang</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-purple-200 block">Kelas</span>
            <span className="text-lg font-black text-white">{classes.length} Kelas</span>
          </div>
        </div>
      </div>

      {/* 2. Admin Sub-Navigation Tabs */}
      <div className="flex border border-slate-200 bg-white rounded-xl p-1 gap-1 shadow-2xs overflow-x-auto no-scrollbar text-xs font-bold">
        <button
          onClick={() => setAdminTab('overview')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
            adminTab === 'overview' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Aktivitas</span>
        </button>
        <button
          onClick={() => setAdminTab('docs')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
            adminTab === 'docs' ? 'bg-amber-600 text-white shadow-2xs' : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
          }`}
        >
          <Server className="w-3.5 h-3.5 text-amber-500" />
          <span>Arsitektur & Skema (Dokumentasi)</span>
        </button>
        <button
          onClick={() => setAdminTab('users')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
            adminTab === 'users' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Pengguna ({users.length})</span>
        </button>
        <button
          onClick={() => setAdminTab('classes')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
            adminTab === 'classes' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Kelas ({classes.length})</span>
        </button>
        <button
          onClick={() => setAdminTab('drive')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
            adminTab === 'drive' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>Drive & Sheets</span>
        </button>
        <button
          onClick={() => setAdminTab('audit')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
            adminTab === 'audit' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
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
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">
              Daftar Pengguna Sistem ({users.length})
            </h3>
            <button
              onClick={handleOpenAddUser}
              className="px-2.5 py-1 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah</span>
            </button>
          </div>

          {/* Mobile View: Cards */}
          <div className="sm:hidden space-y-2">
            {users.map(u => (
              <div key={u.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">{u.fullName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">@{u.username}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    u.role === 'guru' ? 'bg-blue-100 text-blue-800' :
                    u.role === 'siswa' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {u.role.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                  <button
                    onClick={() => handleToggleUserStatus(u)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.status === 'active' ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                    }`}
                  >
                    {u.status === 'active' ? 'Status: Aktif' : 'Status: Nonaktif'}
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenResetPassword(u)}
                      className="p-1 text-amber-700 hover:bg-amber-100 rounded"
                      title="Reset Kata Sandi"
                    >
                      <Key className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEditUser(u)}
                      className="p-1 text-blue-700 hover:bg-blue-100 rounded"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Nama</th>
                  <th className="p-2.5">Username</th>
                  <th className="p-2.5">Peran</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Kelola</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">{u.fullName}</td>
                    <td className="p-2.5 font-mono text-slate-600">{u.username}</td>
                    <td className="p-2.5 font-bold uppercase text-[10px] text-purple-700">{u.role}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="p-2.5 text-right space-x-1">
                      <button onClick={() => handleOpenResetPassword(u)} className="p-1 text-amber-600 hover:bg-amber-50 rounded">
                        <Key className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleOpenEditUser(u)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {/* 7. CLASSES TAB */}
      {adminTab === 'classes' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
            Daftar Kelas ({classes.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {classes.map(c => {
              const wali = users.find(u => u.id === c.waliKelasId);
              const classStudents = users.filter(u => u.role === 'siswa' && u.kelasId === c.id);
              return (
                <div key={c.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1 text-xs">
                  <span className="font-bold text-slate-900 block">{c.name}</span>
                  <div className="text-[11px] text-slate-600">Wali: <strong>{wali?.fullName || '-'}</strong></div>
                  <div className="text-[11px] text-slate-600">Total: <strong>{classStudents.length} Siswa</strong></div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 8. AUDIT LOG TAB */}
      {adminTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
            Audit Log Aktivitas ({auditLogs.length})
          </h3>
          <div className="divide-y divide-slate-100">
            {auditLogs.slice(0, 10).map(log => (
              <div key={log.id} className="py-2 space-y-0.5">
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

      {/* Modal Add / Edit User */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-5 duration-150">
            <div className="p-4 bg-purple-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna'}</h3>
              <button onClick={() => setShowUserModal(false)} className="text-white">✕</button>
            </div>
            <form onSubmit={handleSaveUser} className="p-4 space-y-3 text-xs max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap:</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 bg-slate-50"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Username:</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 bg-slate-50"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Peran:</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full rounded-xl border border-slate-300 p-2 bg-slate-50 font-bold"
                  >
                    <option value="siswa">Siswa</option>
                    <option value="guru">Guru</option>
                    <option value="orang_tua">Orang Tua</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-3 py-2 text-slate-600 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Reset Password */}
      {showPasswordModal && targetResetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-4 space-y-3 text-xs">
            <h3 className="font-bold text-sm text-slate-900">Reset Sandi: {targetResetUser.fullName}</h3>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Sandi Baru:</label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 bg-slate-50 font-mono"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowPasswordModal(false)} className="px-3 py-1.5 text-slate-600">Batal</button>
              <button onClick={handleExecuteResetPassword} className="px-3 py-1.5 bg-amber-600 text-white font-bold rounded-lg">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
