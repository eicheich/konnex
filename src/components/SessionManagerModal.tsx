// src/components/SessionManagerModal.tsx
import React, { useState } from 'react';
import { Session, User } from '../types';
import { X, Calendar, CheckCircle2, Clock, Check, ShieldCheck } from 'lucide-react';

interface SessionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  sessions: Session[];
  onAccept: (sessionId: string) => void;
  onDecline: (sessionId: string) => void;
  onComplete: (sessionId: string) => void;
}

export const SessionManagerModal: React.FC<SessionManagerModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  sessions,
  onAccept,
  onDecline,
  onComplete,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>('active');

  const relevantSessions = sessions.filter(
    (s) => s.learnerId === currentUser.id || s.mentorId === currentUser.id
  );

  const filtered = relevantSessions.filter((s) => {
    if (activeTab === 'active') return s.status === 'PENDING' || s.status === 'ACCEPTED';
    if (activeTab === 'completed') return s.status === 'COMPLETED';
    return true;
  });

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
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-zinc-900 leading-tight">
              Manajemen Sesi Barter
            </h3>
            <p className="text-xs text-zinc-500">
              Pantau jadwal, konfirmasi permintaan, dan selesaikan transaksi waktu
            </p>
          </div>
        </div>

        {/* Segmented Filter */}
        <div className="flex items-center gap-1.5 mb-4 shrink-0 border-b border-zinc-100 pb-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'active'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            Menunggu & Berlangsung ({relevantSessions.filter((s) => s.status === 'PENDING' || s.status === 'ACCEPTED').length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'completed'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            Selesai ({relevantSessions.filter((s) => s.status === 'COMPLETED').length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            Semua ({relevantSessions.length})
          </button>
        </div>

        {/* Sessions list */}
        <div className="overflow-y-auto space-y-3 pr-1 flex-1 text-xs">
          {filtered.length > 0 ? (
            filtered.map((session) => {
              const isLearner = session.learnerId === currentUser.id;

              return (
                <div
                  key={session.id}
                  className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-zinc-200/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                        {isLearner ? 'Anda sebagai Pembelajar' : 'Anda sebagai Pembimbing'}
                      </span>
                      <span className="text-zinc-300">·</span>
                      <span className="font-semibold text-zinc-900 text-sm">
                        {session.skill}
                      </span>
                    </div>

                    {/* Status Badges */}
                    <div>
                      {session.status === 'PENDING' && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          Menunggu Persetujuan
                        </span>
                      )}
                      {session.status === 'ACCEPTED' && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
                          Disetujui
                        </span>
                      )}
                      {session.status === 'COMPLETED' && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Selesai</span>
                        </span>
                      )}
                      {session.status === 'CANCELLED' && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 text-zinc-600">
                          Dibatalkan
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-zinc-900">
                      {session.topic}
                    </h4>
                    <p className="text-zinc-500 text-xs mt-0.5">
                      Pembelajar: @{session.learnerUsername} · Mentor: @{session.mentorUsername} · 60 Menit
                    </p>
                    {session.notes && (
                      <p className="text-zinc-600 italic mt-1.5 bg-white p-2 rounded-lg border border-zinc-100 text-[11px]">
                        "{session.notes}"
                      </p>
                    )}
                  </div>

                  {/* Contextual Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-zinc-500 font-medium">
                      Nilai Transaksi: 1 Token Waktu
                    </span>

                    {session.status === 'PENDING' && !isLearner && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onAccept(session.id)}
                          className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-lg text-xs transition-colors"
                        >
                          Setujui Sesi
                        </button>
                        <button
                          onClick={() => onDecline(session.id)}
                          className="px-2.5 py-1 bg-white hover:bg-zinc-100 text-zinc-600 font-medium rounded-lg text-xs border border-zinc-200 transition-colors"
                        >
                          Tolak
                        </button>
                      </div>
                    )}

                    {session.status === 'ACCEPTED' && (
                      <button
                        onClick={() => onComplete(session.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Tandai Selesai & Transfer 1 Token</span>
                      </button>
                    )}

                    {session.status === 'COMPLETED' && (
                      <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Tercatat aman di buku besar</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 bg-zinc-50 rounded-xl border border-zinc-100 text-zinc-500">
              Tidak ada sesi pada kategori ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
