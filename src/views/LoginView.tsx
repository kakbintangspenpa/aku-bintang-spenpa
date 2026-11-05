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
  CheckCircle2,
  Image as ImageIcon
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
  const [username, setUsername] = useState('siswa.bintang');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Background Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Intro Animation State: 'intro' -> 'form_ready'
  const [introStep, setIntroStep] = useState<'intro' | 'form_ready'>('intro');

  // Slideshow auto-advance every 6.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SCENIC_WALLPAPERS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  // Intro auto-transition to form after 2.4 seconds
  useEffect(() => {
    const introTimer = setTimeout(() => {
      setIntroStep('form_ready');
    }, 2400);
    return () => clearTimeout(introTimer);
  }, []);

  const handleSkipIntro = () => {
    setIntroStep('form_ready');
  };

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
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between font-sans select-none">
      {/* 1. BACKGROUND SLIDESHOW PEMANDANGAN */}
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

        {/* Cinematic Backdrop Gradient Overlay (Deep Contrast for High Readability) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-slate-950/80 backdrop-blur-[1.5px]" />
      </div>

      {/* 2. INTRO ANIMATION SCREEN (Muncul sebelum kartu login terbuka) */}
      {introStep === 'intro' && (
        <div className="relative z-50 fixed inset-0 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
          <div className="max-w-md w-full flex flex-col items-center space-y-6">
            {/* Radiant Star Logo with Expanding Glow */}
            <div className="relative animate-bounce [animation-duration:2.5s]">
              <div className="absolute -inset-8 bg-amber-400/25 blur-3xl rounded-full animate-pulse" />
              <AnimatedStarLogo size="xl" showRays={true} />
            </div>

            {/* Title & Tagline with Reveal Animation */}
            <div className="space-y-2 text-white animate-in slide-in-from-bottom-4 duration-700">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-300 border border-amber-300/40 text-xs font-bold uppercase tracking-widest shadow-lg">
                <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
                Pendidikan Karakter
              </span>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
                7 Kebiasaan Anak Indonesia Hebat
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-sm mx-auto leading-relaxed">
                Membangun Generasi Cerdas, Mandiri, dan Berakhlak Mulia
              </p>
            </div>

            {/* Quick Skip Button */}
            <button
              onClick={handleSkipIntro}
              className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white/90 text-xs font-bold border border-white/25 backdrop-blur-md transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <span>Lanjut ke Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. TOP BRAND BAR (Hanya Menampilkan Logo Bintang & Nama Aplikasi) */}
      <header className={`relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between transition-all duration-700 ${
        introStep === 'form_ready' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div className="flex items-center gap-3">
          <AnimatedStarLogo size="sm" showRays={false} />
          <div>
            <h2 className="font-extrabold text-white text-sm sm:text-base tracking-tight leading-tight drop-shadow-xs">
              7 Kebiasaan Anak Indonesia Hebat
            </h2>
            <p className="text-[10px] sm:text-[11px] text-amber-200/90 font-medium drop-shadow-2xs">
              Pendidikan Karakter &bull; Terhubung Google Drive Sekolah
            </p>
          </div>
        </div>

        {/* Wallpaper Indicator Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/80 text-[11px] font-semibold">
          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>{SCENIC_WALLPAPERS[currentSlide].title}</span>
        </div>
      </header>

      {/* 4. MAIN LOGIN FORM CARD (Modern Transparent Glassmorphic Card) */}
      <main className={`relative z-20 max-w-md w-full mx-auto px-4 my-auto transition-all duration-700 ease-out ${
        introStep === 'form_ready' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
      }`}>
        <div className="bg-slate-900/40 sm:bg-slate-950/45 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/25 overflow-hidden shadow-black/60 ring-1 ring-white/10 text-white">
          {/* Header Kartu dengan Logo Bintang Ramah SMP */}
          <div className="p-6 bg-gradient-to-b from-red-600/75 via-rose-600/50 to-transparent text-white text-center relative overflow-hidden border-b border-white/10 backdrop-blur-sm">
            {/* Ambient Lighting Orbs */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-2">
                <AnimatedStarLogo size="md" showRays={true} />
              </div>
              <h3 className="text-xl font-extrabold tracking-tight text-white drop-shadow-sm">
                Masuk ke Akun Anda
              </h3>
              <p className="text-xs text-red-100/90 font-medium mt-1 max-w-xs leading-relaxed drop-shadow-2xs">
                Membangun generasi cerdas, mandiri, dan berakhlak mulia.
              </p>
            </div>
          </div>

          {/* Form Body dengan Input Transparan Glassmorphism */}
          <div className="p-6 sm:p-8 space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-950/70 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center gap-2 animate-in fade-in backdrop-blur-md">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span className="font-semibold">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div>
                <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5 drop-shadow-xs">
                  <UserIcon className="w-3.5 h-3.5 text-amber-300" />
                  <span>Username Pengguna:</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username akun Anda"
                    className="w-full text-xs sm:text-sm rounded-xl border border-white/25 py-3 px-3.5 bg-white/15 backdrop-blur-md text-white placeholder:text-slate-300 font-medium focus:bg-white/25 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-hidden transition-all shadow-inner"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5 drop-shadow-xs">
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span>Kata Sandi (Password):</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full text-xs sm:text-sm rounded-xl border border-white/25 py-3 pl-3.5 pr-10 bg-white/15 backdrop-blur-md text-white placeholder:text-slate-300 font-medium focus:bg-white/25 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-hidden transition-all shadow-inner"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-1"
                    title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 active:scale-[0.98] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer border border-white/20"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memeriksa Kredensial...</span>
                  </span>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Catatan Bantuan Hak Akses */}
            <div className="pt-3 text-center border-t border-white/15">
              <p className="text-[11px] text-slate-200/90 drop-shadow-xs">
                Gunakan akun resmi yang diberikan oleh pihak sekolah (Siswa, Guru, Orang Tua, atau Admin).
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 5. FOOTER & SLIDESHOW DOTS */}
      <footer className="relative z-20 w-full max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-2">
        <p className="text-[11px] text-center sm:text-left drop-shadow-xs text-white/80">
          &copy; 2026 Aplikasi 7 Kebiasaan Anak Indonesia Hebat &bull; Terhubung Google Drive Sekolah
        </p>

        {/* Slide navigation dots */}
        <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
          {SCENIC_WALLPAPERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                idx === currentSlide
                  ? 'bg-amber-400 w-5'
                  : 'bg-white/40 hover:bg-white/70'
              }`}
              title={`Pemandangan ${idx + 1}`}
            />
          ))}
        </div>
      </footer>
    </div>
  );
};
