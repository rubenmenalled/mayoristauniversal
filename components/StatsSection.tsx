'use client';

import { useEffect, useRef, useState } from 'react';

interface Stat {
  numero: number;
  sufijo: string;
  label: string;
  emoji: string;
}

const stats: Stat[] = [
  { numero: 20, sufijo: '+', label: 'Categorías', emoji: '🗂️' },
  { numero: 500, sufijo: '+', label: 'Productos disponibles', emoji: '📦' },
  { numero: 5, sufijo: ' años', label: 'En el mercado', emoji: '⭐' },
  { numero: 1000, sufijo: '+', label: 'Clientes en todo el país', emoji: '🤝' },
];

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setCount(target);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [start, target, duration]);

  return count;
}

function StatCard({ stat, animate }: { stat: Stat; animate: boolean }) {
  const count = useCountUp(stat.numero, 1500, animate);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        flex: '1 1 0',
        minWidth: 0,
      }}
    >
      <span style={{ fontSize: '36px', marginBottom: '12px', lineHeight: 1 }}>
        {stat.emoji}
      </span>
      <span
        style={{
          fontSize: '52px',
          fontWeight: 800,
          color: '#D4AF37',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {count}
        {stat.sufijo}
      </span>
      <span
        style={{
          marginTop: '10px',
          fontSize: '14px',
          fontWeight: 500,
          color: '#9CA3AF',
          textAlign: 'center',
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
        }}
      >
        {stat.label}
      </span>
    </div>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animate) {
          setAnimate(true);
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [animate]);

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .stats-grid {
            flex-wrap: wrap !important;
          }
          .stats-grid > div {
            flex: 1 1 45% !important;
            min-width: 140px !important;
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        style={{
          backgroundColor: 'rgba(240,235,224, 0.98)',
          borderTop: '2px solid #D4AF37',
          borderBottom: '2px solid #D4AF37',
          width: '100%',
          padding: '16px 0',
        }}
      >
        <div
          className="stats-grid"
          style={{
            display: 'flex',
            flexDirection: 'row',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} animate={animate} />
          ))}
        </div>
      </section>
    </>
  );
}
