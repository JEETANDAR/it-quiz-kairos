
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
  const tickSoundRef = useRef<HTMLAudioElement | null>(null);
  const endSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio elements
    tickSoundRef.current = new Audio('/tick.mp3');
    endSoundRef.current = new Audio('/end.mp3');
    
    return () => {
      if (tickSoundRef.current) {
        tickSoundRef.current.pause();
      }
      if (endSoundRef.current) {
        endSoundRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (!isActive) return;
    
    // Reset animation if SVG exists
    if (svgRef.current) {
      const circle = svgRef.current.querySelector('circle:nth-child(2)') as SVGCircleElement;
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
        // Play ticking sound for last 5 seconds
        if (prev <= 6 && prev > 1 && tickSoundRef.current) {
          tickSoundRef.current.play().catch(() => {
            console.log("Audio playback prevented - user hasn't interacted with the document yet");
          });
        }
        
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          
          // Play end sound
          if (endSoundRef.current) {
            endSoundRef.current.play().catch(() => {
              console.log("Audio playback prevented - user hasn't interacted with the document yet");
            });
          }
          
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
          stroke="#2a3548"
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
        <span className={`text-2xl font-semibold ${timeLeft <= 5 ? 'text-red-500' : 'text-white'}`}>
          {timeLeft}
        </span>
      </div>
    </div>
  );
};

export default Timer;
