'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const SplashScreen = () => {
  const [showSplash, setShowSplash] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setShowSplash(true);
    const timer = setTimeout(() => setShowSplash(false), 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!showSplash) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 w-full h-full animate-gradient-move bg-gradient-to-br from-[#18181b] via-[#232526] to-[#ff914d]/80 opacity-90" />

      {/* Animated diagonal lines overlay */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 40px)',
          opacity: 0.5,
        }}
      />

      {/* Logo */}
      <div
        className="z-10 shadow-2xl"
        style={{
          filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.20))',
          background: 'rgba(255,255,255,0.10)',
          borderRadius: '0.75rem',
        }}
      >
        <Image
          src="/logo.jpeg"
          alt="Mo's VintageWorld Logo"
          width={160}
          height={160}
          className="w-40 h-40 object-contain animate-fade-in rounded-xl"
          priority
        />
      </div>
    </div>
  );
};

export default SplashScreen;
