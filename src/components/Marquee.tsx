"use client";

interface MarqueeProps {
  text: string;
  reverse?: boolean;
  className?: string;
}

export function Marquee({
  text,
  reverse = false,
  className = "",
}: MarqueeProps) {
  const repeated = Array(10).fill(text).join(" — ");

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className={`inline-block ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
      >
        <span className="inline-block pr-8">{repeated}</span>
        <span className="inline-block pr-8">{repeated}</span>
      </div>
    </div>
  );
}
