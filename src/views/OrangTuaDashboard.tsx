import React, { useState } from 'react';
import {
  User,
  JournalEntry,
  TeacherCoaching,
  ParentFeedback
} from '../types';
import { TUJUH_KEBIASAAN } from '../data/constants';
import { HabitIcon } from '../components/HabitIcon';
import {
  Heart,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  Image as ImageIcon,
  UserCheck,
  FileText,
  GraduationCap
} from 'lucide-react';

interface OrangTuaDashboardProps {
  currentUser: User;
  students: User[];
  journals: JournalEntry[];
  coachings: TeacherCoaching[];
  feedbacks: ParentFeedback[];
  onOpenParentFeedbackModal: (childUser: User) => void;
  onViewPhoto: (url: string, title: string) => void;
  onOpenReportView: () => void;
  activeSubTab?: string;
}

export const OrangTuaDashboard: React.FC<OrangTuaDashboardProps> = ({
  currentUser,
  students,
  journals,
  coachings,
  feedbacks,
  onOpenParentFeedbackModal,
  onViewPhoto,
  onOpenReportView,
  activeSubTab = 'dashboard'
}) => {
  const linkedIds = new Set(
    currentUser.linkedSiswaIds || (currentUser.siswaId ? [currentUser.siswaId] : [])
  );
  const myChildren = students.filter(s => linkedIds.has(s.id));
  const [selectedChildId, setSelectedChildId] = useState<string>(
    myChildren[0]?.id || ''
  );

  const activeChild = myChildren.find(c => c.id === selectedChildId) || myChildren[0];

  const childJournals = journals.filter(j => j.siswaId === activeChild?.id);
  const childCoachings = coachings.filter(c => c.siswaId === activeChild?.id);
  const childFeedbacks = feedbacks.filter(f => f.siswaId === activeChild?.id);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayJournals = childJournals.filter(j => j.date === todayStr);
  const completedToday = todayJournals.filter(j => j.status === 'Sudah Dilaksanakan').length;
  const progressPercent = Math.round((completedToday / 7) * 100);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-2xl sm:rounded-3xl text-white p-4 sm:p-7 shadow-md shadow-amber-200/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] sm:text-xs font-bold text-amber-100">
              <Heart className="w-3 h-3 fill-amber-200" />
              Ruang Kemitraan Orang Tua
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
              Bapak/Ibu {currentUser.fullName.split(' ')[0]}
            </h1>
            <p className="text-xs text-amber-100 hidden sm:block mt-0.5">
              Pantau perkembangan buah hati dan alirkan doa serta dukungan kasih sayang dari rumah.
            </p>
          </div>

          {activeChild && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => onOpenParentFeedbackModal(activeChild)}
                className="flex-1 sm:flex-initial px-3.5 py-2 bg-white text-orange-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Beri Dukungan</span>
              </button>
              <button
                onClick={onOpenReportView}
                className="flex-1 sm:flex-initial px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Rapor</span>
              </button>
            </div>
          )}
        </div>

        {/* Child Selector if multiple */}
        {myChildren.length > 1 && (
          <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-2">
            <span className="text-[11px] font-bold text-amber-100">Pilih Anak:</span>
            <div className="flex gap-1.5 overflow-x-auto">
              {myChildren.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedChildId(c.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    c.id === activeChild?.id ? 'bg-white text-orange-950' : 'bg-white/20 text-white'
                  }`}
                >
                  {c.fullName}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {!activeChild ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-500">
          Belum ada profil anak yang terhubung. Hubungi admin sekolah untuk menghubungkan akun anak.
        </div>
      ) : (
        <>
          {/* 2. Child Profile & Progress Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {activeChild.avatarUrl ? (
                <img
                  src={activeChild.avatarUrl}
                  alt={activeChild.fullName}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-300 shadow-2xs shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center font-black text-sm shadow-2xs shrink-0">
                  <GraduationCap className="w-6 h-6 text-amber-700" />
                </div>
              )}
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-tight">
                  {activeChild.fullName}
                </h2>
                <span className="text-[11px] text-slate-500 block">
                  Siswa Binaan &bull; NISN: {activeChild.nisn || '-'}
                </span>
              </div>
            </div>

            <div className="w-full sm:w-64 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-700 mb-1">
                <span>Capaian Hari Ini:</span>
                <span className="text-amber-700">{completedToday}/7 ({progressPercent}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* 3. Status 7 Kebiasaan Hari Ini */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Status 7 Kebiasaan ({todayStr})</span>
              <span className="text-xs font-semibold text-slate-500">{completedToday} Tuntas</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {TUJUH_KEBIASAAN.map(h => {
                const jEntry = todayJournals.find(j => j.habitId === h.id);
                const isDone = jEntry?.status === 'Sudah Dilaksanakan';

                return (
                  <div
                    key={h.id}
                    className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                      isDone
                        ? 'border-emerald-300 bg-emerald-50/40 text-emerald-950'
                        : 'border-slate-200 bg-slate-50/50 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-lg ${isDone ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                          <HabitIcon name={h.icon} className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-xs">{h.shortTitle}</span>
                      </div>
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                    </div>

                    {jEntry ? (
                      <div className="text-[11px] flex items-center justify-between text-emerald-800 font-semibold pt-1">
                        <span>✓ Terlaksana</span>
                        {jEntry.photoUrl && (
                          <button
                            onClick={() => onViewPhoto(jEntry.photoUrl!, `${h.title} - ${activeChild.fullName}`)}
                            className="text-[10px] text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
                          >
                            <ImageIcon className="w-3 h-3" />
                            <span>Foto</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">
                        Belum dicatat
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Catatan Pembinaan Guru & Riwayat Dukungan Ortu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Teacher Notes */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <UserCheck className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                  Catatan dari Guru Wali Kelas
                </h3>
              </div>

              {childCoachings.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  Belum ada catatan pembinaan. Perilaku ananda terpantau tertib di sekolah!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {childCoachings.map(c => (
                    <div key={c.id} className="p-3 rounded-xl border border-teal-200 bg-teal-50/50 text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-teal-950">
                        <span>Guru: {c.guruName}</span>
                        <span className="text-[10px] text-teal-700 bg-teal-100 px-2 py-0.5 rounded font-bold">
                          {c.followUpStatus}
                        </span>
                      </div>
                      <p className="text-slate-700 text-[11px]">
                        <strong>Saran untuk Keluarga:</strong> {c.positiveSolutionAdvice}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Parent Feedback History */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                    Pesan Dukungan Keluarga ({childFeedbacks.length})
                  </h3>
                </div>
                <button
                  onClick={() => onOpenParentFeedbackModal(activeChild)}
                  className="px-2.5 py-1 text-[11px] font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Kirim</span>
                </button>
              </div>

              {childFeedbacks.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  Belum ada pesan tersimpan. Tekan "Kirim" untuk menulis kata-kata penyemangat!
                </div>
              ) : (
                <div className="space-y-2">
                  {childFeedbacks.map(f => (
                    <div key={f.id} className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-amber-950">{f.parentName}</span>
                        <span className="text-[10px] text-amber-700">{f.date}</span>
                      </div>
                      <p className="italic text-slate-700">"{f.supportMessage}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
