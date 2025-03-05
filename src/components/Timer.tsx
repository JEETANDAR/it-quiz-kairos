
import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface TimerProps {
  duration: number;
  onTimeUp?: () => void;
  isActive?: boolean;
  size?: "sm" | "md" | "lg";
}

const Timer: React.FC<TimerProps> = ({
  duration,
  onTimeUp,
  isActive = true,
  size = "md"
}) => {
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const circleRef = useRef<SVGCircleElement>(null);
  const [circumference, setCircumference] = useState(0);
  const [tickPlayed, setTickPlayed] = useState<{[key: number]: boolean}>({});
  const tickSoundRef = useRef<HTMLAudioElement | null>(null);
  const timeUpSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio elements
    tickSoundRef.current = new Audio('/tick.mp3');
    timeUpSoundRef.current = new Audio('/time-up.mp3');

    return () => {
      // Clean up audio elements
      if (tickSoundRef.current) {
        tickSoundRef.current.pause();
        tickSoundRef.current = null;
      }
      if (timeUpSoundRef.current) {
        timeUpSoundRef.current.pause();
        timeUpSoundRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (circleRef.current) {
      const radius = circleRef.current.r.baseVal.value;
      const calculatedCircumference = radius * 2 * Math.PI;
      setCircumference(calculatedCircumference);
    }
  }, []);

  useEffect(() => {
    setSecondsLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSecondsLeft((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(timer);
          if (onTimeUp) onTimeUp();
          // Play time up sound
          if (timeUpSoundRef.current) {
            timeUpSoundRef.current.play().catch(err => {
              console.log("Error playing time-up sound:", err);
            });
          }
          return 0;
        }
        
        // Play tick sound for the last 5 seconds
        const newSeconds = prevSeconds - 1;
        if (newSeconds <= 5 && !tickPlayed[newSeconds]) {
          if (tickSoundRef.current) {
            tickSoundRef.current.currentTime = 0;
            tickSoundRef.current.play().catch(err => {
              console.log("Error playing tick sound:", err);
            });
            setTickPlayed(prev => ({...prev, [newSeconds]: true}));
          }
        }
        
        return newSeconds;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, duration, onTimeUp, tickPlayed]);

  const getTimerSize = () => {
    switch (size) {
      case "sm":
        return "h-14 w-14 text-lg";
      case "lg":
        return "h-24 w-24 text-3xl";
      case "md":
      default:
        return "h-20 w-20 text-2xl";
    }
  };

  const getStrokeWidth = () => {
    switch (size) {
      case "sm":
        return 4;
      case "lg":
        return 8;
      case "md":
      default:
        return 6;
    }
  };

  const setProgress = (seconds: number) => {
    if (secondsLeft === 0 || duration === 0) return 0;
    const progress = ((duration - seconds) / duration) * circumference;
    return progress;
  };

  const getTimerColor = () => {
    const percentage = (secondsLeft / duration) * 100;
    if (percentage <= 25) return "text-red-500";
    if (percentage <= 50) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className={cn("relative flex items-center justify-center", getTimerSize())}>
      <svg className="h-full w-full -rotate-90">
        <circle
          className="text-gray-600/20"
          strokeWidth={getStrokeWidth()}
          stroke="currentColor"
          fill="transparent"
          r="45%"
          cx="50%"
          cy="50%"
        />
        <circle
          className={cn("timer-circle", getTimerColor())}
          ref={circleRef}
          strokeWidth={getStrokeWidth()}
          strokeDashoffset={setProgress(secondsLeft)}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45%"
          cx="50%"
          cy="50%"
          style={{
            animationDuration: `${duration}s`,
            animationPlayState: isActive ? "running" : "paused"
          }}
        />
      </svg>
      <span className={cn("absolute font-bold text-white", secondsLeft <= 5 ? "animate-pulse text-red-500" : "")}>
        {secondsLeft}
      </span>
    </div>
  );
};

export default Timer;
