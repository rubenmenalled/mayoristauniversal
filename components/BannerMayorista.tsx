export default function BannerMayorista() {
  const wrap: React.CSSProperties = {
    background: '#FFFFFF',
    padding: '8px 16px 34px',
    width: '100%',
    boxSizing: 'border-box',
  }
  const card: React.CSSProperties = {
    maxWidth: 1080,
    margin: '0 auto',
    background: 'linear-gradient(135deg,#0B1E3F 0%,#16335f 100%)',
    border: '1.5px solid rgba(212,175,55,0.45)',
    borderRadius: 22,
    boxShadow: '0 14px 40px rgba(11,30,63,0.28)',
    padding: '30px 26px',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'clamp(20px, 5vw, 56px)',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  }
  const glow: React.CSSProperties = {
    position: 'absolute',
    top: -60, right: -40,
    width: 200, height: 200,
    background: 'radial-gradient(circle, rgba(212,175,55,0.18), transparent 70%)',
    pointerEvents: 'none',
  }
  const eyebrow: React.CSSProperties = {
    color: '#D4AF37', fontWeight: 800, fontSize: 13,
    letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 6,
  }
  const big: React.CSSProperties = {
    color: '#FFFFFF', fontWeight: 900,
    fontSize: 'clamp(28px, 6vw, 46px)', lineHeight: 1, margin: 0,
  }
  const gold: React.CSSProperties = { color: '#F0C030' }
  const badge: React.CSSProperties = {
    display: 'inline-block', marginTop: 12,
    background: '#16A34A', color: '#FFFFFF',
    fontWeight: 800, fontSize: 12.5, letterSpacing: '0.04em',
    padding: '5px 16px', borderRadius: 99,
  }
  const divider: React.CSSProperties = {
    width: 1.5, alignSelf: 'stretch', minHeight: 90,
    background: 'linear-gradient(transparent, rgba(212,175,55,0.5), transparent)',
  }
  const subLabel: React.CSSProperties = { color: '#AEBED6', fontWeight: 600, fontSize: 15, marginBottom: 4 }
  const subBig: React.CSSProperties = { color: '#FFFFFF', fontWeight: 900, fontSize: 'clamp(22px, 4.5vw, 32px)', lineHeight: 1.05, margin: 0 }
  const note: React.CSSProperties = { color: '#8DA0BC', fontSize: 12.5, marginTop: 8 }

  return (
    <section style={wrap}>
      <div style={card}>
        <div style={glow} />

        {/* Mayorista */}
        <div style={{ position: 'relative' }}>
          <div style={eyebrow}>💰 Precio mayorista</div>
          <p style={big}>desde <span style={gold}>$100.000</span></p>
          <span style={badge}>✅ SIN RECARGO</span>
        </div>

        <div style={divider} className="banner-divider" />

        {/* Menores */}
        <div style={{ position: 'relative' }}>
          <div style={subLabel}>Compras menores a $100.000</div>
          <p style={subBig}>+ <span style={gold}>30%</span> de recargo</p>
          <div style={note}>Venta también por unidad · mínimo $40.000</div>
        </div>
      </div>

      <style>{`
        @media (max-width: 560px) {
          .banner-divider { display: none; }
        }
      `}</style>
    </section>
  )
}
