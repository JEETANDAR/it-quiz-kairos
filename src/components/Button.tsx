import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Button = ({
  variant = "primary",
  size = "md",
  children,
  className,
  fullWidth = false,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "rounded-lg font-medium transition-all duration-200 inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 btn-hover interactive-btn";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-md border border-white/10",
    secondary:
      "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 shadow-md border border-white/10",
    outline:
      "border-2 border-primary bg-transparent text-primary hover:bg-primary/10 focus:ring-primary shadow",
    ghost: "text-primary hover:bg-primary/10 focus:ring-primary",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-2.5 text-lg",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;