"use client";

type HeartLoaderProps = {
  className?: string;
  heartClassName?: string;
};

export function HeartLoader({ className = "", heartClassName = "" }: HeartLoaderProps) {
  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      <span className={`inline-block text-sm animate-pulse ${heartClassName}`} style={{ animationDelay: "0ms" }}>♥</span>
      <span className={`inline-block text-base animate-pulse ${heartClassName}`} style={{ animationDelay: "140ms" }}>♥</span>
      <span className={`inline-block text-sm animate-pulse ${heartClassName}`} style={{ animationDelay: "280ms" }}>♥</span>
    </div>
  );
}

