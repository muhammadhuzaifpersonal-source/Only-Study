/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import {
  ATELIER_PRODUCTS,
  INITIAL_MATCH_STATE,
  SQUAD_PLAYERS,
} from './data/franchiseData';
import {
  AtelierProduct,
  CartItem,
  Fixture,
  LiveMatchState,
  Player,
  ScreenId,
} from './types';
import { TopBar } from './components/TopBar';
import { Footer } from './components/Footer';
import { ArenaScreen } from './components/ArenaScreen';
import { MatchCenterScreen } from './components/MatchCenterScreen';
import { SquadAuctionScreen } from './components/SquadAuctionScreen';
import { AtelierLabScreen } from './components/AtelierLabScreen';
import { MatchPassModal } from './components/MatchPassModal';

const DELIVERY_OUTCOMES = [
  {
    outcome: '1',
    runs: 1,
    speed: 142,
    text: 'Driven cleanly down to long-off for a brisk single across the damp dusk outfield.',
  },
  {
    outcome: '4',
    runs: 4,
    isBoundary: true,
    speed: 145,
    text: 'FOUR. Threaded past point with razor timing—races across the alpine turf to the rope.',
  },
  {
    outcome: '0',
    runs: 0,
    speed: 147,
    text: 'Skids off the basalt seam at 147 km/h; defended back down the pitch.',
  },
  {
    outcome: '2',
    runs: 2,
    speed: 139,
    text: 'Tucked deep into the leg-side pocket; athletic turn brings a comfortable brace.',
  },
  {
    outcome: '6',
    runs: 6,
    isBoundary: true,
    speed: 136,
    text: 'SIX. Dispatched high over the floodlight tower into the Srinagar night mist.',
  },
  {
    outcome: 'W',
    runs: 0,
    isWicket: true,
    speed: 148,
    text: 'WICKET. Full-length reverse-swinging yorker rattles the base of off stump.',
  },
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('arena');
  const [match, setMatch] = useState<LiveMatchState>(INITIAL_MATCH_STATE);
  const [autoPlay, setAutoPlay] = useState(false);

  const [players, setPlayers] = useState<Player[]>(SQUAD_PLAYERS);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [matchPassOpen, setMatchPassOpen] = useState(false);
  const [preselectedFixture, setPreselectedFixture] = useState<Fixture | null>(null);

  const simulateNextBall = useCallback(() => {
    setMatch((prev) => {
      const totalBalls = prev.homeTeam.overs * 6 + prev.homeTeam.ballsInOver;
      if (
        prev.homeTeam.runs >= prev.homeTeam.target ||
        totalBalls >= 120 ||
        prev.homeTeam.wickets >= 10
      ) {
        return prev;
      }

      // Weighted realistic T20 chase outcome
      const roll = Math.random();
      let selected = DELIVERY_OUTCOMES[0];
      if (roll < 0.22) selected = DELIVERY_OUTCOMES[2]; // 0
      else if (roll < 0.56) selected = DELIVERY_OUTCOMES[0]; // 1
      else if (roll < 0.72) selected = DELIVERY_OUTCOMES[3]; // 2
      else if (roll < 0.88) selected = DELIVERY_OUTCOMES[1]; // 4
      else if (roll < 0.96) selected = DELIVERY_OUTCOMES[4]; // 6
      else selected = DELIVERY_OUTCOMES[5]; // W

      const nextBallsInOver = prev.homeTeam.ballsInOver + 1;
      const completedOver = nextBallsInOver === 6;
      const newOvers = completedOver ? prev.homeTeam.overs + 1 : prev.homeTeam.overs;
      const newBallsInOver = completedOver ? 0 : nextBallsInOver;
      const ballNotation = `${prev.homeTeam.overs}.${nextBallsInOver}`;

      const nextRuns = prev.homeTeam.runs + selected.runs;
      const nextWickets = prev.homeTeam.wickets + (selected.isWicket ? 1 : 0);

      // Update batters
      const updatedBatters = prev.batters.map((b) => {
        if (!b.isStriker || b.isOut) return b;
        if (selected.isWicket) {
          return {
            ...b,
            balls: b.balls + 1,
            isStriker: false,
            isOut: true,
            dismissal: 'b Stobdan',
          };
        }
        return {
          ...b,
          runs: b.runs + selected.runs,
          balls: b.balls + 1,
          fours: b.fours + (selected.outcome === '4' ? 1 : 0),
          sixes: b.sixes + (selected.outcome === '6' ? 1 : 0),
        };
      });

      // Bring in next batter or rotate strike on odd runs / over end
      let finalBatters = updatedBatters;
      if (selected.isWicket) {
        finalBatters = [
          ...updatedBatters,
          {
            id: `b-${Date.now()}`,
            name: 'Imran Qureshi',
            roleTag: 'Lower Order · Striker',
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            isStriker: true,
          },
        ];
      } else if ((selected.runs % 2 === 1) !== completedOver) {
        // Flip striker between active not-out batters
        const activeIds = updatedBatters.filter((b) => !b.isOut).map((b) => b.id);
        if (activeIds.length >= 2) {
          finalBatters = updatedBatters.map((b) =>
            !b.isOut ? { ...b, isStriker: !b.isStriker } : b
          );
        }
      }

      // Update current bowler
      const updatedBowlers = prev.bowlers.map((bw) => {
        if (!bw.isCurrent) return bw;
        const [ovWhole, ovPart = '0'] = bw.overs.split('.');
        const bwBalls = Number(ovWhole) * 6 + Number(ovPart) + 1;
        const bwOversStr = `${Math.floor(bwBalls / 6)}.${bwBalls % 6}`;
        const bwRuns = bw.runs + selected.runs;
        const bwWickets = bw.wickets + (selected.isWicket ? 1 : 0);
        const bwEcon = Number(((bwRuns / bwBalls) * 6).toFixed(2));
        return {
          ...bw,
          overs: bwOversStr,
          runs: bwRuns,
          wickets: bwWickets,
          economy: bwEcon,
        };
      });

      // Update over totals chart
      const currentOverNumber = prev.homeTeam.overs + 1;
      const existingOverIdx = prev.overTotals.findIndex((o) => o.over === currentOverNumber);
      let nextOverTotals = [...prev.overTotals];
      if (existingOverIdx >= 0) {
        nextOverTotals[existingOverIdx] = {
          ...nextOverTotals[existingOverIdx],
          runs: nextOverTotals[existingOverIdx].runs + selected.runs,
          wickets: nextOverTotals[existingOverIdx].wickets + (selected.isWicket ? 1 : 0),
        };
      } else {
        nextOverTotals = [
          ...prev.overTotals.slice(-5),
          {
            over: currentOverNumber,
            runs: selected.runs,
            wickets: selected.isWicket ? 1 : 0,
          },
        ];
      }

      const nextCommentary = [
        {
          id: `comm-${Date.now()}-${Math.random()}`,
          overBall: ballNotation,
          outcome: selected.outcome,
          runsAdded: selected.runs,
          isBoundary: selected.isBoundary,
          isWicket: selected.isWicket,
          text: selected.text,
          speedKph: selected.speed,
        },
        ...prev.commentary.slice(0, 14),
      ];

      return {
        ...prev,
        homeTeam: {
          ...prev.homeTeam,
          runs: nextRuns,
          wickets: nextWickets,
          overs: newOvers,
          ballsInOver: newBallsInOver,
        },
        recentBalls: [...prev.recentBalls.slice(-5), selected.outcome],
        overTotals: nextOverTotals,
        batters: finalBatters,
        bowlers: updatedBowlers,
        commentary: nextCommentary,
      };
    });
  }, []);

  useEffect(() => {
    if (!autoPlay) return;
    const totalBalls = match.homeTeam.overs * 6 + match.homeTeam.ballsInOver;
    if (match.homeTeam.runs >= match.homeTeam.target || totalBalls >= 120) {
      setAutoPlay(false);
      return;
    }

    const timer = window.setInterval(() => {
      simulateNextBall();
    }, 2200);

    return () => window.clearInterval(timer);
  }, [autoPlay, match.homeTeam.runs, match.homeTeam.target, match.homeTeam.overs, match.homeTeam.ballsInOver, simulateNextBall]);

  const handleResetMatch = () => {
    setAutoPlay(false);
    setMatch(INITIAL_MATCH_STATE);
  };

  const handlePlaceBid = (playerId: string, bidderLabel: string, newAmountLakhs: number) => {
    setPlayers((prev) =>
      prev.map((player) => {
        if (player.id !== playerId) return player;
        return {
          ...player,
          currentBidLakhs: newAmountLakhs,
          bidHistory: [
            { bidder: bidderLabel, amountLakhs: newAmountLakhs, time: 'Just now' },
            ...player.bidHistory,
          ],
        };
      })
    );
  };

  const handleAddToCart = (product: AtelierProduct, variant: string) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) => item.product.id === product.id && item.variant === variant
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [...prev, { product, variant, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, variant: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.variant === variant) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string, variant: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.variant === variant)
      )
    );
  };

  const handleOpenFixturePass = (fixture: Fixture) => {
    setPreselectedFixture(fixture);
    setMatchPassOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0D0F] text-[#F8FAFC]">
      <TopBar
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        onOpenMatchPass={() => {
          setPreselectedFixture(null);
          setMatchPassOpen(true);
        }}
      />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-5 md:px-8 xl:px-12 pt-8 md:pt-12">
        {activeScreen === 'arena' && (
          <ArenaScreen
            match={match}
            onSimulateBall={simulateNextBall}
            onNavigate={setActiveScreen}
            onReserveFixture={handleOpenFixturePass}
          />
        )}

        {activeScreen === 'match' && (
          <MatchCenterScreen
            match={match}
            autoPlay={autoPlay}
            onToggleAutoPlay={() => setAutoPlay((prev) => !prev)}
            onSimulateBall={simulateNextBall}
            onResetMatch={handleResetMatch}
          />
        )}

        {activeScreen === 'squad' && (
          <SquadAuctionScreen players={players} onPlaceBid={handlePlaceBid} />
        )}

        {activeScreen === 'atelier' && (
          <AtelierLabScreen
            products={ATELIER_PRODUCTS}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={() => setCart([])}
          />
        )}
      </main>

      <Footer
        onNavigate={setActiveScreen}
        onOpenMatchPass={() => {
          setPreselectedFixture(null);
          setMatchPassOpen(true);
        }}
      />

      <MatchPassModal
        isOpen={matchPassOpen}
        preselectedFixture={preselectedFixture}
        onClose={() => setMatchPassOpen(false)}
      />
    </div>
  );
}
