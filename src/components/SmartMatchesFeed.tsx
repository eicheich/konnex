// src/components/SmartMatchesFeed.tsx
import React, { useState, useMemo } from 'react';
import { User, MatchResult } from '../types';
import { calculateMatchScore } from '../services/store';
import { Search, Star, ArrowRight, CheckCircle2, Sparkles, Filter, BookOpen } from 'lucide-react';

interface SmartMatchesFeedProps {
  currentUser: User;
  allUsers: User[];
  onOpenBooking: (targetUser: User, preselectedSkill?: string) => void;
  onOpenProfile: () => void;
}

export const SmartMatchesFeed: React.FC<SmartMatchesFeedProps> = ({
  currentUser,
  allUsers,
  onOpenBooking,
  onOpenProfile,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'mutual' | 'they_teach' | 'you_teach'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate scores for all other users
  const scoredMatches = useMemo(() => {
    const candidates = allUsers.filter((u) => u.id !== currentUser.id);
    const results: MatchResult[] = candidates.map((candidate) =>
      calculateMatchScore(currentUser, candidate)
    );

    // Sort by match score descending
    results.sort((a, b) => b.matchScore - a.matchScore);
    return results;
  }, [currentUser, allUsers]);

  // Apply filters & search query
  const filteredMatches = useMemo(() => {
    return scoredMatches.filter(({ user, matchType }) => {
      if (filterType === 'mutual' && matchType !== 'mutual') return false;
      if (filterType === 'they_teach' && matchType !== 'they_teach' && matchType !== 'mutual') return false;
      if (filterType === 'you_teach' && matchType !== 'you_teach' && matchType !== 'mutual') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = user.name.toLowerCase().includes(q) || user.username.toLowerCase().includes(q);
        const matchesBio = user.bio.toLowerCase().includes(q);
        const matchesOffered = user.skills_offered.some((s) => s.toLowerCase().includes(q));
        const matchesWanted = user.skills_wanted.some((s) => s.toLowerCase().includes(q));
        return matchesName || matchesBio || matchesOffered || matchesWanted;
      }

      return true;
    });
  }, [scoredMatches, filterType, searchQuery]);

  return (
    <div className="space-y-5">
      
      {/* Feed Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">
            Rekomendasi Partner Barter
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Kecocokan keahlian yang Anda cari dengan yang ditawarkan komunitas
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari keahlian atau nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 shadow-xs"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-zinc-200/60">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filterType === 'all'
              ? 'bg-zinc-900 text-white font-semibold'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          Semua Rekomendasi ({scoredMatches.length})
        </button>

        <button
          onClick={() => setFilterType('mutual')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filterType === 'mutual'
              ? 'bg-zinc-900 text-white font-semibold'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          Kecocokan Saling Menguntungkan
        </button>

        <button
          onClick={() => setFilterType('they_teach')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filterType === 'they_teach'
              ? 'bg-zinc-900 text-white font-semibold'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          Mengajarkan yang Anda Cari
        </button>

        <button
          onClick={() => setFilterType('you_teach')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filterType === 'you_teach'
              ? 'bg-zinc-900 text-white font-semibold'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          Mencari yang Anda Ajarkan
        </button>
      </div>

      {/* Profile Cards Grid */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMatches.map(({ user, matchScore, mutualMatches, reverseMatches, matchType }) => {
            const isMutual = matchType === 'mutual';

            return (
              <div
                key={user.id}
                className="card-classy p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Top card row: Compatibility Badge & Rating */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md inline-flex items-center gap-1 ${
                        isMutual
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : matchScore >= 75
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {isMutual && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      <span>{matchScore}% Cocok</span>
                    </span>

                    <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-zinc-700">{user.rating.toFixed(1)}</span>
                      <span>({user.total_swaps} sesi)</span>
                    </div>
                  </div>

                  {/* User Profile Header */}
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xl shrink-0">
                      {user.avatar}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-heading font-bold text-base text-zinc-900 truncate">
                        {user.name}
                      </h3>
                      <p className="text-xs text-zinc-500 font-medium truncate">
                        @{user.username} · {user.pronouns}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-zinc-600 mt-2.5 line-clamp-2 leading-relaxed font-normal">
                    {user.bio}
                  </p>

                  {/* Mutual Match Highlight Note */}
                  {mutualMatches.length > 0 && (
                    <div className="mt-3 p-2 bg-emerald-50/60 border border-emerald-100 rounded-lg text-[11px] text-emerald-900 font-medium">
                      Mengajarkan keahlian yang Anda cari: <span className="font-semibold">{mutualMatches.join(', ')}</span>
                    </div>
                  )}

                  {/* Skills Grid */}
                  <div className="mt-3.5 space-y-2.5 text-xs pt-3 border-t border-zinc-100">
                    <div>
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                        Bisa Mengajarkan:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {user.skills_offered.map((skill) => {
                          const isMatch = currentUser.skills_wanted.some((w) =>
                            w.toLowerCase().includes(skill.split(' ')[0].toLowerCase())
                          );
                          return (
                            <span
                              key={skill}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                                isMatch
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                                  : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                              }`}
                            >
                              {skill}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                        Ingin Mempelajari:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {user.skills_wanted.map((skill) => {
                          const isMatch = currentUser.skills_offered.some((o) =>
                            o.toLowerCase().includes(skill.split(' ')[0].toLowerCase())
                          );
                          return (
                            <span
                              key={skill}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                                isMatch
                                  ? 'bg-amber-50 border-amber-200 text-amber-900 font-semibold'
                                  : 'bg-zinc-50/50 border-zinc-100 text-zinc-500'
                              }`}
                            >
                              {skill}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-4 mt-3 border-t border-zinc-100">
                  <button
                    onClick={() => onOpenBooking(user)}
                    className="w-full btn-primary text-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Ajukan Sesi Barter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 px-4 rounded-xl border border-zinc-200 bg-white">
          <p className="text-sm font-semibold text-zinc-800">
            Tidak ditemukan partner yang sesuai dengan kriteria.
          </p>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau tambahkan keahlian yang ingin Anda pelajari di profil.
          </p>
          <button
            onClick={onOpenProfile}
            className="btn-secondary text-xs mt-3"
          >
            Kelola Keahlian Saya
          </button>
        </div>
      )}

    </div>
  );
};
