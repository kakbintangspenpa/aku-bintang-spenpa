import React from 'react';
import { X, ExternalLink, HardDrive } from 'lucide-react';

interface PhotoViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export const PhotoViewerModal: React.FC<PhotoViewerModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl border border-slate-700">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm truncate max-w-[350px]">
              {title || 'Dokumentasi Foto Siswa'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-2 bg-slate-900/50 flex items-center justify-center max-h-[70vh]">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[65vh] w-auto max-w-full rounded-lg object-contain shadow-md"
          />
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Tersimpan di Google Drive: <code>7-KEBIASAAN/DOKUMENTASI-SISWA/</code></span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
