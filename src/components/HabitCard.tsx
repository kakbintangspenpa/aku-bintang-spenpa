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
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  todayJournal,
  onOpenJournalModal,
  onViewPhoto,
  canEdit = true
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
      className={`group w-full rounded-2xl border transition-all duration-300 p-3.5 sm:p-4 flex flex-col items-center justify-between text-center cursor-pointer select-none relative overflow-hidden focus:outline-hidden focus:ring-2 focus:ring-red-400 ${
        isDone
          ? 'bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/30 border-emerald-300/90 shadow-xs ring-1 ring-emerald-200/60 hover:border-emerald-400 hover:shadow-lg hover:-translate-y-1'
          : isPending
          ? 'bg-gradient-to-b from-amber-50/70 via-white to-amber-50/30 border-amber-300/90 shadow-xs ring-1 ring-amber-200/60 hover:border-amber-400 hover:shadow-lg hover:-translate-y-1'
          : 'bg-white border-slate-200/90 shadow-2xs hover:border-red-400 hover:shadow-lg hover:-translate-y-1 hover:bg-slate-50/40'
      } active:scale-95`}
    >
      {/* Top Bar: Number Tag & Photo Indicator */}
      <div className="w-full flex items-center justify-between gap-1 mb-2">
        <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-100/90 text-slate-500 border border-slate-200/60">
          #{habit.number}
        </span>

        {todayJournal?.photoUrl && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onViewPhoto?.(todayJournal.photoUrl!, `${habit.title} - ${todayJournal.siswaName}`);
            }}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200 cursor-pointer shadow-2xs"
            title="Lihat foto bukti"
          >
            <ImageIcon className="w-2.5 h-2.5" />
            <span>Foto</span>
          </span>
        )}
      </div>

      {/* Prominent Habit Icon Container (Icon Saja Sesuai Nama Kebiasaan) */}
      <div className="relative my-1.5 sm:my-2">
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${habit.color} flex items-center justify-center text-white shadow-md shadow-slate-300/40 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1`}
        >
          <HabitIcon name={habit.icon} className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-md text-white" />
        </div>

        {/* Floating Checkmark / Clock Status Badge */}
        {isDone && (
          <div
            className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white shadow-sm"
            title="Kebiasaan ini sudah terlaksana"
          >
            <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
          </div>
        )}
        {isPending && (
          <div
            className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center ring-2 ring-white shadow-sm"
            title="Belum terlaksana"
          >
            <Clock className="w-3.5 h-3.5 text-white" />
          </div>
        )}
      </div>

      {/* Habit Name (Centered, Crisp Modern Typography) */}
      <div className="w-full my-1.5 min-h-[36px] flex items-center justify-center">
        <h3 className="text-xs sm:text-[13px] font-extrabold text-slate-800 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
          {habit.title}
        </h3>
      </div>

      {/* Bottom Status Pill */}
      <div className="w-full pt-1.5 mt-auto border-t border-slate-100/90 flex items-center justify-center">
        {isDone ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs group-hover:bg-emerald-200 transition-colors">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Selesai</span>
          </span>
        ) : isPending ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs group-hover:bg-amber-200 transition-colors">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Tertunda</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 shadow-2xs transition-all">
            <Plus className="w-3 h-3" />
            <span>Isi Jurnal</span>
          </span>
        )}
      </div>
    </div>
  );
};


