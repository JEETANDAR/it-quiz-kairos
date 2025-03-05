
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TimerProps {
  duration: number;
  onComplete?: () => void;
  className?: string;
  playTickSound?: boolean;
  size?: number;
  strokeWidth?: number;
}

const FixedTimer: React.FC<TimerProps> = ({
  duration,
  onComplete,
  className,
  playTickSound = false,
  size = 50,
  strokeWidth = 4,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [tickAudio] = useState(() => new Audio("/tick.mp3"));
  const [timeUpAudio] = useState(() => new Audio("/time-up.mp3"));
  
  // Calculate the circumference of the circle
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onComplete) onComplete();
      if (playTickSound) timeUpAudio.play().catch(e => console.error("Audio play error:", e));
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
      
      // Play tick sound for last 5 seconds
      if (playTickSound && timeLeft <= 5 && timeLeft > 0) {
        tickAudio.play().catch(e => console.error("Audio play error:", e));
      }
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft, onComplete, playTickSound, tickAudio, timeUpAudio]);

  // Calculate the stroke dash offset based on the time left
  const strokeDashoffset = circumference * (1 - timeLeft / duration);

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute">
        <span className="text-sm font-medium">{timeLeft}</span>
      </div>
    </div>
  );
};

export default FixedTimer;
