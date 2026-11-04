import React from 'react';
import { HabitDefinition, JournalEntry } from '../types';
import { HabitIcon } from './HabitIcon';
import {
  CheckCircle2,
  Clock,
  PlusCircle,
  Edit3,
  Image as ImageIcon
} from 'lucide-react';

interface HabitCardProps {
  habit: HabitDefinition;
  todayJournal?: JournalEntry;
  onOpenJournalModal: (habit: HabitDefinition, existing?: JournalEntry) => void;
  onViewPhoto: (url: string, title: string) => void;
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
  const hasEntry = !!todayJournal;

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 bg-white shadow-xs flex flex-col justify-between overflow-hidden active:scale-[0.99] ${
        isDone
          ? 'border-emerald-300 ring-1 ring-emerald-200/70 bg-gradient-to-b from-emerald-50/20 to-white'
          : isPending
          ? 'border-amber-300 ring-1 ring-amber-200/70'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Top Banner / Number & Title */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2.5 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${habit.color} flex items-center justify-center text-white shadow-xs shrink-0`}
            >
              <HabitIcon name={habit.icon} className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-500 tracking-wider uppercase">
                Kebiasaan #{habit.number}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-1 sm:line-clamp-none">
                {habit.title}
              </h3>
            </div>
          </div>

          {/* Status Badge */}
          {isDone ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Selesai</span>
            </span>
          ) : isPending ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Tertunda</span>
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-slate-100 text-slate-500 shrink-0">
              Belum Diisi
            </span>
          )}
        </div>

        {/* Short description */}
        <p className="text-[11px] sm:text-xs text-slate-600 mb-3 leading-relaxed">
          {habit.description}
        </p>

        {/* Clean minimal info badge (tanpa riwayat isian panjang, tanpa catatan guru & ortu) */}
        <div className="mt-auto pt-2">
          {isDone ? (
            <div className="flex items-center justify-between text-[11px] bg-emerald-50/70 border border-emerald-200/60 text-emerald-800 px-2.5 py-1.5 rounded-xl font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Terlaksana {todayJournal?.time ? `• ${todayJournal.time}` : ''}</span>
              </span>
              {todayJournal?.photoUrl && (
                <button
                  onClick={() => onViewPhoto(todayJournal.photoUrl!, `${habit.title} - ${todayJournal.siswaName}`)}
                  className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-bold"
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Foto</span>
                </button>
              )}
            </div>
          ) : isPending ? (
            <div className="flex items-center justify-between text-[11px] bg-amber-50/70 border border-amber-200/60 text-amber-800 px-2.5 py-1.5 rounded-xl font-medium">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Belum terlaksana</span>
              </span>
            </div>
          ) : (
            <div className="text-[10px] sm:text-[11px] text-slate-500 bg-slate-50/80 p-2 rounded-xl border border-dashed border-slate-200">
              💡 <span className="font-semibold text-slate-700">Waktu anjuran:</span> {habit.suggestedTimes || 'Sepanjang hari'}
            </div>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      {canEdit && (
        <div className="p-2.5 sm:px-4 sm:py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 hidden sm:inline">
            {hasEntry ? 'Tercatat hari ini' : 'Buka formulir kegiatan'}
          </span>
          <button
            onClick={() => onOpenJournalModal(habit, todayJournal)}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs min-h-[38px] active:scale-95 ${
              isDone
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {hasEntry ? (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Ubah Catatan</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Catat Aktivitas</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
