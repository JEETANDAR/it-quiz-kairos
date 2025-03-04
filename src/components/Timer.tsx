
import React, { useEffect, useState, useRef } from "react";

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isActive?: boolean;
}

const Timer = ({ duration, onTimeUp, isActive = true }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const circumference = 2 * Math.PI * 45;
  const timerRef = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!isActive) return;
    
    // Reset animation if SVG exists
    if (svgRef.current) {
      const circle = svgRef.current.querySelector('circle:nth-child(2)');
      if (circle) {
        circle.style.animation = 'none';
        void circle.offsetWidth; // Trigger reflow
        circle.style.animation = `countdown ${duration}s linear forwards`;
      }
    }

    setTimeLeft(duration);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [duration, onTimeUp, isActive]);

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg 
        ref={svgRef}
        className="w-full h-full" 
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="6"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#3355FF"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          className="timer-circle"
          style={{ animationDuration: `${duration}s` }}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-semibold">{timeLeft}</span>
      </div>
    </div>
  );
};

export default Timer;
