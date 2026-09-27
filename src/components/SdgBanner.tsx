// src/components/SdgBanner.tsx
import React from 'react';
import { X, GraduationCap, Scale, Coins, Globe2, ArrowRight } from 'lucide-react';

interface SdgBannerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
}

export const SdgBanner: React.FC<SdgBannerProps> = ({ isOpen, onClose, onOpenProfile }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white border border-zinc-200 rounded-2xl p-6 sm:p-7 shadow-xl relative max-h-[85vh] overflow-y-auto"
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
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center">
            <Globe2 className="w-5 h-5 text-zinc-700" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-zinc-900 leading-tight">
              Model Ekonomi Waktu (SDG 4 & SDG 10)
            </h3>
            <p className="text-xs text-zinc-500">
              Mengganti uang tunai dengan sistem barter waktu yang inklusif
            </p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs text-zinc-600 leading-relaxed">
          
          {/* SDG 4 Card */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/60 space-y-1.5">
            <div className="flex items-center gap-2 text-zinc-900 font-semibold">
              <GraduationCap className="w-4 h-4 text-zinc-700" />
              <h4 className="font-heading text-sm">
                SDG 4: Pendidikan Berkualitas yang Terjangkau
              </h4>
            </div>
            <p className="text-zinc-600">
              Biaya les privat dan bimbingan seringkali mahal ($30–$100/jam). Di Konnex, akses ke bimbingan 1-on-1 terbuka bagi siapa saja tanpa hambatan finansial. Anda hanya perlu berbagi keahlian yang Anda miliki.
            </p>
          </div>

          {/* SDG 10 Card */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/60 space-y-1.5">
            <div className="flex items-center gap-2 text-zinc-900 font-semibold">
              <Scale className="w-4 h-4 text-zinc-700" />
              <h4 className="font-heading text-sm">
                SDG 10: Mengurangi Ketimpangan Sosial
              </h4>
            </div>
            <p className="text-zinc-600">
              Dalam sistem time-banking, <strong>1 jam waktu setiap manusia bernilai setara</strong>. Mengajarkan percakapan bahasa sehari-hari memiliki bobot 1 token yang sama dengan mengajarkan software engineering.
            </p>
          </div>

          {/* Cara Kerja */}
          <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/50 space-y-2 text-amber-950">
            <div className="flex items-center gap-2 font-semibold">
              <Coins className="w-4 h-4 text-amber-700" />
              <span>Bagaimana alur perolehan token?</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-amber-900/90 font-medium">
              <li>Pilih keahlian yang Anda kuasai pada halaman profil.</li>
              <li>Partner memesan sesi bimbingan 60 menit bersama Anda.</li>
              <li>Lakukan sesi diskusi/bimbingan sesuai waktu yang disepakati.</li>
              <li>Setelah selesai, 1 token otomatis ditransfer ke dompet Anda.</li>
            </ol>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
          <button
            onClick={() => {
              onClose();
              onOpenProfile();
            }}
            className="btn-primary text-xs"
          >
            <span>Atur Keahlian Saya</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
