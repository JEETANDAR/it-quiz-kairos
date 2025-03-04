
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: "fade-in" | "slide-up" | "slide-down" | "scale-in";
}

const AnimatedContainer = ({
  children,
  className = "",
  delay = 0,
  animation = "fade-in"
}: AnimatedContainerProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const animationClasses = {
    "fade-in": "animate-fade-in",
    "slide-up": "animate-slide-up",
    "slide-down": "animate-slide-down",
    "scale-in": "animate-scale-in"
  };

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-out",
        isVisible ? animationClasses[animation] + " opacity-100" : "opacity-0",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedContainer;
