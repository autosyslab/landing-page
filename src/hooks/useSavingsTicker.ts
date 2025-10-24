import { useState, useEffect, useRef } from 'react';

export const useSavingsTicker = (monthlySavings: number, isActive: boolean) => {
  const [currentLoss, setCurrentLoss] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive || monthlySavings === 0) {
      setCurrentLoss(0);
      startTimeRef.current = null;
      return;
    }

    startTimeRef.current = Date.now();

    const costPerMs = monthlySavings / (30 * 24 * 60 * 60 * 1000);

    const interval = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Date.now() - startTimeRef.current;
        setCurrentLoss(elapsed * costPerMs);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [monthlySavings, isActive]);

  return currentLoss;
};
