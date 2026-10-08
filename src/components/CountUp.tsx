import React, { useEffect, useState } from 'react';
import { prefersReducedMotion, useInView } from '../hooks/useInView';

/** Counts from 0 up to `value` the first time it scrolls into view. */
export const CountUp: React.FC<{ value: number; duration?: number; className?: string }> = ({ value, duration = 1600, className }) => {
  const [ref, inView] = useInView<HTMLSpanElement>('0px');
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion() || value <= 0) {
      setShown(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setShown(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {shown.toLocaleString('en-IN')}
    </span>
  );
};
