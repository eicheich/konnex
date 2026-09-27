// src/components/Header.tsx
import React, { useState } from 'react';
import { User } from '../types';
import { 
  Sparkles, 
  Code2, 
  SlidersHorizontal, 
  Calendar, 
  Coins, 
  Globe2, 
  ChevronDown, 
  UserCheck, 
  LogOut, 
  LogIn, 
  UserPlus,
  Home,
  Info,
  Award,
  User as UserIcon
} from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  allUsers: User[];
  activeView: 'dashboard' | 'about' | 'login' | 'register' | 'profile';
  onNavigate: (view: 'dashboard' | 'about' | 'login' | 'register' | 'profile') => void;
  onSwitchUser: (userId: string) => void;
  pendingCount: number;
  onOpenLedger: () => void;
  onOpenSessions: () => void;
  onOpenCodeInspector: () => void;
  onOpenSdg: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allUsers,
  activeView,
  onNavigate,
  onSwitchUser,
  pendingCount,
  onOpenLedger,
  onOpenSessions,
  onOpenCodeInspector,
  onOpenSdg,
  onLogout,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Navigation */}
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            onClick={() => onNavigate('dashboard')}
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-900 text-amber-400 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
              <Coins className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-lg tracking-tight text-zinc-900">
                  konnex
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/80">
                  time-bank
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 hidden sm:block font-medium">
                micro-skill swap platform
              </p>
            </div>
          </div>

          {/* Primary Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-zinc-200">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeView === 'dashboard'
                  ? 'bg-zinc-100 text-zinc-900 font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Jelajahi Sesi</span>
            </button>

            <button
              onClick={() => onNavigate('about')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeView === 'about'
                  ? 'bg-zinc-100 text-zinc-900 font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Tentang Konnex</span>
            </button>

            {currentUser && (
              <>
                <button
                  onClick={() => onNavigate('profile')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeView === 'profile'
                      ? 'bg-zinc-100 text-zinc-900 font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Profil & Badge</span>
                </button>

                <button
                  onClick={onOpenSessions}
                  className="relative px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Sesi Barter</span>
                  {pendingCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ml-0.5">
                      {pendingCount}
                    </span>
                  )}
                </button>
              </>
            )}

            <button
              onClick={onOpenCodeInspector}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors flex items-center gap-1.5"
              title="Lihat Prisma Schema dan Neon Database Configuration"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Prisma & API</span>
            </button>
          </nav>
        </div>

        {/* Right Section: Wallet Balance & User Authentication Dropdown */}
        <div className="flex items-center gap-2.5">
          
          {currentUser ? (
            <>
              {/* Wallet Balance Pill */}
              <button
                onClick={onOpenLedger}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-amber-900 transition-all text-xs font-semibold shadow-xs"
                title="Buka buku besar transaksi token"
              >
                <Coins className="w-4 h-4 text-amber-600" />
                <span>
                  <strong className="font-bold text-sm text-amber-950">{currentUser.token_balance}</strong> Token
                </span>
              </button>

              {/* User Dropdown Selector */}
              <div className="relative">
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl px-2.5 py-1 text-xs cursor-pointer select-none transition-colors"
                >
                  <span className="w-6 h-6 rounded-lg bg-zinc-200 flex items-center justify-center text-sm mr-2 shrink-0">
                    {currentUser.avatar}
                  </span>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-medium text-zinc-400 uppercase tracking-wider leading-none">
                      Akun
                    </span>
                    <span className="font-semibold text-xs text-zinc-800 pr-1 py-0.5 max-w-[80px] sm:max-w-[110px] truncate">
                      @{currentUser.username}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white border border-zinc-200 rounded-xl shadow-lg py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-zinc-100">
                      <p className="font-semibold text-zinc-900">{currentUser.name}</p>
                      <p className="text-[11px] text-zinc-500">{currentUser.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onNavigate('profile');
                        }}
                        className="w-full text-left px-3 py-1.5 text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>Halaman Profil & Badge</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onOpenLedger();
                        }}
                        className="w-full text-left px-3 py-1.5 text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                      >
                        <Coins className="w-3.5 h-3.5 text-amber-500" />
                        <span>Buku Besar Token ({currentUser.token_balance})</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onOpenSessions();
                        }}
                        className="w-full text-left px-3 py-1.5 text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                      >
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Manajemen Sesi Barter</span>
                      </button>
                    </div>

                    {/* Switch to other demo users */}
                    <div className="border-t border-zinc-100 py-1">
                      <div className="px-3 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                        Ganti Akun Komunitas:
                      </div>
                      {allUsers
                        .filter((u) => u.id !== currentUser.id)
                        .slice(0, 4)
                        .map((u) => (
                          <button
                            key={u.id}
                            onClick={() => {
                              setIsDropdownOpen(false);
                              onSwitchUser(u.id);
                            }}
                            className="w-full text-left px-3 py-1.5 text-zinc-600 hover:bg-zinc-50 flex items-center justify-between"
                          >
                            <span className="flex items-center gap-1.5">
                              <span>{u.avatar}</span>
                              <span className="truncate">@{u.username}</span>
                            </span>
                            <span className="text-[10px] text-zinc-400 font-medium">
                              {u.token_balance} 🪙
                            </span>
                          </button>
                        ))}
                    </div>

                    <div className="border-t border-zinc-100 pt-1">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-1.5 text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Keluar Akun</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('login')}
                className="btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </button>

              <button
                onClick={() => onNavigate('register')}
                className="btn-primary text-xs flex items-center gap-1.5 py-1.5 px-3"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Daftar (+2 Token)</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
