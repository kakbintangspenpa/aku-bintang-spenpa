import * as XLSX from 'xlsx';
import { JournalEntry, TeacherCoaching, ParentFeedback, HabitId, ClassRoom, User } from '../types';
import { TUJUH_KEBIASAAN } from '../data/constants';

export interface HabitSummary {
  habitId: HabitId;
  title: string;
  totalEntries: number;
  completedEntries: number;
  percentage: number;
}

export interface StudentProgressSummary {
  siswaId: string;
  siswaName: string;
  kelasName: string;
  totalTarget: number;
  totalCompleted: number;
  overallPercentage: number;
  habitBreakdown: Record<HabitId, { completed: number; total: number; percentage: number }>;
  statusConsistency: 'Sangat Konsisten' | 'Cukup Konsisten' | 'Perlu Pendampingan';
}

class ReportService {
  calculateOverallStats(journals: JournalEntry[]): {
    totalEntries: number;
    completed: number;
    percentage: number;
    verifiedByGuru: number;
    parentAcknowledged: number;
  } {
    const totalEntries = journals.length;
    if (totalEntries === 0) {
      return { totalEntries: 0, completed: 0, percentage: 0, verifiedByGuru: 0, parentAcknowledged: 0 };
    }
    const completed = journals.filter(j => j.status === 'Sudah Dilaksanakan').length;
    const verifiedByGuru = journals.filter(j => j.guruVerified).length;
    const parentAcknowledged = journals.filter(j => j.parentAcknowledged).length;
    const percentage = Math.round((completed / totalEntries) * 100);

    return { totalEntries, completed, percentage, verifiedByGuru, parentAcknowledged };
  }

  getHabitSummaries(journals: JournalEntry[]): HabitSummary[] {
    return TUJUH_KEBIASAAN.map(habit => {
      const habitEntries = journals.filter(j => j.habitId === habit.id);
      const totalEntries = habitEntries.length;
      const completedEntries = habitEntries.filter(j => j.status === 'Sudah Dilaksanakan').length;
      const percentage = totalEntries > 0 ? Math.round((completedEntries / totalEntries) * 100) : 0;
      return {
        habitId: habit.id,
        title: habit.title,
        totalEntries,
        completedEntries,
        percentage
      };
    });
  }

  getStudentProgressList(
    students: User[],
    classes: ClassRoom[],
    journals: JournalEntry[]
  ): StudentProgressSummary[] {
    const classMap = new Map<string, string>();
    classes.forEach(c => classMap.set(c.id, c.name));

    return students.map(student => {
      const studentJournals = journals.filter(j => j.siswaId === student.id);
      const totalTarget = studentJournals.length;
      const totalCompleted = studentJournals.filter(j => j.status === 'Sudah Dilaksanakan').length;
      const overallPercentage = totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0;

      const habitBreakdown: Record<string, { completed: number; total: number; percentage: number }> = {};
      TUJUH_KEBIASAAN.forEach(h => {
        const hJournals = studentJournals.filter(j => j.habitId === h.id);
        const hTotal = hJournals.length;
        const hCompleted = hJournals.filter(j => j.status === 'Sudah Dilaksanakan').length;
        habitBreakdown[h.id] = {
          completed: hCompleted,
          total: hTotal,
          percentage: hTotal > 0 ? Math.round((hCompleted / hTotal) * 100) : 0
        };
      });

      let statusConsistency: 'Sangat Konsisten' | 'Cukup Konsisten' | 'Perlu Pendampingan' = 'Sangat Konsisten';
      if (overallPercentage < 50 || totalCompleted === 0) {
        statusConsistency = 'Perlu Pendampingan';
      } else if (overallPercentage < 80) {
        statusConsistency = 'Cukup Konsisten';
      }

      return {
        siswaId: student.id,
        siswaName: student.fullName,
        kelasName: (student.kelasId && classMap.get(student.kelasId)) || 'Kelas 5A',
        totalTarget,
        totalCompleted,
        overallPercentage,
        habitBreakdown: habitBreakdown as any,
        statusConsistency
      };
    });
  }

  exportToExcel(
    journals: JournalEntry[],
    coachings: TeacherCoaching[],
    feedbacks: ParentFeedback[],
    students: User[],
    classes: ClassRoom[]
  ): void {
    const wb = XLSX.utils.book_new();

    // 1. Sheet Ringkasan Siswa
    const studentSummaries = this.getStudentProgressList(students, classes, journals);
    const summaryData = studentSummaries.map((s, idx) => ({
      No: idx + 1,
      'Nama Siswa': s.siswaName,
      Kelas: s.kelasName,
      'Total Aktivitas Dicatat': s.totalTarget,
      'Total Terlaksana': s.totalCompleted,
      'Persentase Capaian (%)': `${s.overallPercentage}%`,
      'Status Konsistensi': s.statusConsistency
    }));
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Rekap Perkembangan');

    // 2. Sheet Log Jurnal
    const habitMap = new Map<string, string>();
    TUJUH_KEBIASAAN.forEach(h => habitMap.set(h.id, h.title));

    const journalData = journals.map((j, idx) => ({
      No: idx + 1,
      Tanggal: j.date,
      Waktu: j.time || '-',
      'Nama Siswa': j.siswaName,
      'Kebiasaan Hebat': habitMap.get(j.habitId) || j.habitId,
      'Aktivitas Dilakukan': j.activityDescription,
      'Refleksi Siswa': j.reflection || '-',
      Status: j.status,
      'Verifikasi Guru': j.guruVerified ? 'Sudah Diperiksa' : 'Menunggu',
      'Catatan Apresiasi Guru': j.guruFeedback || '-',
      'Konfirmasi Orang Tua': j.parentAcknowledged ? 'Sudah Dilihat' : 'Belum',
      'Catatan Orang Tua': j.parentNotes || '-'
    }));
    const wsJournals = XLSX.utils.json_to_sheet(journalData);
    XLSX.utils.book_append_sheet(wb, wsJournals, 'Log Jurnal Harian');

    // 3. Sheet Pembinaan Guru
    const coachingData = coachings.map((c, idx) => ({
      No: idx + 1,
      Tanggal: c.date,
      'Nama Siswa': c.siswaName,
      'Guru Pembina': c.guruName,
      'Kendala Pembiasaan': c.obstacleNotes,
      'Saran Solusi Positif': c.positiveSolutionAdvice,
      'Target Perbaikan': c.improvementTarget,
      'Jadwal Evaluasi': c.nextEvaluationDate,
      'Status Tindak Lanjut': c.followUpStatus
    }));
    const wsCoaching = XLSX.utils.json_to_sheet(coachingData);
    XLSX.utils.book_append_sheet(wb, wsCoaching, 'Pembinaan Guru');

    // 4. Sheet Tanggapan Orang Tua
    const feedbackData = feedbacks.map((f, idx) => ({
      No: idx + 1,
      Tanggal: f.date,
      'Nama Orang Tua': f.parentName,
      'ID Siswa': f.siswaId,
      'Pesan Dukungan & Rasa Bangga': f.supportMessage,
      'Observasi Rumah': f.homeObservations
    }));
    const wsFeedback = XLSX.utils.json_to_sheet(feedbackData);
    XLSX.utils.book_append_sheet(wb, wsFeedback, 'Tanggapan Orang Tua');

    // Download file
    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Laporan_7_Kebiasaan_Anak_Indonesia_Hebat_${dateStr}.xlsx`);
  }
}

export const reportService = new ReportService();
