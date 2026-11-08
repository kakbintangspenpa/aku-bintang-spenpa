import React from 'react';
import { User, Role } from '../types';
import { authService } from '../services/authService';
import {
  LogOut,
  Shield,
  GraduationCap,
  HeartHandshake,
  UserCheck,
  BookMarked
} from 'lucide-react';
import { AnimatedStarLogo } from './AnimatedStarLogo';

interface NavbarProps {
  currentUser: User;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentTab,
  onSelectTab,
  onOpenGuide
}) => {
  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'admin':
        return { label: 'Admin', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Shield };
      case 'guru':
        return { label: 'Guru', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: UserCheck };
      case 'siswa':
        return { label: 'Siswa', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: GraduationCap };
      case 'orang_tua':
        return { label: 'Ortu', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: HeartHandshake };
    }
  };

  const roleMeta = getRoleBadge(currentUser.role);
  const RoleIcon = roleMeta.icon;

  const getNavLinks = () => {
    switch (currentUser.role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Ringkasan' },
          { id: 'docs', label: 'Arsitektur & Drive' },
          { id: 'users', label: 'Pengguna' },
          { id: 'classes', label: 'Kelas' },
          { id: 'drive_sync', label: 'Koneksi Webhook' },
          { id: 'reports', label: 'Laporan' }
        ];
      case 'guru':
        return [
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'reports', label: 'Laporan' }
        ];
      case 'siswa':
        return [
          { id: 'dashboard', label: '7 Kebiasaan' },
          { id: 'my_journals', label: 'Riwayat' },
          { id: 'badges', label: 'Lencana' }
        ];
      case 'orang_tua':
        return [
          { id: 'dashboard', label: 'Kebiasaan Anak' },
          { id: 'reports', label: 'Laporan' }
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2 sm:gap-3">
            <AnimatedStarLogo size="sm" showRays={false} />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-xs sm:text-base leading-tight">
                  7 Kebiasaan Hebat
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 sm:inline-block hidden">
                  Indonesia
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Pendidikan Karakter Siswa, Guru & Orang Tua
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentTab === link.id
                    ? 'bg-red-50 text-red-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* User Profile Pill & Actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 pl-2">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser.fullName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200"
              />
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                  {currentUser.fullName}
                </div>
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold border ${roleMeta.color}`}>
                  <RoleIcon className="w-2.5 h-2.5" />
                  {roleMeta.label}
                </span>
              </div>
            </div>

            {currentUser.role === 'admin' && (
              <button
                onClick={() => onOpenGuide()}
                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg hidden sm:block"
                title="Buka Panduan Arsitektur Google Drive & Sheets"
              >
                <BookMarked className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => authService.logout()}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors active:scale-95"
              title="Keluar dari akun"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
