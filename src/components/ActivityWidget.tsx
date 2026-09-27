// src/components/ActivityWidget.tsx
import React from 'react';
import { Session, User } from '../types';
import { Bell, Check, X, ArrowRight, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

interface ActivityWidgetProps {
  currentUser: User;
  sessions: Session[];
  onAcceptSession: (sessionId: string) => void;
  onDeclineSession: (sessionId: string) => void;
  onCompleteSession: (sessionId: string) => void;
  onViewAllSessions: () => void;
}

export const ActivityWidget: React.FC<ActivityWidgetProps> = ({
  currentUser,
  sessions,
  onAcceptSession,
  onDeclineSession,
  onCompleteSession,
  onViewAllSessions,
}) => {
  // Requests waiting for current user's approval as mentor
  const incomingPending = sessions.filter(
    (s) => s.mentorId === currentUser.id && s.status === 'PENDING'
  );

  // Accepted sessions ready to be conducted or completed
  const activeSessions = sessions.filter(
    (s) => (s.mentorId === currentUser.id || s.learnerId === currentUser.id) && s.status === 'ACCEPTED'
  );

  // Outgoing pending requests
  const outgoingPending = sessions.filter(
    (s) => s.learnerId === currentUser.id && s.status === 'PENDING'
  );

  const totalActionable = incomingPending.length + activeSessions.length;

  return (
    <div className="card-classy p-6 flex flex-col justify-between">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-sm text-zinc-900 flex items-center gap-2">
                <span>Aktivitas & Permintaan Sesi</span>
                {totalActionable > 0 && (
                  <span className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[10px] font-bold flex items-center justify-center">
                    {totalActionable}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-zinc-500 font-medium">
                Persetujuan dan penyelesaian sesi barter skill
              </p>
            </div>
          </div>

          <button
            onClick={onViewAllSessions}
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 transition-colors"
          >
            <span>Semua ({sessions.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content list */}
        <div className="pt-4 space-y-3">
          
          {/* Incoming Pending Requests */}
          {incomingPending.map((session) => (
            <div
              key={session.id}
              className="p-3.5 rounded-xl border border-amber-200/90 bg-amber-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-lg bg-white border border-amber-200 flex items-center justify-center text-sm shrink-0 shadow-xs">
                  {session.learnerAvatar}
                </span>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-zinc-900">
                      @{session.learnerUsername}
                    </span>
                    <span className="text-zinc-600">
                      ingin belajar keahlian <strong className="text-zinc-900">{session.skill}</strong>
                    </span>
                  </div>
                  <p className="text-zinc-500 text-[11px] mt-0.5">
                    Fokus: "{session.topic}"
                  </p>
                  {session.notes && (
                    <p className="text-zinc-600 text-[11px] mt-1 bg-white/70 p-2 rounded-lg border border-amber-100 italic">
                      "{session.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Accept / Decline actions */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => onAcceptSession(session.id)}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-lg text-xs flex items-center gap-1 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Terima</span>
                </button>
                <button
                  onClick={() => onDeclineSession(session.id)}
                  className="px-2.5 py-1.5 bg-white hover:bg-zinc-100 text-zinc-500 hover:text-rose-600 font-medium rounded-lg text-xs border border-zinc-200 transition-colors"
                  title="Tolak permintaan"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Active Accepted Sessions */}
          {activeSessions.map((session) => {
            const isMentor = session.mentorId === currentUser.id;
            const otherUsername = isMentor ? session.learnerUsername : session.mentorUsername;

            return (
              <div
                key={session.id}
                className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                    <Clock className="w-4 h-4 text-emerald-700" />
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-zinc-900">
                        Sesi Siap: {session.skill}
                      </span>
                      <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        Disetujui
                      </span>
                    </div>
                    <p className="text-zinc-500 text-[11px] mt-0.5">
                      Partner: @{otherUsername} · Durasi: 60 Menit
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onCompleteSession(session.id)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors self-end sm:self-center shrink-0 shadow-xs"
                  title="Selesaikan sesi dan transfer 1 token waktu"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Selesaikan & Transfer 1 Token</span>
                </button>
              </div>
            );
          })}

          {/* Outgoing Requests */}
          {outgoingPending.map((session) => (
            <div
              key={session.id}
              className="p-3 rounded-xl border border-dashed border-zinc-200 bg-white flex items-center justify-between text-xs text-zinc-600"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span className="truncate">
                  Menunggu persetujuan dari <strong className="text-zinc-800">@{session.mentorUsername}</strong> untuk {session.skill}
                </span>
              </div>
              <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 shrink-0 ml-2">
                Menunggu
              </span>
            </div>
          ))}

          {/* Empty state */}
          {incomingPending.length === 0 && activeSessions.length === 0 && outgoingPending.length === 0 && (
            <div className="text-center py-6 px-4 rounded-xl border border-zinc-100 bg-zinc-50/50">
              <p className="text-xs font-semibold text-zinc-700">
                Tidak ada permintaan aktif saat ini.
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Jelajahi rekomendasi mitra di bawah dan kirim ajakan barter keahlian.
              </p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
