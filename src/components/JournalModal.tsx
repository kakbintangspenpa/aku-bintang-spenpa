import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { HabitDefinition, JournalEntry, HabitId, User } from '../types';
import { TUJUH_KEBIASAAN, CONTOH_ISIAN_KEBIASAAN } from '../data/constants';
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
  const getDeviceTimezoneAbbr = (): string => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const offset = new Date().getTimezoneOffset();
      if (offset === -480 || tz.includes('Makassar') || tz.includes('Bali') || tz.includes('Ujung_Pandang') || tz.includes('Singapore') || tz.includes('Kuala_Lumpur') || tz.includes('Manila')) {
        return 'WITA';
      }
      if (offset === -540 || tz.includes('Jayapura')) {
        return 'WIT';
      }
      if (offset === -420 || tz.includes('Jakarta') || tz.includes('Pontianak')) {
        return 'WIB';
      }
      if (offset <= -450 && offset >= -510) {
        return 'WITA';
      }
      return 'WITA';
    } catch {
      return 'WITA';
    }
  };

  const getAutoCurrentTime = (): string => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${hh}:${mm} ${getDeviceTimezoneAbbr()}`;
  };


  const getAutoCurrentDate = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  const [habitId, setHabitId] = useState<HabitId>(
    selectedHabit?.id || 'bangun_pagi_ibadah'
  );
  const [date, setDate] = useState<string>(getAutoCurrentDate());
  const [time, setTime] = useState<string>(getAutoCurrentTime());
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
      setDate(existingEntry.date || getAutoCurrentDate());
      setTime(existingEntry.time || getAutoCurrentTime());
      setDescription(existingEntry.activityDescription);
      setReflection(existingEntry.reflection || '');
      setStatus(existingEntry.status as any || 'Sudah Dilaksanakan');
      setPhotoUrl(existingEntry.photoUrl || '');
      setPhotoFileName(existingEntry.photoFileName || '');
    } else if (selectedHabit) {
      setHabitId(selectedHabit.id);
      setDate(getAutoCurrentDate());
      setTime(getAutoCurrentTime());
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

          {/* Interactive Sample Text Box for Students */}
          {(() => {
            const contohData = CONTOH_ISIAN_KEBIASAAN[habitId] || CONTOH_ISIAN_KEBIASAAN['bangun_pagi_ibadah'];
            return (
              <div className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-50/30 border border-amber-200/90 rounded-2xl p-3.5 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Contoh Teks Isian: {currentHabitDef.shortTitle}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDescription(contohData.activity);
                      if (!reflection) {
                        setReflection(contohData.reflection);
                      }
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500 hover:bg-amber-600 active:scale-95 text-white shadow-2xs transition-all cursor-pointer"
                    title="Salin contoh teks ini ke kolom isian"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Gunakan Contoh</span>
                  </button>
                </div>

                {/* Primary example quote */}
                <div className="bg-white/95 rounded-xl p-2.5 border border-amber-200/70 text-xs text-slate-800 leading-relaxed font-medium">
                  <p className="text-slate-700 italic">
                    "{contohData.activity}"
                  </p>
                </div>

                {/* Alternative sample options */}
                <div className="space-y-1 pt-1 border-t border-amber-200/50">
                  <span className="text-[10px] font-extrabold text-amber-900/80 uppercase tracking-wider block">
                    Pilihan Contoh Kalimat Lainnya:
                  </span>
                  <div className="flex flex-col gap-1">
                    {contohData.alternatives.map((alt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setDescription(alt)}
                        className="text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-700 hover:text-amber-900 border border-amber-200/60 transition-all active:scale-[0.99] font-medium leading-snug flex items-start gap-1.5 group cursor-pointer"
                        title="Klik untuk memakai kalimat ini"
                      >
                        <span className="text-amber-500 font-bold shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                        <span className="line-clamp-2">{alt}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="text-[10px] text-amber-900/80 pt-0.5 flex items-start gap-1">
                  <Info className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Tips Isian:</strong> {contohData.tips}</span>
                </div>
              </div>
            );
          })()}

          {/* Activity Description */}
          {(() => {
            const contohData = CONTOH_ISIAN_KEBIASAAN[habitId] || CONTOH_ISIAN_KEBIASAAN['bangun_pagi_ibadah'];
            return (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Kolom Isian Aktivitas: <span className="text-red-500">*</span>
                  </label>
                  {description && (
                    <button
                      type="button"
                      onClick={() => setDescription('')}
                      className="text-[10px] text-slate-400 hover:text-red-600 font-semibold cursor-pointer"
                    >
                      Kosongkan Teks
                    </button>
                  )}
                </div>
                <textarea
                  rows={3}
                  placeholder={`Tulis aktivitasmu di sini...\nContoh: ${contohData.activity}`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden leading-relaxed shadow-2xs"
                  required
                />
              </div>
            );
          })()}

          {/* Date & Time Row - Waktu Otomatis */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-red-600" />
                  Tanggal:
                </label>
                <span className="text-[10px] font-semibold text-slate-400">Otomatis</span>
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  Waktu (Jam):
                </label>
                <button
                  type="button"
                  onClick={() => setTime(getAutoCurrentTime())}
                  className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 cursor-pointer"
                  title="Perbarui dengan jam saat ini"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Sekarang
                </button>
              </div>
              <input
                type="text"
                placeholder="Contoh: 09:45 WIB"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>
          </div>


          {/* Reflection */}
          {(() => {
            const contohData = CONTOH_ISIAN_KEBIASAAN[habitId] || CONTOH_ISIAN_KEBIASAAN['bangun_pagi_ibadah'];
            return (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Refleksi Diri / Perasaan (Opsional):
                  </label>
                  <button
                    type="button"
                    onClick={() => setReflection(contohData.reflection)}
                    className="text-[10px] text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                  >
                    Gunakan Contoh Refleksi
                  </button>
                </div>
                <input
                  type="text"
                  placeholder={`Contoh: ${contohData.reflection}`}
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>
            );
          })()}


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
