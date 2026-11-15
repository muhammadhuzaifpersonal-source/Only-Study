import React from 'react';
import { ScreenId } from '../types';

interface FooterProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenMatchPass: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenMatchPass }) => {
  const handleNav = (screen: ScreenId) => {
    onNavigate(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.07] bg-[#0A0D0F] mt-20">
      <div className="max-w-[1440px] mx-auto px-5 md:px-8 xl:px-12 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-1.5">
          <p className="font-display text-lg font-extrabold tracking-tight text-[#F8FAFC]">
            ZABARWAN XI
          </p>
          <p className="text-sm text-[#64748B]">
            Sher-e-Kashmir Alpine Oval · Srinagar · 1,585m ASL
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-6 text-sm text-[#859585]">
          <button
            type="button"
            onClick={() => handleNav('arena')}
            className="hover:text-[#F8FAFC] transition-colors cursor-pointer whitespace-nowrap"
          >
            Arena
          </button>
          <button
            type="button"
            onClick={() => handleNav('match')}
            className="hover:text-[#F8FAFC] transition-colors cursor-pointer whitespace-nowrap"
          >
            Match Center
          </button>
          <button
            type="button"
            onClick={() => handleNav('squad')}
            className="hover:text-[#F8FAFC] transition-colors cursor-pointer whitespace-nowrap"
          >
            Squad & Auction
          </button>
          <button
            type="button"
            onClick={() => handleNav('atelier')}
            className="hover:text-[#F8FAFC] transition-colors cursor-pointer whitespace-nowrap"
          >
            Atelier Lab
          </button>
          <button
            type="button"
            onClick={onOpenMatchPass}
            className="text-[#F59E0B] hover:text-[#FFB95F] transition-colors cursor-pointer whitespace-nowrap"
          >
            Hospitality Suites
          </button>
        </nav>

        <p className="text-xs text-[#64748B]">
          © 2026 Zabarwan Cricket Franchise & Apparel Lab
        </p>
      </div>
    </footer>
  );
};
