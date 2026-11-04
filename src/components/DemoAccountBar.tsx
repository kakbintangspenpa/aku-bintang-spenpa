import React, { useState } from 'react';
import { authService } from '../services/authService';
import { User, Role } from '../types';
import { UserCheck, Shield, GraduationCap, HeartHandshake, BookMarked, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface DemoAccountBarProps {
  currentUser: User | null;
  onOpenGuide: () => void;
}

export const DemoAccountBar: React.FC<DemoAccountBarProps> = ({ currentUser, onOpenGuide }) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const handleSwitch = (role: Role) => {
    authService.loginAsDemoRole(role);
  };

  const getRoleBg = (role: Role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-600 text-white';
      case 'guru':
        return 'bg-blue-600 text-white';
      case 'siswa':
        return 'bg-emerald-600 text-white';
      case 'orang_tua':
        return 'bg-amber-600 text-white';
    }
  };

  const roleLabel = (role: Role) => {
    switch (role) {
      case 'siswa': return 'Siswa';
      case 'guru': return 'Guru';
      case 'orang_tua': return 'Orang Tua';
      case 'admin': return 'Admin';
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 text-xs border-b border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 flex items-center justify-between gap-2">
        {/* Left Indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="flex items-center gap-1 font-bold text-amber-400 bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-800/60 text-[10px] sm:text-xs">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Mode Demo:</span>
            <span>{currentUser ? roleLabel(currentUser.role) : 'Pilih Peran'}</span>
          </span>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-1.5">
          <button
            onClick={() => handleSwitch('siswa')}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all text-xs ${
              currentUser?.role === 'siswa'
                ? getRoleBg('siswa') + ' ring-2 ring-emerald-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-300" />
            <span>Siswa (Bintang)</span>
          </button>

          <button
            onClick={() => handleSwitch('guru')}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all text-xs ${
              currentUser?.role === 'guru'
                ? getRoleBg('guru') + ' ring-2 ring-blue-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-300" />
            <span>Guru (Bu Dewi)</span>
          </button>

          <button
            onClick={() => handleSwitch('orang_tua')}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all text-xs ${
              currentUser?.role === 'orang_tua'
                ? getRoleBg('orang_tua') + ' ring-2 ring-amber-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
            <span>Orang Tua (Pak Hendra)</span>
          </button>

          <button
            onClick={() => handleSwitch('admin')}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all text-xs ${
              currentUser?.role === 'admin'
                ? getRoleBg('admin') + ' ring-2 ring-purple-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-purple-300" />
            <span>Admin (Pak Budi)</span>
          </button>

          {currentUser?.role === 'admin' && (
            <button
              onClick={onOpenGuide}
              className="ml-1 bg-gradient-to-r from-red-600 to-amber-600 text-white px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 hover:opacity-90 shadow-2xs text-xs"
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>Panduan Drive</span>
            </button>
          )}
        </div>

        {/* Mobile View Toggle & Fast Switcher */}
        <div className="flex md:hidden items-center gap-1">
          {/* Scrollable chip bar for mobile */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 max-w-[240px] sm:max-w-none">
            <button
              onClick={() => handleSwitch('siswa')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold shrink-0 flex items-center gap-1 ${
                currentUser?.role === 'siswa'
                  ? 'bg-emerald-600 text-white ring-1 ring-emerald-300'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              <GraduationCap className="w-3 h-3 text-emerald-300" />
              Siswa
            </button>
            <button
              onClick={() => handleSwitch('guru')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold shrink-0 flex items-center gap-1 ${
                currentUser?.role === 'guru'
                  ? 'bg-blue-600 text-white ring-1 ring-blue-300'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              <UserCheck className="w-3 h-3 text-blue-300" />
              Guru
            </button>
            <button
              onClick={() => handleSwitch('orang_tua')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold shrink-0 flex items-center gap-1 ${
                currentUser?.role === 'orang_tua'
                  ? 'bg-amber-600 text-white ring-1 ring-amber-300'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              <HeartHandshake className="w-3 h-3 text-amber-300" />
              Ortu
            </button>
            <button
              onClick={() => handleSwitch('admin')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold shrink-0 flex items-center gap-1 ${
                currentUser?.role === 'admin'
                  ? 'bg-purple-600 text-white ring-1 ring-purple-300'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              <Shield className="w-3 h-3 text-purple-300" />
              Admin
            </button>
          </div>

          {currentUser?.role === 'admin' && (
            <button
              onClick={onOpenGuide}
              className="p-1.5 rounded-md bg-slate-800 text-amber-400 shrink-0 hover:bg-slate-700"
              title="Buka Panduan Arsitektur Google Drive"
            >
              <BookMarked className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
