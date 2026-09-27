// src/components/LedgerModal.tsx
import React from 'react';
import { TransactionLedger, User } from '../types';
import { X, ArrowDownRight, ArrowUpRight, ShieldCheck, Coins } from 'lucide-react';

interface LedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  ledger: TransactionLedger[];
}

export const LedgerModal: React.FC<LedgerModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  ledger,
}) => {
  if (!isOpen) return null;

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
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/80 flex items-center justify-center">
            <Coins className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-lg text-zinc-900 leading-tight">
                Buku Besar Token Waktu
              </h3>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                Audit Trail
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Riwayat mutasi kredit & debit token berbasis waktu secara transparan
            </p>
          </div>
        </div>

        {/* User Balance Card */}
        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 mb-4 flex items-center justify-between shrink-0 text-xs">
          <div>
            <span className="text-zinc-400 font-medium block text-[10px] uppercase tracking-wider">
              Saldo Saat Ini
            </span>
            <span className="font-semibold text-sm text-zinc-900">
              @{currentUser.username} ({currentUser.name})
            </span>
          </div>
          <div className="text-right">
            <span className="font-heading font-bold text-xl text-zinc-900">
              {currentUser.token_balance} <span className="text-xs font-normal text-zinc-500">Token</span>
            </span>
          </div>
        </div>

        {/* Transactions List */}
        <div className="overflow-y-auto space-y-2 pr-1 flex-1 text-xs">
          {ledger.map((tx) => {
            const isReceiver = tx.receiverId === currentUser.id;

            return (
              <div
                key={tx.id}
                className="p-3 rounded-xl border border-zinc-200/70 bg-white hover:bg-zinc-50/50 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                      tx.type === 'INITIAL_GRANT'
                        ? 'bg-amber-100 text-amber-900'
                        : isReceiver
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-zinc-100 text-zinc-800'
                    }`}
                  >
                    {tx.type === 'INITIAL_GRANT' ? (
                      <Coins className="w-4 h-4 text-amber-700" />
                    ) : isReceiver ? (
                      <ArrowDownRight className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-zinc-600" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-xs text-zinc-900 truncate">
                      {tx.description}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Dari @{tx.senderUsername} ke @{tx.receiverUsername} · {new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`inline-block font-semibold text-xs px-2 py-0.5 rounded ${
                      isReceiver || tx.type === 'INITIAL_GRANT'
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-zinc-700 bg-zinc-100'
                    }`}
                  >
                    {isReceiver || tx.type === 'INITIAL_GRANT' ? `+${tx.amount}` : `-${tx.amount}`} Token
                  </span>
                  <span className="block text-[9px] font-mono text-zinc-400 mt-0.5">
                    {tx.id.substring(0, 14)}...
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ACID Guaranteed Transaction</span>
          </div>
          <span>Total: {ledger.length} entri</span>
        </div>
      </div>
    </div>
  );
};
