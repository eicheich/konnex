// app/api/sessions/[id]/complete/route.ts
// Next.js App Router (POST endpoint)
// Safe Completed-Session Token Exchange Database Transaction via Neon Database & Prisma ORM

import { NextResponse } from 'next/server';
// In a Next.js production project with Neon & Prisma:
// import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const body = await request.json().catch(() => ({}));
    const { callerUserId, feedbackNotes } = body;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Dynamic import or global singleton of PrismaClient
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    // =========================================================================
    // ATOMIC DATABASE TRANSACTION (Prisma Interactive Transaction on Neon PostgreSQL)
    // Ensures learner balance deduction, mentor balance addition, session state change,
    // and immutable transaction ledger creation all succeed together or rollback completely.
    // =========================================================================
    const transactionResult = await prisma.$transaction(async (tx) => {
      // 1. Fetch session with current status and participants
      const session = await tx.session.findUnique({
        where: { id: sessionId },
        include: {
          learner: true,
          mentor: true,
        },
      });

      if (!session) {
        throw new Error('SESSION_NOT_FOUND');
      }

      // Check current state machine
      if (session.status === 'COMPLETED') {
        throw new Error('SESSION_ALREADY_COMPLETED');
      }

      if (session.status !== 'ACCEPTED') {
        throw new Error('SESSION_NOT_ACCEPTED_YET');
      }

      // 2. Validate Learner has sufficient token balance (minimum 1 token required)
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

      // 5. Transition session status to COMPLETED 🎉
      const completedSession = await tx.session.update({
        where: { id: sessionId },
        data: {
          status: 'COMPLETED',
          notes: feedbackNotes ? `${session.notes || ''} | Feedback: ${feedbackNotes}` : session.notes,
        },
      });

      // 6. Record safe ledger entry for audit trail & transparency
      const ledgerEntry = await tx.transactionLedger.create({
        data: {
          amount: tokenCost,
          type: 'SWAP_TRANSFER',
          description: `Completed 1-hr swap: ${session.skill} (${session.topic})`,
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
      message: 'Token safely transferred and session marked COMPLETED! 💖🪙✨',
      data: transactionResult,
    });
  } catch (error: any) {
    console.error('Safe token transfer transaction failed:', error);

    const errorStatusMap: Record<string, { status: number; message: string }> = {
      SESSION_NOT_FOUND: { status: 404, message: 'Swap session not found.' },
      SESSION_ALREADY_COMPLETED: { status: 409, message: 'This session has already been completed.' },
      SESSION_NOT_ACCEPTED_YET: { status: 400, message: 'Session must be in ACCEPTED status before it can be completed.' },
      INSUFFICIENT_LEARNER_TOKENS: { status: 402, message: 'Learner token balance too low! They need at least 1 token.' },
    };

    const matched = errorStatusMap[error.message] || {
      status: 500,
      message: error.message || 'Internal database transaction failure.',
    };

    return NextResponse.json(
      {
        success: false,
        error: matched.message,
      },
      { status: matched.status }
    );
  }
}
