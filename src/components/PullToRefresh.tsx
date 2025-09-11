import { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  className?: string;
}

const PullToRefresh = ({
  onRefresh,
  children,
  threshold = 80,
  className = ""
}: PullToRefreshProps) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      currentY.current = startY.current;
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (containerRef.current?.scrollTop === 0 && startY.current > 0) {
      currentY.current = e.touches[0].clientY;
      const distance = Math.max(0, currentY.current - startY.current);
      
      if (distance > 0) {
        e.preventDefault();
        setIsPulling(true);
        setPullDistance(distance);
      }
    }
  }, []);

  const handleTouchEnd = useCallback(async () => {
    if (isPulling && pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Pull to refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setIsPulling(false);
    setPullDistance(0);
    startY.current = 0;
    currentY.current = 0;
  }, [isPulling, pullDistance, threshold, onRefresh]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const progress = Math.min(pullDistance / threshold, 1);
  const shouldShowIndicator = isPulling || isRefreshing;

  return (
    <div className={`relative ${className}`}>
      {/* Pull to refresh indicator */}
      {shouldShowIndicator && (
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-center">
          <div 
            className="bg-background border border-border rounded-full p-3 shadow-lg transform transition-transform duration-200"
            style={{
              transform: `translateY(${Math.min(pullDistance * 0.5, 20)}px) scale(${0.8 + progress * 0.2})`,
              opacity: progress
            }}
          >
            <RefreshCw 
              className={`w-6 h-6 text-primary transition-transform duration-200 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
              style={{
                transform: `rotate(${progress * 180}deg)`
              }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div 
        ref={containerRef}
        className="h-full overflow-auto"
        style={{
          transform: `translateY(${isPulling ? Math.min(pullDistance * 0.3, 40) : 0}px)`,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh; 