import React, { useMemo, useState } from 'react';
import { SchoolInfo, InfoCategory, Role, User } from '../types';
import { storageService } from '../services/storageService';
import {
  Megaphone,
  Plus,
  Search,
  Edit2,
  Trash2,
  Pin,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  Calendar,
  Sparkles,
  Info,
  Copy,
  RefreshCw,
  Database
} from 'lucide-react';

interface AdminInfoManagerProps {
  infos: SchoolInfo[];
  currentUser: User;
  onRefreshData: () => void;
}

const SCHOOL_INFOS_SQL = `CREATE TABLE IF NOT EXISTS public.school_infos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'pengumuman',
  target_roles JSONB DEFAULT '["siswa","guru","orang_tua"]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  is_pinned BOOLEAN DEFAULT false,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

GRANT ALL PRIVILEGES ON TABLE public.school_infos TO anon, authenticated;
ALTER TABLE public.school_infos DISABLE ROW LEVEL SECURITY;`;

const ROLE_LABELS: Record<Role, string> = {
  siswa: 'Siswa',
  guru: 'Guru',
  orang_tua: 'Orang Tua',
  admin: 'Admin'
};

const CATEGORY_OPTIONS: { value: InfoCategory; label: string; textClass: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'pengumuman', label: 'Pengumuman', textClass: 'text-slate-700', icon: Info },
  { value: 'penting', label: 'Penting', textClass: 'text-red-700', icon: AlertCircle },
  { value: 'kegiatan', label: 'Kegiatan', textClass: 'text-indigo-700', icon: Calendar },
  { value: 'imbauan', label: 'Imbauan', textClass: 'text-amber-700', icon: Sparkles }
];

