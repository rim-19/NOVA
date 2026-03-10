"use client";

import type { CSSProperties } from "react";

type HeartLoaderProps = {
  className?: string;
  heartClassName?: string;
};

export function HeartLoader({ className = "", heartClassName = "" }: HeartLoaderProps) {
  const HEART_COUNT = 12;

  return (
    <div className={`relative h-12 w-12 ${className}`}>
      <div className="absolute inset-0 rounded-full border border-gold/45 shadow-[0_0_16px_rgba(184,149,106,0.25)]" />
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: "2.2s" }}>
        {Array.from({ length: HEART_COUNT }).map((_, i) => {
          const angle = (i / HEART_COUNT) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + 44 * Math.cos(angle);
          const y = 48 + 44 * Math.sin(angle);
          const size = i % 3 === 0 ? 13 : 14;

          return (
            <HeartMark
              key={i}
              className={heartClassName}
              size={size}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function HeartMark({
  className = "",
  size = 10,
  style,
}: {
  className?: string;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`text-gold ${className}`}
      style={style}
      aria-hidden="true"
    >
      <path d="M12 21s-6.716-4.532-9.192-8.1C.744 9.93 2.06 5 6.429 5c2.08 0 3.51.995 5.571 3.087C14.061 5.995 15.49 5 17.571 5 21.94 5 23.256 9.93 21.192 12.9 18.716 16.468 12 21 12 21z" />
    </svg>
  );
}
