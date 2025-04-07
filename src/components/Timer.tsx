
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isActive?: boolean;
  className?: string;
}

const Timer: React.FC<TimerProps> = ({
  duration,
  onTimeUp,
  isActive = true,
  className
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(!isActive);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    setIsPaused(!isActive);
  }, [isActive]);

  useEffect(() => {
    if (isPaused) return;

    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    // Play ticking sound when time is low
    if (timeLeft <= 5) {
      const tickSound = new Audio('/tick.mp3');
      tickSound.play().catch(err => {
        console.log("Error playing tick sound:", err);
      });
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isPaused, onTimeUp]);

  // Calculate percentage for progress circle
  const percentage = ((duration - timeLeft) / duration) * 100;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg className="w-20 h-20">
        <circle
          className="text-gray-700"
          strokeWidth="5"
          stroke="currentColor"
          fill="transparent"
          r="30"
          cx="40"
          cy="40"
        />
        <circle
          className={`${timeLeft <= 5 ? 'text-red-500' : 'text-blue-600'}`}
          strokeWidth="5"
          strokeDasharray={30 * 2 * Math.PI}
          strokeDashoffset={30 * 2 * Math.PI * (1 - percentage / 100)}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="30"
          cx="40"
          cy="40"
          style={{ transition: "stroke-dashoffset 0.5s" }}
        />
      </svg>
      <span className="absolute text-2xl font-bold">{timeLeft}</span>
    </div>
  );
};

export default Timer;
