// src/types.ts

export type SessionStatus = 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';

export type TransactionType = 'INITIAL_GRANT' | 'SWAP_TRANSFER' | 'REFUND' | 'BONUS';

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  bio: string;
  avatar: string; // Emoji character or sticker
  avatarBg: string; // Pastel hex
  token_balance: number;
  skills_offered: string[];
  skills_wanted: string[];
  rating: number;
  total_swaps: number;
  pronouns: string;
  vibeTag: string;
}

export interface Session {
  id: string;
  topic: string;
  skill: string;
  notes?: string;
  status: SessionStatus;
  scheduledAt?: string;
  durationMinutes: number;
  tokenAmount: number;
  learnerId: string;
  learnerName: string;
  learnerUsername: string;
  learnerAvatar: string;
  mentorId: string;
  mentorName: string;
  mentorUsername: string;
  mentorAvatar: string;
  createdAt: string;
  completedAt?: string;
}

export interface TransactionLedger {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  senderId: string;
  senderName: string;
  senderUsername: string;
  receiverId: string;
  receiverName: string;
  receiverUsername: string;
  sessionId?: string;
  createdAt: string;
}

export interface MatchResult {
  user: User;
  matchScore: number; // 0 - 100%
  mutualMatches: string[]; // skills you want that they offer
  reverseMatches: string[]; // skills they want that you offer
  matchType: 'mutual' | 'they_teach' | 'you_teach' | 'explore';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  badgeColor: string; // tailwind color theme e.g. 'amber', 'emerald', 'blue', 'purple', 'rose'
  category: 'transaksi' | 'edukasi' | 'reputasi' | 'komunitas';
  isUnlocked: boolean;
  unlockedAt?: string;
  progressText?: string;
  requirement: string;
}
