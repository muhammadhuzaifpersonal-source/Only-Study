import React, { useState, useEffect } from 'react';
import { X, Check, Minus, Plus } from 'lucide-react';
import { Fixture } from '../types';
import { UPCOMING_FIXTURES } from '../data/franchiseData';

interface MatchPassModalProps {
  isOpen: boolean;
  preselectedFixture: Fixture | null;
  onClose: () => void;
}

const PASS_TIERS = [
  {
    id: 'pavilion',
    name: 'Alpine Pavilion',
    desc: 'Heated lower-bowl seating along the square-leg boundary.',
    multiplier: 1,
  },
  {
    id: 'floodlight',
    name: 'Floodlight Lounge',
    desc: 'Glass-walled hospitality terrace with Kashmiri kahwa & chef dining.',
    multiplier: 1.8,
  },
  {
    id: 'patron',
    name: 'Pitchside Patron Box',
    desc: 'Private 6-seat obsidian box directly behind the bowler’s arm.',
    multiplier: 2.9,
  },
];

export const MatchPassModal: React.FC<MatchPassModalProps> = ({
  isOpen,
  preselectedFixture,
  onClose,
}) => {
  const [selectedFixtureId, setSelectedFixtureId] = useState(
    preselectedFixture?.id || UPCOMING_FIXTURES[0].id
  );
  const [selectedTierId, setSelectedTierId] = useState('floodlight');
  const [seatCount, setSeatCount] = useState(2);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [passIssued, setPassIssued] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedFixture) {
      setSelectedFixtureId(preselectedFixture.id);
    }
    setPassIssued(null);
    setFormError(null);
  }, [preselectedFixture, isOpen]);

  if (!isOpen) return null;

  const activeFixture =
    UPCOMING_FIXTURES.find((f) => f.id === selectedFixtureId) || UPCOMING_FIXTURES[0];
  const activeTier = PASS_TIERS.find((t) => t.id === selectedTierId) || PASS_TIERS[1];
  const totalInr = Math.round(activeFixture.startingPriceInr * activeTier.multiplier * seatCount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!guestName.trim()) {
      setFormError('Please enter the primary patron name.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail.trim())) {
      setFormError('Please enter a valid email address to issue the pass.');
      return;
    }

    const code = `PASS-${Math.floor(10000 + Math.random() * 89999)}`;
    setPassIssued(code);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="match-pass-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm"
    >
      <div
        className="w-full max-w-xl rounded-[28px] bg-[#0E1317] border border-white/10 p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(0, 230, 118, 0.08)',
        }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] pb-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#F59E0B]">
              Hospitality & Stadium Access
            </p>
            <h2 id="match-pass-title" className="font-display text-2xl font-extrabold text-[#F8FAFC] mt-1">
              Reserve Valley Match Pass
            </h2>
          </div>

          <button
            type="button"
            aria-label="Close match pass modal"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-[#bacbb9] hover:text-[#F8FAFC] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {passIssued ? (
          <div className="p-6 rounded-2xl bg-[#171C20] border border-[#00E676]/40 space-y-4">
            <div className="inline-flex items-center gap-2 text-[#00E676] text-xs font-bold uppercase tracking-wider">
              <Check className="w-4 h-4" />
              <span>Credential Issued · {passIssued}</span>
            </div>
            <h3 className="font-display text-xl font-bold text-[#F8FAFC]">
              Zabarwan XI vs. {activeFixture.opponent}
            </h3>
            <p className="text-sm text-[#bacbb9]">
              {activeTier.name} · {seatCount} Seat{seatCount > 1 ? 's' : ''} · {activeFixture.date} ({activeFixture.time})
            </p>
            <p className="text-xs text-[#859585]">
              Digital QR passes dispatched to {guestEmail}. Present at Gate 02 Patron Concierge.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="cta-stadium-green w-full py-3 text-sm cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Fixture Picker */}
            <div className="space-y-2">
              <label htmlFor="fixture-select" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                Select Fixture
              </label>
              <select
                id="fixture-select"
                value={selectedFixtureId}
                onChange={(e) => setSelectedFixtureId(e.target.value)}
                className="obsidian-input w-full px-3.5 py-2.5 rounded-xl text-sm"
              >
                {UPCOMING_FIXTURES.map((fixture) => (
                  <option key={fixture.id} value={fixture.id} className="bg-[#0E1317] text-[#F8FAFC]">
                    {fixture.date} — vs. {fixture.opponent} ({fixture.venue})
                  </option>
                ))}
              </select>
            </div>

            {/* Tier Selector */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                Hospitality Tier
              </p>
              <div className="space-y-2">
                {PASS_TIERS.map((tier) => {
                  const isSelected = selectedTierId === tier.id;
                  const tierUnit = Math.round(activeFixture.startingPriceInr * tier.multiplier);
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelectedTierId(tier.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-colors flex items-center justify-between gap-4 cursor-pointer ${
                        isSelected
                          ? 'bg-[#00E676]/10 border-[#00E676]'
                          : 'bg-[#171C20] border-white/[0.08] hover:border-white/25'
                      }`}
                    >
                      <div>
                        <p className="font-display text-sm font-bold text-[#F8FAFC]">{tier.name}</p>
                        <p className="text-xs text-[#859585] mt-0.5">{tier.desc}</p>
                      </div>
                      <span className="font-display text-sm font-bold text-[#FFB95F] tabular-nums shrink-0">
                        ₹{tierUnit.toLocaleString('en-IN')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Guest Count + Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div className="space-y-1.5">
                <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                  Seats
                </span>
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#07090B] border border-white/10">
                  <button
                    type="button"
                    aria-label="Decrease seats"
                    onClick={() => setSeatCount((c) => Math.max(1, c - 1))}
                    className="text-[#bacbb9] hover:text-[#F8FAFC] cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-display text-sm font-bold text-[#F8FAFC] tabular-nums">
                    {seatCount}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase seats"
                    onClick={() => setSeatCount((c) => Math.min(8, c + 1))}
                    className="text-[#bacbb9] hover:text-[#F8FAFC] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label htmlFor="pass-guest-name" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                  Primary Patron Name
                </label>
                <input
                  id="pass-guest-name"
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Aarav Raina"
                  className="obsidian-input w-full px-3.5 py-2.5 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pass-guest-email" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#859585]">
                Dispatch Email
              </label>
              <input
                id="pass-guest-email"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="patron@example.com"
                className="obsidian-input w-full px-3.5 py-2.5 rounded-xl text-sm"
              />
            </div>

            {formError && <p className="text-xs text-[#ffb4ab]">{formError}</p>}

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-[#859585]">Allocation Total</p>
                <p className="font-display text-2xl font-extrabold text-[#75FF9E] tabular-nums">
                  ₹{totalInr.toLocaleString('en-IN')}
                </p>
              </div>
              <button
                type="submit"
                className="cta-stadium-green px-6 py-3.5 text-sm cursor-pointer"
              >
                Issue Match Pass
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
