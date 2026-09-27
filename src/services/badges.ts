// src/services/badges.ts
import { Badge, Session, TransactionLedger, User } from '../types';

export function calculateUserBadges(
  user: User,
  sessions: Session[],
  ledger: TransactionLedger[]
): Badge[] {
  // Filter sessions related to this user
  const userSessions = sessions.filter(
    (s) => s.learnerId === user.id || s.mentorId === user.id
  );

  const completedSessions = userSessions.filter((s) => s.status === 'COMPLETED');
  const completedAsMentor = completedSessions.filter((s) => s.mentorId === user.id);
  const completedAsLearner = completedSessions.filter((s) => s.learnerId === user.id);

  // Filter non-grant swap transactions
  const userTransactions = ledger.filter(
    (t) => (t.senderId === user.id || t.receiverId === user.id) && t.type === 'SWAP_TRANSFER'
  );

  const hasFirstTransaction = userTransactions.length > 0 || completedSessions.length > 0;
  const firstTxDate = userTransactions[0]?.createdAt || completedSessions[0]?.completedAt;

  const badges: Badge[] = [
    {
      id: 'first_transaction',
      name: 'Transaksi Perdana',
      description: 'Menyelesaikan transaksi barter keahlian 1 jam pertama di Konnex.',
      icon: '🪙',
      badgeColor: 'amber',
      category: 'transaksi',
      isUnlocked: hasFirstTransaction,
      unlockedAt: firstTxDate ? new Date(firstTxDate).toLocaleDateString('id-ID') : undefined,
      progressText: hasFirstTransaction ? '1/1 Transaksi Selesai' : '0/1 Selesai',
      requirement: 'Selesaikan 1 sesi barter keahlian untuk klaim token.',
    },
    {
      id: 'community_mentor',
      name: 'Mentor Inspiratif',
      description: 'Berhasil membimbing sesama anggota komunitas selama minimal 1 jam.',
      icon: '💡',
      badgeColor: 'emerald',
      category: 'edukasi',
      isUnlocked: completedAsMentor.length >= 1,
      unlockedAt: completedAsMentor[0]?.completedAt ? new Date(completedAsMentor[0].completedAt).toLocaleDateString('id-ID') : undefined,
      progressText: `${completedAsMentor.length}/1 Sesi Bimbingan`,
      requirement: 'Bantu dan ajar rekan komunitas sebagai mentor.',
    },
    {
      id: 'curious_learner',
      name: 'Pembelajar Aktif',
      description: 'Menyelesaikan sesi pembelajaran untuk meningkatkan keterampilan baru.',
      icon: '📖',
      badgeColor: 'blue',
      category: 'edukasi',
      isUnlocked: completedAsLearner.length >= 1,
      unlockedAt: completedAsLearner[0]?.completedAt ? new Date(completedAsLearner[0].completedAt).toLocaleDateString('id-ID') : undefined,
      progressText: `${completedAsLearner.length}/1 Sesi Belajar`,
      requirement: 'Pesan sesi dan pelajari keahlian baru dari mentor.',
    },
    {
      id: 'swap_master',
      name: 'Master Barter',
      description: 'Menyelesaikan 3 atau lebih sesi barter keahlian bernilai waktu.',
      icon: '🏆',
      badgeColor: 'purple',
      category: 'transaksi',
      isUnlocked: user.total_swaps >= 3 || completedSessions.length >= 3,
      unlockedAt: completedSessions[2]?.completedAt ? new Date(completedSessions[2].completedAt).toLocaleDateString('id-ID') : undefined,
      progressText: `${Math.min(user.total_swaps, 3)}/3 Sesi Selesai`,
      requirement: 'Selesaikan minimal 3 sesi barter di platform.',
    },
    {
      id: 'polymath',
      name: 'Multi-Talenta',
      description: 'Menawarkan 3 keahlian atau lebih yang siap dibagikan kepada publik.',
      icon: '🎨',
      badgeColor: 'rose',
      category: 'komunitas',
      isUnlocked: user.skills_offered.length >= 3,
      unlockedAt: 'Profil Lengkap',
      progressText: `${user.skills_offered.length}/3 Keahlian`,
      requirement: 'Daftarkan minimal 3 keahlian di daftar yang Anda ajarkan.',
    },
    {
      id: 'five_star',
      name: 'Reputasi Bintang Lima',
      description: 'Mempertahankan penilaian reputasi tinggi dari mitra belajar.',
      icon: '⭐',
      badgeColor: 'amber',
      category: 'reputasi',
      isUnlocked: user.rating >= 4.9,
      unlockedAt: 'Rating Terjaga',
      progressText: `${user.rating.toFixed(1)} / 5.0 Rating`,
      requirement: 'Raih rating rata-rata 4.9 atau lebih dari rekan barter.',
    },
    {
      id: 'sdg_pioneer',
      name: 'Duta SDG Waktu',
      description: 'Terdaftar sebagai warga aktif dalam ekonomi kesetaraan waktu (SDG 4 & 10).',
      icon: '⚖️',
      badgeColor: 'emerald',
      category: 'komunitas',
      isUnlocked: true, // All registered users receive this pioneer membership
      unlockedAt: 'Anggota Perdana',
      progressText: 'Aktif Berkontribusi',
      requirement: 'Menjadi bagian dari komunitas pertukaran waktu tanpa uang.',
    },
  ];

  return badges;
}
