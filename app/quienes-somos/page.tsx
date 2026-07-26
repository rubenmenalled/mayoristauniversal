export const metadata = {
  title: 'Quiénes somos | Mayorista Universal',
  description: 'Mayorista Universal es una importadora y distribuidora mayorista multirubro con sede en Once, CABA, Argentina. Juguetería, peluches, bijouterie, perfumería, bebé, tendencias y más de 28 categorías, con envíos a todo el país.',
}

export default function QuienesSomosPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 100%)', color: '#374151' }}>

      {/* Header */}
      <div style={{
        background: 'rgba(240,240,240,0.97)',
        borderBottom: '1px solid rgba(255,106,61,0.25)',
        padding: '16px 24px',
        position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20 }}>
          <a href="/" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: '#FF6A3D', fontWeight: 700, fontSize: 14,
            textDecoration: 'none',
          }}>
            ← Volver
          </a>
          <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 20, letterSpacing: '0.04em' }}>
            MAYORISTA UNIVERSAL
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 80px' }}>

        <h1 style={{
          color: '#FF6A3D', fontWeight: 900, fontSize: 'clamp(22px, 3vw, 32px)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
          marginBottom: 8,
        }}>
          Quiénes somos
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 48 }}>
          Importadora y distribuidora mayorista multirubro · Buenos Aires, Argentina
        </p>

        <Section titulo="Qué es Mayorista Universal">
          <p>
            Mayorista Universal es una importadora y distribuidora mayorista multirubro con sede en el barrio
            de Once, Ciudad Autónoma de Buenos Aires, Argentina. Vendemos exclusivamente al por mayor a
            comerciantes, revendedores y compradores institucionales de todo el país, con más de 45.000
            productos activos repartidos en más de 28 categorías.
          </p>
          <p>
            Trabajamos rubros como juguetería, peluches, bijouterie, perfumería, artículos para bebé,
            tendencias, animé, accesorios de invierno, bazar y hogar, marroquinería, y muchos más — todo
            en un mismo lugar, con precios exclusivamente mayoristas.
          </p>
        </Section>

        <Section titulo="Cómo trabajamos">
          <p>
            Cada catálogo (rubro) tiene su propio mínimo de compra, y se puede combinar libremente distintos
            modelos y variantes dentro de un mismo pedido hasta alcanzarlo. Aceptamos pago por transferencia
            bancaria (sin recargo) y Mercado Pago, y realizamos envíos a todo el país.
          </p>
          <p>
            La atención es personalizada por WhatsApp durante todo el proceso de compra, desde la elección
            de productos hasta el seguimiento del envío.
          </p>
        </Section>

        <Section titulo="Contacto">
          <ul style={{ paddingLeft: 24, lineHeight: 2 }}>
            <li>WhatsApp: +54 116 4660482</li>
            <li>Correo electrónico: <a href="mailto:rubenmenalled@gmail.com" style={{ color: '#FF6A3D' }}>rubenmenalled@gmail.com</a></li>
            <li>Oficina en Once, CABA, Buenos Aires</li>
          </ul>
        </Section>

      </div>
    </div>
  )
}

function Section({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{
        color: '#FF8A63', fontWeight: 800, fontSize: 'clamp(16px, 2vw, 19px)',
        marginBottom: 16, paddingBottom: 10,
        borderBottom: '1px solid rgba(255,106,61,0.2)',
        letterSpacing: '0.03em',
      }}>
        {titulo}
      </h2>
      <div style={{ lineHeight: 1.85, fontSize: 15, color: '#374151', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {children}
      </div>
    </div>
  )
}
