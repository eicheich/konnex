// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { User } from '../types';
import { Coins, ArrowRight, ArrowLeft, Check, Sparkles, UserPlus, X, HelpCircle } from 'lucide-react';
import { fireConfetti } from '../services/store';

interface RegisterPageProps {
  onRegisterSuccess: (newUser: User) => void;
  onGoToLogin: () => void;
  onGoToAbout: () => void;
}

const DEFAULT_POPULAR_OFFERS = [
  'React 💻',
  'UI/UX 🎨',
  'Figma 🖌️',
  'Tailwind 💅',
  'Next.js ⚡',
  'Korean 🇰🇷',
  'Japanese 🇯🇵',
  'Inggris Percakapan 🗣️',
  'Crochet 🧶',
  'Fotografi 📸',
  'Video Editing 🎬',
  'Notion & Produktivitas 📓',
  'Python 🐍',
  'Public Speaking 🎤',
  'Sourdough & Baking 🥖'
];

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onGoToLogin,
  onGoToAbout,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Basic account info
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('🌟');

  // Step 2 & 3: Skills offered and wanted
  const [skillsOffered, setSkillsOffered] = useState<string[]>(['Figma 🖌️']);
  const [skillsWanted, setSkillsWanted] = useState<string[]>(['Korean 🇰🇷']);
  const [customOffer, setCustomOffer] = useState('');
  const [customWant, setCustomWant] = useState('');
  const [error, setError] = useState<string | null>(null);

  const avatarOptions = ['🌟', '🌸', '🚀', '🎨', '🧶', '☕', '💡', '👾', '🦊', '🌿'];

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Mohon masukkan nama lengkap Anda.');
      return;
    }
    if (!username.trim()) {
      setError('Mohon buat username unik Anda.');
      return;
    }
    if (!email.trim()) {
      setError('Mohon isi alamat email aktif Anda.');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleStep2Next = () => {
    if (skillsOffered.length === 0) {
      setError('Pilih minimal 1 keahlian yang dapat Anda ajarkan.');
      return;
    }
    setError(null);
    setStep(3);
  };

  const handleFinalSubmit = () => {
    if (skillsWanted.length === 0) {
      setError('Pilih minimal 1 keahlian yang ingin Anda pelajari.');
      return;
    }

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: email.trim().toLowerCase(),
      username: cleanUsername || `user_${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      bio: 'Anggota baru di Konnex. Siap berbagi ilmu dan mempelajari wawasan baru!',
      avatar: avatar,
      avatarBg: '#F4F4F5',
      token_balance: 2, // Welcome grant 2 tokens
      skills_offered: skillsOffered,
      skills_wanted: skillsWanted,
      rating: 5.0,
      total_swaps: 0,
      pronouns: 'dia/mereka',
      vibeTag: 'Anggota Baru ✨',
    };

    fireConfetti();
    onRegisterSuccess(newUser);
  };

  const toggleSkillOffered = (skill: string) => {
    if (skillsOffered.includes(skill)) {
      setSkillsOffered(skillsOffered.filter((s) => s !== skill));
    } else {
      setSkillsOffered([...skillsOffered, skill]);
    }
  };

  const toggleSkillWanted = (skill: string) => {
    if (skillsWanted.includes(skill)) {
      setSkillsWanted(skillsWanted.filter((s) => s !== skill));
    } else {
      setSkillsWanted([...skillsWanted, skill]);
    }
  };

  const addCustomOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customOffer.trim()) return;
    if (!skillsOffered.includes(customOffer.trim())) {
      setSkillsOffered([...skillsOffered, customOffer.trim()]);
    }
    setCustomOffer('');
  };

  const addCustomWant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWant.trim()) return;
    if (!skillsWanted.includes(customWant.trim())) {
      setSkillsWanted([...skillsWanted, customWant.trim()]);
    }
    setCustomWant('');
  };

  return (
    <div className="max-w-xl mx-auto py-6 sm:py-10">
      <div className="card-classy p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-amber-400 mx-auto flex items-center justify-center font-bold shadow-xs">
            <UserPlus className="w-6 h-6 text-amber-300" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-zinc-900 tracking-tight">
            Bergabung dengan Konnex
          </h1>
          <p className="text-xs text-zinc-500">
            Daftar sekarang dan langsung dapatkan <strong className="text-zinc-900 font-semibold">+2 Token Waktu Gratis</strong>
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step >= 1 ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400'
              }`}
            >
              1
            </span>
            <span className={`font-medium ${step >= 1 ? 'text-zinc-900' : 'text-zinc-400'}`}>Akun</span>
          </div>
          <span className="w-6 h-0.5 bg-zinc-200"></span>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step >= 2 ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400'
              }`}
            >
              2
            </span>
            <span className={`font-medium ${step >= 2 ? 'text-zinc-900' : 'text-zinc-400'}`}>Diajarkan</span>
          </div>
          <span className="w-6 h-0.5 bg-zinc-200"></span>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step >= 3 ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400'
              }`}
            >
              3
            </span>
            <span className={`font-medium ${step >= 3 ? 'text-zinc-900' : 'text-zinc-400'}`}>Dipelajari</span>
          </div>
        </div>

        {/* Step 1: Account Info */}
        {step === 1 && (
          <form onSubmit={handleStep1Next} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-700 font-semibold mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Contoh: Sarah Anindita"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-700 font-semibold mb-1">
                  Username (@)
                </label>
                <input
                  type="text"
                  placeholder="sarah_a"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-semibold mb-1">
                  Alamat Email Aktif
                </label>
                <input
                  type="email"
                  placeholder="sarah@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-700 font-semibold mb-1">
                Kata Sandi
              </label>
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400"
              />
            </div>

            {/* Choose Avatar Emoji */}
            <div>
              <label className="block text-zinc-700 font-semibold mb-1.5">
                Pilih Avatar Profil:
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

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full btn-primary text-xs py-2.5 flex items-center justify-center gap-1.5"
            >
              <span>Lanjut: Tentukan Keahlian Mengajar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Step 2: Skills Offered */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Langkah 2 dari 3
              </span>
              <h3 className="font-heading font-bold text-base text-zinc-900 mt-0.5">
                Keahlian apa yang dapat Anda ajarkan?
              </h3>
              <p className="text-zinc-500 text-xs mt-0.5">
                Pilih topik yang Anda sukai untuk membimbing orang lain selama 1 jam.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-1.5">
              <span className="text-zinc-700 font-semibold block">
                Dipilih ({skillsOffered.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {skillsOffered.map((skill) => (
                  <span
                    key={skill}
                    onClick={() => toggleSkillOffered(skill)}
                    className="px-2.5 py-1 bg-white hover:bg-rose-50 hover:text-rose-700 border border-zinc-200 rounded-lg font-medium cursor-pointer flex items-center gap-1 text-xs"
                  >
                    <span>{skill}</span>
                    <X className="w-3 h-3 text-zinc-400" />
                  </span>
                ))}
              </div>
            </div>

            {/* Popular Skills List */}
            <div>
              <span className="font-semibold text-zinc-700 block mb-1.5">
                Pilihan Keahlian Populer Komunitas:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                {DEFAULT_POPULAR_OFFERS.map((skill) => {
                  const isSelected = skillsOffered.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkillOffered(skill)}
                      className={`px-2.5 py-1 rounded-lg border font-medium text-xs transition-colors ${
                        isSelected
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Input */}
            <form onSubmit={addCustomOffer} className="flex gap-2">
              <input
                type="text"
                placeholder="Atau ketik keahlian Anda sendiri..."
                value={customOffer}
                onChange={(e) => setCustomOffer(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
              <button type="submit" className="btn-secondary text-xs py-1.5">
                Tambah
              </button>
            </form>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>
              <button
                type="button"
                onClick={handleStep2Next}
                className="flex-1 btn-primary text-xs py-2.5 flex items-center justify-center gap-1.5"
              >
                <span>Lanjut: Pilih yang Ingin Dipelajari</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Skills Wanted */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Langkah 3 dari 3
              </span>
              <h3 className="font-heading font-bold text-base text-zinc-900 mt-0.5">
                Keahlian apa yang ingin Anda pelajari?
              </h3>
              <p className="text-zinc-500 text-xs mt-0.5">
                Konnex akan mencocokkan Anda dengan mentor yang menawarkan keahlian ini.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-1.5">
              <span className="text-zinc-700 font-semibold block">
                Dipilih ({skillsWanted.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {skillsWanted.map((skill) => (
                  <span
                    key={skill}
                    onClick={() => toggleSkillWanted(skill)}
                    className="px-2.5 py-1 bg-white hover:bg-rose-50 hover:text-rose-700 border border-zinc-200 rounded-lg font-medium cursor-pointer flex items-center gap-1 text-xs"
                  >
                    <span>{skill}</span>
                    <X className="w-3 h-3 text-zinc-400" />
                  </span>
                ))}
              </div>
            </div>

            {/* Popular Skills List */}
            <div>
              <span className="font-semibold text-zinc-700 block mb-1.5">
                Keahlian yang Sering Dicari:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                {DEFAULT_POPULAR_OFFERS.map((skill) => {
                  const isSelected = skillsWanted.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkillWanted(skill)}
                      className={`px-2.5 py-1 rounded-lg border font-medium text-xs transition-colors ${
                        isSelected
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Input */}
            <form onSubmit={addCustomWant} className="flex gap-2">
              <input
                type="text"
                placeholder="Atau ketik keahlian yang Anda cari..."
                value={customWant}
                onChange={(e) => setCustomWant(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
              <button type="submit" className="btn-secondary text-xs py-1.5">
                Tambah
              </button>
            </form>

            {/* Welcome Grant Banner */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-2.5">
              <Coins className="w-5 h-5 text-amber-700 shrink-0" />
              <div>
                <span className="font-semibold block text-xs">Bonus Sambutan 2 Token Langsung Masuk</span>
                <span className="text-[11px] text-amber-800">
                  Dapat langsung digunakan untuk memesan 2 sesi bimbingan pertama Anda.
                </span>
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="flex-1 btn-primary text-xs py-2.5 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Selesaikan Pendaftaran & Klaim Token</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer links */}
        <div className="pt-4 border-t border-zinc-100 text-center text-xs text-zinc-500 space-y-2">
          <p>
            Sudah memiliki akun?{' '}
            <button
              onClick={onGoToLogin}
              className="font-semibold text-zinc-900 hover:underline"
            >
              Masuk ke akun Anda
            </button>
          </p>

          <p>
            <button
              onClick={onGoToAbout}
              className="text-zinc-500 hover:text-zinc-900 hover:underline text-[11px]"
            >
              Pelajari model ekonomi waktu SDG 4 & 10
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};
