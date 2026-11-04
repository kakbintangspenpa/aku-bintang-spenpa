import React, { useState } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';
import { Heart, X, Send, Sparkles, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ParentFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentUser: User;
  childUser: User;
  onSaved: () => void;
}

export const ParentFeedbackModal: React.FC<ParentFeedbackModalProps> = ({
  isOpen,
  onClose,
  parentUser,
  childUser,
  onSaved
}) => {
  const [supportMessage, setSupportMessage] = useState<string>('');
  const [homeObservations, setHomeObservations] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;

    storageService.addFeedback({
      siswaId: childUser.id,
      parentId: parentUser.id,
      parentName: parentUser.fullName,
      date: new Date().toISOString().split('T')[0],
      supportMessage: supportMessage.trim(),
      homeObservations: homeObservations.trim()
    });

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
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
        <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Tanggapan & Dukungan Kasih Sayang</h3>
              <p className="text-xs text-amber-100">
                Untuk Anak Tercinta: <span className="font-bold">{childUser.fullName}</span>
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
          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
            💛 <span className="font-bold">Pesan Motivasi untuk Anak:</span> Kata-kata positif dan dukungan tulus dari Ayah/Ibu sangat berharga dalam memperkuat rasa percaya diri dan kebiasaan baik anak di masa pertumbuhannya.
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Kata-Kata Apresiasi, Rasa Bangga & Semangat: <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              placeholder="Contoh: Ayah dan Ibu sangat bangga melihat ketekunanmu bangun pagi sendiri dan rajin membaca buku..."
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-slate-500" />
              Observasi Kebiasaan di Rumah (Opsional):
            </label>
            <textarea
              rows={2}
              value={homeObservations}
              onChange={(e) => setHomeObservations(e.target.value)}
              placeholder="Ceritakan perubahan positif atau kegiatan mandiri yang diamati di rumah..."
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

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
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl shadow-md shadow-amber-200 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Kirim Dukungan untuk Anak
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
