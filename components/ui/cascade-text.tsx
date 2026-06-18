"use client";

import React, { useMemo, useState, type ElementType, type CSSProperties } from "react";

export interface TextRevealProps {
  text: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  fontSize?: string;
  staggerDelay?: number;
  duration?: number;
  easing?: string;
  color?: string;
  hoverColor?: string;
  direction?: "up" | "down";
}

const TextReveal = React.memo(function TextReveal({
  text,
  as: Component = "span",
  className = "",
  style,
  fontSize = "1.15em",
  staggerDelay = 22,
  duration = 220,
  easing = "ease-in-out",
  color = "inherit",
  hoverColor = "#FFFFFF",
  direction = "up",
}: TextRevealProps) {
  const [hovered, setHovered] = useState(false);

  const chars = useMemo(() => {
    if (typeof Intl !== "undefined" && (Intl as any).Segmenter) {
      const segmenter = new (Intl as any).Segmenter("es", { granularity: "grapheme" });
      return Array.from(segmenter.segment(text), (s: any) => s.segment) as string[];
    }
    return Array.from(text);
  }, [text]);

  const sign = direction === "up" ? 1 : -1;

  return (
    <Component
      className={`inline-flex overflow-hidden relative ${className}`.trim()}
      style={{ fontSize, color: hovered ? hoverColor : color, height: "1em", lineHeight: 1, ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={text}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          className="inline-block relative will-change-transform"
          style={{
            textShadow: `0 ${sign}em currentColor`,
            transition: `transform ${duration}ms ${easing}`,
            transitionDelay: `${i * staggerDelay}ms`,
            transform: hovered ? `translateY(${-sign}em)` : "translateY(0)",
          }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </Component>
  );
});

TextReveal.displayName = "TextReveal";
export { TextReveal };
