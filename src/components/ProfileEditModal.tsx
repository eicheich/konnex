// src/components/ProfileEditModal.tsx
import React, { useState } from 'react';
import { User } from '../types';
import { X, Plus, Check, SlidersHorizontal } from 'lucide-react';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSaveProfile: (updated: Partial<User>) => void;
}

const POPULAR_SKILLS = [
  'React 💻',
  'UI/UX 🎨',
  'Figma 🖌️',
  'Next.js ⚡',
  'Tailwind 💅',
  'Korean 🇰🇷',
  'Japanese 🇯🇵',
  'Crochet 🧶',
  '3D Blender 🍩',
  'Film Photography 📸',
  'Matcha Whisking 🍵',
  'Notion 📓',
  'Python 🐍',
  'Video Editing 🎬',
  'Public Speaking 🎤',
];

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [skillsOffered, setSkillsOffered] = useState<string[]>([...currentUser.skills_offered]);
  const [skillsWanted, setSkillsWanted] = useState<string[]>([...currentUser.skills_wanted]);
  const [customSkill, setCustomSkill] = useState('');
  const [targetList, setTargetList] = useState<'offered' | 'wanted'>('offered');

  const toggleOffered = (skill: string) => {
    if (skillsOffered.includes(skill)) {
      setSkillsOffered(skillsOffered.filter((s) => s !== skill));
    } else {
      setSkillsOffered([...skillsOffered, skill]);
      setSkillsWanted(skillsWanted.filter((s) => s !== skill));
    }
  };

  const toggleWanted = (skill: string) => {
    if (skillsWanted.includes(skill)) {
      setSkillsWanted(skillsWanted.filter((s) => s !== skill));
    } else {
      setSkillsWanted([...skillsWanted, skill]);
      setSkillsOffered(skillsOffered.filter((s) => s !== skill));
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkill.trim()) return;
    const clean = customSkill.trim();
    if (targetList === 'offered') {
      if (!skillsOffered.includes(clean)) setSkillsOffered([...skillsOffered, clean]);
    } else {
      if (!skillsWanted.includes(clean)) setSkillsWanted([...skillsWanted, clean]);
    }
    setCustomSkill('');
  };

  const handleSave = () => {
    onSaveProfile({
      name,
      bio,
      skills_offered: skillsOffered,
      skills_wanted: skillsWanted,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white border border-zinc-200 rounded-2xl p-6 sm:p-7 shadow-xl relative max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-zinc-100 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-zinc-900 leading-tight">
              Profil & Preferensi Keahlian
            </h3>
            <p className="text-xs text-zinc-500">
              Atur keahlian yang dapat Anda ajarkan dan yang ingin Anda pelajari
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto space-y-4 pr-1 flex-1 text-xs">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-700 font-semibold mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400"
              />
            </div>
            <div>
              <label className="block text-zinc-700 font-semibold mb-1">
                Deskripsi Singkat / Bio
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400"
              />
            </div>
          </div>

          {/* Skills Offered */}
          <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/60 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-zinc-900">
                Keahlian yang Ditawarkan (Anda Mengajar)
              </label>
              <span className="text-zinc-500 text-[11px]">
                {skillsOffered.length} dipilih
              </span>
            </div>
            <p className="text-zinc-500 text-[11px]">
              Orang lain dapat memesan sesi bimbingan 1 jam dari daftar ini:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {skillsOffered.map((skill) => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleOffered(skill)}
                  className="px-2.5 py-1 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-800 flex items-center gap-1 transition-colors"
                >
                  <span>{skill}</span>
                  <X className="w-3 h-3 text-zinc-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Skills Wanted */}
          <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/60 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-zinc-900">
                Keahlian yang Dicari (Anda Belajar)
              </label>
              <span className="text-zinc-500 text-[11px]">
                {skillsWanted.length} dipilih
              </span>
            </div>
            <p className="text-zinc-500 text-[11px]">
              Sistem akan memprioritaskan rekomendasi mentor yang mengajarkan hal ini:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {skillsWanted.map((skill) => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleWanted(skill)}
                  className="px-2.5 py-1 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-800 flex items-center gap-1 transition-colors"
                >
                  <span>{skill}</span>
                  <X className="w-3 h-3 text-zinc-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick-Pick Popular Skills */}
          <div>
            <label className="block text-zinc-700 font-semibold mb-1.5">
              Pilihan Cepat Keahlian Komunitas:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SKILLS.map((skill) => {
                const isOffered = skillsOffered.includes(skill);
                const isWanted = skillsWanted.includes(skill);

                return (
                  <div key={skill} className="flex items-center text-xs">
                    <span className="px-2.5 py-1 bg-zinc-100 rounded-l-lg font-medium text-zinc-700 border border-r-0 border-zinc-200">
                      {skill}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleOffered(skill)}
                      className={`px-2 py-1 text-[10px] font-semibold border border-zinc-200 transition-colors ${
                        isOffered ? 'bg-zinc-900 text-white' : 'bg-white hover:bg-zinc-50 text-zinc-600'
                      }`}
                      title="Ajarkan ini"
                    >
                      Ajar
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleWanted(skill)}
                      className={`px-2 py-1 text-[10px] font-semibold rounded-r-lg border border-l-0 border-zinc-200 transition-colors ${
                        isWanted ? 'bg-zinc-900 text-white' : 'bg-white hover:bg-zinc-50 text-zinc-600'
                      }`}
                      title="Pelajari ini"
                    >
                      Belajar
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Custom */}
          <form onSubmit={handleAddCustom} className="flex items-center gap-2 pt-1">
            <select
              value={targetList}
              onChange={(e) => setTargetList(e.target.value as 'offered' | 'wanted')}
              className="px-2.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-700 font-medium"
            >
              <option value="offered">Tambah ke Diajarkan</option>
              <option value="wanted">Tambah ke Dipelajari</option>
            </select>
            <input
              type="text"
              placeholder="Contoh: Sourdough Bread, Machine Learning, dll."
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
            <button
              type="submit"
              className="btn-secondary text-xs"
            >
              Tambah
            </button>
          </form>
        </div>

        {/* Footer actions */}
        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary text-xs"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary text-xs"
          >
            Simpan & Perbarui Rekomendasi
          </button>
        </div>
      </div>
    </div>
  );
};
