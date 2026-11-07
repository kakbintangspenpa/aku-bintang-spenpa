import React from 'react';
import { Role } from '../types';
import {
  Home,
  CheckCircle2,
  Award,
  FileText,
  Users,
  HeartHandshake,
  Shield,
  Layers,
  HardDrive,
  ListTodo,
  BookOpen
} from 'lucide-react';

interface BottomNavProps {
  role: Role;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  pendingCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  role,
  currentTab,
  onSelectTab,
  pendingCount = 0
}) => {
  const getNavItems = () => {
    switch (role) {
      case 'siswa':
        return [
          { id: 'dashboard', label: '7 Kebiasaan', icon: Home },
          { id: 'my_journals', label: 'Riwayat', icon: ListTodo },
          { id: 'badges', label: 'Lencana', icon: Award }
        ];
      case 'guru':
        return [
          { id: 'dashboard', label: 'Beranda', icon: Home },
          { id: 'verify_journals', label: 'Verifikasi', icon: CheckCircle2, badge: pendingCount },
          { id: 'coaching', label: 'Pembinaan', icon: HeartHandshake },
          { id: 'reports', label: 'Laporan', icon: FileText }
        ];
      case 'orang_tua':
        return [
          { id: 'dashboard', label: 'Pantau Anak', icon: Home },
          { id: 'child_journals', label: 'Jurnal Foto', icon: ListTodo },
          { id: 'parent_support', label: 'Dukungan', icon: HeartHandshake },
          { id: 'reports', label: 'Laporan', icon: FileText }
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Beranda', icon: Home },
          { id: 'docs', label: 'Arsitektur', icon: BookOpen },
          { id: 'users', label: 'Pengguna', icon: Users },
          { id: 'drive_sync', label: 'Drive', icon: HardDrive },
          { id: 'reports', label: 'Laporan', icon: FileText }
        ];
    }
  };

  const items = getNavItems();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1 safe-area-pb">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 relative transition-all rounded-xl active:scale-95 ${
                isActive
                  ? 'text-red-600 font-bold'
                  : 'text-slate-500 hover:text-slate-700 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight truncate max-w-[64px] ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
