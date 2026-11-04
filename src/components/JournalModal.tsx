import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { HabitDefinition, JournalEntry, HabitId, User } from '../types';
import { TUJUH_KEBIASAAN } from '../data/constants';
import { HabitIcon } from './HabitIcon';
import { storageService } from '../services/storageService';
import {
  X,
  Upload,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Camera,
  Trash2,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  selectedHabit?: HabitDefinition;
  existingEntry?: JournalEntry;
  onSaved: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  selectedHabit,
  existingEntry,
  onSaved
}) => {
  const [habitId, setHabitId] = useState<HabitId>(
    selectedHabit?.id || 'bangun_pagi_ibadah'
  );
  const [date, setDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [time, setTime] = useState<string>('06:00 WIB');
  const [description, setDescription] = useState<string>('');
  const [reflection, setReflection] = useState<string>('');
  const [status, setStatus] = useState<'Sudah Dilaksanakan' | 'Belum Dilaksanakan'>('Sudah Dilaksanakan');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showGuidelines, setShowGuidelines] = useState<boolean>(false);

  useEffect(() => {
    if (existingEntry) {
      setHabitId(existingEntry.habitId);
      setDate(existingEntry.date);
      setTime(existingEntry.time || '');
      setDescription(existingEntry.activityDescription);
      setReflection(existingEntry.reflection || '');
      setStatus(existingEntry.status as any || 'Sudah Dilaksanakan');
      setPhotoUrl(existingEntry.photoUrl || '');
      setPhotoFileName(existingEntry.photoFileName || '');
    } else if (selectedHabit) {
      setHabitId(selectedHabit.id);
      setDate(new Date().toISOString().split('T')[0]);
      setTime(selectedHabit.suggestedTimes?.split('atau')[0]?.trim() || '06:00 WIB');
      setDescription('');
      setReflection('');
      setStatus('Sudah Dilaksanakan');
      setPhotoUrl('');
      setPhotoFileName('');
    }
    setErrorMsg('');
  }, [isOpen, selectedHabit, existingEntry]);

  if (!isOpen) return null;

  const currentHabitDef = TUJUH_KEBIASAAN.find(h => h.id === habitId) || TUJUH_KEBIASAAN[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Harap unggah berkas foto (JPG, PNG, atau WEBP).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg('Ukuran foto maksimal adalah 3 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoUrl(reader.result as string);
      setPhotoFileName(file.name);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleSetSamplePhoto = () => {
    const samplePhotos: Record<HabitId, string> = {
      bangun_pagi_ibadah: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=500&auto=format&fit=crop&q=80',
      berolahraga: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=500&auto=format&fit=crop&q=80',
      makan_sehat: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
      gemar_membaca: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=80',
      bermasyarakat: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500&auto=format&fit=crop&q=80',
      istirahat_tepat: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=500&auto=format&fit=crop&q=80',
      kedisiplinan_umum: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=80'
    };
    setPhotoUrl(samplePhotos[habitId]);
    setPhotoFileName(`bukti_${habitId}_hebat.jpg`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      setErrorMsg('Harap tuliskan aktivitas yang telah kamu lakukan.');
      return;
    }

    if (existingEntry) {
      storageService.updateJournal(
        existingEntry.id,
        {
          habitId,
          date,
          time,
          activityDescription: description.trim(),
          reflection: reflection.trim(),
          status,
          photoUrl: photoUrl || undefined,
          photoFileName: photoFileName || undefined
        },
        currentUser.fullName,
        currentUser.role
      );
    } else {
      storageService.addJournal({
        siswaId: currentUser.id,
        siswaName: currentUser.fullName,
        kelasId: currentUser.kelasId || 'kelas-5a',
        habitId,
        date,
        time,
        activityDescription: description.trim(),
        reflection: reflection.trim(),
        status,
        photoUrl: photoUrl || undefined,
        photoFileName: photoFileName || undefined,
        photoDriveFileId: photoUrl ? `DRIVE_${Date.now()}` : undefined
      });
    }

    if (status === 'Sudah Dilaksanakan') {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback
      }
    }

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] sm:max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200">
        
        {/* Sticky Header */}
        <div className={`p-4 bg-gradient-to-r ${currentHabitDef.color} text-white flex items-center justify-between shrink-0`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
              <HabitIcon name={currentHabitDef.icon} className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 block">
                Formulir Jurnal Harian
              </span>
              <h2 className="text-sm sm:text-base font-bold leading-tight truncate max-w-[220px] sm:max-w-none">
                {currentHabitDef.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/15 hover:bg-black/25 text-white transition-colors active:scale-95"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-slate-800">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Habit Selection Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Pilih Kebiasaan Hebat:
            </label>
            <select
              value={habitId}
              onChange={(e) => setHabitId(e.target.value as HabitId)}
              className="w-full text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            >
              {TUJUH_KEBIASAAN.map((h) => (
                <option key={h.id} value={h.id}>
                  #{h.number} - {h.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status Selection - Big Touch Targets for Mobile */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Status Pelaksanaan Hari Ini:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('Sudah Dilaksanakan')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all min-h-[44px] active:scale-95 ${
                  status === 'Sudah Dilaksanakan'
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Sudah Dilaksanakan</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('Belum Dilaksanakan')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all min-h-[44px] active:scale-95 ${
                  status === 'Belum Dilaksanakan'
                    ? 'bg-amber-600 border-amber-600 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Belum Terlaksana</span>
              </button>
            </div>
          </div>

          {/* Activity Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Apa yang kamu lakukan hari ini? <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Bangun jam 04.45 lalu sholat subuh berjamaah dan merapikan kamar..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              required
            />
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                Tanggal:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2 bg-slate-50"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                Waktu (Jam):
              </label>
              <input
                type="text"
                placeholder="05.00 WIB"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2 bg-slate-50"
              />
            </div>
          </div>

          {/* Reflection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Refleksi Diri / Perasaan (Opsional):
            </label>
            <input
              type="text"
              placeholder="Bagaimana perasaanmu setelah melakukannya?"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            />
          </div>

          {/* Photo Upload Section */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-slate-500" />
                Foto Bukti Kegiatan:
              </label>
              <button
                type="button"
                onClick={handleSetSamplePhoto}
                className="text-[11px] text-blue-600 font-semibold hover:underline"
              >
                Contoh Foto
              </button>
            </div>

            {photoUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-36">
                <img
                  src={photoUrl}
                  alt="Bukti"
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => { setPhotoUrl(''); setPhotoFileName(''); }}
                  className="absolute top-2 right-2 px-2 py-1 bg-red-600/90 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs"
                >
                  <Trash2 className="w-3 h-3" />
                  Hapus
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-300 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors active:scale-[0.99]">
                <Camera className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs font-bold text-slate-700">
                  Ambil Foto / Pilih dari Galeri
                </span>
                <span className="text-[10px] text-slate-400">
                  Format JPG/PNG, tersimpan ke Google Drive
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Collapsible Guidelines for Mobile */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setShowGuidelines(!showGuidelines)}
              className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-slate-700 font-bold"
            >
              <span className="flex items-center gap-1.5 text-[11px]">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                Lihat Contoh Kegiatan yang Dianjurkan
              </span>
              {showGuidelines ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showGuidelines && (
              <div className="p-3 bg-white text-[11px] text-slate-600 space-y-1 border-t border-slate-100">
                <ul className="list-disc pl-4 space-y-0.5">
                  {currentHabitDef.guidelines.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </form>

        {/* Sticky Bottom Actions */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-initial py-2.5 px-4 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="flex-2 sm:flex-initial py-2.5 px-5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs rounded-xl shadow-md shadow-red-200 flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simpan Jurnal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
