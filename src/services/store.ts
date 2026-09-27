// src/services/store.ts
import confetti from 'canvas-confetti';
import { MatchResult, Session, TransactionLedger, User } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_kia',
    email: 'kia@konnex.app',
    username: 'kia',
    name: 'Kia Sparks',
    bio: 'frontend fairy building playful apps 🧚‍♀️ passionate about accessible design & matcha lattes!',
    avatar: '🌸',
    avatarBg: '#FFB7D5', // Bubblegum Pink
    token_balance: 3, // 3 tokens left as requested in example
    skills_offered: ['React 💻', 'UI/UX 🎨', 'Figma 🖌️', 'Tailwind 💅', 'Next.js ⚡'],
    skills_wanted: ['Korean 🇰🇷', 'Crochet 🧶', 'Film Photography 📸', 'Matcha Whisking 🍵'],
    rating: 4.95,
    total_swaps: 6,
    pronouns: 'she/they',
    vibeTag: 'Creative Coder ✨',
  },
  {
    id: 'user_reza',
    email: 'reza@konnex.app',
    username: 'reza',
    name: 'Reza Pratama',
    bio: 'seoul exchange alum 🇰🇷 dancer & amateur film editor. wanna level up my design and web dev!',
    avatar: '🌟',
    avatarBg: '#FFEFA6', // Butter Yellow
    token_balance: 2,
    skills_offered: ['Korean 🇰🇷', 'K-Pop Dance 🕺', 'Video Editing 🎬', 'Street Photography 📷'],
    skills_wanted: ['Figma 🖌️', 'UI/UX 🎨', 'React 💻'],
    rating: 5.0,
    total_swaps: 4,
    pronouns: 'he/him',
    vibeTag: 'Lively Creator 🌈',
  },
  {
    id: 'user_hana',
    email: 'hana@konnex.app',
    username: 'hana',
    name: 'Hana Kim',
    bio: 'yarn addict 🧶 slow-fashion maker & ceramics enthusiast. looking for Notion wizards & web help!',
    avatar: '🧶',
    avatarBg: '#D6C7FF', // Pastel Lavender
    token_balance: 3,
    skills_offered: ['Crochet 🧶', 'Embroidery 🪡', 'Ceramics 🏺', 'Plant Care 🪴'],
    skills_wanted: ['Notion 📓', 'Next.js ⚡', 'React 💻', 'SEO 🔍'],
    rating: 4.98,
    total_swaps: 7,
    pronouns: 'she/her',
    vibeTag: 'Craft Core 🍄',
  },
  {
    id: 'user_kenji',
    email: 'kenji@konnex.app',
    username: 'kenji',
    name: 'Kenji Sato',
    bio: 'indie game dev & 3D enthusiast 🍩 making low-poly worlds. let\'s swap 3D tips for styling!',
    avatar: '👾',
    avatarBg: '#C1F2B0', // Matcha Green
    token_balance: 4,
    skills_offered: ['3D Blender 🍩', 'Game Dev 👾', 'Sound Design 🎧', 'Japanese 🇯🇵'],
    skills_wanted: ['Tailwind 💅', 'React 💻', 'UI/UX 🎨'],
    rating: 4.92,
    total_swaps: 9,
    pronouns: 'he/they',
    vibeTag: 'Pixel Wizard 🕹️',
  },
  {
    id: 'user_luna',
    email: 'luna@konnex.app',
    username: 'luna',
    name: 'Luna Rossi',
    bio: 'analog camera collector 📸 zine publisher & typography nerd. want to learn React & creative code!',
    avatar: '🦋',
    avatarBg: '#FFD3B6', // Peach
    token_balance: 2,
    skills_offered: ['Film Photography 📸', 'Color Grading 🎞️', 'Zine Making 📖', 'Printmaking 🖼️'],
    skills_wanted: ['React 💻', 'Figma 🖌️', 'Personal Branding 🌟'],
    rating: 4.88,
    total_swaps: 3,
    pronouns: 'they/them',
    vibeTag: 'Indie Artist 🎨',
  },
  {
    id: 'user_maya',
    email: 'maya@konnex.app',
    username: 'maya',
    name: 'Maya Lin',
    bio: 'matcha fanatic 🍵 cafe hopper, acoustic guitar player & certified tea sommelier. lets trade vibes!',
    avatar: '🍵',
    avatarBg: '#AEE2FF', // Sky
    token_balance: 3,
    skills_offered: ['Matcha Whisking 🍵', 'Acoustic Guitar 🎸', 'French 🇫🇷', 'Sourdough 🥖'],
    skills_wanted: ['UI/UX 🎨', 'Figma 🖌️', 'Public Speaking 🎤'],
    rating: 5.0,
    total_swaps: 5,
    pronouns: 'she/her',
    vibeTag: 'Cozy Host 🥐',
  },
  {
    id: 'user_alex',
    email: 'alex@konnex.app',
    username: 'alex',
    name: 'Alex Vance',
    bio: 'data nerd turned generative artist 📊 loves automation, spreadsheets and cozy coffee chats.',
    avatar: '⚡',
    avatarBg: '#FFEFA6', // Butter Yellow
    token_balance: 2,
    skills_offered: ['Python 🐍', 'Data Viz 📊', 'Notion 📓', 'Spreadsheets 📈'],
    skills_wanted: ['Crochet 🧶', 'Film Photography 📸', 'Tailwind 💅'],
    rating: 4.85,
    total_swaps: 2,
    pronouns: 'they/he',
    vibeTag: 'Data Alchemist 🔮',
  },
];

