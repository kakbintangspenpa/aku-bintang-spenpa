import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { AppreciationBadge } from '../types';

import {
  Award,
  Sparkles,
  Lock,
  Printer,
  Download,
  Loader2,
  Check,
  X,
  CheckCircle2,
  Calendar,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Star
} from 'lucide-react';



interface TrophyShelfProps {
  badges: AppreciationBadge[];
  studentName: string;
}

// Milestone trophies that can be unlocked
interface MilestoneTrophy {
  id: string;
  name: string;
  habitCategory: string;
  requirement: string;
  trophyType: 'gold_cup' | 'silver_cup' | 'star_trophy' | 'book_trophy' | 'medal';
  unlocked: boolean;
}

const UPCOMING_MILESTONES: MilestoneTrophy[] = [
  {
    id: 'mile-1',
    name: 'Piala 14 Hari Tanpa Putus',
    habitCategory: 'Konsistensi 7 Kebiasaan',
    requirement: 'Pertahankan streak pengisian 7 kebiasaan selama 14 hari berturut-turut.',
    trophyType: 'silver_cup',
    unlocked: false
  },
  {
    id: 'mile-2',
    name: 'Piala Cendekia Literasi',
    habitCategory: 'Gemar Membaca',
    requirement: 'Catat aktivitas membaca buku minimal 10 kali dalam sebulan.',
    trophyType: 'book_trophy',
    unlocked: false
  },
  {
    id: 'mile-3',
    name: 'Piala Bintang Kebaikan',
    habitCategory: 'Aksi Bermasyarakat',
    requirement: 'Lakukan dan catat 5 aksi sosial atau tolong menolong sesama.',
    trophyType: 'star_trophy',
    unlocked: false
  }
];