export const AdminInfoManager: React.FC<AdminInfoManagerProps> = ({
  infos,
  currentUser,
  onRefreshData
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'archived' | 'siswa' | 'guru' | 'orang_tua'>('all');

  // Form modal states
  const [showModal, setShowModal] = useState(false);
  const [editingInfo, setEditingInfo] = useState<SchoolInfo | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<InfoCategory>('pengumuman');
  const [targetRoles, setTargetRoles] = useState<Role[]>(['siswa', 'guru', 'orang_tua']);
  const [isPinned, setIsPinned] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState('');

  // Delete confirmation modal
  const [infoToDelete, setInfoToDelete] = useState<SchoolInfo | null>(null);

  // SQL helper state
  const [copiedSql, setCopiedSql] = useState(false);
  const [isCheckingSync, setIsCheckingSync] = useState(false);
  const infoTableMissing = storageService.getInfoTableMissing();

  const stats = useMemo(() => {
    const activeCount = infos.filter(i => i.isActive).length;
    const pinnedCount = infos.filter(i => i.isPinned && i.isActive).length;
    const archivedCount = infos.filter(i => !i.isActive).length;
    return {
      total: infos.length,
      activeCount,
      pinnedCount,
      archivedCount
    };
  }, [infos]);

  const filteredInfos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return infos
      .filter(item => {
        if (filterMode === 'active' && !item.isActive) return false;
        if (filterMode === 'archived' && item.isActive) return false;
        if (filterMode === 'siswa' || filterMode === 'guru' || filterMode === 'orang_tua') {
          if (!item.targetRoles?.includes(filterMode)) return false;
        }
        if (q) {
          return (
            item.title.toLowerCase().includes(q) ||
            item.content.toLowerCase().includes(q) ||
            item.createdBy.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
      });
  }, [infos, filterMode, searchQuery]);

  const handleOpenAdd = () => {
    setEditingInfo(null);
    setTitle('');
    setContent('');
    setCategory('pengumuman');
    setTargetRoles(['siswa', 'guru', 'orang_tua']);
    setIsPinned(false);
    setIsActive(true);
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEdit = (item: SchoolInfo) => {
    setEditingInfo(item);
    setTitle(item.title);
    setContent(item.content);
    setCategory(item.category);
    setTargetRoles(item.targetRoles && item.targetRoles.length > 0 ? item.targetRoles : ['siswa', 'guru', 'orang_tua']);
    setIsPinned(item.isPinned);
    setIsActive(item.isActive);
    setFormError('');
    setShowModal(true);
  };

  const toggleTargetRole = (r: Role) => {
    setTargetRoles(prev => {
      if (prev.includes(r)) {
        return prev.filter(item => item !== r);
      }
      return [...prev, r];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Judul informasi wajib diisi.');
      return;
    }
    if (!content.trim()) {
      setFormError('Isi pengumuman atau informasi tidak boleh kosong.');
      return;
    }
    if (targetRoles.length === 0) {
      setFormError('Pilih minimal satu sasaran penerima (Siswa, Guru, atau Orang Tua).');
      return;
    }

    if (editingInfo) {
      storageService.updateSchoolInfo(
        editingInfo.id,
        {
          title: title.trim(),
          content: content.trim(),
          category,
          targetRoles,
          isPinned,
          isActive
        },
        currentUser.fullName,
        'admin'
      );
    } else {
      storageService.addSchoolInfo(
        {
          title: title.trim(),
          content: content.trim(),
          category,
          targetRoles,
          isPinned,
          isActive,
          createdBy: currentUser.fullName
        },
        currentUser.fullName,
        'admin'
      );
    }

    setShowModal(false);
    onRefreshData();
  };

  const handleToggleActive = (item: SchoolInfo) => {
    storageService.updateSchoolInfo(
      item.id,
      { isActive: !item.isActive },
      currentUser.fullName,
      'admin'
    );
    onRefreshData();
  };

  const handleTogglePin = (item: SchoolInfo) => {
    storageService.updateSchoolInfo(
      item.id,
      { isPinned: !item.isPinned },
      currentUser.fullName,
      'admin'
    );
    onRefreshData();
  };

  const handleConfirmDelete = () => {
    if (!infoToDelete) return;
    storageService.deleteSchoolInfo(infoToDelete.id, currentUser.fullName, 'admin');
    setInfoToDelete(null);
    onRefreshData();
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SCHOOL_INFOS_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleRetrySync = async () => {
    setIsCheckingSync(true);
    await storageService.syncFromSupabase();
    onRefreshData();
    setIsCheckingSync(false);
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '-';
    }
  };

  return (
    <div className="space-y-4">
      {/* Admin-only SQL notice if school_infos table has not been created in Supabase */}
      {infoTableMissing && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3 text-xs text-amber-950">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <Database className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-sm">
                  Tabel <code className="font-mono">school_infos</code> belum ada di Supabase
                </h4>
                <p className="text-amber-800 mt-0.5 leading-relaxed">
                  Informasi sementara tersimpan di perangkat ini. Agar pengumuman tampil otomatis di perangkat Siswa, Guru, dan Orang Tua lainnya, jalankan perintah SQL berikut satu kali di <strong>Supabase SQL Editor</strong>.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopySql}
                className="px-3 py-1.5 rounded-lg bg-amber-900 hover:bg-amber-800 text-white font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'SQL Tersalin' : 'Salin SQL'}</span>
              </button>
              <button
                type="button"
                onClick={handleRetrySync}
                disabled={isCheckingSync}
                className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingSync ? 'animate-spin' : ''}`} />
                <span>Cek Ulang</span>
              </button>
            </div>
          </div>
          <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl overflow-x-auto font-mono text-[11px] leading-relaxed">
            {SCHOOL_INFOS_SQL}
          </pre>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4 text-xs">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Kelola Informasi & Pengumuman Sekolah
              </h2>
              <p className="text-[11px] text-slate-500">
                Terbitkan informasi yang tampil langsung di dashboard Siswa, Guru, dan Orang Tua.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Informasi Baru</span>
          </button>
        </div>

        {/* Summary Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-[11px] text-slate-500 font-semibold block">Total Informasi</span>
            <span className="text-lg font-extrabold text-slate-900 tabular-nums">{stats.total}</span>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-[11px] text-slate-500 font-semibold block">Sedang Tayang</span>
            <span className="text-lg font-extrabold text-emerald-700 tabular-nums">{stats.activeCount}</span>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-[11px] text-slate-500 font-semibold block">Disematkan</span>
            <span className="text-lg font-extrabold text-amber-700 tabular-nums">{stats.pinnedCount}</span>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-[11px] text-slate-500 font-semibold block">Diarsipkan</span>
            <span className="text-lg font-extrabold text-slate-600 tabular-nums">{stats.archivedCount}</span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul, isi informasi, atau pembuat..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-xs"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
            {(
              [
                { id: 'all', label: 'Semua' },
                { id: 'active', label: 'Aktif' },
                { id: 'archived', label: 'Arsip' },
                { id: 'siswa', label: 'Siswa' },
                { id: 'guru', label: 'Guru' },
                { id: 'orang_tua', label: 'Orang Tua' }
              ] as const
            ).map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterMode(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  filterMode === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Information List */}
        {filteredInfos.length === 0 ? (
          <div className="py-10 text-center space-y-2 border border-dashed border-slate-200 rounded-2xl">
            <Megaphone className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700 text-sm">
              {infos.length === 0
                ? 'Belum ada informasi sekolah yang dibuat'
                : 'Tidak ada informasi yang cocok dengan filter'}
            </p>
            <p className="text-slate-500 text-xs max-w-md mx-auto">
              Buat pengumuman pertama agar siswa, guru, dan orang tua mendapatkan kabar terbaru di dashboard masing-masing.
            </p>
            {infos.length === 0 && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="mt-2 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Informasi Pertama</span>
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
            {filteredInfos.map(item => {
              const catMeta = CATEGORY_OPTIONS.find(c => c.value === item.category) || CATEGORY_OPTIONS[0];
              const CatIcon = catMeta.icon;
              const targetSummary = (item.targetRoles || [])
                .map(r => ROLE_LABELS[r] || r)
                .join(', ');

              return (
                <div
                  key={item.id}
                  className={`p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                    item.isActive ? 'bg-white' : 'bg-slate-50/70 opacity-80'
                  }`}
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    {/* Clean unboxed metadata line */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-semibold">
                      <span className={`inline-flex items-center gap-1 font-bold ${catMeta.textClass}`}>
                        <CatIcon className="w-3.5 h-3.5" />
                        <span>{catMeta.label}</span>
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className={item.isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 font-bold'}>
                        {item.isActive ? 'Tayang Aktif' : 'Diarsipkan'}
                      </span>
                      {item.isPinned && (
                        <>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                            <Pin className="w-3 h-3" />
                            <span>Disematkan</span>
                          </span>
                        </>
                      )}
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-slate-600">Target: {targetSummary}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-slate-500 tabular-nums">{formatDate(item.updatedAt || item.createdAt)}</span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                      {item.content}
                    </p>
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center gap-1.5 shrink-0 pt-1 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => handleTogglePin(item)}
                      title={item.isPinned ? 'Lepas sematan atas' : 'Sematkan di paling atas'}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        item.isPinned
                          ? 'bg-amber-50 border-amber-300 text-amber-800'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Pin className="w-3.5 h-3.5" />
                      <span className="hidden lg:inline">{item.isPinned ? 'Disematkan' : 'Sematkan'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleActive(item)}
                      title={item.isActive ? 'Arsipkan (sembunyikan dari dashboard)' : 'Tayangkan kembali'}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        item.isActive
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span className="hidden lg:inline">{item.isActive ? 'Aktif' : 'Arsip'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      title="Edit informasi"
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setInfoToDelete(item)}
                      title="Hapus informasi"
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-700 to-indigo-800 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    {editingInfo ? 'Edit Informasi Sekolah' : 'Buat Informasi Sekolah Baru'}
                  </h3>
                  <span className="text-[11px] text-purple-200 block">
                    Tampil di dashboard Siswa, Guru, dan/atau Orang Tua
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 text-xs overflow-y-auto">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Judul Informasi *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Jadwal Pengisian Jurnal Selama Pekan Penilaian"
                  className="w-full rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Kategori Informasi
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {CATEGORY_OPTIONS.map(opt => {
                    const Icon = opt.icon;
                    const active = category === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setCategory(opt.value)}
                        className={`px-3 py-2 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                          active
                            ? 'bg-purple-700 border-purple-700 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-800">
                    Ditujukan Kepada *
                  </label>
                  <button
                    type="button"
                    onClick={() => setTargetRoles(['siswa', 'guru', 'orang_tua'])}
                    className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer"
                  >
                    Pilih Semua Peran
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['siswa', 'guru', 'orang_tua'] as Role[]).map(r => {
                    const checked = targetRoles.includes(r);
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => toggleTargetRole(r)}
                        className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                          checked
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {checked && <Check className="w-3.5 h-3.5" />}
                        <span>{ROLE_LABELS[r]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Isi Informasi / Pengumuman *
                </label>
                <textarea
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan rincian pengumuman, tanggal penting, atau arahan untuk siswa, guru, dan orang tua..."
                  className="w-full rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-slate-800 leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-4 h-4 accent-purple-700 rounded"
                  />
                  <div>
                    <span className="font-bold text-slate-800 block">Sematkan di Atas</span>
                    <span className="text-[10px] text-slate-500">Prioritaskan di urutan pertama</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <div>
                    <span className="font-bold text-slate-800 block">Langsung Tayangkan</span>
                    <span className="text-[10px] text-slate-500">Tampil di dashboard penerima</span>
                  </div>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold shadow-xs flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingInfo ? 'Simpan Perubahan' : 'Terbitkan Informasi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {infoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 space-y-3 text-xs border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-sm text-slate-900">Hapus Informasi Sekolah?</h3>
              <p className="text-slate-600">
                Pengumuman <strong>"{infoToDelete.title}"</strong> akan dihapus permanen dari dashboard penerima.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setInfoToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-xs cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
