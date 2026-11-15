export type ScreenId = 'arena' | 'match' | 'squad' | 'atelier';

export interface BatterRow {
  id: string;
  name: string;
  roleTag: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isStriker?: boolean;
  isOut?: boolean;
  dismissal?: string;
}

export interface BowlerRow {
  id: string;
  name: string;
  style: string;
  overs: string;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  isCurrent?: boolean;
}

export interface CommentaryItem {
  id: string;
  overBall: string;
  outcome: string;
  runsAdded: number;
  isBoundary?: boolean;
  isWicket?: boolean;
  text: string;
  speedKph: number;
}

export interface LiveMatchState {
  matchTitle: string;
  venue: string;
  elevation: string;
  statusLabel: string;
  homeTeam: {
    name: string;
    code: string;
    runs: number;
    wickets: number;
    overs: number;
    ballsInOver: number;
    target: number;
  };
  awayTeam: {
    name: string;
    code: string;
    runs: number;
    wickets: number;
    oversDisplay: string;
  };
  recentBalls: string[];
  overTotals: { over: number; runs: number; wickets: number }[];
  batters: BatterRow[];
  bowlers: BowlerRow[];
  commentary: CommentaryItem[];
  pitchTelemetry: {
    surface: string;
    paceAvg: string;
    dewIndex: string;
    wind: string;
    temp: string;
  };
}

export interface Fixture {
  id: string;
  opponent: string;
  tournament: string;
  venue: string;
  date: string;
  time: string;
  elevation: string;
  status: string;
  startingPriceInr: number;
}

export type PlayerCategory = 'All' | 'Batters' | 'Bowlers' | 'All-Rounders';

export interface Player {
  id: string;
  name: string;
  number: number;
  role: 'Batter' | 'Bowler' | 'All-Rounder';
  hometown: string;
  battingStyle: string;
  bowlingStyle: string;
  age: number;
  image: string;
  matches: number;
  average: string;
  strikeRate: string;
  bestPerformance: string;
  auctionItemTitle: string;
  currentBidLakhs: number;
  bidIncrementLakhs: number;
  bidHistory: { bidder: string; amountLakhs: number; time: string }[];
  bio: string;
}

export type ProductCategory = 'All' | 'Matchwear' | 'Willow & Gear' | 'Alpine Outerwear';

export interface AtelierProduct {
  id: string;
  name: string;
  category: Exclude<ProductCategory, 'All'>;
  editionLabel: string;
  priceInr: number;
  image: string;
  shortDesc: string;
  specs: string[];
  variants: string[];
  inStock: boolean;
}

export interface CartItem {
  product: AtelierProduct;
  variant: string;
  quantity: number;
}
