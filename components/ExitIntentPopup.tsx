'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'exitPopupShown';
const WA_LINK =
  'https://wa.me/5491164660482?text=Hola%2C%20quiero%20consultar%20sobre%20precios%20mayoristas';

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window === 'undefined') return;
    if (localStorage.getItem(STORAGE_KEY) === 'true') return;
    if (window.innerWidth <= 768) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setVisible(true);
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const close = () => {
    setClosing(true);
    localStorage.setItem(STORAGE_KEY, 'true');
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 280);
  };

  if (!mounted || !visible) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.72)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    opacity: closing ? 0 : 1,
    transition: 'opacity 0.28s ease',
  };

  const cardStyle: React.CSSProperties = {
    background: 'linear-gradient(145deg, #0B1E3F 0%, #16294f 100%)',
    border: '1.5px solid rgba(255,106,61, 0.55)',
    borderRadius: '20px',
    padding: '40px 36px 36px',
    maxWidth: '420px',
    width: '100%',
    position: 'relative',
    boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,106,61, 0.08)',
    transform: closing ? 'scale(0.95) translateY(10px)' : 'scale(1) translateY(0)',
    transition: 'transform 0.28s ease, opacity 0.28s ease',
    opacity: closing ? 0 : 1,
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  };

  const closeBtnStyle: React.CSSProperties = {
    position: 'absolute',
    top: '14px',
    right: '16px',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#8899aa',
    fontSize: '16px',
    lineHeight: 1,
    transition: 'background 0.18s',
  };

  const emojiStyle: React.CSSProperties = {
    fontSize: '48px',
    marginBottom: '16px',
    display: 'block',
    textAlign: 'center',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '26px',
    fontWeight: 800,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: '12px',
    letterSpacing: '-0.02em',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '15px',
    color: '#8899aa',
    textAlign: 'center',
    lineHeight: 1.6,
    marginBottom: '28px',
  };

  const primaryBtnStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '14px 20px',
    background: 'linear-gradient(135deg, #FF8A63 0%, #FF6A3D 100%)',
    color: '#C01515',
    fontWeight: 800,
    fontSize: '15px',
    textAlign: 'center',
    borderRadius: '10px',
    textDecoration: 'none',
    marginBottom: '12px',
    border: 'none',
    cursor: 'pointer',
    letterSpacing: '0.01em',
    transition: 'opacity 0.18s',
  };

  const secondaryBtnStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '12px 20px',
    background: 'rgba(255,255,255,0.06)',
    color: '#8899aa',
    fontWeight: 600,
    fontSize: '14px',
    textAlign: 'center',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer',
    transition: 'background 0.18s, color 0.18s',
  };

  return (
    <div style={overlayStyle} onClick={close}>
      <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtnStyle} onClick={close} aria-label="Cerrar">
          ✕
        </button>

        <span style={emojiStyle}>🛒</span>
        <h2 style={titleStyle}>¡Esperá! ¿Tenés dudas?</h2>
        <p style={subtitleStyle}>
          Nuestro equipo está disponible para ayudarte a armar tu pedido mayorista
        </p>

        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          style={primaryBtnStyle}
          onClick={close}
        >
          💬 Consultanos por WhatsApp
        </a>

        <button style={secondaryBtnStyle} onClick={close}>
          Seguir navegando
        </button>
      </div>
    </div>
  );
}
