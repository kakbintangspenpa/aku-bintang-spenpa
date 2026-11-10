import React from 'react';
import { HabitDefinition, JournalEntry } from '../types';
import { HabitIcon } from './HabitIcon';
import {
  CheckCircle2,
  Clock,
  Plus,
  Image as ImageIcon
} from 'lucide-react';

interface HabitCardProps {
  habit: HabitDefinition;
  todayJournal?: JournalEntry;
  onOpenJournalModal: (habit: HabitDefinition, existing?: JournalEntry) => void;
  onViewPhoto?: (url: string, title: string) => void;
  canEdit?: boolean;
  index?: number;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  todayJournal,
  onOpenJournalModal,
  onViewPhoto,
  canEdit = true,
  index = 0
}) => {
  const isDone = todayJournal?.status === 'Sudah Dilaksanakan';
  const isPending = todayJournal?.status === 'Belum Dilaksanakan';

  const handleClick = () => {
    if (canEdit) {
      onOpenJournalModal(habit, todayJournal);
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      style={{
        animationDelay: `${index * 70}ms`
      }}
      className={`group w-full rounded-2xl border transition-all duration-300 ease-out p-3.5 sm:p-4 flex flex-col items-center justify-between text-center cursor-pointer select-none relative overflow-hidden focus:outline-hidden focus:ring-2 focus:ring-red-400 animate-fade-in-up ${
        isDone
          ? 'bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/30 border-emerald-300/90 shadow-xs ring-1 ring-emerald-200/60 hover:border-emerald-400 hover:ring-2 hover:ring-emerald-300/60 hover:shadow-xl hover:shadow-emerald-500/15 hover:-translate-y-2 hover:scale-[1.02]'
          : isPending
          ? 'bg-gradient-to-b from-amber-50/70 via-white to-amber-50/30 border-amber-300/90 shadow-xs ring-1 ring-amber-200/60 hover:border-amber-400 hover:ring-2 hover:ring-amber-300/60 hover:shadow-xl hover:shadow-amber-500/15 hover:-translate-y-2 hover:scale-[1.02]'
          : 'bg-white border-slate-200/90 shadow-2xs hover:border-red-400 hover:ring-2 hover:ring-red-200/70 hover:shadow-xl hover:shadow-red-500/15 hover:-translate-y-2 hover:scale-[1.02] hover:bg-slate-50/50'
      } active:scale-95`}
    >
      {/* Dynamic Hover Ambient Sheen Reflection */}
      <div
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none opacity-30"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)'
        }}
      />

      {/* Top Bar: Number Tag & Photo Indicator */}
      <div className="w-full flex items-center justify-between gap-1 mb-2 relative z-10">
        <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-100/90 text-slate-500 border border-slate-200/60 group-hover:bg-white group-hover:text-slate-800 group-hover:shadow-2xs transition-all">
          #{habit.number}
        </span>

        {todayJournal?.photoUrl && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onViewPhoto?.(todayJournal.photoUrl!, `${habit.title} - ${todayJournal.siswaName}`);
            }}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200 cursor-pointer shadow-2xs hover:scale-105 transition-transform"
            title="Lihat foto bukti"
          >
            <ImageIcon className="w-2.5 h-2.5" />
            <span>Foto</span>
          </span>
        )}
      </div>

      {/* Prominent Habit Icon Container (Icon Saja Sesuai Nama Kebiasaan) */}
      <div className="relative my-1.5 sm:my-2">
        {/* Glow halo behind icon on hover */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${habit.color} blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300 scale-95 group-hover:scale-110`}
        />

        <div
          className={`relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${habit.color} flex items-center justify-center text-white shadow-md shadow-slate-300/40 transition-all duration-300 ease-out group-hover:scale-110 group-hover:-rotate-2 group-hover:shadow-lg`}
        >
          <HabitIcon name={habit.icon} className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-md text-white transition-transform duration-300 group-hover:scale-105" />
        </div>

        {/* Floating Checkmark / Clock Status Badge */}
        {isDone && (
          <div
            className="absolute -top-1.5 -right-1.5 z-20 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white shadow-sm transition-transform duration-200 group-hover:scale-110"
            title="Kebiasaan ini sudah terlaksana"
          >
            <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
          </div>
        )}
        {isPending && (
          <div
            className="absolute -top-1.5 -right-1.5 z-20 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center ring-2 ring-white shadow-sm transition-transform duration-200 group-hover:scale-110"
            title="Belum terlaksana"
          >
            <Clock className="w-3.5 h-3.5 text-white" />
          </div>
        )}
      </div>

      {/* Habit Name (Centered, Crisp Modern Typography) */}
      <div className="w-full my-1 min-h-[40px] flex flex-col items-center justify-center relative z-10">
        <h3 className="text-xs sm:text-[13px] font-extrabold text-slate-800 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
          {habit.title}
        </h3>
        {habit.suggestedTimes && (
          <span className="text-[9.5px] font-bold text-slate-400 group-hover:text-slate-600 mt-0.5 flex items-center gap-0.5 tracking-tight">
            <Clock className="w-2.5 h-2.5 text-slate-400" />
            {habit.suggestedTimes}
          </span>
        )}
      </div>

      {/* Bottom Status Pill */}
      <div className="w-full pt-1.5 mt-auto border-t border-slate-100/90 flex items-center justify-center relative z-10">
        {isDone ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs group-hover:bg-emerald-200 group-hover:scale-105 transition-all">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Selesai</span>
          </span>
        ) : isPending ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs group-hover:bg-amber-200 group-hover:scale-105 transition-all">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Tertunda</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 group-hover:scale-105 shadow-2xs transition-all duration-200">
            <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
            <span>Isi Jurnal</span>
          </span>
        )}
      </div>
    </div>
  );
};


