'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'firstOrderGuideShown';

const STEPS = [
  { emoji: '🛍️', label: 'Elegís tus productos', hint: 'Estás acá' },
  { emoji: '💳', label: 'Pagás con confianza', hint: 'Transferencia, Mercado Pago o WhatsApp' },
  { emoji: '📦', label: 'Preparamos tu pedido', hint: 'Armamos todo con cuidado' },
  { emoji: '🚚', label: 'Lo despachamos', hint: 'Envíos a todo el país' },
];

export default function FirstOrderGuide() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const handler = () => {
      if (typeof window === 'undefined') return;
      if (localStorage.getItem(STORAGE_KEY) === 'true') return;
      setVisible(true);
    };
    window.addEventListener('mu:item-added', handler);
    return () => window.removeEventListener('mu:item-added', handler);
  }, []);

  const close = () => {
    setClosing(true);
    localStorage.setItem(STORAGE_KEY, 'true');
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 280);
  };

  if (!visible) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    zIndex: 9998,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    opacity: closing ? 0 : 1,
    transition: 'opacity 0.28s ease',
  };

  const cardStyle: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '28px 24px 24px',
    maxWidth: '380px',
    width: '100%',
    position: 'relative',
    boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
    transform: closing ? 'scale(0.95) translateY(10px)' : 'scale(1) translateY(0)',
    transition: 'transform 0.28s ease, opacity 0.28s ease',
    opacity: closing ? 0 : 1,
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  };

  return (
    <div style={overlayStyle} onClick={close}>
      <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={close}
          aria-label="Cerrar"
          style={{
            position: 'absolute', top: 12, right: 12, background: '#F3F4F6', border: 'none',
            borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: '#6B7280', fontSize: 14,
          }}>
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}>✅</div>
          <h2 style={{ fontSize: 19, fontWeight: 900, color: '#111827', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
            ¡Genial, elegiste tu primer producto!
          </h2>
          <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
            Así de simple es comprar con nosotros
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 18,
                  background: i === 0 ? 'linear-gradient(135deg,#FF6A3D,#FF8A63)' : '#F3F4F6',
                  border: i === 0 ? 'none' : '1.5px solid #E5E7EB',
                  boxShadow: i === 0 ? '0 3px 10px rgba(255,106,61,0.4)' : 'none',
                }}>
                  {s.emoji}
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 2, flex: 1, minHeight: 26, background: i === 0 ? '#FFD7C2' : '#E5E7EB', margin: '2px 0' }} />
                )}
              </div>
              <div style={{ paddingBottom: i < STEPS.length - 1 ? 18 : 0, paddingTop: 6 }}>
                <div style={{ fontSize: 14, fontWeight: i === 0 ? 900 : 700, color: i === 0 ? '#111827' : '#374151' }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 11.5, color: i === 0 ? '#FF6A3D' : '#9CA3AF', fontWeight: i === 0 ? 800 : 500, marginTop: 1 }}>
                  {s.hint}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 16,
          fontSize: 10.5, color: '#6B7280', fontWeight: 700,
        }}>
          <span>🔒 Pago seguro</span>
          <span>·</span>
          <span>💬 Te acompañamos por WhatsApp</span>
        </div>

        <button
          onClick={close}
          style={{
            width: '100%', padding: '12px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg,#FF6A3D,#FF8A63)', color: '#FFFFFF',
            fontWeight: 900, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,106,61,0.35)',
          }}>
          Entendido, seguir comprando →
        </button>
      </div>
    </div>
  );
}
