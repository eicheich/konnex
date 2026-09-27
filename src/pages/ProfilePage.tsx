// src/pages/ProfilePage.tsx
import React, { useState } from 'react';
import { User, Session, TransactionLedger, Badge } from '../types';
import { calculateUserBadges } from '../services/badges';
import { 
  Coins, 
  Star, 
  Calendar, 
  Award, 
  ShieldCheck, 
  SlidersHorizontal, 
  History, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Clock, 
  Plus, 
  X, 
  Edit3, 
  Check, 
  ArrowRight,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { fireConfetti } from '../services/store';

interface ProfilePageProps {
  currentUser: User;
  sessions: Session[];
  ledger: TransactionLedger[];
  onUpdateProfile: (updated: Partial<User>) => void;
  onOpenLedger: () => void;
  onOpenSessions: () => void;
  onGoToDashboard: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  sessions,
  ledger,
  onUpdateProfile,
  onOpenLedger,
  onOpenSessions,
  onGoToDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'edit'>('overview');
  const [badgeCategoryFilter, setBadgeCategoryFilter] = useState<'all' | 'transaksi' | 'edukasi' | 'reputasi' | 'komunitas'>('all');

  // Inline edit state
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [pronouns, setPronouns] = useState(currentUser.pronouns);
  const [vibeTag, setVibeTag] = useState(currentUser.vibeTag);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [skillsOffered, setSkillsOffered] = useState<string[]>([...currentUser.skills_offered]);
  const [skillsWanted, setSkillsWanted] = useState<string[]>([...currentUser.skills_wanted]);
  const [newOfferInput, setNewOfferInput] = useState('');
  const [newWantInput, setNewWantInput] = useState('');
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  // Calculate dynamic badges
  const badges = calculateUserBadges(currentUser, sessions, ledger);
  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  const userSessions = sessions.filter(
    (s) => s.learnerId === currentUser.id || s.mentorId === currentUser.id
  );
  const completedSessions = userSessions.filter((s) => s.status === 'COMPLETED');
  const hoursShared = completedSessions.length * 1; // 1 hr per session

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: name.trim(),
      bio: bio.trim(),
      pronouns: pronouns.trim(),
      vibeTag: vibeTag.trim(),
      avatar: avatar,
      skills_offered: skillsOffered,
      skills_wanted: skillsWanted,
    });
    fireConfetti();
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2500);
  };

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferInput.trim()) return;
    if (!skillsOffered.includes(newOfferInput.trim())) {
      setSkillsOffered([...skillsOffered, newOfferInput.trim()]);
    }
    setNewOfferInput('');
  };

  const handleAddWant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWantInput.trim()) return;
    if (!skillsWanted.includes(newWantInput.trim())) {
      setSkillsWanted([...skillsWanted, newWantInput.trim()]);
    }
    setNewWantInput('');
  };

  const filteredBadges = badges.filter((b) => {
    if (badgeCategoryFilter === 'all') return true;
    return b.category === badgeCategoryFilter;
  });

  const avatarOptions = ['🌸', '🌟', '🧶', '👾', '🦋', '🍵', '⚡', '☕', '🦊', '🎨', '🚀', '🌿'];

  return (
    <div className="space-y-7 py-2">
      
      {/* Profile Header Hero Card */}
      <section className="card-classy p-6 sm:p-8 bg-gradient-to-r from-white via-white to-amber-50/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-3xl sm:text-4xl shrink-0 shadow-xs">
              {currentUser.avatar}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading font-bold text-xl sm:text-2xl text-zinc-900 tracking-tight">
                  {currentUser.name}
                </h1>
                <span className="text-xs text-zinc-500 font-medium">
                  @{currentUser.username}
                </span>
                <span className="text-[11px] font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">
                  {currentUser.pronouns}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 max-w-xl font-normal leading-relaxed">
                "{currentUser.bio}"
              </p>

              <div className="flex items-center gap-3 pt-1 text-xs text-zinc-500 flex-wrap">
                <span className="inline-flex items-center gap-1 font-semibold text-zinc-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{currentUser.rating.toFixed(1)} Rating</span>
                </span>
                <span>·</span>
                <span>{currentUser.total_swaps} Sesi Barter</span>
                <span>·</span>
                <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{unlockedCount} / {badges.length} Badge Diraih</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Wallet Summary Card */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 p-4 rounded-xl bg-white border border-zinc-200 shrink-0 shadow-xs">
            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-semibold text-zinc-400 block tracking-wider">
                Saldo Dompet Waktu
              </span>
              <span className="font-heading font-bold text-2xl text-zinc-900">
                {currentUser.token_balance} <span className="text-xs font-normal text-zinc-500">Token</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenLedger}
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                title="Lihat mutasi token di buku besar"
              >
                <History className="w-3.5 h-3.5 text-zinc-500" />
                <span>Buku Besar</span>
              </button>
              <button
                onClick={() => setActiveTab('edit')}
                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profil</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-1.5 border-b border-zinc-200/80 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-zinc-900 text-white font-semibold'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          Ringkasan & Keahlian
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'badges'
              ? 'bg-zinc-900 text-white font-semibold'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Koleksi Badge ({unlockedCount}/{badges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('edit')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'edit'
              ? 'bg-zinc-900 text-white font-semibold'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Pengaturan & Keahlian</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Skills Display & Metrics (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Skills Offered Card */}
            <div className="card-classy p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base text-zinc-900 flex items-center gap-2">
                    <span>Keahlian yang Ditawarkan</span>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                      Anda Mengajar
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Anggota komunitas dapat memesan sesi 1 jam untuk mempelajari hal ini dari Anda.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('edit')}
                  className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:underline"
                >
                  + Tambah
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {currentUser.skills_offered.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-medium text-zinc-800 flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Skills Wanted Card */}
            <div className="card-classy p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base text-zinc-900 flex items-center gap-2">
                    <span>Keahlian yang Dicari</span>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
                      Anda Belajar
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Algoritma matchmaker akan memprioritaskan mentor yang menguasai materi ini.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('edit')}
                  className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:underline"
                >
                  + Tambah
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {currentUser.skills_wanted.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-800 flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Badges Highlight */}
            <div className="card-classy p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base text-zinc-900">
                    Badge Pencapaian Terbaru
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Lencana penghargaan atas kontribusi dan transaksi barter di Konnex
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('badges')}
                  className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:underline"
                >
                  Lihat Semua ({badges.length})
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {badges
                  .filter((b) => b.isUnlocked)
                  .slice(0, 4)
                  .map((badge) => (
                    <div
                      key={badge.id}
                      className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/40 flex items-center gap-3"
                    >
                      <span className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-xl shrink-0 shadow-xs">
                        {badge.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-zinc-900 truncate">
                            {badge.name}
                          </span>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        </div>
                        <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>

          {/* Right Column: Lifetime Stats & Quick Links (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Impact Metric Widget */}
            <div className="card-classy p-6 space-y-4">
              <h3 className="font-heading font-bold text-sm text-zinc-900">
                Statistik Waktu & Barter
              </h3>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-500" />
                    <span className="text-xs text-zinc-600">Total Waktu Barter</span>
                  </div>
                  <span className="font-heading font-bold text-sm text-zinc-900">
                    {hoursShared} Jam
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-zinc-500" />
                    <span className="text-xs text-zinc-600">Sesi Selesai</span>
                  </div>
                  <span className="font-heading font-bold text-sm text-zinc-900">
                    {currentUser.total_swaps} Sesi
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span className="text-xs text-zinc-600">Reputasi Komunitas</span>
                  </div>
                  <span className="font-heading font-bold text-sm text-zinc-900">
                    {currentUser.rating.toFixed(1)} / 5.0
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100">
                <button
                  onClick={onGoToDashboard}
                  className="w-full btn-primary text-xs flex items-center justify-center gap-1.5 py-2.5"
                >
                  <span>Cari Partner Barter Baru</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* SDG Commitment Card */}
            <div className="card-classy p-5 space-y-2 bg-gradient-to-br from-emerald-50/50 to-white border-emerald-200/70">
              <div className="flex items-center gap-2 text-emerald-900 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Anggota Bersertifikasi SDG</span>
              </div>
              <p className="text-[11px] text-zinc-600 leading-relaxed">
                Anda berpartisipasi aktif dalam demokratisasi ilmu (SDG 4) dan pengurangan ketimpangan ekonomi (SDG 10) melalui transaksi berbasis waktu setara.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: BADGE SHOWCASE */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          
          {/* Badge Filter & Progress Bar */}
          <div className="card-classy p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading font-bold text-lg text-zinc-900">
                  Lencana & Penghargaan Komunitas
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Setiap milestone transaksi dan bimbingan akan membuka badge permanen yang terverifikasi.
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="font-heading font-bold text-xl text-zinc-900">
                  {unlockedCount} <span className="text-xs font-normal text-zinc-500">dari {badges.length} Terbuka</span>
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${(unlockedCount / badges.length) * 100}%` }}
              ></div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
              <button
                onClick={() => setBadgeCategoryFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  badgeCategoryFilter === 'all'
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Semua Badge ({badges.length})
              </button>

              <button
                onClick={() => setBadgeCategoryFilter('transaksi')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  badgeCategoryFilter === 'transaksi'
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Transaksi Perdana & Barter
              </button>

              <button
                onClick={() => setBadgeCategoryFilter('edukasi')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  badgeCategoryFilter === 'edukasi'
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Mentor & Belajar
              </button>

              <button
                onClick={() => setBadgeCategoryFilter('reputasi')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  badgeCategoryFilter === 'reputasi'
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Reputasi Komunitas
              </button>

              <button
                onClick={() => setBadgeCategoryFilter('komunitas')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  badgeCategoryFilter === 'komunitas'
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                SDG & Multi-Talenta
              </button>
            </div>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBadges.map((badge) => {
              return (
                <div
                  key={badge.id}
                  className={`card-classy p-5 relative overflow-hidden transition-all ${
                    badge.isUnlocked
                      ? 'border-amber-200/90 bg-white hover:border-amber-300'
                      : 'border-zinc-200/60 bg-zinc-50/50 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border ${
                        badge.isUnlocked
                          ? 'bg-amber-50 border-amber-200/80 shadow-xs'
                          : 'bg-zinc-100 border-zinc-200 grayscale text-zinc-400'
                      }`}
                    >
                      {badge.icon}
                    </div>

                    <div>
                      {badge.isUnlocked ? (
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Terbuka</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                          <Lock className="w-3 h-3 text-zinc-400" />
                          <span>Terkunci</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-sm text-zinc-900">
                      {badge.name}
                    </h3>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                    <span className="font-medium text-zinc-700">
                      {badge.progressText || badge.requirement}
                    </span>
                    {badge.unlockedAt && (
                      <span className="text-[10px] text-zinc-400">
                        {badge.unlockedAt}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 3: EDIT PROFILE & SKILLS */}
      {activeTab === 'edit' && (
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSaveProfile} className="card-classy p-6 sm:p-8 space-y-6 text-xs">
            <div>
              <h2 className="font-heading font-bold text-lg text-zinc-900">
                Pengaturan Profil & Keahlian Barter
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Perbarui biodata dan daftar keahlian untuk menyesuaikan algoritma matchmaking.
              </p>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">
                    Kata Ganti (Pronouns)
                  </label>
                  <input
                    type="text"
                    value={pronouns}
                    onChange={(e) => setPronouns(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Deskripsi Singkat / Bio
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1.5">
                  Pilih Avatar Emoji:
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {avatarOptions.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setAvatar(emoji)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition-all ${
                        avatar === emoji
                          ? 'border-zinc-900 bg-zinc-100 shadow-xs scale-105'
                          : 'border-zinc-200 bg-white hover:bg-zinc-50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills Offered Manager */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-900 block">
                  Keahlian yang Ditawarkan (Anda Mengajar):
                </span>
                <span className="text-[11px] text-zinc-500">
                  {skillsOffered.length} keahlian
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {skillsOffered.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-zinc-200 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    onClick={() => setSkillsOffered(skillsOffered.filter((s) => s !== skill))}
                    title="Klik untuk menghapus"
                  >
                    <span>{skill}</span>
                    <X className="w-3 h-3 text-zinc-400" />
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Tambah keahlian baru (misal: Docker, Piano, dll.)..."
                  value={newOfferInput}
                  onChange={(e) => setNewOfferInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
                <button
                  type="button"
                  onClick={handleAddOffer}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  Tambah
                </button>
              </div>
            </div>

            {/* Skills Wanted Manager */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-900 block">
                  Keahlian yang Dicari (Anda Belajar):
                </span>
                <span className="text-[11px] text-zinc-500">
                  {skillsWanted.length} keahlian
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {skillsWanted.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-zinc-200 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    onClick={() => setSkillsWanted(skillsWanted.filter((s) => s !== skill))}
                    title="Klik untuk menghapus"
                  >
                    <span>{skill}</span>
                    <X className="w-3 h-3 text-zinc-400" />
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Tambah keahlian yang ingin Anda pelajari..."
                  value={newWantInput}
                  onChange={(e) => setNewWantInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
                <button
                  type="button"
                  onClick={handleAddWant}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  Tambah
                </button>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                {isSavedRecently && (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Profil berhasil disimpan! ✨</span>
                  </>
                )}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};