export const TrophyShelf: React.FC<TrophyShelfProps> = ({ badges, studentName }) => {
  const [selectedBadge, setSelectedBadge] = useState<AppreciationBadge | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'earned' | 'upcoming'>('all');

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner Lemari Piala */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border border-amber-900/40">
        {/* Ambient lighting spot */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-10 w-48 h-48 bg-yellow-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>Ruang Prestasi & Penghargaan Karakter</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Rak Piala & Lencana Kehormatan
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-medium max-w-xl leading-relaxed">
              Koleksi piala dan medali emas yang dianugerahkan oleh guru atas keteladanan karakter mulia <strong className="text-amber-300">{studentName}</strong>.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-2 bg-stone-800/80 backdrop-blur-md p-2 rounded-2xl border border-amber-600/30">
            <div className="px-3.5 py-2 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-700/30 border border-amber-400/30 text-center min-w-[75px]">
              <span className="block text-xl sm:text-2xl font-black text-amber-300 leading-tight">
                {badges.length}
              </span>
              <span className="text-[10px] font-extrabold text-amber-200/90 uppercase tracking-wide">
                Diraih
              </span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-center min-w-[75px]">
              <span className="block text-xl sm:text-2xl font-black text-stone-300 leading-tight">
                {UPCOMING_MILESTONES.length}
              </span>
              <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wide">
                Target Baru
              </span>
            </div>
          </div>
        </div>

        {/* Filter Tab Chips */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCategoryFilter === 'all'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Semua Koleksi ({badges.length + UPCOMING_MILESTONES.length})
            </button>
            <button
              onClick={() => setActiveCategoryFilter('earned')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCategoryFilter === 'earned'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              🏆 Piala Diraih ({badges.length})
            </button>
            <button
              onClick={() => setActiveCategoryFilter('upcoming')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCategoryFilter === 'upcoming'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              🔒 Target Milestones ({UPCOMING_MILESTONES.length})
            </button>
          </div>

          <span className="text-[11px] text-amber-300/80 font-medium hidden sm:inline">
            ✨ Klik piala untuk melihat Piagam Penghargaan Resmi
          </span>
        </div>
      </div>

      {/* 2. THE TROPHY CABINET & SHELVES (Rak Susun Kayu Mewah) */}
      <div className="bg-gradient-to-b from-stone-900 via-stone-850 to-stone-900 rounded-3xl p-4 sm:p-7 shadow-2xl border border-stone-800 relative">
        {/* Subtle wooden wall slats in background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none rounded-3xl"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(0,0,0,0.4) 48px, rgba(0,0,0,0.4) 50px)'
          }}
        />

        <div className="relative z-10 space-y-10 sm:space-y-12">
          {/* TINGKAT 1: RAK PIALA UTAMA (EARNED TROPHIES) */}
          {(activeCategoryFilter === 'all' || activeCategoryFilter === 'earned') && (
            <div className="space-y-3">
              {/* Shelf Tag */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-xs" />
                  <h3 className="text-xs sm:text-sm font-extrabold text-amber-300 uppercase tracking-wider">
                    Rak Tingkat 1 &bull; Piala Kehormatan Guru
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-stone-400">
                  {badges.length} Piala Terpajang
                </span>
              </div>

              {/* Trophies standing on shelf */}
              {badges.length === 0 ? (
                <div className="text-center py-12 text-stone-400 bg-stone-800/40 rounded-2xl border border-dashed border-stone-700">
                  <Award className="w-10 h-10 text-stone-500 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold text-stone-300">Belum ada piala yang dipajang di rak ini.</p>
                  <p className="text-xs text-stone-400 mt-1">Terus konsisten mengisi 7 kebiasaan untuk mendapatkan penghargaan dari guru!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 pt-4 pb-2">
                  {badges.map((badge, idx) => (
                    <TrophyCard
                      key={badge.id}
                      badge={badge}
                      idx={idx}
                      onSelect={() => setSelectedBadge(badge)}
                    />
                  ))}
                </div>
              )}

              {/* REALISTIC 3D WOODEN SHELF LEDGE */}
              <div className="relative pt-1">
                {/* Top lit surface of the wooden shelf */}
                <div className="h-4 sm:h-5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 rounded-t-sm shadow-md border-t border-amber-400/50 relative">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-yellow-200/40" />
                </div>
                {/* Front face of the shelf with wood grain and brass trim */}
                <div className="h-5 sm:h-6 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 rounded-b-md shadow-2xl border-b-2 border-black/80 flex items-center justify-between px-4">
                  <div className="w-8 h-1 bg-amber-600/40 rounded-full" />
                  <span className="text-[9px] font-bold tracking-widest text-amber-400/70 uppercase">
                    Koleksi Prestasi Karakter
                  </span>
                  <div className="w-8 h-1 bg-amber-600/40 rounded-full" />
                </div>
                {/* Under-shelf deep drop shadow */}
                <div className="h-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
              </div>
            </div>
          )}

          {/* TINGKAT 2: RAK TARGET MILESTONES (UPCOMING TROPHIES) */}
          {(activeCategoryFilter === 'all' || activeCategoryFilter === 'upcoming') && (
            <div className="space-y-3">
              {/* Shelf Tag */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-500" />
                  <h3 className="text-xs sm:text-sm font-extrabold text-stone-300 uppercase tracking-wider">
                    Rak Tingkat 2 &bull; Piala Tantangan & Milestone Berikutnya
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-stone-500">
                  {UPCOMING_MILESTONES.length} Target Tersedia
                </span>
              </div>

              {/* Locked/Silhouette trophies */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 pb-2">
                {UPCOMING_MILESTONES.map((milestone) => (
                  <LockedTrophyCard key={milestone.id} milestone={milestone} />
                ))}
              </div>

              {/* REALISTIC 3D WOODEN SHELF LEDGE */}
              <div className="relative pt-1">
                <div className="h-4 sm:h-5 bg-gradient-to-r from-amber-800/80 via-amber-700/80 to-amber-800/80 rounded-t-sm shadow-md border-t border-amber-500/30 relative">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-yellow-200/20" />
                </div>
                <div className="h-5 sm:h-6 bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 rounded-b-md shadow-2xl border-b-2 border-black/80 flex items-center justify-between px-4">
                  <div className="w-6 h-1 bg-stone-700 rounded-full" />
                  <span className="text-[9px] font-bold tracking-widest text-stone-400 uppercase">
                    Milestone Pembiasaan
                  </span>
                  <div className="w-6 h-1 bg-stone-700 rounded-full" />
                </div>
                <div className="h-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. MODAL PIAGAM PENGHARGAAN RESMI (OFFICIAL CERTIFICATE) */}
      {selectedBadge && (
        <CertificateModal
          badge={selectedBadge}
          studentName={studentName}
          onClose={() => setSelectedBadge(null)}
          onPrint={handlePrintCertificate}
        />
      )}
    </div>
  );
};

// ==========================================
// INDIVIDUAL EARNED TROPHY CARD
// ==========================================
interface TrophyCardProps {
  badge: AppreciationBadge;
  idx: number;
  onSelect: () => void;
}

const TrophyCard: React.FC<TrophyCardProps> = ({ badge, idx, onSelect }) => {
  // Determine trophy style based on badge name or index
  const isMedal = badge.badgeName.toLowerCase().includes('duta') || idx % 2 === 1;

  return (
    <div
      onClick={onSelect}
      className="group cursor-pointer bg-gradient-to-b from-stone-850 via-stone-800 to-stone-900 rounded-2xl p-4 sm:p-5 border border-amber-500/30 hover:border-amber-400 shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Golden glow hover spotlight */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-44 h-44 bg-amber-400/10 group-hover:bg-amber-400/20 rounded-full blur-2xl transition-all pointer-events-none" />

      {/* Top Bar: Date & Official Seal */}
      <div className="flex items-center justify-between gap-2 relative z-10 mb-3">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
          <Calendar className="w-3 h-3" />
          {badge.date}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">
          <Sparkles className="w-3 h-3 fill-amber-400" />
          Penghargaan Guru
        </span>
      </div>

      {/* CENTERPIECE: REALISTIC 3D TROPHY / MEDAL GRAPHIC */}
      <div className="flex items-center justify-center py-2 relative z-10">
        {isMedal ? (
          <RealisticGoldMedal />
        ) : (
          <RealisticGoldTrophyCup />
        )}
      </div>

      {/* PEDESTAL & ENGRAVED BRASS PLAQUE */}
      <div className="relative z-10 mt-3 pt-3 border-t border-amber-500/20 text-center space-y-2">
        {/* Brass engraved plaque look */}
        <div className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 p-2 sm:p-2.5 rounded-xl border border-yellow-100 shadow-md">
          <h4 className="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-tight leading-snug">
            {badge.badgeName}
          </h4>
        </div>

        {/* Teacher quote */}
        <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 text-left">
          <p className="text-[11px] sm:text-xs text-stone-200 font-medium leading-relaxed">
            "{badge.message}"
          </p>
          <div className="mt-2 flex items-center justify-between text-[10px] text-amber-300/90 font-bold border-t border-white/10 pt-1.5">
            <span className="flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-amber-400" />
              <span>Oleh: {badge.guruName}</span>
            </span>
            <span className="text-amber-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
              Buka Piagam <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// LOCKED / MILESTONE TROPHY CARD
// ==========================================
const LockedTrophyCard: React.FC<{ milestone: MilestoneTrophy }> = ({ milestone }) => {
  return (
    <div className="bg-stone-800/40 rounded-2xl p-4 border border-dashed border-stone-700/80 flex flex-col justify-between relative overflow-hidden group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">
          {milestone.habitCategory}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-700 text-stone-300">
          <Lock className="w-2.5 h-2.5" />
          Terkunci
        </span>
      </div>

      {/* Translucent Silhouette Trophy */}
      <div className="flex items-center justify-center py-3 opacity-40 group-hover:opacity-60 transition-opacity">
        <RealisticSilhouetteTrophy type={milestone.trophyType} />
      </div>

      <div className="mt-2 text-center space-y-1.5">
        <h4 className="text-xs font-bold text-stone-300 group-hover:text-amber-300 transition-colors">
          {milestone.name}
        </h4>
        <p className="text-[10px] text-stone-400 leading-relaxed bg-black/20 p-2 rounded-lg border border-white/5">
          {milestone.requirement}
        </p>
      </div>
    </div>
  );
};

// ==========================================
// REALISTIC 3D SVG VECTOR TROPHIES
// ==========================================

export const RealisticGoldTrophyCup: React.FC = () => {
  return (
    <div className="relative w-36 h-40 flex items-center justify-center filter drop-shadow-[0_10px_15px_rgba(245,158,11,0.25)]">
      <svg viewBox="0 0 160 180" className="w-full h-full">
        <defs>
          {/* Metallic Gold Gradient for Main Cup */}
          <linearGradient id="goldCupBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#92400E" />
            <stop offset="15%" stopColor="#F59E0B" />
            <stop offset="45%" stopColor="#FEF08A" />
            <stop offset="65%" stopColor="#FBBF24" />
            <stop offset="90%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Specular highlight */}
          <linearGradient id="goldHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FEF08A" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </linearGradient>

          {/* Pedestal Black Marble */}
          <linearGradient id="marblePedestal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="30%" stopColor="#334155" />
            <stop offset="70%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Brass Plate Gradient */}
          <linearGradient id="brassPlate" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CA8A04" />
            <stop offset="40%" stopColor="#FEF08A" />
            <stop offset="70%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#A16207" />
          </linearGradient>
        </defs>

        {/* Cup Left Handle */}
        <path
          d="M 45 42 C 15 45, 10 90, 48 95 C 44 88, 30 75, 48 56 Z"
          fill="url(#goldCupBody)"
          stroke="#78350F"
          strokeWidth="1"
        />
        {/* Cup Right Handle */}
        <path
          d="M 115 42 C 145 45, 150 90, 112 95 C 116 88, 130 75, 112 56 Z"
          fill="url(#goldCupBody)"
          stroke="#78350F"
          strokeWidth="1"
        />

        {/* Cup Lip / Top Rim */}
        <ellipse cx="80" cy="35" rx="36" ry="7" fill="url(#goldCupBody)" stroke="#78350F" strokeWidth="1" />
        <ellipse cx="80" cy="34" rx="31" ry="4.5" fill="#B45309" opacity="0.6" />

        {/* Main Cup Bowl */}
        <path
          d="M 44 35 C 44 85, 60 105, 80 105 C 100 105, 116 85, 116 35 Z"
          fill="url(#goldCupBody)"
          stroke="#78350F"
          strokeWidth="1"
        />

        {/* Highlight Reflection Arc */}
        <path
          d="M 52 40 C 50 75, 60 95, 75 98 C 65 92, 58 75, 59 40 Z"
          fill="url(#goldHighlight)"
          opacity="0.9"
        />

        {/* Center Star Emblem on Bowl */}
        <g transform="translate(80, 65) scale(0.9)">
          <circle cx="0" cy="0" r="14" fill="#78350F" opacity="0.3" />
          <polygon
            points="0,-12 3.5,-4 12,-3 5.5,3.5 8,12 0,7 -8,12 -5.5,3.5 -12,-3 -3.5,-4"
            fill="#FFFBEB"
            stroke="#CA8A04"
            strokeWidth="1"
          />
        </g>

        {/* Cup Stem / Neck */}
        <path
          d="M 74 105 L 86 105 L 84 125 L 76 125 Z"
          fill="url(#goldCupBody)"
          stroke="#78350F"
          strokeWidth="0.5"
        />
        {/* Stem Ring */}
        <ellipse cx="80" cy="116" rx="9" ry="3.5" fill="#FEF08A" stroke="#78350F" strokeWidth="0.5" />

        {/* Base Pedestal (Layer 1 - Golden Collar) */}
        <ellipse cx="80" cy="126" rx="19" ry="5" fill="url(#goldCupBody)" stroke="#78350F" strokeWidth="0.5" />

        {/* Base Pedestal (Layer 2 - Obsidian / Black Marble Solid Block) */}
        <path
          d="M 55 130 L 105 130 L 112 165 L 48 165 Z"
          fill="url(#marblePedestal)"
          stroke="#0F172A"
          strokeWidth="1"
        />
        <ellipse cx="80" cy="130" rx="25" ry="3" fill="#475569" />

        {/* Brass Plaque on Base */}
        <rect
          x="58"
          y="138"
          width="44"
          height="18"
          rx="2"
          fill="url(#brassPlate)"
          stroke="#713F12"
          strokeWidth="1"
        />
        {/* Plaque screws */}
        <circle cx="61" cy="141" r="0.8" fill="#451A03" />
        <circle cx="99" cy="141" r="0.8" fill="#451A03" />
        <circle cx="61" cy="153" r="0.8" fill="#451A03" />
        <circle cx="99" cy="153" r="0.8" fill="#451A03" />
        {/* Plaque text lines */}
        <line x1="65" y1="145" x2="95" y2="145" stroke="#451A03" strokeWidth="1" strokeLinecap="round" />
        <line x1="70" y1="149" x2="90" y2="149" stroke="#713F12" strokeWidth="0.8" strokeLinecap="round" />

        {/* Sparkle Star on Upper Right Lip */}
        <g transform="translate(112, 32) scale(0.6)">
          <polygon
            points="0,-10 2.5,-2.5 10,0 2.5,2.5 0,10 -2.5,2.5 -10,0 -2.5,-2.5"
            fill="#FFFFFF"
          />
        </g>
      </svg>
    </div>
  );
};

export const RealisticGoldMedal: React.FC = () => {
  return (
    <div className="relative w-36 h-40 flex items-center justify-center filter drop-shadow-[0_10px_15px_rgba(245,158,11,0.25)]">
      <svg viewBox="0 0 160 180" className="w-full h-full">
        <defs>
          {/* Ribbon Red-White Gradient (Indonesia Merah Putih) */}
          <linearGradient id="ribbonRed" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#991B1B" />
            <stop offset="50%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>

          <linearGradient id="ribbonWhite" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Medal Gold Disc */}
          <radialGradient id="medalGold" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="45%" stopColor="#F59E0B" />
            <stop offset="85%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </radialGradient>

          {/* Medal Rim Bevel */}
          <linearGradient id="medalBevel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>
        </defs>

        {/* Left Ribbon Strand (Red and White) */}
        <polygon points="50,10 65,10 82,90 62,90" fill="url(#ribbonRed)" />
        <polygon points="65,10 75,10 88,90 82,90" fill="url(#ribbonWhite)" />

        {/* Right Ribbon Strand (Red and White) */}
        <polygon points="110,10 95,10 78,90 98,90" fill="url(#ribbonRed)" />
        <polygon points="95,10 85,10 72,90 78,90" fill="url(#ribbonWhite)" />

        {/* Gold Connector Ring */}
        <ellipse cx="80" cy="90" rx="9" ry="7" fill="none" stroke="#D97706" strokeWidth="3" />

        {/* Outer Medallion Disc */}
        <circle cx="80" cy="116" r="42" fill="url(#medalBevel)" stroke="#78350F" strokeWidth="1" />
        <circle cx="80" cy="116" r="38" fill="url(#medalGold)" />

        {/* Embossed Laurel Wreath Dots/Border */}
        <circle cx="80" cy="116" r="32" fill="none" stroke="#78350F" strokeWidth="1" strokeDasharray="3 3" />

        {/* Inner Circle */}
        <circle cx="80" cy="116" r="28" fill="url(#medalGold)" stroke="#B45309" strokeWidth="1.5" />

        {/* Center Star with Emboss Effect */}
        <g transform="translate(80, 116)">
          <polygon
            points="0,-16 4.5,-5 16,-4 7.5,4.5 10.5,16 0,9.5 -10.5,16 -7.5,4.5 -16,-4 -4.5,-5"
            fill="#FFFBEB"
            stroke="#92400E"
            strokeWidth="1.2"
          />
        </g>

        {/* Specular Glint */}
        <ellipse cx="66" cy="102" rx="10" ry="4" transform="rotate(-30 66 102)" fill="#FFFFFF" opacity="0.6" />
        <g transform="translate(60, 96) scale(0.55)">
          <polygon
            points="0,-10 2.5,-2.5 10,0 2.5,2.5 0,10 -2.5,2.5 -10,0 -2.5,-2.5"
            fill="#FFFFFF"
          />
        </g>
      </svg>
    </div>
  );
};

const RealisticSilhouetteTrophy: React.FC<{ type: string }> = () => {
  return (
    <div className="relative w-28 h-32 flex items-center justify-center">
      <svg viewBox="0 0 160 180" className="w-full h-full fill-stone-600">
        <path d="M 45 42 C 15 45, 10 90, 48 95 C 44 88, 30 75, 48 56 Z" />
        <path d="M 115 42 C 145 45, 150 90, 112 95 C 116 88, 130 75, 112 56 Z" />
        <path d="M 44 35 C 44 85, 60 105, 80 105 C 100 105, 116 85, 116 35 Z" />
        <rect x="74" y="105" width="12" height="20" rx="1" />
        <rect x="52" y="125" width="56" height="35" rx="3" />
      </svg>
    </div>
  );
};

// ==========================================
// CERTIFICATE MODAL (PIAGAM APRESIASI RESMI)
// ==========================================
interface CertificateModalProps {
  badge: AppreciationBadge;
  studentName: string;
  onClose: () => void;
  onPrint: () => void;
}

const CertificateModal: React.FC<CertificateModalProps> = ({
  badge,
  studentName,
  onClose,
  onPrint
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certificateRef.current) {
      onPrint();
      return;
    }

    try {
      setIsDownloading(true);
      await new Promise(resolve => setTimeout(resolve, 80));

      const element = certificateRef.current;
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2, // 2x resolution for crisp 4K / retina export
        backgroundColor: '#ffffff',
        skipFonts: true,
        cacheBust: false
      });

      const safeStudent = studentName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
      const safeBadge = badge.badgeName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
      const fileName = `Piagam_${safeBadge}_${safeStudent}.png`;

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Gagal mengunduh file, fallback print:', err);
      onPrint();
    } finally {
      setIsDownloading(false);
    }

  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full my-auto flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden border-2 border-amber-400 animate-in fade-in zoom-in-95 duration-150 print:max-h-none print:border-none print:shadow-none print:my-0 print:rounded-none">
        {/* Modal Top Action Bar (Sticky, Never Cut Off) */}
        <div className="p-3 sm:p-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800 shrink-0 sticky top-0 z-20 print:hidden">
          <div className="flex items-center gap-2 min-w-0">
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="font-extrabold text-xs sm:text-sm truncate">
              Piagam Penghargaan Karakter Siswa
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-75 disabled:cursor-wait"
              title="Unduh piagam ke perangkat (Gambar HD)"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengunduh...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-950" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer active:scale-95"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CERTIFICATE BODY (SCROLLABLE & PRINT READY) */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-6 md:p-8 bg-amber-50/40 relative print:overflow-visible print:p-0">
          {/* Certificate Ornamental Border */}
          <div ref={certificateRef} className="p-4 sm:p-6 md:p-7 rounded-2xl border-4 border-amber-600/40 bg-white relative shadow-sm">
            <div className="absolute inset-2 border border-dashed border-amber-500/50 rounded-xl pointer-events-none" />

            {/* Header / National Crest Style */}
            <div className="text-center space-y-1 relative z-10">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 mx-auto flex items-center justify-center text-white shadow-md mb-1.5">
                <Star className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-white" />
              </div>
              <span className="text-[10px] font-black tracking-widest text-red-600 uppercase block">
                7 KEBIASAAN ANAK INDONESIA HEBAT
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                PIAGAM PENGHARGAAN KARAKTER
              </h2>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-mono">
                Nomor: PIAGAM-{badge.id.toUpperCase()}/{badge.date.replace(/-/g, '')}
              </p>
            </div>

            {/* Certificate Content */}
            <div className="text-center my-4 sm:my-5 space-y-2.5 relative z-10">
              <p className="text-xs text-slate-600 font-medium">
                Piagam kehormatan ini dianugerahkan dengan penuh rasa bangga kepada:
              </p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-950 underline decoration-amber-400 decoration-2 underline-offset-4 tracking-tight">
                {studentName}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Atas keteladanan, dedikasi, serta konsistensi budi pekerti dalam mewujudkan kebiasaan luhur:
              </p>

              {/* Award Title Badge */}
              <div className="inline-block px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 border border-amber-300 text-amber-950 font-black text-xs sm:text-sm md:text-base shadow-xs">
                ⭐ {badge.badgeName} ⭐
              </div>

              {/* Teacher Quote */}
              <div className="bg-amber-50/80 p-3 sm:p-4 rounded-xl border border-amber-200/80 max-w-lg mx-auto text-xs text-slate-700 italic leading-relaxed">
                "{badge.message}"
              </div>
            </div>

            {/* Signatures & Date Footer */}
            <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-200 flex items-center justify-between text-xs relative z-10 gap-2">
              <div className="text-left space-y-0.5">
                <span className="text-[10px] sm:text-[11px] text-slate-500 block">Diterbitkan pada:</span>
                <span className="font-extrabold text-slate-800 text-xs sm:text-sm">{badge.date}</span>
                <div className="mt-1.5 inline-flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Terverifikasi Sistem</span>
                </div>
              </div>

              <div className="text-right space-y-0.5">
                <span className="text-[10px] sm:text-[11px] text-slate-500 block">Guru Pembina Karakter,</span>
                <div className="h-7 sm:h-8 flex items-center justify-end font-serif italic text-amber-900 text-xs sm:text-sm opacity-80">
                  Dewi Ratnasari
                </div>
                <span className="font-extrabold text-slate-900 underline block text-xs sm:text-sm">{badge.guruName}</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 block font-mono">NIP. 19850412 201001 2 023</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer (Sticky) */}
        <div className="p-2.5 sm:p-3 bg-stone-900/95 text-white flex items-center justify-between border-t border-stone-800 shrink-0 print:hidden">
          <span className="text-[10px] text-stone-400 hidden sm:inline">
            Dokumen resmi tanda kelulusan & apresiasi karakter siswa
          </span>
          <div className="flex items-center gap-2 ml-auto w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-stone-300 hover:text-white hover:bg-stone-800 transition-all cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer active:scale-95"
              title="Cetak via printer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-75 disabled:cursor-wait"
              title="Unduh piagam ke perangkat (Gambar HD)"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengunduh...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-950" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


