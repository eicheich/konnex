// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { User } from '../types';
import { Coins, ArrowRight, ShieldCheck, Lock, Mail, Eye, EyeOff, UserCheck, Sparkles } from 'lucide-react';

interface LoginPageProps {
  allUsers: User[];
  onLoginSuccess: (userId: string) => void;
  onGoToRegister: () => void;
  onGoToAbout: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  allUsers,
  onLoginSuccess,
  onGoToRegister,
  onGoToAbout,
}) => {
  const [selectedDemoUser, setSelectedDemoUser] = useState<string>(allUsers[0]?.id || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(true);

  const handleDemoLogin = (userId: string) => {
    onLoginSuccess(userId);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Silakan masukkan alamat email Anda.');
      return;
    }
    if (!password.trim()) {
      setError('Silakan masukkan kata sandi Anda.');
      return;
    }

    // Match with existing users by email or username
    const matched = allUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() || u.username.toLowerCase() === email.trim().toLowerCase()
    );

    if (matched) {
      onLoginSuccess(matched.id);
    } else {
      // Pick first demo user as fallback for mock login
      onLoginSuccess(allUsers[0].id);
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 sm:py-10">
      <div className="card-classy p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-amber-400 mx-auto flex items-center justify-center font-bold shadow-xs">
            <Coins className="w-6 h-6 text-amber-300" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-zinc-900 tracking-tight">
            Masuk ke Konnex
          </h1>
          <p className="text-xs text-zinc-500">
            Akses dompet waktu dan mulai sesi barter keahlian Anda
          </p>
        </div>

        {/* Mode Toggle (Pilih Akun Demo vs Form Login) */}
        <div className="flex rounded-xl bg-zinc-100 p-1 text-xs">
          <button
            type="button"
            onClick={() => setIsDemoMode(true)}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
              isDemoMode
                ? 'bg-white text-zinc-900 font-semibold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Pilih Akun Komunitas Demo
          </button>
          <button
            type="button"
            onClick={() => setIsDemoMode(false)}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
              !isDemoMode
                ? 'bg-white text-zinc-900 font-semibold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Email & Kata Sandi
          </button>
        </div>

        {isDemoMode ? (
          /* Quick Demo Account Selector */
          <div className="space-y-3">
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Pilih Profil Komunitas untuk Masuk:
            </label>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {allUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleDemoLogin(user.id)}
                  className="p-3 rounded-xl border border-zinc-200 hover:border-zinc-400 bg-white hover:bg-zinc-50/80 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-lg shrink-0">
                      {user.avatar}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-zinc-900 truncate">
                          {user.name}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          @{user.username}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                        Ajarkan: {user.skills_offered.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200/60">
                      {user.token_balance} Token
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-center text-zinc-500 pt-1">
              Klik salah satu akun di atas untuk langsung masuk ke dashboard secara instan.
            </p>
          </div>
        ) : (
          /* Standard Email/Password Form */
          <form onSubmit={handleCustomLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-700 font-semibold mb-1">
                Alamat Email atau Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="nama@email.com atau @username"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-zinc-700 font-semibold">
                  Kata Sandi
                </label>
                <span className="text-[11px] text-zinc-500 cursor-pointer hover:underline">
                  Lupa sandi?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full pl-9 pr-10 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full btn-primary text-xs py-2.5 flex items-center justify-center gap-1.5"
            >
              <span>Masuk Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Footer links */}
        <div className="pt-4 border-t border-zinc-100 text-center text-xs text-zinc-500 space-y-2">
          <p>
            Belum memiliki akun?{' '}
            <button
              onClick={onGoToRegister}
              className="font-semibold text-zinc-900 hover:underline"
            >
              Daftar akun baru (+2 Token Gratis)
            </button>
          </p>

          <p>
            <button
              onClick={onGoToAbout}
              className="text-zinc-500 hover:text-zinc-900 hover:underline text-[11px]"
            >
              Pelajari cara kerja sistem barter Konnex
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};
