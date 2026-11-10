import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { AnimatedStarLogo } from '../components/AnimatedStarLogo';
import {
  Sparkles,
  Lock,
  User as UserIcon,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Shield
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
  onOpenGuide?: () => void;
}

// Koleksi gambar pemandangan alam Indonesia beresolusi tinggi untuk background slider
const SCENIC_WALLPAPERS = [
  {
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&auto=format&fit=crop&q=80',
    title: 'Keheningan Danau & Pegunungan Pagi',
    location: 'Alam Nusantara'
  },
  {
    url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&auto=format&fit=crop&q=80',
    title: 'Hamparan Terasering Hijau Nan Asri',
    location: 'Lembah Nusantara'
  },
  {
    url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1920&auto=format&fit=crop&q=80',
    title: 'Pesona Bahari & Gugusan Pulau Tropis',
    location: 'Kepulauan Indonesia'
  },
  {
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&auto=format&fit=crop&q=80',
    title: 'Puncak Cakrawala & Mentari Pagi',
    location: 'Pegunungan Indonesia'
  }
];

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slideshow auto-advance every 6.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SCENIC_WALLPAPERS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const res = authService.login(username.trim(), password);
      setIsLoading(false);
      if (res.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(res.error || 'Username atau kata sandi tidak sesuai. Silakan coba lagi.');
      }
    }, 350);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between font-sans select-none bg-slate-950">
      {/* 1. BACKGROUND SLIDESHOW PEMANDANGAN DENGAN FILTER COOL-TONED */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {SCENIC_WALLPAPERS.map((wallpaper, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={wallpaper.url}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              } transition-transform duration-7000 ease-out`}
              style={{ backgroundImage: `url(${wallpaper.url})` }}
            />
          );
        })}

        {/* Ambient Cool-Toned Gradient Overlay (Cold Deep Navy / Cyan Fog) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-sky-950/70 backdrop-blur-[2px]" />
        
        {/* Subtle Ambient Aurora Light Spots */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. TOP BRAND BAR (ANIMATED GLIDE-IN) */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-3">
          <AnimatedStarLogo size="sm" showRays={false} />
          <div>
            <h2 className="font-extrabold text-white text-sm sm:text-base tracking-tight leading-tight drop-shadow-xs">
              7 Kebiasaan Anak Indonesia Hebat
            </h2>
            <p className="text-[10px] sm:text-[11px] text-cyan-300/90 font-medium drop-shadow-2xs">
              Pendidikan Karakter &bull; Terhubung Google Drive Sekolah
            </p>
          </div>
        </div>

        {/* Wallpaper Indicator Badge (Cool Frosted Pill) */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md border border-cyan-500/20 text-cyan-200/90 text-[11px] font-semibold shadow-xs">
          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>{SCENIC_WALLPAPERS[currentSlide].title}</span>
        </div>
      </header>

      {/* 3. MAIN LOGIN FORM CARD (NUANSA DINGIN & GLASSMORPHISM MODERN) */}
      <main className="relative z-20 max-w-md w-full mx-auto px-4 my-auto py-4 animate-in fade-in zoom-in-95 slide-in-from-bottom-6 duration-700 ease-out">
        <div className="bg-slate-950/65 sm:bg-slate-950/75 backdrop-blur-2xl rounded-3xl border border-cyan-400/30 shadow-2xl shadow-cyan-950/80 ring-1 ring-cyan-300/20 text-white relative overflow-hidden transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_12px_45px_rgba(6,182,212,0.22)]">
          {/* Ambient Corner Orbs for Cold Glow */}
          <div className="absolute -top-14 -right-14 w-44 h-44 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -bottom-14 -left-14 w-44 h-44 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header Kartu Bernuansa Dingin (Cold Cyan / Deep Ice Navy) */}
          <div className="p-6 sm:p-7 bg-gradient-to-b from-cyan-950/80 via-slate-900/70 to-transparent text-white text-center relative overflow-hidden border-b border-cyan-500/20 backdrop-blur-md">
            <div className="relative z-10 flex flex-col items-center">
              {/* Star Mascot with Floating Physics Animation */}
              <div className="mb-3 animate-float-slow">
                <AnimatedStarLogo size="md" showRays={true} />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 mb-2 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest shadow-2xs">
                <Sparkles className="w-3 h-3 fill-cyan-300 text-cyan-300" />
                <span>Pendidikan Karakter Siswa</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-md">
                Masuk ke Akun Anda
              </h3>
              <p className="text-xs text-cyan-100/80 font-medium mt-1 max-w-xs leading-relaxed drop-shadow-2xs">
                Membangun generasi cerdas, mandiri, dan berakhlak mulia.
              </p>
            </div>
          </div>

          {/* Form Body dengan Input Nuansa Dingin */}
          <div className="p-6 sm:p-7 space-y-4 relative z-10">
            {errorMsg && (
              <div className="p-3 bg-rose-950/70 border border-rose-500/50 rounded-xl text-xs text-rose-200 flex items-center gap-2 animate-shake backdrop-blur-md shadow-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span className="font-semibold">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div>
                <label className="block text-xs font-bold text-cyan-100 mb-1.5 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Username Pengguna:</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username akun Anda"
                    className="w-full text-xs sm:text-sm rounded-xl border border-cyan-500/30 py-3 px-3.5 bg-slate-900/70 backdrop-blur-md text-white placeholder:text-slate-400 font-medium focus:bg-slate-900/90 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 focus:outline-hidden transition-all shadow-inner"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-cyan-100 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Kata Sandi (Password):</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full text-xs sm:text-sm rounded-xl border border-cyan-500/30 py-3 pl-3.5 pr-10 bg-slate-900/70 backdrop-blur-md text-white placeholder:text-slate-400 font-medium focus:bg-slate-900/90 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 focus:outline-hidden transition-all shadow-inner"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-300/70 hover:text-cyan-200 transition-colors p-1 cursor-pointer"
                    title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button (Cool Gradient with Shimmer Hover Sweep) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white font-black text-sm rounded-xl shadow-lg shadow-cyan-950/70 hover:shadow-cyan-500/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer border border-cyan-400/40 relative overflow-hidden group"
              >
                {/* Dynamic Light Shimmer Sweep */}
                <div
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none opacity-25"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)'
                  }}
                />

                {isLoading ? (
                  <span className="flex items-center gap-2 relative z-10">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memeriksa Kredensial...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2 relative z-10">
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </form>

            {/* Catatan Keamanan Akun Sekolah Resmi */}
            <div className="pt-3 border-t border-cyan-500/20 text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-cyan-300 text-xs font-bold">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>Portal Resmi 7 Kebiasaan Siswa Hebat</span>
              </div>
              <p className="text-[11px] text-cyan-100/75 leading-relaxed max-w-xs mx-auto">
                Silakan masuk menggunakan username dan kata sandi yang telah didaftarkan oleh sekolah.
              </p>
              <div className="pt-1.5 border-t border-slate-800/80">
                <p className="text-[10px] text-slate-400">
                  Login Awal Administrator: <span className="text-cyan-300 font-mono bg-slate-900/90 px-1 py-0.5 rounded border border-cyan-500/30">admin</span> / <span className="text-cyan-300 font-mono bg-slate-900/90 px-1 py-0.5 rounded border border-cyan-500/30">password123</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 4. FOOTER & SLIDESHOW DOTS */}
      <footer className="relative z-20 w-full max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 animate-in fade-in duration-700">
        <p className="text-[11px] text-center sm:text-left drop-shadow-xs text-slate-300">
          &copy; 2026 Aplikasi 7 Kebiasaan Anak Indonesia Hebat &bull; Terhubung Google Drive Sekolah
        </p>

        {/* Slide navigation dots */}
        <div className="flex items-center gap-1.5 bg-slate-900/70 px-2.5 py-1 rounded-full border border-cyan-500/20 backdrop-blur-md shadow-xs">
          {SCENIC_WALLPAPERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentSlide
                  ? 'bg-cyan-400 w-5 shadow-xs'
                  : 'bg-white/30 hover:bg-white/60 w-2'
              }`}
              title={`Pemandangan ${idx + 1}`}
            />
          ))}
        </div>
      </footer>
    </div>
  );
};
