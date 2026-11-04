import React, { useState } from 'react';
import { JournalEntry, User } from '../types';
import { storageService } from '../services/storageService';
import { Award, Star, Heart, CheckCircle2, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ApresiasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  journal: JournalEntry | null;
  guruUser: User;
  onSaved: () => void;
}

const PRESET_FEEDBACKS = [
  'Luar biasa! Konsistensi kebiasaan ini akan menjadikanmu pribadi yang mandiri dan berkarakter mulia.',
  'Bagus sekali! Ibu/Bapak guru sangat bangga atas semangat dan kedisiplinanmu hari ini.',
  'Terus pertahankan ya! Kebaikan kecil yang dilakukan setiap hari akan menghasilkan prestasi luar biasa.',
  'Hebat! Cerita refleksimu sangat menyentuh dan menunjukkan ketulusan hatimu.'
];

const BADGE_OPTIONS = [
  { name: 'Bintang Teladan Hari Ini', icon: 'Star', color: 'text-amber-500 bg-amber-50 border-amber-200' },
  { name: 'Pejuang Karakter Mulia', icon: 'Award', color: 'text-purple-500 bg-purple-50 border-purple-200' },
  { name: 'Duta Sahabat Hebat', icon: 'Heart', color: 'text-rose-500 bg-rose-50 border-rose-200' },
  { name: 'Juara Disiplin Positif', icon: 'CheckCircle2', color: 'text-emerald-500 bg-emerald-50 border-emerald-200' }
];

export const ApresiasiModal: React.FC<ApresiasiModalProps> = ({
  isOpen,
  onClose,
  journal,
  guruUser,
  onSaved
}) => {
  const [feedback, setFeedback] = useState<string>(journal?.guruFeedback || '');
  const [selectedBadge, setSelectedBadge] = useState<string>('');

  if (!isOpen || !journal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    // Verify & save feedback to journal
    storageService.verifyJournalByGuru(journal.id, guruUser.fullName, feedback.trim());

    // If badge selected, also award badge to student
    if (selectedBadge) {
      storageService.addBadge({
        siswaId: journal.siswaId,
        guruId: guruUser.id,
        guruName: guruUser.fullName,
        badgeName: selectedBadge,
        badgeIcon: 'Award',
        message: feedback.trim()
      });
    }

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch {
      // Ignore
    }

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Apresiasi & Pembinaan Guru</h3>
              <p className="text-xs text-blue-100">
                Siswa: <span className="font-semibold">{journal.siswaName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black/10 hover:bg-black/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Activity summary */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
            <span className="font-bold text-slate-800 block mb-1">
              Aktivitas Siswa ({journal.date}):
            </span>
            <p className="italic">"{journal.activityDescription}"</p>
            {journal.reflection && (
              <p className="mt-1 text-slate-500">Refleksi: {journal.reflection}</p>
            )}
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Pilihan Kata Apresiasi Cepat:
            </label>
            <div className="space-y-1.5">
              {PRESET_FEEDBACKS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setFeedback(preset)}
                  className="w-full text-left text-xs p-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-colors text-slate-700"
                >
                  "{preset}"
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan Apresiasi & Motivasi Guru: <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tuliskan apresiasi, motivasi, atau pesan membangun untuk siswa..."
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              required
            />
          </div>

          {/* Optional Badge Gift */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Sematkan Lencana Karakter (Opsional):
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BADGE_OPTIONS.map((badge, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedBadge(selectedBadge === badge.name ? '' : badge.name)}
                  className={`p-2 rounded-xl border text-xs font-semibold text-left transition-all ${
                    selectedBadge === badge.name
                      ? `${badge.color} ring-2 ring-blue-400 font-bold`
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  🏆 {badge.name}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-200 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Simpan & Kirim Apresiasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