export const INITIAL_SESSIONS: Session[] = [
  {
    id: 'session_1',
    topic: 'Figma Auto-Layout & Design System Tokens',
    skill: 'Figma 🖌️',
    notes: 'hey Kia! love your portfolio, would love to learn component properties and responsive auto-layout from you! ✨',
    status: 'PENDING',
    scheduledAt: '2026-09-29T14:00:00.000Z',
    durationMinutes: 60,
    tokenAmount: 1,
    learnerId: 'user_reza',
    learnerName: 'Reza Pratama',
    learnerUsername: 'reza',
    learnerAvatar: '🌟',
    mentorId: 'user_kia',
    mentorName: 'Kia Sparks',
    mentorUsername: 'kia',
    mentorAvatar: '🌸',
    createdAt: '2026-09-27T00:15:00.000Z',
  },
  {
    id: 'session_2',
    topic: 'Granny Squares & Color Transitions for Beginners',
    skill: 'Crochet 🧶',
    notes: 'Super excited to show you the magic loop and basic double crochet stitches! Have a 4.5mm hook ready 🧶',
    status: 'ACCEPTED',
    scheduledAt: '2026-09-28T16:30:00.000Z',
    durationMinutes: 60,
    tokenAmount: 1,
    learnerId: 'user_kia',
    learnerName: 'Kia Sparks',
    learnerUsername: 'kia',
    learnerAvatar: '🌸',
    mentorId: 'user_hana',
    mentorName: 'Hana Kim',
    mentorUsername: 'hana',
    mentorAvatar: '🧶',
    createdAt: '2026-09-26T18:00:00.000Z',
  },
  {
    id: 'session_3',
    topic: 'Intro to 3D Donut & Lighting in Blender',
    skill: '3D Blender 🍩',
    notes: 'Great session! You mastered geometry nodes faster than anyone I know! Keep rendering 🍩✨',
    status: 'COMPLETED',
    scheduledAt: '2026-09-24T10:00:00.000Z',
    durationMinutes: 60,
    tokenAmount: 1,
    learnerId: 'user_kia',
    learnerName: 'Kia Sparks',
    learnerUsername: 'kia',
    learnerAvatar: '🌸',
    mentorId: 'user_kenji',
    mentorName: 'Kenji Sato',
    mentorUsername: 'kenji',
    mentorAvatar: '👾',
    createdAt: '2026-09-24T09:00:00.000Z',
    completedAt: '2026-09-24T11:05:00.000Z',
  },
];

