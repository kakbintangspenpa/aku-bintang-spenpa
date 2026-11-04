import React, { useState } from 'react';
import {
  User,
  ClassRoom,
  JournalEntry,
  TeacherCoaching,
  ParentFeedback,
  HabitId
} from '../types';
import { TUJUH_KEBIASAAN } from '../data/constants';
import { reportService } from '../services/reportService';
import { LineChartReport } from '../components/LineChartReport';
import {
  FileSpreadsheet,
  Printer,
  Filter,
  Download,
  Calendar,
  CheckCircle2,
  TrendingUp,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface LaporanViewProps {
  currentUser: User;
  students: User[];
  teachers: User[];
  classes: ClassRoom[];
  journals: JournalEntry[];
  coachings: TeacherCoaching[];
  feedbacks: ParentFeedback[];
  onBackToDashboard: () => void;
}

export const LaporanView: React.FC<LaporanViewProps> = ({
  currentUser,
  students,
  teachers,
  classes,
  journals,
  coachings,
  feedbacks,
  onBackToDashboard
}) => {
  const [filterStudentId, setFilterStudentId] = useState<string>('all');
  const [filterClassId, setFilterClassId] = useState<string>('all');
  const [filterHabitId, setFilterHabitId] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('2026-01-01');
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const effectiveStudentId = currentUser.role === 'siswa' ? currentUser.id : filterStudentId;

  const filteredJournals = journals.filter(j => {
    if (effectiveStudentId !== 'all' && j.siswaId !== effectiveStudentId) return false;
    if (filterClassId !== 'all' && j.kelasId !== filterClassId) return false;
    if (filterHabitId !== 'all' && j.habitId !== filterHabitId) return false;
    if (j.date < startDate || j.date > endDate) return false;
    return true;
  });

  const overallStats = reportService.calculateOverallStats(filteredJournals);
  const habitSummaries = reportService.getHabitSummaries(filteredJournals);
  const studentSummaries = reportService.getStudentProgressList(
    effectiveStudentId !== 'all' ? students.filter(s => s.id === effectiveStudentId) : students,
    classes,
    filteredJournals
  );

  const handleExportExcel = () => {
    reportService.exportToExcel(
      filteredJournals,
      coachings,
      feedbacks,
      effectiveStudentId !== 'all' ? students.filter(s => s.id === effectiveStudentId) : students,
      classes
    );
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Header Toolbar */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:hidden">
        <div>
          <span className="text-[10px] sm:text-[11px] font-bold text-red-700 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
            Pelaporan Karakter
          </span>
          <h1 className="text-base sm:text-xl font-extrabold text-slate-900 mt-0.5">
            Laporan 7 Kebiasaan Siswa
          </h1>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportExcel}
            className="flex-1 sm:flex-initial py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor Excel</span>
          </button>
          <button
            onClick={handlePrintPDF}
            className="flex-1 sm:flex-initial py-2 px-3 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak/PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Collapsible Filter Bar */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs text-xs print:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between font-bold text-slate-700"
        >
          <span className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-red-600" />
            <span>Filter Laporan (Siswa, Kelas, Tanggal)</span>
          </span>
          <span className="text-slate-400">
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </button>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3 mt-2 border-t border-slate-100">
            {currentUser.role !== 'siswa' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Pilih Siswa:</label>
                <select
                  value={filterStudentId}
                  onChange={(e) => setFilterStudentId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 bg-slate-50 font-medium"
                >
                  <option value="all">Semua Siswa</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Kelas:</label>
              <select
                value={filterClassId}
                onChange={(e) => setFilterClassId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2 bg-slate-50 font-medium"
              >
                <option value="all">Semua Kelas</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Mulai:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-1.5 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Sampai:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-1.5 bg-slate-50"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. 4 Mini Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
          <span className="text-[10px] text-slate-500 block">Total Jurnal</span>
          <span className="text-xl font-black text-slate-900">{overallStats.totalEntries}</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
          <span className="text-[10px] text-emerald-600 block">Terlaksana</span>
          <span className="text-xl font-black text-emerald-600">{overallStats.completed} ({overallStats.percentage}%)</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
          <span className="text-[10px] text-blue-600 block">Diverifikasi</span>
          <span className="text-xl font-black text-blue-600">{overallStats.verifiedByGuru}</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
          <span className="text-[10px] text-amber-600 block">Didukung Ortu</span>
          <span className="text-xl font-black text-amber-600">{overallStats.parentAcknowledged}</span>
        </div>
      </div>

      {/* 4. Grafik Garis Capaian 7 Kebiasaan */}
      <LineChartReport
        habitSummaries={habitSummaries}
        journals={filteredJournals}
      />

      {/* 5. Rekap Siswa (Cards on Mobile + Table on Desktop) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
          Rekap Siswa Binaan
        </h3>

        {/* Mobile View: Cards */}
        <div className="sm:hidden space-y-2">
          {studentSummaries.map(s => (
            <div key={s.siswaId} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{s.siswaName}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  s.statusConsistency === 'Sangat Konsisten' ? 'bg-emerald-100 text-emerald-800' :
                  s.statusConsistency === 'Cukup Konsisten' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {s.statusConsistency}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>{s.kelasName}</span>
                <span className="font-bold text-slate-800">{s.totalCompleted} / {s.totalTarget} ({s.overallPercentage}%)</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-2.5">Nama</th>
                <th className="p-2.5">Kelas</th>
                <th className="p-2.5">Jurnal</th>
                <th className="p-2.5">Persentase</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentSummaries.map(s => (
                <tr key={s.siswaId} className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-900">{s.siswaName}</td>
                  <td className="p-2.5 text-slate-600">{s.kelasName}</td>
                  <td className="p-2.5 font-semibold text-slate-700">{s.totalCompleted} dari {s.totalTarget}</td>
                  <td className="p-2.5 font-bold">{s.overallPercentage}%</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      s.statusConsistency === 'Sangat Konsisten' ? 'bg-emerald-100 text-emerald-800' :
                      s.statusConsistency === 'Cukup Konsisten' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {s.statusConsistency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
