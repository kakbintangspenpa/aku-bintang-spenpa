import React, { useState, useEffect } from 'react';
import { TeacherCoaching, User, HabitId } from '../types';
import { TUJUH_KEBIASAAN } from '../data/constants';
import { storageService } from '../services/storageService';
import { HeartHandshake, X, Calendar, Target, CheckCircle2 } from 'lucide-react';

interface PembinaanModalProps {
  isOpen: boolean;
  onClose: () => void;
  guruUser: User;
  students: User[];
  preSelectedStudentId?: string;
  existingCoaching?: TeacherCoaching | null;
  onSaved: () => void;
}

export const PembinaanModal: React.FC<PembinaanModalProps> = ({
  isOpen,
  onClose,
  guruUser,
  students,
  preSelectedStudentId,
  existingCoaching,
  onSaved
}) => {
  const [siswaId, setSiswaId] = useState<string>(preSelectedStudentId || students[0]?.id || '');
  const [habitId, setHabitId] = useState<HabitId | 'all'>('all');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [obstacleNotes, setObstacleNotes] = useState<string>('');
  const [positiveSolutionAdvice, setPositiveSolutionAdvice] = useState<string>('');
  const [improvementTarget, setImprovementTarget] = useState<string>('');
  const [nextEvaluationDate, setNextEvaluationDate] = useState<string>('');
  const [followUpStatus, setFollowUpStatus] = useState<'Dalam Proses' | 'Tercapai' | 'Perlu Pendampingan Lanjutan'>('Dalam Proses');

  useEffect(() => {
    if (existingCoaching) {
      setSiswaId(existingCoaching.siswaId);
      setHabitId(existingCoaching.habitId || 'all');
      setDate(existingCoaching.date);
      setObstacleNotes(existingCoaching.obstacleNotes);
      setPositiveSolutionAdvice(existingCoaching.positiveSolutionAdvice);
      setImprovementTarget(existingCoaching.improvementTarget);
      setNextEvaluationDate(existingCoaching.nextEvaluationDate);
      setFollowUpStatus(existingCoaching.followUpStatus);
    } else {
      if (preSelectedStudentId) setSiswaId(preSelectedStudentId);
      setDate(new Date().toISOString().split('T')[0]);
      // set next eval to 7 days later
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setNextEvaluationDate(nextWeek.toISOString().split('T')[0]);
      setObstacleNotes('');
      setPositiveSolutionAdvice('');
      setImprovementTarget('');
      setFollowUpStatus('Dalam Proses');
    }
  }, [isOpen, existingCoaching, preSelectedStudentId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetStudent = students.find(s => s.id === siswaId);
    if (!targetStudent) return;

    if (existingCoaching) {
      storageService.updateCoaching(
        existingCoaching.id,
        {
          siswaId,
          siswaName: targetStudent.fullName,
          habitId,
          date,
          obstacleNotes: obstacleNotes.trim(),
          positiveSolutionAdvice: positiveSolutionAdvice.trim(),
          improvementTarget: improvementTarget.trim(),
          nextEvaluationDate,
          followUpStatus
        },
        guruUser.fullName
      );
    } else {
      storageService.addCoaching({
        siswaId,
        siswaName: targetStudent.fullName,
        kelasId: targetStudent.kelasId || 'kelas-5a',
        guruId: guruUser.id,
        guruName: guruUser.fullName,
        habitId,
        date,
        obstacleNotes: obstacleNotes.trim(),
        positiveSolutionAdvice: positiveSolutionAdvice.trim(),
        improvementTarget: improvementTarget.trim(),
        nextEvaluationDate,
        followUpStatus
      });
    }

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full overflow-hidden my-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 bg-gradient-to-r from-teal-600 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {existingCoaching ? 'Edit Catatan Pembinaan' : 'Formulir Pembinaan Karakter Siswa'}
              </h3>
              <p className="text-xs text-emerald-100">
                Pendekatan apresiatif, edukatif, dan solusi positif
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Student selection & habit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pilih Siswa Binaan: <span className="text-red-500">*</span>
              </label>
              <select
                value={siswaId}
                onChange={(e) => setSiswaId(e.target.value)}
                className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                required
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.nisn || 'Siswa'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Fokus Kebiasaan:
              </label>
              <select
                value={habitId}
                onChange={(e) => setHabitId(e.target.value as any)}
                className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              >
                <option value="all">Semua Kebiasaan (Umum)</option>
                {TUJUH_KEBIASAAN.map(h => (
                  <option key={h.id} value={h.id}>
                    #{h.number} - {h.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Obstacle identification */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Identifikasi Kendala Siswa: <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              value={obstacleNotes}
              onChange={(e) => setObstacleNotes(e.target.value)}
              placeholder="Contoh: Siswa sering tidur larut malam karena bermain gawai sehingga bangun terlambat..."
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              required
            />
          </div>

          {/* Positive Educational Solution */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Saran Penyelesaian yang Positif & Mendidik: <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              value={positiveSolutionAdvice}
              onChange={(e) => setPositiveSolutionAdvice(e.target.value)}
              placeholder="Contoh: Berdiskusi hangat dengan siswa dan orang tua untuk menyepakati batas jam gawai pada pukul 20.30 WIB..."
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              required
            />
          </div>

          {/* Improvement Target */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-teal-600" />
              Target Perbaikan yang Ingin Dicapai: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={improvementTarget}
              onChange={(e) => setImprovementTarget(e.target.value)}
              placeholder="Contoh: Mampu tidur sebelum 21.00 WIB selama 5 hari berturut-turut."
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              required
            />
          </div>

          {/* Evaluation Date & Follow-Up Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Jadwal Evaluasi Berikutnya:
              </label>
              <input
                type="date"
                value={nextEvaluationDate}
                onChange={(e) => setNextEvaluationDate(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Status Tindak Lanjut:
              </label>
              <select
                value={followUpStatus}
                onChange={(e) => setFollowUpStatus(e.target.value as any)}
                className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              >
                <option value="Dalam Proses">⏳ Dalam Proses</option>
                <option value="Tercapai">✅ Tercapai</option>
                <option value="Perlu Pendampingan Lanjutan">⚠️ Perlu Pendampingan Lanjutan</option>
              </select>
            </div>
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
              className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-200 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Simpan Catatan Pembinaan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