export const INITIAL_LEDGER: TransactionLedger[] = [
  {
    id: 'tx_init_1',
    amount: 2,
    type: 'INITIAL_GRANT',
    description: 'Welcome to Konnex! Initial 2-token grant (SDG 4 & 10) 🎁',
    senderId: 'system',
    senderName: 'Konnex Foundation',
    senderUsername: 'konnex',
    receiverId: 'user_kia',
    receiverName: 'Kia Sparks',
    receiverUsername: 'kia',
    createdAt: '2026-09-20T12:00:00.000Z',
  },
  {
    id: 'tx_swap_1',
    amount: 1,
    type: 'SWAP_TRANSFER',
    description: 'Completed 1-hr swap: 3D Blender 🍩 (Intro to 3D Donut)',
    senderId: 'user_kia',
    senderName: 'Kia Sparks',
    senderUsername: 'kia',
    receiverId: 'user_kenji',
    receiverName: 'Kenji Sato',
    receiverUsername: 'kenji',
    sessionId: 'session_3',
    createdAt: '2026-09-24T11:05:00.000Z',
  },
  {
    id: 'tx_swap_2',
    amount: 1,
    type: 'SWAP_TRANSFER',
    description: 'Completed 1-hr swap: React 💻 (State Management & Hooks)',
    senderId: 'user_maya',
    senderName: 'Maya Lin',
    senderUsername: 'maya',
    receiverId: 'user_kia',
    receiverName: 'Kia Sparks',
    receiverUsername: 'kia',
    createdAt: '2026-09-25T15:20:00.000Z',
  },
  {
    id: 'tx_swap_3',
    amount: 1,
    type: 'SWAP_TRANSFER',
    description: 'Completed 1-hr swap: Tailwind 💅 (Neo-Brutalist Layouts)',
    senderId: 'user_alex',
    senderName: 'Alex Vance',
    senderUsername: 'alex',
    receiverId: 'user_kia',
    receiverName: 'Kia Sparks',
    receiverUsername: 'kia',
    createdAt: '2026-09-26T11:00:00.000Z',
  },
];

// Helper to trigger confetti celebration
export function fireConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFB7D5', '#D6C7FF', '#FFEFA6', '#C1F2B0', '#AEE2FF', '#000000'],
    });
  } catch (e) {
    // ignore in testing environments
  }
}

// Storage key
const STORAGE_KEY = 'konnex_app_state_v1';

export interface AppState {
  currentUserId: string;
  users: User[];
  sessions: Session[];
  ledger: TransactionLedger[];
}

export function loadStoredState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.users && parsed.sessions && parsed.ledger) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed reading localStorage', e);
  }

  return {
    currentUserId: 'user_kia',
    users: INITIAL_USERS,
    sessions: INITIAL_SESSIONS,
    ledger: INITIAL_LEDGER,
  };
}

export function saveStoredState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed saving localStorage', e);
  }
}

// Calculate match score between active user and another user
export function calculateMatchScore(currentUser: User, candidate: User): MatchResult {
  // Normalize skills for comparison (strip emojis or match substring)
  const cleanSkill = (s: string) => s.split(' ')[0].toLowerCase().trim();

  const myWants = currentUser.skills_wanted.map(cleanSkill);
  const myOffers = currentUser.skills_offered.map(cleanSkill);

  // Skills they offer that I want
  const mutualMatches = candidate.skills_offered.filter((theirOffer) =>
    myWants.some((want) => cleanSkill(theirOffer).includes(want) || want.includes(cleanSkill(theirOffer)))
  );

  // Skills they want that I offer
  const reverseMatches = candidate.skills_wanted.filter((theirWant) =>
    myOffers.some((offer) => cleanSkill(theirWant).includes(offer) || offer.includes(cleanSkill(theirWant)))
  );

  let score = 50; // base score for vibrant discovery
  let matchType: 'mutual' | 'they_teach' | 'you_teach' | 'explore' = 'explore';

  if (mutualMatches.length > 0 && reverseMatches.length > 0) {
    // Perfect two-way swap match!
    score = 90 + Math.min(9, (mutualMatches.length + reverseMatches.length) * 2);
    matchType = 'mutual';
  } else if (mutualMatches.length > 0) {
    // They offer what I want
    score = 75 + Math.min(14, mutualMatches.length * 5);
    matchType = 'they_teach';
  } else if (reverseMatches.length > 0) {
    // You offer what they want
    score = 65 + Math.min(14, reverseMatches.length * 4);
    matchType = 'you_teach';
  } else {
    // Shared exploratory interest
    score = 55 + Math.floor(candidate.rating * 5);
    matchType = 'explore';
  }

  return {
    user: candidate,
    matchScore: Math.min(99, score),
    mutualMatches,
    reverseMatches,
    matchType,
  };
}
