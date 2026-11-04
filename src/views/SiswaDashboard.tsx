import React, { useState } from 'react';
import { User, JournalEntry, HabitDefinition, AppreciationBadge } from '../types';
import { TUJUH_KEBIASAAN } from '../data/constants';
import { HabitCard } from '../components/HabitCard';
import {
  Sparkles,
  Flame,
  Award,
  CheckCircle2,
  Calendar,
  Heart,
  PlusCircle,
  Image as ImageIcon,
  ArrowRight,
  Star
} from 'lucide-react';
import { TrophyShelf } from '../components/TrophyShelf';

interface SiswaDashboardProps {
  currentUser: User;
  journals: JournalEntry[];
  badges: AppreciationBadge[];
  onOpenJournalModal: (habit?: HabitDefinition, existing?: JournalEntry) => void;
  onViewPhoto: (url: string, title: string) => void;
  activeSubTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const SiswaDashboard: React.FC<SiswaDashboardProps> = ({
  currentUser,
  journals,
  badges,
  onOpenJournalModal,
  onViewPhoto,
  activeSubTab = 'dashboard',
  onSelectTab
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const studentJournals = journals.filter(j => j.siswaId === currentUser.id);
  const studentBadges = badges.filter(b => b.siswaId === currentUser.id);

  const selectedDateJournals = studentJournals.filter(j => j.date === selectedDate);
  const completedTodayCount = selectedDateJournals.filter(j => j.status === 'Sudah Dilaksanakan').length;
  const todayPercentage = Math.round((completedTodayCount / 7) * 100);

  const streakDays = 7;

  // Sub-tab view switching
  const isHistoryTab = activeSubTab === 'my_journals';
  const isBadgesTab = activeSubTab === 'badges';
  const isDashboardTab = !isHistoryTab && !isBadgesTab;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Mobile & Desktop Greeting Card */}
      {isDashboardTab && (
        <div className="bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 rounded-2xl sm:rounded-3xl text-white p-4 sm:p-6 lg:p-7 shadow-md shadow-red-200/50 relative overflow-hidden">
          {/* Subtle background decorative shapes */}
          <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full bg-black/10 blur-xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            {/* Top Tag & Date */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] sm:text-xs font-bold text-white border border-white/25 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Anak Indonesia Hebat</span>
              </span>
              <span className="text-[11px] font-semibold text-white/90 bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20 sm:hidden">
                {selectedDate}
              </span>
            </div>

            {/* Main Greeting & 3 High-Contrast Stat Cards */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                    Halo, {currentUser.fullName.split(' ')[0]}!
                  </h1>
                  <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-400 text-amber-950 shadow-xs ring-2 ring-white/40 shrink-0">
                    <Star className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-amber-400 text-amber-900" />
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-red-50/95 font-medium leading-relaxed max-w-lg">
                  Mari wujudkan 7 Kebiasaan Hebat hari ini dengan penuh semangat!
                </p>
              </div>

              {/* 3 High-Contrast Stat Cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full md:w-auto shrink-0">
                {/* Streak */}
                <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center shadow-xs border border-white/60 min-w-[80px]">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500 shrink-0" />
                    <span className="text-base sm:text-lg font-black text-slate-900 leading-none">{streakDays}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 block uppercase tracking-wide">
                    Hari Streak
                  </span>
                </div>

                {/* Hari Ini */}
                <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center shadow-xs border border-white/60 min-w-[80px]">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-base sm:text-lg font-black text-slate-900 leading-none">{completedTodayCount}/7</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 block uppercase tracking-wide">
                    Hari Ini
                  </span>
                </div>

                {/* Lencana */}
                <div
                  onClick={() => onSelectTab?.('badges')}
                  className={`bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center shadow-xs border border-white/60 min-w-[80px] ${
                    onSelectTab ? 'cursor-pointer hover:bg-white hover:scale-105 active:scale-95 transition-all' : ''
                  }`}
                  title="Klik untuk membuka Lemari Rak Piala"
                >
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-base sm:text-lg font-black text-slate-900 leading-none">{studentBadges.length}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 block uppercase tracking-wide">
                    Lencana 🏆
                  </span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="pt-3 border-t border-white/20">
              <div className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span>Capaian 7 Kebiasaan</span>
                  <span className="text-white/80 font-normal hidden sm:inline">&bull; Target Harian</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/25 backdrop-blur-xs text-white font-extrabold text-xs tracking-tight border border-white/30 shadow-2xs">
                  {todayPercentage}% Tuntas
                </span>
              </div>
              <div className="w-full h-3 bg-black/25 rounded-full p-0.5 overflow-hidden border border-white/20">
                <div
                  className="h-full bg-gradient-to-r from-amber-300 via-emerald-300 to-emerald-400 rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: `${todayPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Compact Date Selector & Quick Add Button */}
      {isDashboardTab && (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-3 sm:p-4 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-red-600 shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-bold rounded-lg border border-slate-200 px-2.5 py-1.5 bg-slate-50 focus:bg-white focus:outline-hidden"
            />
          </div>

          <button
            onClick={() => onOpenJournalModal()}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Catat Aktivitas</span>
            <span className="sm:hidden">Catat</span>
          </button>
        </div>
      )}

      {/* 3. The 7 Habits List / Grid */}
      {isDashboardTab && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              Daftar 7 Kebiasaan Hari Ini
            </h2>
            <span className="text-[11px] font-bold text-slate-500">
              {completedTodayCount} dari 7 Selesai
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {TUJUH_KEBIASAAN.map((habit) => {
              const entry = selectedDateJournals.find(j => j.habitId === habit.id);
              return (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  todayJournal={entry}
                  onOpenJournalModal={onOpenJournalModal}
                  onViewPhoto={onViewPhoto}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Teaser Lemari Rak Piala pada Dashboard Siswa */}
      {isDashboardTab && studentBadges.length > 0 && (
        <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-amber-900/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-xl shrink-0 shadow-xs">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-xs sm:text-sm text-amber-200">
                  Rak Piala & Lencana Karakter ({studentBadges.length} Piala Terpajang)
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Koleksi
                </span>
              </div>
              <p className="text-[11px] text-stone-300 mt-0.5">
                Buka lemari rak susun piala untuk melihat deretan piala kehormatan dan cetak Piagam Penghargaan Resmi.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectTab?.('badges')}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs shrink-0 transition-all active:scale-95 cursor-pointer shadow-xs text-center"
          >
            Buka Lemari Rak Piala &rarr;
          </button>
        </div>
      )}

      {/* 4. Badges & Teacher Messages Section (Halaman Lemari Rak Susun Piala) */}
      {isBadgesTab && (
        <TrophyShelf badges={studentBadges} studentName={currentUser.fullName} />
      )}

      {/* 5. Riwayat Jurnal Siswa (Hanya tampil pada tab Riwayat di header/nav) */}
      {isHistoryTab && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-600" />
              <h3 className="font-bold text-sm text-slate-900">
                Riwayat Jurnal Terakhir ({studentJournals.length})
              </h3>
            </div>
          </div>

          {studentJournals.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              Belum ada catatan jurnal. Mulailah dengan menekan tombol "Catat Aktivitas".
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {studentJournals.slice(0, 10).map((j) => {
                const habit = TUJUH_KEBIASAAN.find(h => h.id === j.habitId);
                const isDone = j.status === 'Sudah Dilaksanakan';

                return (
                  <div key={j.id} className="py-3 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">
                          {habit?.shortTitle || j.habitId}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          &bull; {j.date}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isDone ? 'Terlaksana' : 'Tertunda'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-snug">
                      "{j.activityDescription}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      {j.photoUrl ? (
                        <button
                          onClick={() => onViewPhoto(j.photoUrl!, `${habit?.title} - ${j.siswaName}`)}
                          className="inline-flex items-center gap-1 text-blue-600 font-bold hover:underline"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Foto Bukti</span>
                        </button>
                      ) : (
                        <span className="text-slate-400">Tanpa foto</span>
                      )}

                      {j.guruFeedback ? (
                        <span className="text-blue-700 font-semibold text-[10px] truncate max-w-[200px]">
                          ✓ Guru: "{j.guruFeedback}"
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Menunggu respon guru</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
