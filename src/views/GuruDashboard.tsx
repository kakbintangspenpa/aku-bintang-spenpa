import React, { useState } from 'react';
import {
  User,
  JournalEntry,
  TeacherCoaching,
  ClassRoom,
  SchoolInfo
} from '../types';
import { TUJUH_KEBIASAAN } from '../data/constants';
import { SchoolInfoBoard } from '../components/SchoolInfoBoard';
import { storageService } from '../services/storageService';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  Search,
  HeartHandshake,
  Image as ImageIcon,
  PlusCircle,
  FileSpreadsheet,
  ChevronRight,
  Trash2,
  Edit2,
  Calendar,
  Target,
  Clock,
  X
} from 'lucide-react';

interface GuruDashboardProps {
  currentUser: User;
  students: User[];
  classes: ClassRoom[];
  journals: JournalEntry[];
  coachings: TeacherCoaching[];
  schoolInfos?: SchoolInfo[];
  onOpenApresiasiModal: (journal: JournalEntry) => void;
  onOpenPembinaanModal: (studentId?: string, existing?: TeacherCoaching) => void;
  onViewPhoto: (url: string, title: string) => void;
  onOpenReportView: () => void;
  onRefreshData?: () => void;
  activeSubTab?: string;
}

export const GuruDashboard: React.FC<GuruDashboardProps> = ({
  currentUser,
  students,
  classes,
  journals,
  coachings,
  schoolInfos = [],
  onOpenApresiasiModal,
  onOpenPembinaanModal,
  onViewPhoto,
  onOpenReportView,
  onRefreshData,
  activeSubTab = 'dashboard'
}) => {
  const [filterClass, setFilterClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileTab, setMobileTab] = useState<'verifikasi' | 'siswa' | 'pembinaan'>('verifikasi');
  const [journalViewMode, setJournalViewMode] = useState<'pending' | 'all'>('pending');
  const [journalToDelete, setJournalToDelete] = useState<JournalEntry | null>(null);
  const [coachingToDelete, setCoachingToDelete] = useState<TeacherCoaching | null>(null);

  const myStudents = students.filter(
    s => s.assignedGuruId === currentUser.id || s.kelasId === currentUser.kelasId
  );

  const activeStudents = filterClass === 'all'
    ? myStudents
    : myStudents.filter(s => s.kelasId === filterClass);

  const filteredStudents = activeStudents.filter(s =>
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.nisn && s.nisn.includes(searchQuery))
  );

  const myStudentIds = new Set(myStudents.map(s => s.id));
  const myJournals = journals.filter(j => myStudentIds.has(j.siswaId));
  const pendingVerification = myJournals.filter(j => !j.guruVerified);

  const myCoachings = coachings.filter(c => c.guruId === currentUser.id);

  const studentAnalysis = myStudents.map(student => {
    const sJournals = myJournals.filter(j => j.siswaId === student.id);
    const completed = sJournals.filter(j => j.status === 'Sudah Dilaksanakan').length;
    const total = sJournals.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      student,
      total,
      completed,
      rate,
      needsCoaching: rate < 60 || total === 0
    };
  });

  const studentsNeedingCoaching = studentAnalysis.filter(s => s.needsCoaching);
  const sortedMyJournals = [...myJournals].sort(
    (a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime()
  );
  const displayedJournals = journalViewMode === 'pending' ? pendingVerification : sortedMyJournals;
  const sortedMyCoachings = [...myCoachings].sort(
    (a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime()
  );

  const handleMarkCoachingDone = (coaching: TeacherCoaching) => {
    storageService.updateCoaching(
      coaching.id,
      { followUpStatus: 'Tercapai' },
      currentUser.fullName
    );
    onRefreshData?.();
  };

  const handleConfirmDeleteJournal = () => {
    if (!journalToDelete) return;
    storageService.deleteJournal(journalToDelete.id, currentUser.fullName, 'guru');
    setJournalToDelete(null);
    onRefreshData?.();
  };

  const handleConfirmDeleteCoaching = () => {
    if (!coachingToDelete) return;
    storageService.deleteCoaching(coachingToDelete.id, currentUser.fullName, 'guru');
    setCoachingToDelete(null);
    onRefreshData?.();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-2xl sm:rounded-3xl text-white p-4 sm:p-7 shadow-md shadow-blue-200/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] sm:text-xs font-bold text-blue-200">
              <Users className="w-3 h-3" />
              Guru Pembina Karakter
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
              Ibu/Bapak {currentUser.fullName.split(' ')[0]}
            </h1>
            <p className="text-xs text-blue-100 hidden sm:block mt-0.5">
              Pantau perkembangan 7 kebiasaan dan berikan motivasi bagi siswa binaan.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onOpenPembinaanModal()}
              className="flex-1 sm:flex-initial px-3 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Bina Siswa</span>
            </button>
            <button
              onClick={onOpenReportView}
              className="flex-1 sm:flex-initial px-3 py-2 bg-white/20 hover:bg-white/30 active:scale-95 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Laporan</span>
            </button>
          </div>
        </div>

        {/* 4 Mini Stat Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-3 border-t border-white/20 text-xs">
          <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-blue-200 block">Siswa Binaan</span>
            <span className="text-lg font-black text-white">{myStudents.length} Anak</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-blue-200 block">Total Jurnal</span>
            <span className="text-lg font-black text-white">{myJournals.length} Entri</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-amber-300 block">Perlu Verifikasi</span>
            <span className="text-lg font-black text-amber-300">{pendingVerification.length} Jurnal</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-rose-300 block">Perlu Binaan</span>
            <span className="text-lg font-black text-rose-300">{studentsNeedingCoaching.length} Siswa</span>
          </div>
        </div>
      </div>

      {/* Papan Informasi Sekolah */}
      <SchoolInfoBoard infos={schoolInfos} role="guru" />

      {/* 2. Notice if students need coaching */}
      {studentsNeedingCoaching.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 text-xs">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-amber-950 block text-xs">
                Perhatian: {studentsNeedingCoaching.length} siswa perlu motivasi pembiasaan
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {studentsNeedingCoaching.map(s => (
                  <button
                    key={s.student.id}
                    onClick={() => onOpenPembinaanModal(s.student.id)}
                    className="px-2 py-0.5 bg-white border border-amber-300 rounded-lg text-[11px] font-semibold text-amber-900 flex items-center gap-1 hover:bg-amber-100"
                  >
                    <span>{s.student.fullName} ({s.rate}%)</span>
                    <ChevronRight className="w-3 h-3 text-amber-600" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Mobile Segmented Tab Switcher */}
      <div className="flex sm:hidden border border-slate-200 bg-white rounded-xl p-1 gap-1 text-xs font-bold">
        <button
          onClick={() => setMobileTab('verifikasi')}
          className={`flex-1 py-2 rounded-lg text-center transition-all ${
            mobileTab === 'verifikasi' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600'
          }`}
        >
          Verifikasi ({pendingVerification.length})
        </button>
        <button
          onClick={() => setMobileTab('siswa')}
          className={`flex-1 py-2 rounded-lg text-center transition-all ${
            mobileTab === 'siswa' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600'
          }`}
        >
          Siswa ({myStudents.length})
        </button>
        <button
          onClick={() => setMobileTab('pembinaan')}
          className={`flex-1 py-2 rounded-lg text-center transition-all ${
            mobileTab === 'pembinaan' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600'
          }`}
        >
          Binaan ({myCoachings.length})
        </button>
      </div>

      {/* 4. Antrean Verifikasi & Riwayat Catatan Siswa */}
      <div className={`bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3 ${
        mobileTab !== 'verifikasi' ? 'hidden sm:block' : ''
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900">
              {journalViewMode === 'pending' ? 'Antrean Verifikasi Jurnal Masuk' : 'Riwayat Catatan Siswa'}
            </h3>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setJournalViewMode('pending')}
              className={`px-2.5 py-1 rounded-md font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                journalViewMode === 'pending'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Menunggu ({pendingVerification.length})
            </button>
            <button
              type="button"
              onClick={() => setJournalViewMode('all')}
              className={`px-2.5 py-1 rounded-md font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                journalViewMode === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Riwayat ({myJournals.length})
            </button>
          </div>
        </div>

        {displayedJournals.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            {journalViewMode === 'pending'
              ? 'Semua jurnal siswa telah diperiksa dan diapresiasi.'
              : 'Belum ada riwayat catatan jurnal dari siswa binaan.'}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {displayedJournals.map(j => {
              const habit = TUJUH_KEBIASAAN.find(h => h.id === j.habitId);
              return (
                <div key={j.id} className="py-3 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">
                          {j.siswaName}
                        </span>
                        <span className="text-slate-300" aria-hidden="true">&middot;</span>
                        <span className={`text-[11px] font-semibold ${j.guruVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {j.guruVerified ? 'Terverifikasi' : 'Menunggu Verifikasi'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block tabular-nums mt-0.5">
                        {habit?.title || j.habitId} &bull; {j.date} {j.time && `(${j.time})`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {j.photoUrl && (
                        <button
                          type="button"
                          onClick={() => onViewPhoto(j.photoUrl!, `${habit?.title} - ${j.siswaName}`)}
                          className="px-2 py-1 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1 border border-blue-200 cursor-pointer"
                        >
                          <ImageIcon className="w-3 h-3" />
                          <span>Foto</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setJournalToDelete(j)}
                        className="px-2 py-1 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg inline-flex items-center gap-1 border border-rose-200 cursor-pointer"
                        title="Hapus catatan siswa ini"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{j.activityDescription}"
                  </p>

                  {j.guruFeedback && (
                    <p className="text-[11px] text-blue-800 bg-blue-50/60 px-2.5 py-1.5 rounded-lg border border-blue-100">
                      <strong>Apresiasi Guru:</strong> "{j.guruFeedback}"
                    </p>
                  )}

                  {!j.guruVerified && (
                    <button
                      type="button"
                      onClick={() => onOpenApresiasiModal(j)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Periksa & Beri Apresiasi</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Daftar Siswa Binaan (Mobile Cards + Desktop Table) */}
      <div className={`bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3 ${
        mobileTab !== 'siswa' ? 'hidden sm:block' : ''
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900">
            Daftar Siswa Binaan ({myStudents.length})
          </h3>
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Cari siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>
        </div>

        {/* Mobile View: Cards */}
        <div className="sm:hidden space-y-2.5">
          {filteredStudents.map(student => {
            const sJournals = myJournals.filter(j => j.siswaId === student.id);
            const doneCount = sJournals.filter(j => j.status === 'Sudah Dilaksanakan').length;
            const rate = sJournals.length > 0 ? Math.round((doneCount / sJournals.length) * 100) : 0;

            return (
              <div key={student.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {student.avatarUrl ? (
                      <img
                        src={student.avatarUrl}
                        alt={student.fullName}
                        className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                        {student.fullName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <span className="font-bold text-slate-900 block leading-tight">{student.fullName}</span>
                      <span className="text-[10px] text-slate-400">NISN: {student.nisn || '-'}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    rate >= 75 ? 'bg-emerald-100 text-emerald-800' :
                    rate >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {rate}% Capaian
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-600 font-medium">
                    {doneCount} dari {sJournals.length} jurnal
                  </span>
                  <button
                    onClick={() => onOpenPembinaanModal(student.id)}
                    className="px-2.5 py-1 text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg flex items-center gap-1"
                  >
                    <HeartHandshake className="w-3 h-3" />
                    <span>Catat Binaan</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-2.5">Nama Siswa</th>
                <th className="p-2.5">NISN</th>
                <th className="p-2.5">Jurnal</th>
                <th className="p-2.5">Konsistensi</th>
                <th className="p-2.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(student => {
                const sJournals = myJournals.filter(j => j.siswaId === student.id);
                const doneCount = sJournals.filter(j => j.status === 'Sudah Dilaksanakan').length;
                const rate = sJournals.length > 0 ? Math.round((doneCount / sJournals.length) * 100) : 0;

                return (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="p-2.5">
                      <div className="flex items-center gap-2">
                        {student.avatarUrl ? (
                          <img
                            src={student.avatarUrl}
                            alt={student.fullName}
                            className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 shrink-0 shadow-2xs"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                            {student.fullName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className="font-bold text-slate-900">{student.fullName}</span>
                      </div>
                    </td>
                    <td className="p-2.5 text-slate-500 font-mono text-[11px]">{student.nisn || '-'}</td>
                    <td className="p-2.5 text-slate-700">{sJournals.length} Entri</td>
                    <td className="p-2.5 font-bold text-slate-700">{rate}%</td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => onOpenPembinaanModal(student.id)}
                        className="px-2.5 py-1 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg inline-flex items-center gap-1"
                      >
                        <HeartHandshake className="w-3 h-3" />
                        Bina
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Riwayat Catatan Pembinaan */}
      <div className={`bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3 ${
        mobileTab !== 'pembinaan' ? 'hidden sm:block' : ''
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-sm text-slate-900">
                Riwayat Catatan Pembinaan ({sortedMyCoachings.length})
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Pembinaan otomatis terkirim ke halaman akun siswa yang dibina. Binaan yang telah selesai dapat ditandai selesai atau dihapus.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenPembinaanModal()}
            className="px-3 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Tambah Binaan</span>
          </button>
        </div>

        {sortedMyCoachings.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            Belum ada catatan pembinaan tersimpan. Tekan "Bina" pada siswa atau "Tambah Binaan" untuk mengirim arahan ke akun siswa.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sortedMyCoachings.map(c => {
              const focusHabit = c.habitId && c.habitId !== 'all'
                ? TUJUH_KEBIASAAN.find(h => h.id === c.habitId)
                : null;
              const isDone = c.followUpStatus === 'Tercapai';
              const isExtended = c.followUpStatus === 'Perlu Pendampingan Lanjutan';

              return (
                <div key={c.id} className="py-3.5 first:pt-1 last:pb-1 text-xs space-y-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-xs">{c.siswaName}</span>
                        <span className="text-slate-300" aria-hidden="true">&middot;</span>
                        <span className="text-[11px] font-medium text-teal-800">
                          {focusHabit ? `#${focusHabit.number} ${focusHabit.shortTitle}` : 'Semua Kebiasaan'}
                        </span>
                        <span className="text-slate-300" aria-hidden="true">&middot;</span>
                        <span className="text-[11px] text-slate-500 tabular-nums">{c.date}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Target className="w-3 h-3 text-teal-600" />
                          <span>Target: <strong className="text-slate-700">{c.improvementTarget}</strong></span>
                        </span>
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Evaluasi: {c.nextEvaluationDate}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold mr-1 ${
                          isDone
                            ? 'text-emerald-700'
                            : isExtended
                            ? 'text-rose-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        ) : isExtended ? (
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span>{c.followUpStatus}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => onOpenPembinaanModal(c.siswaId, c)}
                        className="px-2 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                        title="Edit catatan pembinaan"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      {!isDone && (
                        <button
                          type="button"
                          onClick={() => handleMarkCoachingDone(c)}
                          className="px-2 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                          title="Tandai pembinaan selesai (Tercapai)"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Selesai</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setCoachingToDelete(c)}
                        className="px-2 py-1 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                        title="Hapus catatan pembinaan"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">Kendala:</strong> {c.obstacleNotes}
                  </p>
                  <div className="text-teal-950 bg-teal-50/80 p-2.5 rounded-xl border border-teal-200/70 font-medium text-[11px] leading-relaxed">
                    <strong className="text-teal-800">Saran Solusi (Terkirim ke Siswa):</strong> {c.positiveSolutionAdvice}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Hapus Catatan Jurnal Siswa */}
      {journalToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <Trash2 className="w-4 h-4" />
                <span>Hapus Catatan Siswa?</span>
              </div>
              <button
                type="button"
                onClick={() => setJournalToDelete(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 text-xs text-slate-600 space-y-2">
              <p>
                Catatan jurnal milik <strong className="text-slate-900">{journalToDelete.siswaName}</strong> ({journalToDelete.date}) akan dihapus permanen:
              </p>
              <p className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-700 italic">
                "{journalToDelete.activityDescription}"
              </p>
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setJournalToDelete(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteJournal}
                className="px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl inline-flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Catatan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Catatan Pembinaan */}
      {coachingToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <Trash2 className="w-4 h-4" />
                <span>Hapus Catatan Binaan?</span>
              </div>
              <button
                type="button"
                onClick={() => setCoachingToDelete(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 text-xs text-slate-600 space-y-2">
              <p>
                Catatan pembinaan untuk <strong className="text-slate-900">{coachingToDelete.siswaName}</strong> akan dihapus dari riwayat guru dan halaman akun siswa.
              </p>
              <p className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-700">
                <strong>Target:</strong> {coachingToDelete.improvementTarget}
              </p>
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCoachingToDelete(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCoaching}
                className="px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl inline-flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Binaan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
