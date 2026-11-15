import React from 'react';
import { ArrowRight, Play, ChevronRight } from 'lucide-react';
import { Fixture, LiveMatchState, ScreenId } from '../types';
import { ASSETS, UPCOMING_FIXTURES } from '../data/franchiseData';
import { ResilientImage } from './ResilientImage';

interface ArenaScreenProps {
  match: LiveMatchState;
  onSimulateBall: () => void;
  onNavigate: (screen: ScreenId) => void;
  onReserveFixture: (fixture: Fixture) => void;
}

export const ArenaScreen: React.FC<ArenaScreenProps> = ({
  match,
  onSimulateBall,
  onNavigate,
  onReserveFixture,
}) => {
  const ballsBowled = match.homeTeam.overs * 6 + match.homeTeam.ballsInOver;
  const ballsRemaining = Math.max(0, 120 - ballsBowled);
  const runsNeeded = Math.max(0, match.homeTeam.target - match.homeTeam.runs);
  const crr = ballsBowled > 0 ? ((match.homeTeam.runs / ballsBowled) * 6).toFixed(2) : '0.00';
  const rrr = ballsRemaining > 0 ? ((runsNeeded / ballsRemaining) * 6).toFixed(2) : '0.00';
  const isChased = match.homeTeam.runs >= match.homeTeam.target;

  return (
    <div className="space-y-16 md:space-y-24">
      {/* 1. Hero Section: Dominant 16:9 Floodlit Alpine Stadium Backdrop */}
      <section className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0E1317]">
        <div className="relative min-h-[540px] lg:min-h-[620px] flex items-end">
          <ResilientImage
            src={ASSETS.heroStadium}
            alt="Sher-e-Kashmir Alpine Oval floodlit cricket arena at twilight beneath snow-capped peaks"
            className="absolute inset-0 w-full h-full object-cover object-center"
            fallbackTitle="Sher-e-Kashmir Alpine Oval"
          />
          {/* Measured gradient scrim for guaranteed >=4.5:1 text contrast */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#0A0D0F] via-[#0A0D0F]/70 to-[#0A0D0F]/25"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#0A0D0F]/90 via-[#0A0D0F]/45 to-transparent"
          />

          <div className="relative z-10 w-full p-7 md:p-12 lg:p-16 max-w-3xl space-y-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#75FF9E]">
              Srinagar Alpine Oval · 1,585m Elevation · Season 2026
            </p>

            <h1 className="font-display text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#F8FAFC] text-balance">
              Floodlit cricket carved from Himalayan slate.
            </h1>

            <p className="text-base md:text-lg text-[#bacbb9] leading-relaxed max-w-xl">
              High-altitude championship matches, live pitch telemetry, and bespoke Kashmiri willow craftsmanship from the Zabarwan range.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('match')}
                className="cta-stadium-green px-7 py-3.5 text-sm inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Enter Match Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('atelier')}
                className="px-6 py-3.5 rounded-xl border border-white/15 text-sm font-medium text-[#F8FAFC] hover:border-white/35 hover:bg-white/[0.04] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Explore Atelier Lab
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Telemetry & Split-Flap Scoreboard Bar */}
      <section aria-label="Live Match Telemetry" className="obsidian-card p-6 md:p-8 relative overflow-hidden">
        {/* Subtle floodlight emerald ambient bloom */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/3 w-72 h-72 rounded-full bg-[#00E676]/10 blur-3xl"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.07]">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#00E676]">
              {isChased ? 'Match Complete · Zabarwan XI Victory' : match.statusLabel}
            </p>
            <h2 className="font-display text-xl md:text-2xl font-bold text-[#F8FAFC]">
              {match.matchTitle}
            </h2>
            <p className="text-sm text-[#859585]">
              {match.venue} · {match.elevation}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onSimulateBall}
              disabled={isChased || ballsRemaining === 0}
              className="cta-prestige-gold px-5 py-2.5 text-xs md:text-sm inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Simulate Next Ball</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('match')}
              className="px-5 py-2.5 rounded-xl border border-white/15 text-xs md:text-sm font-medium text-[#F8FAFC] hover:border-[#00E676]/50 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Full Scorecard</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Split-Flap Score Matrix */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 items-center">
          {/* Home Team Split-Flap */}
          <div className="md:col-span-4 flex items-baseline justify-between md:justify-start gap-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#bacbb9]">
                {match.homeTeam.code} · Chasing
              </p>
              <p className="font-display text-3xl md:text-4xl font-extrabold text-[#F8FAFC] tabular-nums mt-1">
                {match.homeTeam.runs}/{match.homeTeam.wickets}
              </p>
            </div>
            <div className="text-right md:text-left">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                Overs
              </p>
              <p className="font-display text-xl font-bold text-[#00E676] tabular-nums mt-1">
                {match.homeTeam.overs}.{match.homeTeam.ballsInOver}
              </p>
            </div>
          </div>

          {/* Hairline Split-Flap Divider & Away Score */}
          <div className="md:col-span-4 md:border-x md:border-white/[0.08] md:px-6 flex items-baseline justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                {match.awayTeam.code} · 1st Innings
              </p>
              <p className="font-display text-2xl font-bold text-[#dfe3e9] tabular-nums mt-1">
                {match.awayTeam.runs}/{match.awayTeam.wickets}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                Target
              </p>
              <p className="font-display text-2xl font-bold text-[#F59E0B] tabular-nums mt-1">
                {match.homeTeam.target}
              </p>
            </div>
          </div>

          {/* Live Telemetry Rates */}
          <div className="md:col-span-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                CRR
              </p>
              <p className="font-display text-xl font-bold text-[#F8FAFC] tabular-nums mt-1">
                {crr}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                RRR
              </p>
              <p className="font-display text-xl font-bold text-[#FFB95F] tabular-nums mt-1">
                {isChased ? '0.00' : rrr}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                Need
              </p>
              <p className="font-display text-xl font-bold text-[#75FF9E] tabular-nums mt-1">
                {isChased ? 'Won' : `${runsNeeded} (${ballsRemaining})`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Asymmetric Bento Showcase: Franchise Roster + Performance Atelier */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#F59E0B]">
              Franchise Architecture & Craft
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[#F8FAFC] text-balance">
              Engineered for nocturnal valley velocity.
            </h2>
          </div>
          <p className="text-sm text-[#859585] max-w-md">
            Every stitch, willow cleft, and bowling tactical model is calibrated for 1,585m air density and late-evening mountain dew.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Col-span 5: Captain Dossier & Patron Auction */}
          <article
            onClick={() => onNavigate('squad')}
            className="lg:col-span-5 obsidian-card-interactive overflow-hidden flex flex-col cursor-pointer"
          >
            <div className="relative h-80 lg:h-96 overflow-hidden">
              <ResilientImage
                src={ASSETS.captainPortrait}
                alt="Aarav Dar in Zabarwan XI obsidian and emerald match kit inside stadium tunnel"
                className="w-full h-full object-cover object-top"
                fallbackTitle="Captain Aarav Dar"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#0E1317] via-transparent to-transparent"
              />
            </div>

            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#00E676]">
                  Squad & Patron Auction · 2026 Roster
                </p>
                <h3 className="font-display text-2xl font-bold text-[#F8FAFC]">
                  Aarav Dar & The Valley Core
                </h3>
                <p className="text-sm text-[#bacbb9] leading-relaxed">
                  Inspect full batting and pace profiles across six marquee Kashmir & northern specialists, with live patron bids on match-worn relics.
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between text-sm">
                <span className="text-[#859585] tabular-nums">146.2 km/h Peak Pace · 152.4 Avg SR</span>
                <span className="text-[#00E676] font-semibold inline-flex items-center gap-1">
                  Open Roster <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </article>

          {/* Col-span 7: Stacked Atelier Showcase + Willow Craft */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <article
              onClick={() => onNavigate('atelier')}
              className="obsidian-card-interactive overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch flex-1 cursor-pointer"
            >
              <div className="md:col-span-6 relative min-h-[240px]">
                <ResilientImage
                  src={ASSETS.performanceKit}
                  alt="Obsidian Pro Match Kit and Alpine Track Jacket on honed basalt stone"
                  className="w-full h-full object-cover"
                  fallbackTitle="Obsidian Pro Match Kit"
                />
              </div>
              <div className="md:col-span-6 p-6 md:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#F59E0B]">
                    Atelier Lab · Matchwear Drop 01
                  </p>
                  <h3 className="font-display text-2xl font-bold text-[#F8FAFC]">
                    Merino-Weave Match Issue
                  </h3>
                  <p className="text-sm text-[#bacbb9] leading-relaxed">
                    Hydrophobic Japanese merino knit and ripstop outer shells with brushed brass crests. Built for cold dusk overs.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between text-sm">
                  <span className="text-[#F8FAFC] font-bold tabular-nums">From ₹9,800</span>
                  <span className="text-[#00E676] font-semibold inline-flex items-center gap-1">
                    Shop Atelier <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </article>

            <article
              onClick={() => onNavigate('atelier')}
              className="obsidian-card-interactive overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch flex-1 cursor-pointer"
            >
              <div className="md:col-span-6 relative min-h-[240px]">
                <ResilientImage
                  src={ASSETS.willowBat}
                  alt="Handcrafted Kashmir Willow cricket bat and obsidian leather ball with gold seam"
                  className="w-full h-full object-cover"
                  fallbackTitle="Kashmir Willow Craft"
                />
              </div>
              <div className="md:col-span-6 p-6 md:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#75FF9E]">
                    Anantnag Cleft Archive · Batch of 50
                  </p>
                  <h3 className="font-display text-2xl font-bold text-[#F8FAFC]">
                    14-Year Seasoned Kashmir Willow
                  </h3>
                  <p className="text-sm text-[#bacbb9] leading-relaxed">
                    Hand-pressed clefts paired with carbon-weave vibration handles and waxed gold-seam match spheres.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between text-sm">
                  <span className="text-[#F8FAFC] font-bold tabular-nums">94% Batch Reserved</span>
                  <span className="text-[#00E676] font-semibold inline-flex items-center gap-1">
                    Inspect Gear <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 4. Upcoming Valley Fixtures Schedule */}
      <section className="obsidian-card p-6 md:p-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/[0.07]">
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#00E676]">
              Upcoming Valley Fixtures
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#F8FAFC]">
              Winter Night Series Hospitality
            </h2>
          </div>
          <p className="text-sm text-[#859585]">
            Heated pavilion seating and floodlight suite allocations open for patrons.
          </p>
        </div>

        <div className="divide-y divide-white/[0.07]">
          {UPCOMING_FIXTURES.map((fixture) => (
            <div
              key={fixture.id}
              className="py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            >
              <div className="space-y-1">
                <p className="text-xs text-[#859585] tabular-nums">
                  {fixture.date} · {fixture.time} · {fixture.elevation}
                </p>
                <h3 className="font-display text-xl font-bold text-[#F8FAFC]">
                  Zabarwan XI vs. {fixture.opponent}
                </h3>
                <p className="text-sm text-[#bacbb9]">
                  {fixture.tournament} · {fixture.venue}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between lg:justify-end gap-6">
                <div className="text-left lg:text-right">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#F59E0B]">
                    {fixture.status}
                  </p>
                  <p className="font-display text-lg font-bold text-[#F8FAFC] tabular-nums">
                    From ₹{fixture.startingPriceInr.toLocaleString('en-IN')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onReserveFixture(fixture)}
                  className="px-5 py-2.5 rounded-xl border border-white/15 text-sm font-medium text-[#F8FAFC] hover:border-[#00E676] hover:text-[#00E676] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Reserve Seat
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
