'use client';
import { useState, useEffect } from 'react';

interface AnimatedCounterProps {
  endValue: number;
  duration?: number;
}

export default function AnimatedCounter({ endValue, duration = 1000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startValue = 0;
    const increment = Math.ceil(endValue / (duration / 50));

    const counter = setInterval(() => {
      startValue += increment;
      if (startValue >= endValue) {
        startValue = endValue;
        clearInterval(counter);
      }
      setCount(startValue);
    }, 50);

    return () => clearInterval(counter);
  }, [endValue, duration]);

  return <span>{count.toLocaleString()}</span>;
}
