import React from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { LiveMatchState } from '../types';

interface MatchCenterScreenProps {
  match: LiveMatchState;
  autoPlay: boolean;
  onToggleAutoPlay: () => void;
  onSimulateBall: () => void;
  onResetMatch: () => void;
}

export const MatchCenterScreen: React.FC<MatchCenterScreenProps> = ({
  match,
  autoPlay,
  onToggleAutoPlay,
  onSimulateBall,
  onResetMatch,
}) => {
  const ballsBowled = match.homeTeam.overs * 6 + match.homeTeam.ballsInOver;
  const ballsRemaining = Math.max(0, 120 - ballsBowled);
  const runsNeeded = Math.max(0, match.homeTeam.target - match.homeTeam.runs);
  const isChased = match.homeTeam.runs >= match.homeTeam.target;
  const isOverComplete = ballsRemaining === 0 && !isChased;
  const crr = ballsBowled > 0 ? ((match.homeTeam.runs / ballsBowled) * 6).toFixed(2) : '0.00';
  const rrr = ballsRemaining > 0 ? ((runsNeeded / ballsRemaining) * 6).toFixed(2) : '0.00';

  const maxOverRuns = Math.max(...match.overTotals.map((o) => o.runs), 16);

  return (
    <div className="space-y-10">
      {/* Header + Live Simulator Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#00E676]">
            {isChased
              ? 'Result · Zabarwan XI Won'
              : isOverComplete
              ? 'Result · Ladakh Glaciers Defended'
              : match.statusLabel}
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-[#F8FAFC] text-balance">
            {match.matchTitle}
          </h1>
          <p className="text-sm text-[#859585]">
            {match.venue} · {match.elevation}
          </p>
        </div>

        {/* Interactive Telemetry Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onSimulateBall}
            disabled={isChased || isOverComplete}
            className="cta-stadium-green px-5 py-2.5 text-sm inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            <span>Simulate Delivery</span>
          </button>

          {/* Obsidian Pitch 44x24px Switch Toggle */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-white/10 bg-[#0E1317]">
            <span className="text-xs font-medium text-[#dfe3e9] whitespace-nowrap">
              Auto-Feed
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={autoPlay}
              aria-label="Toggle automatic ball simulation"
              onClick={onToggleAutoPlay}
              disabled={isChased || isOverComplete}
              className={`relative w-[44px] h-[24px] rounded-full transition-colors cursor-pointer disabled:opacity-40 ${
                autoPlay ? 'bg-[#059669]' : 'bg-[#262B2F]'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-[#F8FAFC] shadow-sm transition-transform duration-150 ${
                  autoPlay ? 'translate-x-[24px]' : 'translate-x-[4px]'
                }`}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={onResetMatch}
            className="px-4 py-2.5 rounded-xl border border-white/15 text-xs font-medium text-[#bacbb9] hover:text-[#F8FAFC] hover:border-white/30 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Chase</span>
          </button>
        </div>
      </div>

      {/* Split-Flap Broadcast Scoreboard */}
      <section className="obsidian-card p-6 md:p-8 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 right-1/4 w-80 h-80 rounded-full bg-[#00E676]/10 blur-3xl"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Home Score */}
          <div className="lg:col-span-5 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#75FF9E]">
              {match.homeTeam.name} ({match.homeTeam.code})
            </p>
            <div className="flex items-baseline gap-4">
              <span className="font-display text-5xl font-extrabold text-[#F8FAFC] tabular-nums">
                {match.homeTeam.runs}/{match.homeTeam.wickets}
              </span>
              <span className="font-display text-xl font-bold text-[#00E676] tabular-nums">
                {match.homeTeam.overs}.{match.homeTeam.ballsInOver} / 20.0 Ov
              </span>
            </div>
            <p className="text-sm text-[#FFB95F] font-medium tabular-nums">
              {isChased
                ? `Zabarwan XI won by ${10 - match.homeTeam.wickets} wickets`
                : isOverComplete
                ? `Ladakh Glaciers won by ${match.homeTeam.target - 1 - match.homeTeam.runs} runs`
                : `Need ${runsNeeded} runs from ${ballsRemaining} deliveries`}
            </p>
          </div>

          {/* Away Score & Rate Split */}
          <div className="lg:col-span-4 lg:border-x lg:border-white/[0.08] lg:px-8 grid grid-cols-3 gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                {match.awayTeam.code} Total
              </p>
              <p className="font-display text-2xl font-bold text-[#dfe3e9] tabular-nums mt-1">
                {match.awayTeam.runs}/{match.awayTeam.wickets}
              </p>
              <p className="text-xs text-[#64748B] tabular-nums">{match.awayTeam.oversDisplay} Ov</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                Current RR
              </p>
              <p className="font-display text-2xl font-bold text-[#F8FAFC] tabular-nums mt-1">
                {crr}
              </p>
              <p className="text-xs text-[#64748B]">Runs / Over</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                Required RR
              </p>
              <p className="font-display text-2xl font-bold text-[#F59E0B] tabular-nums mt-1">
                {isChased ? '0.00' : rrr}
              </p>
              <p className="text-xs text-[#64748B]">Target {match.homeTeam.target}</p>
            </div>
          </div>

          {/* Last 6 Deliveries Strip */}
          <div className="lg:col-span-3 space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
              Recent Deliveries
            </p>
            <div className="flex items-center gap-2">
              {match.recentBalls.map((ball, idx) => {
                const isBoundary = ball === '4' || ball === '6';
                const isWicket = ball === 'W';
                return (
                  <span
                    key={`${ball}-${idx}`}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-display text-sm font-bold tabular-nums border ${
                      isWicket
                        ? 'bg-[#93000a]/50 border-[#ffb4ab]/50 text-[#ffb4ab]'
                        : isBoundary
                        ? 'bg-[#00E676]/15 border-[#00E676]/50 text-[#75FF9E]'
                        : 'bg-[#171C20] border-white/10 text-[#dfe3e9]'
                    }`}
                  >
                    {ball}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Alpine Atmospheric & Pitch Telemetry Strip */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/[0.07] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">Pitch Strip</p>
            <p className="text-sm font-medium text-[#F8FAFC] mt-1">{match.pitchTelemetry.surface}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">Seam Velocity</p>
            <p className="text-sm font-medium text-[#F8FAFC] tabular-nums mt-1">{match.pitchTelemetry.paceAvg}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">Dew Index</p>
            <p className="text-sm font-medium text-[#F8FAFC] tabular-nums mt-1">{match.pitchTelemetry.dewIndex}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">Ridge Wind</p>
            <p className="text-sm font-medium text-[#F8FAFC] tabular-nums mt-1">{match.pitchTelemetry.wind}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">Valley Temp</p>
            <p className="text-sm font-medium text-[#F8FAFC] tabular-nums mt-1">{match.pitchTelemetry.temp}</p>
          </div>
        </div>
      </section>

      {/* Main 12-Col Analytics Split: Scorecards (8 cols) + Over Momentum & Commentary (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Batting & Bowling Tables */}
        <div className="lg:col-span-8 space-y-6">
          {/* Batting Scorecard */}
          <section className="obsidian-card p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
              <h2 className="font-display text-xl font-bold text-[#F8FAFC]">
                Zabarwan XI Batting
              </h2>
              <span className="text-xs text-[#859585] tabular-nums">
                Extras 9 (lb 4, w 5)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.07] text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                    <th className="py-3 pr-4">Batter</th>
                    <th className="py-3 px-3 text-right">R</th>
                    <th className="py-3 px-3 text-right">B</th>
                    <th className="py-3 px-3 text-right">4s</th>
                    <th className="py-3 px-3 text-right">6s</th>
                    <th className="py-3 pl-3 text-right">SR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-sm">
                  {match.batters.map((batter) => {
                    const sr = batter.balls > 0 ? ((batter.runs / batter.balls) * 100).toFixed(1) : '0.0';
                    return (
                      <tr key={batter.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 pr-4">
                          <div className="font-semibold text-[#F8FAFC]">
                            {batter.name}
                            {batter.isStriker && !batter.isOut && (
                              <span className="text-[#00E676] ml-1.5" title="On strike">*</span>
                            )}
                          </div>
                          <div className="text-xs text-[#859585] mt-0.5">
                            {batter.isOut ? batter.dismissal : batter.roleTag}
                          </div>
                        </td>
                        <td className="py-4 px-3 text-right font-display text-base font-bold text-[#F8FAFC] tabular-nums">
                          {batter.runs}
                        </td>
                        <td className="py-4 px-3 text-right text-[#bacbb9] tabular-nums">
                          {batter.balls}
                        </td>
                        <td className="py-4 px-3 text-right text-[#bacbb9] tabular-nums">
                          {batter.fours}
                        </td>
                        <td className="py-4 px-3 text-right text-[#bacbb9] tabular-nums">
                          {batter.sixes}
                        </td>
                        <td className="py-4 pl-3 text-right font-medium text-[#75FF9E] tabular-nums">
                          {sr}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Bowling Figures */}
          <section className="obsidian-card p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
              <h2 className="font-display text-xl font-bold text-[#F8FAFC]">
                Ladakh Glaciers Bowling
              </h2>
              <span className="text-xs text-[#859585]">Death Over Rotation</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.07] text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                    <th className="py-3 pr-4">Bowler</th>
                    <th className="py-3 px-3 text-right">O</th>
                    <th className="py-3 px-3 text-right">M</th>
                    <th className="py-3 px-3 text-right">R</th>
                    <th className="py-3 px-3 text-right">W</th>
                    <th className="py-3 pl-3 text-right">Econ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-sm">
                  {match.bowlers.map((bowler) => (
                    <tr key={bowler.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 pr-4">
                        <div className="font-semibold text-[#F8FAFC]">
                          {bowler.name}
                          {bowler.isCurrent && (
                            <span className="text-[#F59E0B] ml-2 text-[11px] uppercase tracking-wider font-bold">
                              Bowling
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#859585] mt-0.5">{bowler.style}</div>
                      </td>
                      <td className="py-4 px-3 text-right text-[#bacbb9] tabular-nums">
                        {bowler.overs}
                      </td>
                      <td className="py-4 px-3 text-right text-[#bacbb9] tabular-nums">
                        {bowler.maidens}
                      </td>
                      <td className="py-4 px-3 text-right text-[#bacbb9] tabular-nums">
                        {bowler.runs}
                      </td>
                      <td className="py-4 px-3 text-right font-display text-base font-bold text-[#F8FAFC] tabular-nums">
                        {bowler.wickets}
                      </td>
                      <td className="py-4 pl-3 text-right font-medium text-[#FFB95F] tabular-nums">
                        {bowler.economy.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column: Over Momentum + Ball-by-Ball Commentary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Over Momentum Bars */}
          <section className="obsidian-card p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
              <h2 className="font-display text-lg font-bold text-[#F8FAFC]">
                Over Momentum
              </h2>
              <span className="text-xs text-[#859585]">Runs per over</span>
            </div>

            <div className="grid grid-cols-6 gap-3 items-end h-36 pt-4">
              {match.overTotals.map((item) => {
                const heightPct = Math.max(16, Math.round((item.runs / maxOverRuns) * 100));
                return (
                  <div key={item.over} className="flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-xs font-bold text-[#F8FAFC] tabular-nums">
                      {item.runs}
                    </span>
                    <div className="w-full bg-[#171C20] rounded-lg h-24 flex items-end overflow-hidden p-1">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-md transition-all duration-200 ${
                          item.wickets > 0
                            ? 'bg-[#F59E0B]'
                            : item.runs >= 14
                            ? 'bg-[#00E676]'
                            : 'bg-[#059669]'
                        }`}
                      />
                    </div>
                    <span className="text-[11px] text-[#859585] tabular-nums">
                      Ov {item.over}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Ball-by-Ball Commentary */}
          <section className="obsidian-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
              <h2 className="font-display text-lg font-bold text-[#F8FAFC]">
                Pitch Commentary
              </h2>
              <span className="text-xs text-[#859585]">Live Feed</span>
            </div>

            <div className="divide-y divide-white/[0.07] max-h-[420px] overflow-y-auto pr-1">
              {match.commentary.map((entry) => (
                <div key={entry.id} className="py-4 first:pt-1 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-display font-bold text-[#F8FAFC] tabular-nums">
                      {entry.overBall} · {entry.outcome === 'W' ? 'WICKET' : `${entry.runsAdded} Run${entry.runsAdded === 1 ? '' : 's'}`}
                    </span>
                    <span className="text-[#859585] tabular-nums">
                      {entry.speedKph} km/h
                    </span>
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      entry.isWicket
                        ? 'text-[#ffb4ab]'
                        : entry.isBoundary
                        ? 'text-[#75FF9E]'
                        : 'text-[#bacbb9]'
                    }`}
                  >
                    {entry.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
