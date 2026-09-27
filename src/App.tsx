// src/App.tsx
import React, { useState, useEffect } from 'react';
import { User, Session, TransactionLedger, Badge } from './types';
import {
  loadStoredState,
  saveStoredState,
  fireConfetti,
  INITIAL_USERS,
  INITIAL_SESSIONS,
  INITIAL_LEDGER,
} from './services/store';
import { calculateUserBadges } from './services/badges';

// Components & Modals
import { Header } from './components/Header';
import { WalletCard } from './components/WalletCard';
import { ActivityWidget } from './components/ActivityWidget';
import { SmartMatchesFeed } from './components/SmartMatchesFeed';
import { BookingModal } from './components/BookingModal';
import { SessionManagerModal } from './components/SessionManagerModal';
import { LedgerModal } from './components/LedgerModal';
import { ProfileEditModal } from './components/ProfileEditModal';
import { CodeInspectorModal } from './components/CodeInspectorModal';
import { SdgBanner } from './components/SdgBanner';
import { BadgeUnlockedModal } from './components/BadgeUnlockedModal';

// Pages
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';

import { Sparkles, ShieldCheck, RefreshCw, Terminal, CheckCircle2, ArrowRight } from 'lucide-react';

export default function App() {
  const [state, setState] = useState(() => loadStoredState());
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle?: string } | null>(null);

  // Active View: 'dashboard' | 'about' | 'login' | 'register' | 'profile'
  const [activeView, setActiveView] = useState<'dashboard' | 'about' | 'login' | 'register' | 'profile'>('dashboard');

  // Active Modals
  const [bookingTarget, setBookingTarget] = useState<{ user: User; skill?: string } | null>(null);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSessionsOpen, setIsSessionsOpen] = useState(false);
  const [isCodeInspectorOpen, setIsCodeInspectorOpen] = useState(false);
  const [isSdgOpen, setIsSdgOpen] = useState(false);

  // Badge celebration popup
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<Badge | null>(null);

  // Persist state to local storage on changes
  useEffect(() => {
    saveStoredState(state);
  }, [state]);

  const currentUser = state.users.find((u) => u.id === state.currentUserId) || null;

  const showToast = (title: string, subtitle?: string) => {
    setToastMessage({ title, subtitle });
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Switch Active User
  const handleSwitchUser = (userId: string) => {
    setState((prev) => ({
      ...prev,
      currentUserId: userId,
    }));
    const target = state.users.find((u) => u.id === userId);
    showToast(`Beralih ke akun @${target?.username}`, `Saldo dompet: ${target?.token_balance} token`);
  };

  // Handle Login
  const handleLoginSuccess = (userId: string) => {
    setState((prev) => ({
      ...prev,
      currentUserId: userId,
    }));
    const user = state.users.find((u) => u.id === userId);
    setActiveView('dashboard');
    showToast(`Selamat datang kembali, ${user?.name}! 👋`, `Saldo: ${user?.token_balance} Token Waktu`);
  };

  // Handle Register
  const handleRegisterSuccess = (newUser: User) => {
    const welcomeLedgerEntry: TransactionLedger = {
      id: `tx_welcome_${Date.now()}`,
      amount: 2,
      type: 'INITIAL_GRANT',
      description: 'Hibah selamat datang komunitas Konnex (SDG 4 & 10) 🎁',
      senderId: 'system',
      senderName: 'Konnex Foundation',
      senderUsername: 'konnex',
      receiverId: newUser.id,
      receiverName: newUser.name,
      receiverUsername: newUser.username,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      users: [newUser, ...prev.users],
      currentUserId: newUser.id,
      ledger: [welcomeLedgerEntry, ...prev.ledger],
    }));

    setActiveView('dashboard');
    showToast(`Akun berhasil dibuat! Selamat datang @${newUser.username} ✨`, '+2 Token Waktu telah dikreditkan ke dompet Anda.');
  };

  // Handle Logout
  const handleLogout = () => {
    setState((prev) => ({
      ...prev,
      currentUserId: '',
    }));
    setActiveView('login');
    showToast('Berhasil keluar akun', 'Silakan masuk kembali untuk melanjutkan barter.');
  };

  // Handle Profile Update
  const handleSaveProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === currentUser.id ? { ...u, ...updated } : u)),
    }));
    showToast('Profil berhasil diperbarui', 'Keahlian dan biodata Anda telah diperbarui.');
  };

  // 1. Booking Flow
  const handleBookingSubmit = (mentorId: string, skill: string, topic: string, notes: string) => {
    if (!currentUser) {
      setActiveView('login');
      return;
    }

    const mentor = state.users.find((u) => u.id === mentorId);
    if (!mentor) return;

    const newSession: Session = {
      id: `session_${Date.now()}`,
      topic,
      skill,
      notes: notes || undefined,
      status: 'PENDING',
      scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(),
      durationMinutes: 60,
      tokenAmount: 1,
      learnerId: currentUser.id,
      learnerName: currentUser.name,
      learnerUsername: currentUser.username,
      learnerAvatar: currentUser.avatar,
      mentorId: mentor.id,
      mentorName: mentor.name,
      mentorUsername: mentor.username,
      mentorAvatar: mentor.avatar,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      sessions: [newSession, ...prev.sessions],
    }));

    showToast(`Permintaan sesi terkirim ke @${mentor.username}`, `Status: Menunggu persetujuan`);
  };

  // 2. Accept Session
  const handleAcceptSession = (sessionId: string) => {
    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) =>
        s.id === sessionId ? { ...s, status: 'ACCEPTED' as const } : s
      ),
    }));
    showToast('Permintaan sesi disetujui', 'Jadwalkan pertemuan 60 menit bersama partner.');
  };

  // 3. Decline Session
  const handleDeclineSession = (sessionId: string) => {
    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) =>
        s.id === sessionId ? { ...s, status: 'CANCELLED' as const } : s
      ),
    }));
    showToast('Sesi dibatalkan', 'Permintaan barter tidak dilanjutkan.');
  };

  // 4. Complete Session & Safe Token Transfer Transaction (Core Ledger Flow)
  const handleCompleteSession = (sessionId: string) => {
    const session = state.sessions.find((s) => s.id === sessionId);
    if (!session) return;

    if (session.status === 'COMPLETED') {
      showToast('Sesi sudah selesai', 'Transaksi token sudah tercatat sebelumnya.');
      return;
    }

    const learner = state.users.find((u) => u.id === session.learnerId);
    const mentor = state.users.find((u) => u.id === session.mentorId);

    if (!learner || !mentor) {
      showToast('Data pengguna tidak ditemukan');
      return;
    }

    const tokenAmount = session.tokenAmount || 1;

    if (learner.token_balance < tokenAmount) {
      showToast(
        'Saldo token pembelajar tidak mencukupi',
        `@${learner.username} hanya memiliki ${learner.token_balance} token.`
      );
      return;
    }

    // Previous badges state to check for newly unlocked
    const prevBadges = currentUser ? calculateUserBadges(currentUser, state.sessions, state.ledger) : [];

    // Atomic transaction simulation matching Prisma $transaction
    const newTx: TransactionLedger = {
      id: `tx_${Date.now()}`,
      amount: tokenAmount,
      type: 'SWAP_TRANSFER',
      description: `Sesi barter 1 jam selesai: ${session.skill} (${session.topic})`,
      senderId: learner.id,
      senderName: learner.name,
      senderUsername: learner.username,
      receiverId: mentor.id,
      receiverName: mentor.name,
      receiverUsername: mentor.username,
      sessionId: session.id,
      createdAt: new Date().toISOString(),
    };

    const updatedSessions = state.sessions.map((s) =>
      s.id === sessionId
        ? {
            ...s,
            status: 'COMPLETED' as const,
            completedAt: new Date().toISOString(),
          }
        : s
    );

    const updatedLedger = [newTx, ...state.ledger];

    const updatedUsers = state.users.map((u) => {
      if (u.id === learner.id) {
        return {
          ...u,
          token_balance: u.token_balance - tokenAmount,
          total_swaps: u.total_swaps + 1,
        };
      }
      if (u.id === mentor.id) {
        return {
          ...u,
          token_balance: u.token_balance + tokenAmount,
          total_swaps: u.total_swaps + 1,
        };
      }
      return u;
    });

    setState((prev) => ({
      ...prev,
      users: updatedUsers,
      sessions: updatedSessions,
      ledger: updatedLedger,
    }));

    fireConfetti();
    showToast(
      'Sesi barter selesai & 1 token berhasil ditransfer',
      `@${learner.username} (-1 token) ➔ @${mentor.username} (+1 token)`
    );

    // Check if new badge unlocked for current user
    if (currentUser) {
      const updatedCurrentUser = updatedUsers.find((u) => u.id === currentUser.id) || currentUser;
      const newBadges = calculateUserBadges(updatedCurrentUser, updatedSessions, updatedLedger);
      
      const unlockedNow = newBadges.find((nb) => {
        const wasUnlocked = prevBadges.find((pb) => pb.id === nb.id)?.isUnlocked;
        return nb.isUnlocked && !wasUnlocked;
      });

      if (unlockedNow) {
        setTimeout(() => {
          setNewlyUnlockedBadge(unlockedNow);
        }, 600);
      } else if (updatedCurrentUser.total_swaps === 1) {
        // Fallback for first transaction badge celebration
        const firstTxBadge = newBadges.find((b) => b.id === 'first_transaction');
        if (firstTxBadge) {
          setTimeout(() => {
            setNewlyUnlockedBadge(firstTxBadge);
          }, 600);
        }
      }
    }
  };

  // Reset demo
  const handleResetData = () => {
    setState({
      currentUserId: 'user_kia',
      users: INITIAL_USERS,
      sessions: INITIAL_SESSIONS,
      ledger: INITIAL_LEDGER,
    });
    showToast('Data demo dipulihkan', 'Semua profil dan sesi kembali ke kondisi awal.');
  };

  const pendingRequestsCount = currentUser
    ? state.sessions.filter(
        (s) => s.mentorId === currentUser.id && s.status === 'PENDING'
      ).length
    : 0;

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-zinc-900 flex flex-col font-sans">
      
      {/* Clean Modern Navbar */}
      <Header
        currentUser={currentUser}
        allUsers={state.users}
        activeView={activeView}
        onNavigate={setActiveView}
        onSwitchUser={handleSwitchUser}
        pendingCount={pendingRequestsCount}
        onOpenLedger={() => setIsLedgerOpen(true)}
        onOpenSessions={() => setIsSessionsOpen(true)}
        onOpenCodeInspector={() => setIsCodeInspectorOpen(true)}
        onOpenSdg={() => setIsSdgOpen(true)}
        onLogout={handleLogout}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="bg-zinc-900 text-white rounded-xl py-3 px-4 shadow-lg flex items-start gap-2.5 max-w-sm border border-zinc-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold leading-tight">
                {toastMessage.title}
              </p>
              {toastMessage.subtitle && (
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-normal">
                  {toastMessage.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 space-y-7">
        
        {/* VIEW 1: ABOUT PAGE */}
        {activeView === 'about' && (
          <AboutPage
            onGoToDashboard={() => setActiveView('dashboard')}
            onGoToRegister={() => setActiveView('register')}
            onOpenCodeInspector={() => setIsCodeInspectorOpen(true)}
          />
        )}

        {/* VIEW 2: LOGIN PAGE */}
        {activeView === 'login' && (
          <LoginPage
            allUsers={state.users}
            onLoginSuccess={handleLoginSuccess}
            onGoToRegister={() => setActiveView('register')}
            onGoToAbout={() => setActiveView('about')}
          />
        )}

        {/* VIEW 3: REGISTER PAGE */}
        {activeView === 'register' && (
          <RegisterPage
            onRegisterSuccess={handleRegisterSuccess}
            onGoToLogin={() => setActiveView('login')}
            onGoToAbout={() => setActiveView('about')}
          />
        )}

        {/* VIEW 4: PROFILE PAGE & BADGE SHOWCASE */}
        {activeView === 'profile' && currentUser && (
          <ProfilePage
            currentUser={currentUser}
            sessions={state.sessions}
            ledger={state.ledger}
            onUpdateProfile={handleSaveProfile}
            onOpenLedger={() => setIsLedgerOpen(true)}
            onOpenSessions={() => setIsSessionsOpen(true)}
            onGoToDashboard={() => setActiveView('dashboard')}
          />
        )}

        {/* VIEW 5: MAIN DASHBOARD & EXPLORE */}
        {activeView === 'dashboard' && currentUser && (
          <>
            {/* Hero Greeting Card */}
            <section className="card-classy p-6 sm:p-7 relative overflow-hidden bg-gradient-to-r from-white via-white to-amber-50/40">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 text-xs text-zinc-500 font-medium">
                    <span>Selamat datang kembali, <strong>{currentUser.name}</strong></span>
                    <span>·</span>
                    <span className="text-zinc-400">@{currentUser.username}</span>
                  </div>

                  <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 leading-snug">
                    Tukar keahlian, perluas wawasan, tanpa uang tunai.
                  </h1>

                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                    Konnex adalah ekosistem barter keahlian berbasis token waktu (SDG 4 & 10). Setiap 1 jam sesi mengajar yang Anda berikan menghasilkan 1 token untuk mempelajari keahlian apa pun dari komunitas.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
                  <button
                    onClick={() => setActiveView('profile')}
                    className="btn-primary text-xs"
                  >
                    Profil & Badge Saya
                  </button>
                  <button
                    onClick={() => setActiveView('about')}
                    className="btn-secondary text-xs"
                  >
                    Tentang Konnex
                  </button>
                </div>
              </div>
            </section>

            {/* Dashboard Row 1: Wallet Card + Activity Widget */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Wallet Balance Card (7 cols) */}
              <div className="lg:col-span-7 flex">
                <div className="w-full">
                  <WalletCard
                    currentUser={currentUser}
                    recentLedger={state.ledger}
                    onOpenLedger={() => setIsLedgerOpen(true)}
                    onEarnMoreHelp={() => setActiveView('about')}
                  />
                </div>
              </div>

              {/* Activity Widget (5 cols) */}
              <div className="lg:col-span-5 flex">
                <div className="w-full">
                  <ActivityWidget
                    currentUser={currentUser}
                    sessions={state.sessions}
                    onAcceptSession={handleAcceptSession}
                    onDeclineSession={handleDeclineSession}
                    onCompleteSession={handleCompleteSession}
                    onViewAllSessions={() => setIsSessionsOpen(true)}
                  />
                </div>
              </div>
            </div>

            {/* Dashboard Row 2: Smart Matches & Explore Feed */}
            <section className="pt-2">
              <SmartMatchesFeed
                currentUser={currentUser}
                allUsers={state.users}
                onOpenBooking={(targetUser, skill) => setBookingTarget({ user: targetUser, skill })}
                onOpenProfile={() => setActiveView('profile')}
              />
            </section>
          </>
        )}

        {/* Fallback if logged out on dashboard or profile */}
        {(activeView === 'dashboard' || activeView === 'profile') && !currentUser && (
          <div className="card-classy p-8 text-center space-y-4 max-w-lg mx-auto my-12">
            <h2 className="font-heading font-bold text-xl text-zinc-900">
              Silakan Masuk untuk Mengakses Halaman Ini
            </h2>
            <p className="text-xs text-zinc-500">
              Masuk dengan akun komunitas demo atau daftar baru untuk mengklaim 2 Token Waktu gratis.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveView('login')}
                className="btn-primary text-xs"
              >
                Masuk ke Akun
              </button>
              <button
                onClick={() => setActiveView('register')}
                className="btn-secondary text-xs"
              >
                Daftar Baru
              </button>
            </div>
          </div>
        )}

        {/* Developer / Architecture Footer Strip */}
        <section className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-200/80 text-zinc-700 flex items-center justify-center font-bold text-xs">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold text-zinc-800">Spesifikasi Full-Stack:</span>{' '}
              <span className="text-zinc-500">Prisma Schema, Neon Serverless PostgreSQL, dan sistem badge reputasi.</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCodeInspectorOpen(true)}
              className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 underline decoration-zinc-300"
            >
              Lihat Schema & API
            </button>
            <span className="text-zinc-300">·</span>
            <button
              onClick={handleResetData}
              className="text-xs text-zinc-500 hover:text-zinc-800 flex items-center gap-1"
              title="Reset data demo ke awal"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Demo</span>
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/80 bg-white px-4 md:px-8 py-5 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <div>
            <span className="font-semibold text-zinc-800">Konnex</span> — Platform Barter Keahlian Berbasis Waktu (SDG 4 & 10).
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveView('about')} className="hover:text-zinc-900 transition-colors">
              Tentang Konnex
            </button>
            {currentUser && (
              <button onClick={() => setActiveView('profile')} className="hover:text-zinc-900 transition-colors">
                Koleksi Badge
              </button>
            )}
            <button onClick={() => setIsLedgerOpen(true)} className="hover:text-zinc-900 transition-colors">
              Buku Besar
            </button>
            <button onClick={() => setIsCodeInspectorOpen(true)} className="hover:text-zinc-900 transition-colors">
              Prisma ORM
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {currentUser && (
        <>
          <BookingModal
            isOpen={!!bookingTarget}
            onClose={() => setBookingTarget(null)}
            mentor={bookingTarget?.user || null}
            currentUser={currentUser}
            preselectedSkill={bookingTarget?.skill}
            onSubmitBooking={handleBookingSubmit}
          />

          <SessionManagerModal
            isOpen={isSessionsOpen}
            onClose={() => setIsSessionsOpen(false)}
            currentUser={currentUser}
            sessions={state.sessions}
            onAccept={handleAcceptSession}
            onDecline={handleDeclineSession}
            onComplete={handleCompleteSession}
          />

          <LedgerModal
            isOpen={isLedgerOpen}
            onClose={() => setIsLedgerOpen(false)}
            currentUser={currentUser}
            ledger={state.ledger}
          />

          <ProfileEditModal
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            currentUser={currentUser}
            onSaveProfile={handleSaveProfile}
          />

          <BadgeUnlockedModal
            badge={newlyUnlockedBadge}
            onClose={() => setNewlyUnlockedBadge(null)}
            onViewAllBadges={() => {
              setNewlyUnlockedBadge(null);
              setActiveView('profile');
            }}
          />
        </>
      )}

      <CodeInspectorModal
        isOpen={isCodeInspectorOpen}
        onClose={() => setIsCodeInspectorOpen(false)}
        currentUser={currentUser || state.users[0]}
        sessions={state.sessions}
      />

      <SdgBanner
        isOpen={isSdgOpen}
        onClose={() => setIsSdgOpen(false)}
        onOpenProfile={() => setActiveView('profile')}
      />

    </div>
  );
}
