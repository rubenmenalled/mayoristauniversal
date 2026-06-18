'use client';

import { useEffect, useState } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const btnStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '24px',
    left: '24px',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: hovered
      ? 'linear-gradient(135deg, #FF8A63 0%, #FF6A3D 100%)'
      : 'linear-gradient(135deg, #FF6A3D 0%, #b8941e 100%)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: 700,
    lineHeight: 1,
    zIndex: 1000,
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(12px)',
    transition: 'opacity 0.28s ease, transform 0.28s ease, background 0.18s ease, box-shadow 0.18s ease',
    pointerEvents: visible ? 'auto' : 'none',
    boxShadow: hovered
      ? '0 6px 20px rgba(255,106,61, 0.5)'
      : '0 3px 12px rgba(255,106,61, 0.3)',
  };

  return (
    <button
      style={btnStyle}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Volver al inicio"
      title="Volver al inicio"
    >
      ↑
    </button>
  );
}
