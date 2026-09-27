// src/components/BookingModal.tsx
import React, { useState } from 'react';
import { User } from '../types';
import { X, Clock, Coins, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: User | null;
  currentUser: User;
  preselectedSkill?: string;
  onSubmitBooking: (mentorId: string, skill: string, topic: string, notes: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  mentor,
  currentUser,
  preselectedSkill,
  onSubmitBooking,
}) => {
  if (!isOpen || !mentor) return null;

  const [selectedSkill, setSelectedSkill] = useState<string>(
    preselectedSkill || mentor.skills_offered[0] || 'Keahlian Umum'
  );
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const hasTokens = currentUser.token_balance >= 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Mohon isi topik atau materi yang ingin Anda pelajari.');
      return;
    }
    if (!hasTokens) {
      setError('Saldo token Anda tidak mencukupi (minimal 1 token diperlukan).');
      return;
    }

    onSubmitBooking(mentor.id, selectedSkill, topic.trim(), notes.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white border border-zinc-200 rounded-2xl p-6 sm:p-7 shadow-xl relative animate-in zoom-in-95 duration-150"
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
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xl shrink-0">
            {mentor.avatar}
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-zinc-900 leading-tight">
              Ajukan Sesi Barter dengan @{mentor.username}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Sesi 1-on-1 selama 60 menit menggunakan 1 token waktu
            </p>
          </div>
        </div>

        {/* Token Escrow Notice */}
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 mb-5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-700 shrink-0" />
            <div>
              <span className="font-semibold block">Biaya: 1 Token Waktu</span>
              <span className="text-[11px] text-amber-800">
                Token hanya akan dipotong setelah sesi selesai diselenggarakan.
              </span>
            </div>
          </div>
          <span className="font-semibold text-xs px-2 py-0.5 rounded bg-white border border-amber-200 text-amber-900 shrink-0">
            Saldo: {currentUser.token_balance}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Skill Selector */}
          <div>
            <label className="block font-semibold text-zinc-700 mb-1.5">
              1. Pilih Keahlian yang Ingin Dipelajari:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {mentor.skills_offered.map((skill) => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => setSelectedSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectedSkill === skill
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Session Topic */}
          <div>
            <label className="block font-semibold text-zinc-700 mb-1.5">
              2. Topik Spesifik / Tujuan Sesi: *
            </label>
            <input
              type="text"
              placeholder="Contoh: Belajar dasar Figma Auto-Layout atau percakapan praktis bahasa Korea"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                if (error) setError(null);
              }}
              className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-zinc-700 mb-1.5">
              3. Catatan Tambahan untuk Partner (Opsional):
            </label>
            <textarea
              rows={2}
              placeholder="Sampaikan jadwal preferensi Anda (misal: Sabtu sore atau malam hari)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400"
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!hasTokens}
              className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                hasTokens
                  ? 'bg-zinc-900 hover:bg-zinc-800 text-white'
                  : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
              }`}
            >
              <span>Kirim Permintaan Sesi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
