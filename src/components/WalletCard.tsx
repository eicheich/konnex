// src/components/WalletCard.tsx
import React from 'react';
import { User, TransactionLedger } from '../types';
import { Coins, ArrowUpRight, ShieldCheck, History, Sparkles, HelpCircle, Star, CheckCircle2 } from 'lucide-react';

interface WalletCardProps {
  currentUser: User;
  recentLedger: TransactionLedger[];
  onOpenLedger: () => void;
  onEarnMoreHelp: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  currentUser,
  recentLedger,
  onOpenLedger,
  onEarnMoreHelp,
}) => {
  return (
    <div className="card-classy p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between">
      
      {/* Top Header: Title & Token Badge */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Dompet Waktu
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Transparansi Buku Besar</span>
            </span>
          </div>

          {/* Big Clean Balance Display */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900">
              {currentUser.token_balance}
            </span>
            <span className="text-zinc-500 font-medium text-lg">
              Token Tersedia
            </span>
          </div>
        </div>

        {/* Action Button: History */}
        <button
          onClick={onOpenLedger}
          className="btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3"
          title="Lihat riwayat transaksi"
        >
          <History className="w-3.5 h-3.5 text-zinc-500" />
          <span>Buku Besar</span>
        </button>
      </div>

      {/* Clear Rule Explanation */}
      <p className="text-sm text-zinc-600 mt-3 leading-relaxed">
        Sistem waktu adil: <strong className="text-zinc-900 font-semibold">1 jam mengajar = 1 token = 1 jam belajar</strong>. Anda dapat memesan {currentUser.token_balance} jam sesi bimbingan 1-on-1 gratis tanpa uang tunai.
      </p>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 my-5 pt-4 border-t border-zinc-100">
        <div className="p-3 rounded-xl bg-zinc-50/80 border border-zinc-100">
          <span className="block text-[11px] text-zinc-500 font-medium">Sesi Berhasil</span>
          <span className="font-heading font-semibold text-lg text-zinc-900 mt-0.5 block">
            {currentUser.total_swaps}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-zinc-50/80 border border-zinc-100">
          <span className="block text-[11px] text-zinc-500 font-medium">Rating Komunitas</span>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-heading font-semibold text-lg text-zinc-900">
              {currentUser.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-50/80 border border-zinc-100">
          <span className="block text-[11px] text-zinc-500 font-medium">Nilai Waktu</span>
          <span className="font-heading font-semibold text-lg text-zinc-900 mt-0.5 block">
            1 Jam / Sesi
          </span>
        </div>
      </div>

      {/* Bottom Footer: Earn More Tokens Tip & Latest Entry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-100 text-xs text-zinc-500">
        {recentLedger.length > 0 ? (
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="truncate text-zinc-600 font-medium">
              Terakhir: {recentLedger[0].description}
            </span>
          </div>
        ) : (
          <span>Belum ada riwayat transaksi.</span>
        )}

        <button
          onClick={onEarnMoreHelp}
          className="text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-1 self-start sm:self-auto shrink-0"
        >
          <span>Cara dapatkan token?</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
