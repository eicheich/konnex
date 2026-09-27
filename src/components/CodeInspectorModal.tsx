// src/components/CodeInspectorModal.tsx
import React, { useState } from 'react';
import { X, Copy, Check, Play, Code2, Database } from 'lucide-react';
import { Session, User } from '../types';

interface CodeInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  sessions: Session[];
}

const PRISMA_SCHEMA_CODE = `// prisma/schema.prisma
// Konnex Micro-Skill Swap Schema for Neon Serverless PostgreSQL

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum SessionStatus {
  PENDING    // Awaiting mentor acceptance
  ACCEPTED   // Mentor agreed, ready to meet
  COMPLETED  // Finished, token transferred
  CANCELLED  // Declined or cancelled
}

enum TransactionType {
  INITIAL_GRANT  // 2 free onboarding tokens
  SWAP_TRANSFER  // 1-token swap for 1-hr session
  REFUND         // Refund
  BONUS          // Community reward
}

model User {
  id              String      @id @default(cuid())
  email           String      @unique
  username        String      @unique
  name            String
  bio             String?
  avatar          String
  avatarBg        String      @default("#F4F4F5")
  token_balance   Int         @default(2) // Initial 2 tokens
  skills_offered  String[]    // e.g. ["React 💻", "UI/UX 🎨"]
  skills_wanted   String[]    // e.g. ["Korean 🇰🇷", "Crochet 🧶"]
  rating          Float       @default(5.0)
  total_swaps     Int         @default(0)
  pronouns        String      @default("they/them")
  vibeTag         String      @default("Active Member")

  sessionsAsLearner Session[] @relation("LearnerSessions")
  sessionsAsMentor  Session[] @relation("MentorSessions")

  sentTransactions     TransactionLedger[] @relation("SentTransactions")
  receivedTransactions TransactionLedger[] @relation("ReceivedTransactions")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([username])
}

model Session {
  id              String         @id @default(cuid())
  topic           String
  skill           String
  notes           String?
  status          SessionStatus  @default(PENDING)
  scheduledAt     DateTime?
  durationMinutes Int            @default(60)
  tokenAmount     Int            @default(1)

  learnerId       String
  learner         User           @relation("LearnerSessions", fields: [learnerId], references: [id], onDelete: Cascade)

  mentorId        String
  mentor          User           @relation("MentorSessions", fields: [mentorId], references: [id], onDelete: Cascade)

  transaction     TransactionLedger? @relation("SessionTransaction")

  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  @@index([learnerId])
  @@index([mentorId])
  @@index([status])
}

model TransactionLedger {
  id          String          @id @default(cuid())
  amount      Int             @default(1)
  type        TransactionType @default(SWAP_TRANSFER)
  description String

  senderId    String
  sender      User            @relation("SentTransactions", fields: [senderId], references: [id], onDelete: Cascade)

  receiverId  String
  receiver    User            @relation("ReceivedTransactions", fields: [receiverId], references: [id], onDelete: Cascade)

  sessionId   String?         @unique
  session     Session?        @relation("SessionTransaction", fields: [sessionId], references: [id], onDelete: SetNull)

  createdAt   DateTime        @default(now())

  @@index([senderId])
  @@index([receiverId])
  @@index([createdAt])
}`;

