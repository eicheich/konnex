// src/components/BadgeUnlockedModal.tsx
import React from 'react';
import { Badge } from '../types';
import { X, Sparkles, Award, ArrowRight } from 'lucide-react';

interface BadgeUnlockedModalProps {
  badge: Badge | null;
  onClose: () => void;
  onViewAllBadges: () => void;
}

export const BadgeUnlockedModal: React.FC<BadgeUnlockedModalProps> = ({
  badge,
  onClose,
  onViewAllBadges,
}) => {
  if (!badge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm bg-white border border-zinc-200 rounded-2xl p-6 shadow-2xl text-center relative animate-in zoom-in-95 duration-200 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg bg-zinc-100 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-4xl mx-auto shadow-xs">
          {badge.icon}
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Badge Baru Terbuka!</span>
          </div>
          <h3 className="font-heading font-bold text-xl text-zinc-900">
            {badge.name}
          </h3>
          <p className="text-xs text-zinc-600 leading-relaxed px-2">
            {badge.description}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-[11px] text-zinc-500">
          Tercatat permanen dalam profil dan terhubung dengan reputasi barter Anda.
        </div>

        <div className="pt-1 flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex-1 btn-secondary text-xs py-2"
          >
            Tutup
          </button>
          <button
            onClick={() => {
              onClose();
              onViewAllBadges();
            }}
            className="flex-1 btn-primary text-xs py-2 flex items-center justify-center gap-1"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
