export default function ConfianzaSection() {
  const items = [
    {
      emoji: '🏢',
      titulo: 'Empresa registrada',
      texto: 'Operamos desde nuestra oficina en Lavalle 2378, Piso 8, Of. 82 — CABA. Factura disponible según tu condición.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=70',
    },
    {
      emoji: '📦',
      titulo: 'Así trabajamos',
      texto: 'Recibimos tu pedido, lo armamos con cuidado y lo despachamos por correo con número de seguimiento para que lo sigas hasta tu puerta.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=70',
    },
    {
      emoji: '🚚',
      titulo: 'Envíos a todo el país',
      texto: 'Trabajamos con los principales transportes (Andreani, OCA, Correo Argentino y más). Llegamos a cualquier provincia.',
      image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=70',
    },
    {
      emoji: '💬',
      titulo: 'Atención real por WhatsApp',
      texto: 'Te respondemos en el día. Sacate todas las dudas antes de comprar y te acompañamos en todo el proceso.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=70',
    },
  ]

  const wrap: React.CSSProperties = {
    background: '#FFFFFF', padding: '64px 20px', width: '100%', boxSizing: 'border-box',
  }
  const inner: React.CSSProperties = { maxWidth: 1100, margin: '0 auto' }
  const head: React.CSSProperties = { textAlign: 'center', marginBottom: 44 }
  const title: React.CSSProperties = {
    fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 900, color: '#0B1E3F', margin: '0 0 10px',
  }
  const sub: React.CSSProperties = { fontSize: 16, color: '#6B7280', margin: 0 }
  const grid: React.CSSProperties = {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20,
  }
  const card: React.CSSProperties = {
    position: 'relative', borderRadius: 16, overflow: 'hidden',
    minHeight: 270, padding: 22, display: 'flex', flexDirection: 'column',
    justifyContent: 'flex-end', textAlign: 'left',
    boxShadow: '0 10px 30px rgba(11,30,63,0.18)',
  }
  const cardImg: React.CSSProperties = {
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    objectFit: 'cover', zIndex: 0,
  }
  const cardOverlay: React.CSSProperties = {
    position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
    background: 'linear-gradient(180deg, rgba(11,30,63,0.25) 0%, rgba(11,30,63,0.60) 50%, rgba(11,30,63,0.93) 100%)',
  }
  const cardBody: React.CSSProperties = { position: 'relative', zIndex: 2 }
  const badge: React.CSSProperties = {
    fontSize: 30, width: 56, height: 56, borderRadius: '50%',
    background: 'rgba(255,106,61,0.92)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
  }
  const ct: React.CSSProperties = { color: '#FFFFFF', fontWeight: 800, fontSize: 17, margin: '0 0 6px', textShadow: '0 2px 10px rgba(0,0,0,0.4)' }
  const cx: React.CSSProperties = { color: 'rgba(255,255,255,0.92)', fontSize: 13.5, lineHeight: 1.55, margin: 0, textShadow: '0 1px 8px rgba(0,0,0,0.4)' }

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={head}>
          <h2 style={title}>Comprá con confianza</h2>
          <p style={sub}>Somos un negocio real, con dirección física y atención personalizada</p>
        </div>

        {/* Garantía de entrega — destacada */}
        <div className="conf-card" style={{
          position: 'relative', overflow: 'hidden',
          border: '2px solid #16A34A', borderRadius: 16,
          padding: '24px', marginBottom: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
          flexWrap: 'wrap', textAlign: 'center',
          boxShadow: '0 10px 30px rgba(11,30,63,0.16)',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=1200&q=70" alt=""
            className="conf-img"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            background: 'linear-gradient(135deg, rgba(20,83,45,0.90) 0%, rgba(22,101,52,0.84) 100%)',
          }} />
          <span style={{ position: 'relative', zIndex: 2, fontSize: 40, lineHeight: 1 }}>🛡️</span>
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'left', maxWidth: 760 }}>
            <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 'clamp(17px,2.6vw,22px)', marginBottom: 4, textShadow: '0 2px 10px rgba(0,0,0,0.35)' }}>
              Garantía de entrega
            </div>
            <div style={{ color: 'rgba(255,255,255,0.95)', fontSize: 'clamp(13px,2vw,15px)', lineHeight: 1.5, textShadow: '0 1px 8px rgba(0,0,0,0.35)' }}>
              Tu pedido <strong>llega sí o sí</strong>. Si no llega, o llega roto o fallado, <strong>te lo reponemos o te devolvemos tu dinero</strong>. Comprá tranquilo.
            </div>
          </div>
        </div>

        <div style={grid}>
          {items.map(it => (
            <div key={it.titulo} style={card} className="conf-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.image} alt="" style={cardImg} className="conf-img" />
              <div style={cardOverlay} />
              <div style={cardBody}>
                <div style={badge}>{it.emoji}</div>
                <h3 style={ct}>{it.titulo}</h3>
                <p style={cx}>{it.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .conf-card .conf-img { transition: transform .45s ease; }
        .conf-card:hover .conf-img { transform: scale(1.07); }
      `}</style>
    </section>
  )
}
