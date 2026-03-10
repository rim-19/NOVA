"use client";

type HeartLoaderProps = {
  className?: string;
  heartClassName?: string;
};

export function HeartLoader({ className = "", heartClassName = "" }: HeartLoaderProps) {
  return (
    <div className={`relative h-12 w-12 ${className}`}>
      <div className="absolute inset-0 rounded-full border border-gold/45 shadow-[0_0_16px_rgba(184,149,106,0.25)]" />
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: "2.2s" }}>
        <HeartMark
          className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[2px] ${heartClassName}`}
          size={10}
        />
        <HeartMark
          className={`absolute right-0 top-1/2 translate-x-[2px] -translate-y-1/2 ${heartClassName}`}
          size={8}
        />
        <HeartMark
          className={`absolute left-0 top-1/2 -translate-x-[2px] -translate-y-1/2 ${heartClassName}`}
          size={8}
        />
      </div>
    </div>
  );
}

function HeartMark({ className = "", size = 10 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`text-gold ${className}`}
      aria-hidden="true"
    >
      <path d="M12 21s-6.716-4.532-9.192-8.1C.744 9.93 2.06 5 6.429 5c2.08 0 3.51.995 5.571 3.087C14.061 5.995 15.49 5 17.571 5 21.94 5 23.256 9.93 21.192 12.9 18.716 16.468 12 21 12 21z" />
    </svg>
  );
}
