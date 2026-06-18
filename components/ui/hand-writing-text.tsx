"use client";

import { motion } from "framer-motion";

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.6, ease: [0.43, 0.13, 0.23, 0.96] },
      opacity: { duration: 0.4 },
    },
  },
};

/**
 * Rodea su contenido con un círculo "dibujado a mano" que se traza
 * solo cuando entra en pantalla. Pensado para resaltar un dato (ej: $100.000).
 */
interface HandDrawnCircleProps {
  children: React.ReactNode;
  color?: string;
  strokeWidth?: number;
}

function HandDrawnCircle({
  children,
  color = "#FF6A3D",
  strokeWidth = 5,
}: HandDrawnCircleProps) {
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {children}
      <motion.svg
        viewBox="0 0 300 110"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          top: "-16%",
          left: "-13%",
          width: "126%",
          height: "132%",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <motion.path
          d="M 256 30
             C 150 8, 40 18, 26 52
             C 14 86, 130 102, 230 92
             C 296 84, 300 40, 210 24"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{
            pathLength: [0, 1, 1, 1],
            opacity: [0, 1, 1, 0],
          }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{
            duration: 5,
            ease: "easeInOut",
            times: [0, 0.55, 0.85, 1],
            repeat: Infinity,
            repeatDelay: 1.6,
          }}
        />
      </motion.svg>
    </span>
  );
}

interface HandWrittenTitleProps {
  title?: string;
  subtitle?: string;
}

function HandWrittenTitle({
  title = "Hand Written",
  subtitle = "Optional subtitle",
}: HandWrittenTitleProps) {
  return (
    <div className="relative w-full max-w-4xl mx-auto py-24">
      <div className="absolute inset-0">
        <motion.svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 600"
          initial="hidden"
          animate="visible"
          className="w-full h-full"
        >
          <title>Mayorista Universal</title>
          <motion.path
            d="M 950 90
               C 1250 300, 1050 480, 600 520
               C 250 520, 150 480, 150 300
               C 150 120, 350 80, 600 80
               C 850 80, 950 180, 950 180"
            fill="none"
            strokeWidth="12"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={draw}
            className="text-[#FF6A3D] opacity-90"
          />
        </motion.svg>
      </div>
      <div className="relative text-center z-10 flex flex-col items-center justify-center">
        <motion.h1
          className="text-4xl md:text-6xl text-black dark:text-white tracking-tighter flex items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="text-xl text-black/80 dark:text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}

export { HandWrittenTitle, HandDrawnCircle };
