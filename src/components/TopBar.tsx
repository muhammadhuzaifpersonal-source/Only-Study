import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ScreenId } from '../types';

interface TopBarProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenMatchPass: () => void;
}

const NAV_ITEMS: { id: ScreenId; label: string }[] = [
  { id: 'arena', label: 'Arena' },
  { id: 'match', label: 'Match Center' },
  { id: 'squad', label: 'Squad & Auction' },
  { id: 'atelier', label: 'Atelier Lab' },
];

export const TopBar: React.FC<TopBarProps> = ({
  activeScreen,
  onNavigate,
  onOpenMatchPass,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelect = (screen: ScreenId) => {
    onNavigate(screen);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 obsidian-glass border-b border-white/[0.08]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-8 xl:px-12 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand wordmark */}
        <button
          type="button"
          onClick={() => handleSelect('arena')}
          className="font-display text-lg md:text-xl font-extrabold tracking-tight text-[#F8FAFC] hover:text-[#00E676] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E676] rounded-md px-1"
        >
          ZABARWAN XI
        </button>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`relative py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E676] rounded-md px-1 ${
                  isActive
                    ? 'text-[#F8FAFC]'
                    : 'text-[#859585] hover:text-[#dfe3e9]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-1 -bottom-0.5 h-[2px] bg-[#00E676] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + mobile menu toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenMatchPass}
            className="cta-stadium-green px-5 py-2.5 text-xs md:text-sm tracking-tight whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75FF9E]"
          >
            Match Pass
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-[#0E1317] text-[#F8FAFC] hover:border-[#00E676]/50 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-white/[0.08] bg-[#0E1317] px-5 py-4 space-y-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30'
                    : 'text-[#dfe3e9] hover:bg-white/[0.04]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};