const NEXTJS_API_ROUTE_CODE = `// app/api/sessions/[id]/complete/route.ts
// Next.js App Router (POST) - Safe Completed-Session Token Exchange Transaction

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Neon Serverless Prisma Client

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const body = await request.json().catch(() => ({}));
    const { feedbackNotes } = body;

    // Execute atomic safe transaction via Prisma
    const transactionResult = await prisma.$transaction(async (tx) => {
      // 1. Fetch session with current status and participants
      const session = await tx.session.findUnique({
        where: { id: sessionId },
        include: { learner: true, mentor: true },
      });

      if (!session) {
        throw new Error('SESSION_NOT_FOUND');
      }

      if (session.status === 'COMPLETED') {
        throw new Error('SESSION_ALREADY_COMPLETED');
      }

      if (session.status !== 'ACCEPTED') {
        throw new Error('SESSION_NOT_ACCEPTED_YET');
      }

      // 2. Validate Learner token balance
      const tokenCost = session.tokenAmount || 1;
      if (session.learner.token_balance < tokenCost) {
        throw new Error('INSUFFICIENT_LEARNER_TOKENS');
      }

      // 3. Deduct 1 token from Learner
      const updatedLearner = await tx.user.update({
        where: { id: session.learnerId },
        data: {
          token_balance: { decrement: tokenCost },
          total_swaps: { increment: 1 },
        },
      });

      // 4. Credit 1 token to Mentor
      const updatedMentor = await tx.user.update({
        where: { id: session.mentorId },
        data: {
          token_balance: { increment: tokenCost },
          total_swaps: { increment: 1 },
        },
      });

      // 5. Update session status to COMPLETED
      const completedSession = await tx.session.update({
        where: { id: sessionId },
        data: {
          status: 'COMPLETED',
          notes: feedbackNotes ? \`\${session.notes || ''} | Feedback: \${feedbackNotes}\` : session.notes,
        },
      });

      // 6. Record safe immutable entry in TransactionLedger
      const ledgerEntry = await tx.transactionLedger.create({
        data: {
          amount: tokenCost,
          type: 'SWAP_TRANSFER',
          description: \`Completed 1-hr swap: \${session.skill} (\${session.topic})\`,
          senderId: session.learnerId,
          receiverId: session.mentorId,
          sessionId: session.id,
        },
      });

      return {
        session: completedSession,
        ledger: ledgerEntry,
        learnerNewBalance: updatedLearner.token_balance,
        mentorNewBalance: updatedMentor.token_balance,
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Token successfully transferred and session marked completed.',
      data: transactionResult,
    });
  } catch (error: any) {
    const errorStatusMap: Record<string, { status: number; message: string }> = {
      SESSION_NOT_FOUND: { status: 404, message: 'Swap session not found.' },
      SESSION_ALREADY_COMPLETED: { status: 409, message: 'This session has already been completed.' },
      SESSION_NOT_ACCEPTED_YET: { status: 400, message: 'Session must be in ACCEPTED status before completion.' },
      INSUFFICIENT_LEARNER_TOKENS: { status: 402, message: 'Learner token balance too low.' },
    };

    const matched = errorStatusMap[error.message] || {
      status: 500,
      message: error.message || 'Internal database transaction failure.',
    };

    return NextResponse.json(
      { success: false, error: matched.message },
      { status: matched.status }
    );
  }
}`;

