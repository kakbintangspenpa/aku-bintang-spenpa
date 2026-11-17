import React, { useState, useEffect } from 'react';
import { HabitTimeRuleConfig, User } from '../types';
import { storageService, formatTimeRuleLabel } from '../services/storageService';
import { TUJUH_KEBIASAAN } from '../data/constants';
import { HabitIcon } from './HabitIcon';
import {
  Clock,
  Lock,
  Unlock,
  RotateCcw,
  Check,
  Database,
  Copy,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

interface AdminTimeRulesManagerProps {
  currentUser: User;
  onRefreshData: () => void;
}

const TIME_RULES_SQL = `CREATE TABLE IF NOT EXISTS public.habit_time_rules (
  habit_id TEXT PRIMARY KEY,
  habit_name TEXT NOT NULL,
  enabled BOOLEAN DEFAULT false,
  start_hour INT NOT NULL DEFAULT 5,
  start_minute INT NOT NULL DEFAULT 0,
  end_hour INT NOT NULL DEFAULT 6,
  end_minute INT NOT NULL DEFAULT 0,
  timezone_label TEXT DEFAULT 'WIB',
  lock_outside_window BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

GRANT ALL PRIVILEGES ON TABLE public.habit_time_rules TO anon, authenticated;
ALTER TABLE public.habit_time_rules DISABLE ROW LEVEL SECURITY;`;

function toTimeInputValue(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export const AdminTimeRulesManager: React.FC<AdminTimeRulesManagerProps> = ({
  currentUser,
  onRefreshData
}) => {
  const [rules, setRules] = useState<HabitTimeRuleConfig[]>(() => storageService.getHabitTimeRules());
  const [saveMessage, setSaveMessage] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [isCheckingSync, setIsCheckingSync] = useState(false);

  const timeRulesTableMissing = storageService.getTimeRulesTableMissing();

  useEffect(() => {
    setRules(storageService.getHabitTimeRules());
  }, []);

  const updateRule = (habitId: string, patch: Partial<HabitTimeRuleConfig>) => {
    setRules(prev =>
      prev.map(r => (r.habitId === habitId ? { ...r, ...patch } : r))
    );
  };

  const handleTimeChange = (habitId: string, field: 'start' | 'end', value: string) => {
    const [hhStr, mmStr] = value.split(':');
    const hh = Math.min(23, Math.max(0, Number(hhStr) || 0));
    const mm = Math.min(59, Math.max(0, Number(mmStr) || 0));
    if (field === 'start') {
      updateRule(habitId, { startHour: hh, startMinute: mm });
    } else {
      updateRule(habitId, { endHour: hh, endMinute: mm });
    }
  };

  const handleSaveAll = () => {
    storageService.saveHabitTimeRules(rules, currentUser.fullName, 'admin');
    onRefreshData();
    setSaveMessage('Pengaturan batas waktu pengisian jurnal berhasil disimpan.');
    setTimeout(() => setSaveMessage(''), 4000);
  };

  const handleResetDefaults = () => {
    const defaults = storageService.resetHabitTimeRules(currentUser.fullName, 'admin');
    setRules(defaults);
    onRefreshData();
    setSaveMessage('Batas waktu dikembalikan ke pengaturan standar awal.');
    setTimeout(() => setSaveMessage(''), 4000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(TIME_RULES_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleRetrySync = async () => {
    setIsCheckingSync(true);
    await storageService.syncFromSupabase();
    setRules(storageService.getHabitTimeRules());
    onRefreshData();
    setIsCheckingSync(false);
  };

  const isCurrentlyOpen = (rule: HabitTimeRuleConfig): boolean => {
    if (!rule.enabled) return true;
    const now = new Date();
    const curMins = now.getHours() * 60 + now.getMinutes();
    const startMins = rule.startHour * 60 + rule.startMinute;
    const endMins = rule.endHour * 60 + rule.endMinute;
    if (startMins <= endMins) {
      return curMins >= startMins && curMins <= endMins;
    }
    // Cross-midnight window (e.g. 20:00 - 05:00)
    return curMins >= startMins || curMins <= endMins;
  };

  const activeRestrictedCount = rules.filter(r => r.enabled).length;

  return (
    <div className="space-y-4">
      {timeRulesTableMissing && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3 text-xs text-amber-950">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <Database className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-sm">
                  Tabel <code className="font-mono">habit_time_rules</code> belum dibuat di Supabase
                </h4>
                <p className="text-amber-800 mt-0.5 leading-relaxed">
                  Pengaturan batas waktu saat ini tersimpan di perangkat ini. Agar perubahan batas waktu langsung berlaku untuk semua perangkat Siswa, jalankan SQL berikut satu kali di <strong>Supabase SQL Editor</strong>.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopySql}
                className="px-3 py-1.5 rounded-lg bg-amber-900 hover:bg-amber-800 text-white font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'SQL Tersalin' : 'Salin SQL'}</span>
              </button>
              <button
                type="button"
                onClick={handleRetrySync}
                disabled={isCheckingSync}
                className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingSync ? 'animate-spin' : ''}`} />
                <span>Cek Ulang</span>
              </button>
            </div>
          </div>
          <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl overflow-x-auto font-mono text-[11px] leading-relaxed">
            {TIME_RULES_SQL}
          </pre>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4 text-xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Pengelolaan Batas Waktu Mengisi Jurnal
              </h2>
              <p className="text-[11px] text-slate-500">
                Atur jam buka/tutup pengisian jurnal untuk masing-masing 7 Kebiasaan · <span className="font-bold text-slate-700 tabular-nums">{activeRestrictedCount} dari 7</span> kebiasaan dibatasi jamnya
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standar</span>
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs flex items-center gap-1.5 whitespace-nowrap shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>
        </div>

        {saveMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveMessage}</span>
          </div>
        )}

        {/* Habits Rules List */}
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
          {rules.map(rule => {
            const habitDef = TUJUH_KEBIASAAN.find(h => h.id === rule.habitId);
            const openNow = isCurrentlyOpen(rule);

            return (
              <div
                key={rule.habitId}
                className={`p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                  rule.enabled ? 'bg-white' : 'bg-slate-50/50'
                }`}
              >
                {/* Left: Habit identity & current status */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${habitDef?.color || 'from-slate-600 to-slate-800'} text-white flex items-center justify-center shrink-0`}>
                    <HabitIcon name={habitDef?.icon || 'Clock'} className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="text-[11px] font-bold text-slate-400 tabular-nums">
                        #{habitDef?.number}
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        {rule.habitName}
                      </h3>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      {rule.enabled ? (
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${openNow ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {openNow ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          <span>{openNow ? 'Sedang Dibuka' : 'Sedang Terkunci'}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-500">
                          Bebas Sepanjang Hari
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {rule.enabled
                        ? `Jadwal aktif: ${formatTimeRuleLabel(rule)} · ${rule.lockOutsideWindow ? 'Status "Sudah Dilaksanakan" dikunci di luar jam' : 'Hanya pengingat jadwal (tidak mengunci)'}`
                        : 'Siswa dapat mengisi status "Sudah Dilaksanakan" kapan saja tanpa batasan jam.'}
                    </p>
                  </div>
                </div>

                {/* Right: Controls */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  {/* Enable/Disable Toggle */}
                  <button
                    type="button"
                    onClick={() => updateRule(rule.habitId, { enabled: !rule.enabled })}
                    className={`px-3 py-2 rounded-xl border font-bold text-xs whitespace-nowrap transition-colors cursor-pointer ${
                      rule.enabled
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {rule.enabled ? 'Batas Waktu Aktif' : 'Aktifkan Batas Waktu'}
                  </button>

                  {rule.enabled && (
                    <>
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                        <span className="text-[11px] font-bold text-slate-500">Mulai</span>
                        <input
                          type="time"
                          value={toTimeInputValue(rule.startHour, rule.startMinute)}
                          onChange={(e) => handleTimeChange(rule.habitId, 'start', e.target.value)}
                          className="font-mono font-bold text-slate-900 bg-transparent focus:outline-hidden text-xs"
                        />
                        <span className="text-slate-300">–</span>
                        <span className="text-[11px] font-bold text-slate-500">Selesai</span>
                        <input
                          type="time"
                          value={toTimeInputValue(rule.endHour, rule.endMinute)}
                          onChange={(e) => handleTimeChange(rule.habitId, 'end', e.target.value)}
                          className="font-mono font-bold text-slate-900 bg-transparent focus:outline-hidden text-xs"
                        />
                      </div>

                      <select
                        value={rule.timezoneLabel}
                        onChange={(e) => updateRule(rule.habitId, { timezoneLabel: e.target.value })}
                        className="px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800 text-xs cursor-pointer"
                        title="Label zona waktu"
                      >
                        <option value="WIB">WIB</option>
                        <option value="WITA">WITA</option>
                        <option value="WIT">WIT</option>
                        <option value="">Waktu Lokal</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => updateRule(rule.habitId, { lockOutsideWindow: !rule.lockOutsideWindow })}
                        title="Jika dikunci, siswa di luar jam hanya bisa memilih Belum Terlaksana"
                        className={`px-3 py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                          rule.lockOutsideWindow
                            ? 'bg-amber-50 border-amber-300 text-amber-900'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {rule.lockOutsideWindow ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        <span>{rule.lockOutsideWindow ? 'Kunci Otomatis' : 'Pengingat Saja'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
