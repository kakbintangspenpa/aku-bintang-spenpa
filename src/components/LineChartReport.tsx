import React, { useState } from 'react';
import { HabitSummary } from '../services/reportService';
import { JournalEntry } from '../types';
import { TUJUH_KEBIASAAN } from '../data/constants';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  CheckCircle2,
  Info
} from 'lucide-react';

interface LineChartReportProps {
  habitSummaries: HabitSummary[];
  journals: JournalEntry[];
}

export const LineChartReport: React.FC<LineChartReportProps> = ({
  habitSummaries,
  journals
}) => {
  const [chartMode, setChartMode] = useState<'habits_line' | 'daily_trend' | 'bars'>('habits_line');
  const [activeHoverIdx, setActiveHoverIdx] = useState<number | null>(null);

  // 1. Data for 7 Habits Line Chart
  const habitPoints = TUJUH_KEBIASAAN.map((habit, idx) => {
    const summary = habitSummaries.find(h => h.habitId === habit.id);
    const percentage = summary ? summary.percentage : 0;
    const completed = summary ? summary.completedEntries : 0;
    const total = summary ? summary.totalEntries : 0;
    return {
      idx,
      id: habit.id,
      number: habit.number,
      title: habit.title,
      shortTitle: habit.shortTitle,
      percentage,
      completed,
      total,
      suggestedTimes: habit.suggestedTimes
    };
  });

  // 2. Data for Daily Trend Line Chart
  const dateMap = new Map<string, { total: number; completed: number }>();
  journals.forEach(j => {
    if (!dateMap.has(j.date)) {
      dateMap.set(j.date, { total: 0, completed: 0 });
    }
    const cur = dateMap.get(j.date)!;
    cur.total += 1;
    if (j.status === 'Sudah Dilaksanakan') {
      cur.completed += 1;
    }
  });

  const sortedDates = Array.from(dateMap.keys()).sort();
  const dailyPoints = sortedDates.map((date, idx) => {
    const dData = dateMap.get(date)!;
    const percentage = Math.round((dData.completed / 7) * 100);
    return {
      idx,
      date,
      displayDate: date.slice(5), // MM-DD
      completed: dData.completed,
      totalTarget: 7,
      percentage: Math.min(percentage, 100)
    };
  });

  // SVG Chart Geometry
  const svgWidth = 720;
  const svgHeight = 260;
  const paddingLeft = 45;
  const paddingRight = 35;
  const paddingTop = 35;
  const paddingBottom = 45;

  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = svgHeight - paddingTop - paddingBottom;

  // Coordinate helper for Y (0% to 100%)
  const getY = (pct: number) => {
    const clamped = Math.max(0, Math.min(100, pct));
    return paddingTop + chartH * (1 - clamped / 100);
  };

  // Helper to generate path for Habit Points
  const habitCoords = habitPoints.map((p, i) => {
    const x = paddingLeft + (i / Math.max(1, habitPoints.length - 1)) * chartW;
    const y = getY(p.percentage);
    return { x, y, ...p };
  });

  const habitLineD = habitCoords.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const habitAreaD = habitCoords.length > 0
    ? `${habitLineD} L ${habitCoords[habitCoords.length - 1].x} ${paddingTop + chartH} L ${habitCoords[0].x} ${paddingTop + chartH} Z`
    : '';

  // Helper to generate path for Daily Points
  const dailyCoords = dailyPoints.map((p, i) => {
    const x = paddingLeft + (i / Math.max(1, dailyPoints.length - 1)) * chartW;
    const y = getY(p.percentage);
    return { x, y, ...p };
  });

  const dailyLineD = dailyCoords.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const dailyAreaD = dailyCoords.length > 0
    ? `${dailyLineD} L ${dailyCoords[dailyCoords.length - 1].x} ${paddingTop + chartH} L ${dailyCoords[0].x} ${paddingTop + chartH} Z`
    : '';

  // Average consistency calculation
  const totalAvg = Math.round(
    habitPoints.reduce((acc, h) => acc + h.percentage, 0) / Math.max(1, habitPoints.length)
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header and Chart Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Grafik Garis Capaian 7 Kebiasaan
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Visualisasi fluktuasi dan konsistensi pelaksanaan tujuh kebiasaan karakter siswa.
          </p>
        </div>

        {/* View Switcher Chips */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartMode('habits_line')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              chartMode === 'habits_line'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Grafik Garis 7 Kebiasaan</span>
          </button>

          {dailyPoints.length > 1 && (
            <button
              type="button"
              onClick={() => setChartMode('daily_trend')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                chartMode === 'daily_trend'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Tren Harian</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setChartMode('bars')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              chartMode === 'bars'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Diagram Batang</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide block">
            Rata-rata Konsistensi
          </span>
          <span className="text-lg font-black text-emerald-700">{totalAvg}% Tuntas</span>
        </div>
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-2.5">
          <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wide block">
            Kebiasaan Tertinggi
          </span>
          <span className="text-xs font-black text-blue-900 truncate block">
            {habitPoints.slice().sort((a, b) => b.percentage - a.percentage)[0]?.shortTitle || '-'} (
            {habitPoints.slice().sort((a, b) => b.percentage - a.percentage)[0]?.percentage || 0}%)
          </span>
        </div>
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide block">
            Fokus Perhatian
          </span>
          <span className="text-xs font-black text-amber-900 truncate block">
            {habitPoints.slice().sort((a, b) => a.percentage - b.percentage)[0]?.shortTitle || '-'} (
            {habitPoints.slice().sort((a, b) => a.percentage - b.percentage)[0]?.percentage || 0}%)
          </span>
        </div>
      </div>

      {/* MODE 1: GRAFIK GARIS 7 KEBIASAAN */}
      {chartMode === 'habits_line' && (
        <div className="space-y-3">
          <div className="w-full overflow-x-auto pb-2">
            <div className="min-w-[620px] sm:min-w-full">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto overflow-visible select-none"
              >
                <defs>
                  {/* Area fill gradient beneath the line */}
                  <linearGradient id="habitAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.32" />
                    <stop offset="85%" stopColor="#10B981" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Line stroke gradient */}
                  <linearGradient id="habitLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="50%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>

                  {/* Drop shadow for points */}
                  <filter id="pointShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#065F46" floodOpacity="0.25" />
                  </filter>
                </defs>

                {/* Y-Axis Gridlines & Reference Labels */}
                {[100, 75, 50, 25, 0].map(val => {
                  const y = getY(val);
                  return (
                    <g key={val}>
                      <line
                        x1={paddingLeft}
                        y1={y}
                        x2={svgWidth - paddingRight}
                        y2={y}
                        stroke="#E2E8F0"
                        strokeDasharray={val === 0 ? 'none' : '4 4'}
                        strokeWidth={val === 0 ? '1.5' : '1'}
                      />
                      <text
                        x={paddingLeft - 8}
                        y={y + 3.5}
                        textAnchor="end"
                        className="text-[10px] font-bold fill-slate-400 font-sans"
                      >
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {/* Shaded Area Under Line */}
                {habitAreaD && (
                  <path d={habitAreaD} fill="url(#habitAreaGrad)" />
                )}

                {/* Main Curve / Trend Line */}
                {habitLineD && (
                  <path
                    d={habitLineD}
                    fill="none"
                    stroke="url(#habitLineGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data Points (Circles) & Percentage Labels */}
                {habitCoords.map((pt, i) => {
                  const isHovered = activeHoverIdx === i;
                  return (
                    <g
                      key={pt.id}
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setActiveHoverIdx(i)}
                      onMouseLeave={() => setActiveHoverIdx(null)}
                      onClick={() => setActiveHoverIdx(i)}
                    >
                      {/* Vertical highlight guide on hover */}
                      {isHovered && (
                        <line
                          x1={pt.x}
                          y1={paddingTop}
                          x2={pt.x}
                          y2={paddingTop + chartH}
                          stroke="#10B981"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                          opacity="0.7"
                        />
                      )}

                      {/* Percentage pill above point */}
                      <g transform={`translate(${pt.x}, ${pt.y - 12})`}>
                        <rect
                          x="-18"
                          y="-13"
                          width="36"
                          height="16"
                          rx="4"
                          fill={pt.percentage >= 70 ? '#065F46' : pt.percentage >= 40 ? '#B45309' : '#991B1B'}
                          className="shadow-xs"
                        />
                        <text
                          x="0"
                          y="-2"
                          textAnchor="middle"
                          className="text-[9.5px] font-black fill-white font-sans"
                        >
                          {pt.percentage}%
                        </text>
                      </g>

                      {/* Outer Ring on Hover */}
                      {isHovered && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="10"
                          fill="#10B981"
                          opacity="0.25"
                        />
                      )}

                      {/* Circular node */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? '7' : '5.5'}
                        fill="#FFFFFF"
                        stroke={pt.percentage >= 70 ? '#059669' : pt.percentage >= 40 ? '#D97706' : '#DC2626'}
                        strokeWidth="3"
                        filter="url(#pointShadow)"
                      />

                      {/* X-Axis Habit Number Label */}
                      <circle
                        cx={pt.x}
                        cy={svgHeight - 25}
                        r="9"
                        fill={isHovered ? '#059669' : '#F1F5F9'}
                      />
                      <text
                        x={pt.x}
                        y={svgHeight - 22}
                        textAnchor="middle"
                        className={`text-[9px] font-black font-sans ${isHovered ? 'fill-white' : 'fill-slate-700'}`}
                      >
                        #{pt.number}
                      </text>

                      {/* X-Axis Habit Short Name */}
                      <text
                        x={pt.x}
                        y={svgHeight - 6}
                        textAnchor="middle"
                        className={`text-[10px] font-bold font-sans ${
                          isHovered ? 'fill-emerald-800 font-extrabold' : 'fill-slate-600'
                        }`}
                      >
                        {pt.shortTitle}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Interactive Inspection Card when a node is selected/hovered */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center text-xs shrink-0">
                #{activeHoverIdx !== null ? habitPoints[activeHoverIdx].number : '1-7'}
              </span>
              <div>
                <span className="font-extrabold text-slate-900 block">
                  {activeHoverIdx !== null ? habitPoints[activeHoverIdx].title : 'Pilih titik pada grafik garis'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {activeHoverIdx !== null
                    ? `Terlaksana: ${habitPoints[activeHoverIdx].completed} dari ${habitPoints[activeHoverIdx].total} catatan (${habitPoints[activeHoverIdx].percentage}%)`
                    : 'Arahkan kursor atau sentuh titik grafik untuk melihat rincian setiap kebiasaan'}
                </span>
              </div>
            </div>

            {activeHoverIdx !== null && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                {habitPoints[activeHoverIdx].percentage}% Konsisten
              </span>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: GRAFIK GARIS TREN HARIAN */}
      {chartMode === 'daily_trend' && dailyPoints.length > 1 && (
        <div className="space-y-3">
          <div className="w-full overflow-x-auto pb-2">
            <div className="min-w-[620px] sm:min-w-full">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto overflow-visible select-none"
              >
                <defs>
                  <linearGradient id="dailyAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.32" />
                    <stop offset="85%" stopColor="#2563EB" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                  </linearGradient>

                  <linearGradient id="dailyLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1D4ED8" />
                    <stop offset="50%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>

                {/* Y-Axis Gridlines */}
                {[100, 75, 50, 25, 0].map(val => {
                  const y = getY(val);
                  return (
                    <g key={val}>
                      <line
                        x1={paddingLeft}
                        y1={y}
                        x2={svgWidth - paddingRight}
                        y2={y}
                        stroke="#E2E8F0"
                        strokeDasharray={val === 0 ? 'none' : '4 4'}
                        strokeWidth="1"
                      />
                      <text
                        x={paddingLeft - 8}
                        y={y + 3.5}
                        textAnchor="end"
                        className="text-[10px] font-bold fill-slate-400 font-sans"
                      >
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {/* Shaded Area Under Line */}
                {dailyAreaD && (
                  <path d={dailyAreaD} fill="url(#dailyAreaGrad)" />
                )}

                {/* Main Trend Line */}
                {dailyLineD && (
                  <path
                    d={dailyLineD}
                    fill="none"
                    stroke="url(#dailyLineGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data Points */}
                {dailyCoords.map((pt, i) => (
                  <g key={pt.date} className="cursor-pointer">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="5"
                      fill="#FFFFFF"
                      stroke="#2563EB"
                      strokeWidth="2.5"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      textAnchor="middle"
                      className="text-[9.5px] font-black fill-blue-900 font-sans"
                    >
                      {pt.completed}/7
                    </text>
                    <text
                      x={pt.x}
                      y={svgHeight - 12}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-slate-600 font-sans"
                    >
                      {pt.date}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: DIAGRAM BATANG (HORIZONTAL PROGRESS BARS) */}
      {chartMode === 'bars' && (
        <div className="space-y-2.5 pt-2">
          {habitSummaries.map(h => (
            <div key={h.habitId} className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{h.title}</span>
                <span className="font-semibold text-slate-600">{h.percentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    h.percentage >= 70 ? 'bg-emerald-500' : h.percentage >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${h.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
