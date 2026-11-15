import React, { useState } from 'react';
import { Mountain } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#171C20] via-[#0E1317] to-[#0A0D0F] text-[#bacbb9] p-6 text-center ${className}`}
      >
        <Mountain className="w-8 h-8 text-[#00E676]/60 mb-2" strokeWidth={1.5} />
        <span className="text-xs font-medium tracking-wider uppercase text-[#859585]">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
