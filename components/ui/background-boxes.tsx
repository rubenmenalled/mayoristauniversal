"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const rows = new Array(90).fill(1);
  const cols = new Array(70).fill(1);

  // Colores de marca para el iluminado al pasar el mouse
  const colors = [
    "rgb(255 106 61)",  // coral
    "rgb(255 138 99)",  // coral claro
    "rgb(245 197 24)",  // dorado
    "rgb(96 165 250)",  // azul 400
    "rgb(147 197 253)", // azul 300
    "rgb(255 255 255)", // blanco
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0",
        className
      )}
      {...rest}
    >
      <style>{`
        @keyframes boxglow0 { 0%,100%,72%{background-color:transparent} 80%{background-color:rgb(255 106 61)} }
        @keyframes boxglow1 { 0%,100%,72%{background-color:transparent} 80%{background-color:rgb(245 197 24)} }
        @keyframes boxglow2 { 0%,100%,72%{background-color:transparent} 80%{background-color:rgb(96 165 250)} }
        @keyframes boxglow3 { 0%,100%,72%{background-color:transparent} 80%{background-color:rgb(255 255 255)} }
      `}</style>
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="w-16 h-8 border-l border-slate-700/60 relative"
        >
          {cols.map((_, j) => {
            const lit = (i * 31 + j * 17) % 19 === 0;
            const autoGlow: React.CSSProperties | undefined = lit
              ? { animation: `boxglow${(i + j) % 4} 4s ease-in-out ${((i * 7 + j * 5) % 60) / 8}s infinite` }
              : undefined;
            return (
            <motion.div
              whileHover={{
                backgroundColor: getRandomColor(),
                transition: { duration: 0 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              style={autoGlow}
              key={`col` + j}
              className="w-16 h-8 border-r border-t border-slate-700/60 relative"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute h-6 w-10 -top-[14px] -left-[22px] text-slate-700/60 stroke-[1px] pointer-events-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
            );
          })}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
