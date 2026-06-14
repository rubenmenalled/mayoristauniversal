export default function ConfianzaSection() {
  const items = [
    {
      emoji: '🏢',
      titulo: 'Empresa registrada',
      texto: 'Operamos desde nuestra oficina en Lavalle 2378, Piso 8, Of. 82 — CABA. Factura disponible según tu condición.',
    },
    {
      emoji: '📦',
      titulo: 'Así trabajamos',
      texto: 'Recibimos tu pedido, lo armamos con cuidado y lo despachamos por correo con número de seguimiento para que lo sigas hasta tu puerta.',
    },
    {
      emoji: '🚚',
      titulo: 'Envíos a todo el país',
      texto: 'Trabajamos con los principales transportes (Andreani, OCA, Correo Argentino y más). Llegamos a cualquier provincia.',
    },
    {
      emoji: '💬',
      titulo: 'Atención real por WhatsApp',
      texto: 'Te respondemos en el día. Sacate todas las dudas antes de comprar y te acompañamos en todo el proceso.',
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
    background: 'linear-gradient(180deg,#FFFFFF,#FBFAF4)',
    border: '1.5px solid #EFE3BD', borderRadius: 16, padding: '26px 22px',
    boxShadow: '0 4px 18px rgba(11,30,63,0.06)', textAlign: 'center',
  }
  const badge: React.CSSProperties = {
    fontSize: 34, width: 64, height: 64, borderRadius: '50%',
    background: 'linear-gradient(135deg,#FDF6E3,#F6E7B8)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
  }
  const ct: React.CSSProperties = { color: '#0B1E3F', fontWeight: 800, fontSize: 16, margin: '0 0 6px' }
  const cx: React.CSSProperties = { color: '#4B5563', fontSize: 13.5, lineHeight: 1.55, margin: 0 }

  return (
    <section style={wrap}>
      <div style={inner}>
        <div style={head}>
          <h2 style={title}>Comprá con confianza</h2>
          <p style={sub}>Somos un negocio real, con dirección física y atención personalizada</p>
        </div>
        <div style={grid}>
          {items.map(it => (
            <div key={it.titulo} style={card}>
              <div style={badge}>{it.emoji}</div>
              <h3 style={ct}>{it.titulo}</h3>
              <p style={cx}>{it.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
