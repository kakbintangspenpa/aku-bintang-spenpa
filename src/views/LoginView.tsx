import React, { useState } from 'react';
import { authService } from '../services/authService';
import { Role } from '../types';
import {
  Sparkles,
  Lock,
  User as UserIcon,
  ShieldCheck,
  GraduationCap,
  HeartHandshake,
  UserCheck,
  AlertCircle,
  BookMarked,
  ArrowRight
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
  onOpenGuide: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onOpenGuide }) => {
  const [username, setUsername] = useState('siswa.bintang');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const res = authService.login(username, password);
      setIsLoading(false);
      if (res.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(res.error || 'Gagal login. Periksa kembali username dan kata sandi.');
      }
    }, 200);
  };

  const selectDemoAccount = (u: string, p: string = 'password123') => {
    setUsername(u);
    setPassword(p);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-amber-50/40 flex flex-col justify-between p-3 sm:p-6">
      {/* Top Banner */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between py-2 gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-200 shrink-0">
            <span className="font-extrabold text-lg sm:text-xl">7K</span>
          </div>
          <div>
            <h1 className="font-extrabold text-slate-800 text-xs sm:text-base leading-tight">
              7 Kebiasaan Anak Hebat
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-500">
              Pendidikan Karakter &bull; Terhubung Google Drive
            </p>
          </div>
        </div>

        <button
          onClick={onOpenGuide}
          className="text-[11px] sm:text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs shrink-0"
        >
          <BookMarked className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Arsitektur & Panduan Drive</span>
          <span className="sm:hidden">Panduan</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-auto py-3 sm:py-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Card Header */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-red-600 to-rose-600 text-white text-center relative overflow-hidden">
            <div className="inline-flex p-2.5 bg-white/20 rounded-2xl mb-2 shadow-inner">
              <Sparkles className="w-6 h-6 text-amber-200" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold">Masuk ke Akun Anda</h2>
            <p className="text-[11px] sm:text-xs text-red-100 mt-0.5 max-w-xs mx-auto">
              Membangun generasi cerdas, mandiri, dan berakhlak mulia.
            </p>
          </div>

          {/* Form */}
          <div className="p-4 sm:p-8 space-y-4 sm:space-y-5">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  Username Pengguna:
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: siswa.bintang"
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Kata Sandi (Password):
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi..."
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm rounded-xl shadow-md shadow-red-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Memeriksa Akun...</span>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Switcher Chips */}
            <div className="pt-4 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block mb-2 text-center uppercase tracking-wider">
                ⚡ Atau Masuk Cepat dengan Akun Contoh:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => selectDemoAccount('siswa.bintang')}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    username === 'siswa.bintang'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-1 ring-emerald-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold block text-[11px]">Siswa</span>
                    <span className="text-[10px] text-slate-500">siswa.bintang</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => selectDemoAccount('guru.dewi')}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    username === 'guru.dewi'
                      ? 'bg-blue-50 border-blue-400 text-blue-900 ring-1 ring-blue-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold block text-[11px]">Guru Pembina</span>
                    <span className="text-[10px] text-slate-500">guru.dewi</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => selectDemoAccount('ortu.bintang')}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    username === 'ortu.bintang'
                      ? 'bg-amber-50 border-amber-400 text-amber-900 ring-1 ring-amber-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <HeartHandshake className="w-4 h-4 text-amber-600 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold block text-[11px]">Orang Tua</span>
                    <span className="text-[10px] text-slate-500">ortu.bintang</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => selectDemoAccount('admin')}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    username === 'admin'
                      ? 'bg-purple-50 border-purple-400 text-purple-900 ring-1 ring-purple-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold block text-[11px]">Admin Sekolah</span>
                    <span className="text-[10px] text-slate-500">admin</span>
                  </div>
                </button>
              </div>
              <p className="text-[10px] text-center text-slate-400 mt-2">
                Kata sandi standar seluruh akun percontohan: <code>password123</code>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 py-3">
        © 2026 Aplikasi 7 Kebiasaan Anak Indonesia Hebat &bull; Terhubung dengan Google Drive & Google Sheets Sekolah
      </footer>
    </div>
  );
};
