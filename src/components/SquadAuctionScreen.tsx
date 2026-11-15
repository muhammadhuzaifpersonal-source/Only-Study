import React, { useMemo, useState } from 'react';
import { Search, X, Gavel, Check } from 'lucide-react';
import { Player, PlayerCategory } from '../types';
import { ResilientImage } from './ResilientImage';

interface SquadAuctionScreenProps {
  players: Player[];
  onPlaceBid: (playerId: string, bidderLabel: string, newAmountLakhs: number) => void;
}

const CATEGORIES: PlayerCategory[] = ['All', 'Batters', 'Bowlers', 'All-Rounders'];

export const SquadAuctionScreen: React.FC<SquadAuctionScreenProps> = ({
  players,
  onPlaceBid,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PlayerCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [patronName, setPatronName] = useState('');
  const [bidNotice, setBidNotice] = useState<string | null>(null);

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const matchesRole =
        selectedCategory === 'All' ||
        (selectedCategory === 'Batters' && player.role === 'Batter') ||
        (selectedCategory === 'Bowlers' && player.role === 'Bowler') ||
        (selectedCategory === 'All-Rounders' && player.role === 'All-Rounder');

      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        player.name.toLowerCase().includes(q) ||
        player.hometown.toLowerCase().includes(q) ||
        player.battingStyle.toLowerCase().includes(q);

      return matchesRole && matchesQuery;
    });
  }, [players, selectedCategory, searchQuery]);

  const activePlayer = useMemo(
    () => players.find((p) => p.id === activePlayerId) ?? null,
    [players, activePlayerId]
  );

  const handleOpenPlayer = (playerId: string) => {
    setActivePlayerId(playerId);
    setBidNotice(null);
  };

  const handleConfirmBid = (incrementLakhs: number) => {
    if (!activePlayer) return;
    const label = patronName.trim()
      ? `${patronName.trim()} · Verified Patron`
      : 'Patron #904 · Srinagar';
    const nextAmount = Number((activePlayer.currentBidLakhs + incrementLakhs).toFixed(1));
    onPlaceBid(activePlayer.id, label, nextAmount);
    setBidNotice(`Bid accepted at ₹${nextAmount.toFixed(1)}L for ${activePlayer.name}`);
  };

  return (
    <div className="space-y-10">
      {/* Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#F59E0B]">
            2026 Valley Roster & Patron Vault
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-[#F8FAFC] text-balance">
            Squad Profiles & Live Patron Auction
          </h1>
          <p className="text-sm text-[#859585]">
            Explore full career telemetry across Zabarwan XI’s starting unit and bid on authenticated match-worn relics.
          </p>
        </div>

        {/* Search + Segmented Role Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search player or city..."
              aria-label="Search squad players"
              className="obsidian-input pl-10 pr-4 py-2.5 rounded-xl text-sm w-full sm:w-56"
            />
          </div>

          <div
            role="tablist"
            aria-label="Filter squad by role"
            className="flex items-center gap-1 p-1 rounded-xl bg-[#0E1317] border border-white/[0.08] overflow-x-auto"
          >
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#00E676] text-[#0A0D0F] font-bold'
                      : 'text-[#859585] hover:text-[#F8FAFC]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredPlayers.length === 0 ? (
        <div className="obsidian-card p-12 text-center space-y-4">
          <p className="font-display text-xl font-bold text-[#F8FAFC]">
            No squad members match "{searchQuery}"
          </p>
          <p className="text-sm text-[#859585]">
            Clear your search or switch back to all player roles.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="cta-stadium-green px-5 py-2.5 text-xs cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Player Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map((player) => (
            <article
              key={player.id}
              className="obsidian-card-interactive overflow-hidden flex flex-col"
            >
              <div className="relative h-64 overflow-hidden bg-[#171C20]">
                <ResilientImage
                  src={player.image}
                  alt={`${player.name} — Zabarwan XI ${player.role}`}
                  className="w-full h-full object-cover object-top"
                  fallbackTitle={player.name}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0E1317] via-[#0E1317]/20 to-transparent"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#75FF9E]">
                    #{player.number} · {player.role} · {player.hometown}
                  </p>
                  <h2 className="font-display text-2xl font-bold text-[#F8FAFC]">
                    {player.name}
                  </h2>
                  <p className="text-xs text-[#859585]">
                    {player.battingStyle} · {player.matches} Matches
                  </p>
                </div>

                {/* Career Stats Row */}
                <div className="grid grid-cols-3 gap-3 py-4 border-y border-white/[0.07]">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                      Avg
                    </p>
                    <p className="font-display text-lg font-bold text-[#F8FAFC] tabular-nums mt-0.5">
                      {player.average}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                      SR
                    </p>
                    <p className="font-display text-lg font-bold text-[#F8FAFC] tabular-nums mt-0.5">
                      {player.strikeRate}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                      Best
                    </p>
                    <p className="font-display text-lg font-bold text-[#FFB95F] tabular-nums mt-0.5">
                      {player.bestPerformance}
                    </p>
                  </div>
                </div>

                {/* Auction Footer */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#F59E0B]">
                      Patron Bid
                    </p>
                    <p className="font-display text-lg font-extrabold text-[#F8FAFC] tabular-nums">
                      ₹{player.currentBidLakhs.toFixed(1)}L
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenPlayer(player.id)}
                    className="cta-prestige-gold px-4 py-2.5 text-xs whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Inspect & Bid
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Level 3 Modal: Player Dossier & Live Auction Console */}
      {activePlayer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="player-dossier-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm"
        >
          <div
            className="w-full max-w-3xl rounded-[28px] bg-[#0E1317] border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto"
            style={{
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(0, 230, 118, 0.08)',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Portrait Column */}
              <div className="md:col-span-5 relative min-h-[260px] bg-[#171C20]">
                <ResilientImage
                  src={activePlayer.image}
                  alt={activePlayer.name}
                  className="w-full h-full object-cover object-top"
                  fallbackTitle={activePlayer.name}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0E1317] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0E1317]/60"
                />
              </div>

              {/* Dossier & Auction Bid Form */}
              <div className="md:col-span-7 p-6 md:p-8 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#00E676]">
                      #{activePlayer.number} · {activePlayer.role} · Age {activePlayer.age}
                    </p>
                    <h2 id="player-dossier-title" className="font-display text-2xl md:text-3xl font-extrabold text-[#F8FAFC]">
                      {activePlayer.name}
                    </h2>
                    <p className="text-xs text-[#859585]">
                      {activePlayer.hometown} · {activePlayer.battingStyle}
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label="Close player dossier"
                    onClick={() => setActivePlayerId(null)}
                    className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-[#bacbb9] hover:text-[#F8FAFC] hover:border-white/30 transition-colors cursor-pointer shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-[#bacbb9] leading-relaxed">
                  {activePlayer.bio}
                </p>

                {/* Relic Lot Summary */}
                <div className="p-4 rounded-2xl bg-[#171C20] border border-white/[0.07] space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#F59E0B]">
                        Authenticated Auction Lot
                      </p>
                      <p className="text-sm font-semibold text-[#F8FAFC] mt-0.5">
                        {activePlayer.auctionItemTitle}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                        Current Bid
                      </p>
                      <p className="font-display text-2xl font-extrabold text-[#FFB95F] tabular-nums">
                        ₹{activePlayer.currentBidLakhs.toFixed(1)}L
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                    <label htmlFor="patron-bidder-input" className="block text-xs font-medium text-[#bacbb9]">
                      Patron Name / Syndicate ID (Optional)
                    </label>
                    <input
                      id="patron-bidder-input"
                      type="text"
                      value={patronName}
                      onChange={(e) => setPatronName(e.target.value)}
                      placeholder="e.g. Patron #904 · Srinagar"
                      className="obsidian-input w-full px-3.5 py-2.5 rounded-xl text-sm"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleConfirmBid(0.5)}
                      className="cta-stadium-green px-4 py-2.5 text-xs inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Gavel className="w-3.5 h-3.5" />
                      <span>Bid +₹0.5L (₹{(activePlayer.currentBidLakhs + 0.5).toFixed(1)}L)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleConfirmBid(1.0)}
                      className="cta-prestige-gold px-4 py-2.5 text-xs inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Bid +₹1.0L (₹{(activePlayer.currentBidLakhs + 1.0).toFixed(1)}L)</span>
                    </button>
                  </div>

                  {bidNotice && (
                    <p className="text-xs font-medium text-[#75FF9E] inline-flex items-center gap-1.5 pt-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>{bidNotice}</span>
                    </p>
                  )}
                </div>

                {/* Bid Ledger */}
                <div className="space-y-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                    Recent Verified Bids
                  </p>
                  <div className="divide-y divide-white/[0.06] max-h-36 overflow-y-auto">
                    {activePlayer.bidHistory.map((bid, index) => (
                      <div key={`${bid.bidder}-${index}`} className="py-2 flex items-center justify-between text-xs">
                        <span className="text-[#dfe3e9] font-medium">{bid.bidder}</span>
                        <div className="flex items-center gap-3 tabular-nums">
                          <span className="text-[#64748B]">{bid.time}</span>
                          <span className="font-display font-bold text-[#F59E0B]">
                            ₹{bid.amountLakhs.toFixed(1)}L
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
