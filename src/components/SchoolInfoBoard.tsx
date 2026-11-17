import React, { useMemo, useState } from 'react';
import { SchoolInfo, Role, InfoCategory } from '../types';
import {
  Megaphone,
  Pin,
  Calendar,
  AlertCircle,
  Info,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

interface SchoolInfoBoardProps {
  infos: SchoolInfo[];
  role: Role;
}

const CATEGORY_META: Record<InfoCategory, { label: string; textClass: string; icon: React.ComponentType<{ className?: string }> }> = {
  penting: {
    label: 'Penting',
    textClass: 'text-red-700',
    icon: AlertCircle
  },
  kegiatan: {
    label: 'Kegiatan',
    textClass: 'text-indigo-700',
    icon: Calendar
  },
  imbauan: {
    label: 'Imbauan',
    textClass: 'text-amber-700',
    icon: Sparkles
  },
  pengumuman: {
    label: 'Pengumuman',
    textClass: 'text-slate-700',
    icon: Info
  }
};

export const SchoolInfoBoard: React.FC<SchoolInfoBoardProps> = ({ infos, role }) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<SchoolInfo | null>(null);

  const visibleInfos = useMemo(() => {
    return infos
      .filter(item => {
        if (!item.isActive) return false;
        const targets = Array.isArray(item.targetRoles) && item.targetRoles.length > 0
          ? item.targetRoles
          : (['siswa', 'guru', 'orang_tua'] as Role[]);
        return targets.includes(role);
      })
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
      });
  }, [infos, role]);

  const displayedInfos = showAll ? visibleInfos : visibleInfos.slice(0, 3);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  return (
    <section
      aria-label="Informasi Sekolah"
      className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
            <Megaphone className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
              Informasi Sekolah
            </h2>
            <p className="text-[11px] text-slate-500 truncate">
              Pengumuman resmi dari Admin Sekolah · <span className="tabular-nums font-semibold">{visibleInfos.length}</span> informasi aktif
            </p>
          </div>
        </div>

        {visibleInfos.length > 3 && (
          <button
            type="button"
            onClick={() => setShowAll(prev => !prev)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <span>{showAll ? 'Tampilkan Ringkas' : `Lihat Semua (${visibleInfos.length})`}</span>
            {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Content */}
      {visibleInfos.length === 0 ? (
        <div className="px-4 py-5 sm:px-5 text-center sm:text-left text-xs text-slate-500">
          Belum ada informasi atau pengumuman terbaru untuk Anda saat ini.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {displayedInfos.map(info => {
            const cat = CATEGORY_META[info.category] || CATEGORY_META.pengumuman;
            const CatIcon = cat.icon;
            return (
              <article
                key={info.id}
                onClick={() => setSelectedInfo(info)}
                className="px-4 py-3.5 sm:px-5 hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0 flex-1">
                    {/* Clean unboxed metadata row */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-semibold">
                      <span className={`inline-flex items-center gap-1 font-bold ${cat.textClass}`}>
                        <CatIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>{cat.label}</span>
                      </span>
                      {info.isPinned && (
                        <>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                            <Pin className="w-3 h-3 shrink-0" />
                            <span>Disematkan</span>
                          </span>
                        </>
                      )}
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-slate-500 tabular-nums">{formatDate(info.updatedAt || info.createdAt)}</span>
                      <span aria-hidden="true" className="text-slate-300 hidden sm:inline">·</span>
                      <span className="text-slate-500 hidden sm:inline truncate">Oleh {info.createdBy}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                      {info.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 whitespace-pre-line">
                      {info.content}
                    </p>
                  </div>

                  <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900 whitespace-nowrap shrink-0 pt-1">
                    Baca →
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Detail Reader Modal */}
      {selectedInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setSelectedInfo(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  {(() => {
                    const cat = CATEGORY_META[selectedInfo.category] || CATEGORY_META.pengumuman;
                    const CatIcon = cat.icon;
                    return (
                      <span className={`inline-flex items-center gap-1 font-bold ${cat.textClass}`}>
                        <CatIcon className="w-3.5 h-3.5" />
                        <span>{cat.label}</span>
                      </span>
                    );
                  })()}
                  {selectedInfo.isPinned && (
                    <>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                        <Pin className="w-3 h-3" />
                        <span>Disematkan</span>
                      </span>
                    </>
                  )}
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-500 tabular-nums">
                    {formatDate(selectedInfo.updatedAt || selectedInfo.createdAt)}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                  {selectedInfo.title}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Diterbitkan oleh {selectedInfo.createdBy}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInfo(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {selectedInfo.content}
            </div>

            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedInfo(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