export const CodeInspectorModal: React.FC<CodeInspectorModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  sessions,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'prisma' | 'route' | 'simulator'>('prisma');
  const [copied, setCopied] = useState<string | null>(null);

  // Simulator state
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    sessions.find((s) => s.status === 'ACCEPTED')?.id || sessions[0]?.id || ''
  );
  const [simulatedResponse, setSimulatedResponse] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulatedResponse(null);

    const targetSession = sessions.find((s) => s.id === selectedSessionId);

    setTimeout(() => {
      setIsSimulating(false);
      if (!targetSession) {
        setSimulatedResponse({
          status: 404,
          body: { success: false, error: 'Session not found.' },
        });
        return;
      }

      if (targetSession.status === 'COMPLETED') {
        setSimulatedResponse({
          status: 409,
          body: { success: false, error: 'This session has already been completed.' },
        });
        return;
      }

      if (targetSession.status !== 'ACCEPTED') {
        setSimulatedResponse({
          status: 400,
          body: {
            success: false,
            error: `Session status is ${targetSession.status}. Sesi harus berstatus ACCEPTED terlebih dahulu.`,
          },
        });
        return;
      }

      setSimulatedResponse({
        status: 200,
        body: {
          success: true,
          message: 'Token 1 jam barter berhasil ditransfer & sesi selesai.',
          data: {
            transactionId: `tx_live_${Math.random().toString(36).substring(2, 9)}`,
            amount: 1,
            type: 'SWAP_TRANSFER',
            session: {
              id: targetSession.id,
              topic: targetSession.topic,
              status: 'COMPLETED',
            },
            transferredFrom: targetSession.learnerUsername,
            transferredTo: targetSession.mentorUsername,
            database: 'Neon PostgreSQL (Prisma $transaction ACID)',
          },
        },
      });
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl bg-white border border-zinc-200 rounded-2xl p-6 sm:p-7 shadow-xl relative max-h-[88vh] flex flex-col"
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
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-zinc-900 leading-tight">
              Arsitektur Backend & Database
            </h3>
            <p className="text-xs text-zinc-500">
              Prisma ORM schema, atomic database transaction endpoint & simulasi API
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1.5 mb-3 shrink-0 border-b border-zinc-100 pb-2">
          <button
            onClick={() => setActiveTab('prisma')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'prisma'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            schema.prisma (Neon PostgreSQL)
          </button>

          <button
            onClick={() => setActiveTab('route')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'route'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            Next.js App Router (POST Route)
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <Play className="w-3 h-3" />
            <span>Simulasi Transaksi Sesi</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-zinc-950 text-zinc-200 rounded-xl border border-zinc-800 p-4 font-mono text-xs relative">
          
          {activeTab === 'prisma' && (
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-zinc-400">
                <span>prisma/schema.prisma</span>
                <button
                  onClick={() => handleCopy(PRISMA_SCHEMA_CODE, 'prisma')}
                  className="flex items-center gap-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[11px] transition-colors"
                >
                  {copied === 'prisma' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'prisma' ? 'Tersalin' : 'Salin Kode'}</span>
                </button>
              </div>
              <pre className="overflow-x-auto whitespace-pre leading-relaxed select-all">
                {PRISMA_SCHEMA_CODE}
              </pre>
            </div>
          )}

          {activeTab === 'route' && (
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-zinc-400">
                <span>app/api/sessions/[id]/complete/route.ts</span>
                <button
                  onClick={() => handleCopy(NEXTJS_API_ROUTE_CODE, 'route')}
                  className="flex items-center gap-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[11px] transition-colors"
                >
                  {copied === 'route' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'route' ? 'Tersalin' : 'Salin Kode'}</span>
                </button>
              </div>
              <pre className="overflow-x-auto whitespace-pre leading-relaxed select-all">
                {NEXTJS_API_ROUTE_CODE}
              </pre>
            </div>
          )}

          {activeTab === 'simulator' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="text-zinc-300">
                <p className="font-semibold text-white mb-0.5">
                  Uji coba endpoint transaksi safe token swap:
                </p>
                <p className="text-zinc-400 text-[11px]">
                  Menjalankan validasi mutasi debit 1 token pada Pembelajar dan kredit 1 token pada Mentor.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 font-sans">
                <div className="w-full sm:w-auto flex-1">
                  <label className="block text-zinc-400 text-[10px] uppercase font-semibold mb-1">
                    Pilih Sesi Uji Coba:
                  </label>
                  <select
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-xs"
                  >
                    {sessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        [{s.status}] {s.skill} (@{s.learnerUsername} ➔ @{s.mentorUsername})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full sm:w-auto pt-4 sm:pt-0">
                  <button
                    onClick={runSimulation}
                    disabled={isSimulating}
                    className="w-full sm:w-auto px-4 py-2 bg-white text-zinc-900 font-semibold text-xs rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isSimulating ? 'Memproses...' : 'Kirim POST Request'}</span>
                  </button>
                </div>
              </div>

              {simulatedResponse && (
                <div className="pt-3 border-t border-zinc-800 font-mono">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        simulatedResponse.status === 200
                          ? 'bg-emerald-950 text-emerald-300'
                          : 'bg-rose-950 text-rose-300'
                      }`}
                    >
                      HTTP {simulatedResponse.status}
                    </span>
                    <span className="text-zinc-400 text-[11px]">Respon:</span>
                  </div>
                  <pre className="p-3 bg-zinc-900 rounded-lg text-[11px] overflow-x-auto text-zinc-200">
                    {JSON.stringify(simulatedResponse.body, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
