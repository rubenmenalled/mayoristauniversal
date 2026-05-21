export const metadata = {
  title: 'Política de Privacidad | Mayorista Universal',
  description: 'Política de privacidad y tratamiento de datos personales de Mayorista Universal.',
}

export default function PrivacidadPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 100%)', color: '#e8eaf0' }}>

      {/* Header */}
      <div style={{
        background: 'rgba(240,240,240,0.97)',
        borderBottom: '1px solid rgba(212,175,55,0.25)',
        padding: '16px 24px',
        position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20 }}>
          <a href="/" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: '#D4AF37', fontWeight: 700, fontSize: 14,
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
          color: '#D4AF37', fontWeight: 900, fontSize: 'clamp(22px, 3vw, 32px)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
          marginBottom: 8,
        }}>
          Política de Privacidad
        </h1>
        <p style={{ color: '#7a8fa8', fontSize: 14, marginBottom: 48 }}>
          Última actualización: Mayo 2026
        </p>

        <p style={{ lineHeight: 1.85, fontSize: 15, color: '#c8d4e0', marginBottom: 40 }}>
          En Mayorista Universal valoramos y respetamos su privacidad. Esta Política de Privacidad describe
          cómo recopilamos, utilizamos, almacenamos y protegemos sus datos personales en cumplimiento de la
          Ley N° 25.326 de Protección de los Datos Personales de la República Argentina y sus normas reglamentarias.
          Al utilizar nuestra plataforma, usted consiente el tratamiento de sus datos conforme a lo aquí descrito.
        </p>

        {/* Sección 1 */}
        <Section titulo="1. Información que Recopilamos">
          <p>
            Al registrarse y utilizar Mayorista Universal, recopilamos los siguientes datos personales y
            comerciales:
          </p>
          <ul style={{ paddingLeft: 24, lineHeight: 2.2 }}>
            <li><strong style={{ color: '#F0C030' }}>Datos de identidad:</strong> nombre y apellido o razón social, número de DNI o CUIT/CUIL.</li>
            <li><strong style={{ color: '#F0C030' }}>Datos de contacto:</strong> dirección de correo electrónico, número de WhatsApp o teléfono, domicilio comercial o fiscal.</li>
            <li><strong style={{ color: '#F0C030' }}>Datos de actividad:</strong> historial de pedidos, productos consultados, categorías visitadas, búsquedas realizadas dentro del Sitio.</li>
            <li><strong style={{ color: '#F0C030' }}>Datos técnicos:</strong> dirección IP, tipo de navegador, sistema operativo, dispositivo utilizado, páginas visitadas y tiempo de sesión.</li>
            <li><strong style={{ color: '#F0C030' }}>Datos de pago:</strong> información necesaria para acreditar transferencias o procesar pagos (no almacenamos datos de tarjetas de crédito directamente; los pagos son procesados por proveedores habilitados).</li>
          </ul>
          <p>
            No recopilamos datos sensibles en los términos del artículo 2° de la Ley 25.326, tales como
            información sobre salud, origen étnico, orientación sexual o creencias religiosas.
          </p>
        </Section>

        {/* Sección 2 */}
        <Section titulo="2. Cómo Usamos la Información">
          <p>
            Los datos recopilados son utilizados exclusivamente para los siguientes fines:
          </p>
          <ul style={{ paddingLeft: 24, lineHeight: 2.2 }}>
            <li>Gestionar su cuenta de usuario y verificar su identidad como comprador mayorista.</li>
            <li>Procesar y confirmar pedidos, coordinar la logística de envío y emitir comprobantes fiscales.</li>
            <li>Comunicarnos con usted por correo electrónico o WhatsApp para informarle sobre el estado de sus pedidos, novedades de catálogo y actualizaciones del Sitio.</li>
            <li>Personalizar su experiencia en el Sitio mostrando categorías y productos relevantes según su historial de compras.</li>
            <li>Cumplir con obligaciones legales, fiscales y regulatorias aplicables (AFIP, legislación comercial argentina).</li>
            <li>Mejorar el funcionamiento y la seguridad de la plataforma mediante el análisis de datos de uso agregados y anonimizados.</li>
          </ul>
          <p>
            No utilizamos sus datos para toma de decisiones completamente automatizadas que lo afecten de manera significativa,
            ni los sometemos a perfilamiento con fines distintos a los declarados en esta política.
          </p>
        </Section>

        {/* Sección 3 */}
        <Section titulo="3. Almacenamiento y Seguridad">
          <p>
            Sus datos personales son almacenados en infraestructura provista por <strong style={{ color: '#F0C030' }}>Supabase</strong>,
            plataforma de base de datos en la nube que cumple con estándares internacionales de seguridad (SOC 2 Type II).
            Toda la información sensible se almacena cifrada en tránsito mediante TLS/SSL y en reposo mediante
            encriptación AES-256.
          </p>
          <p>
            Implementamos medidas técnicas y organizativas razonables para proteger sus datos contra acceso no
            autorizado, pérdida, alteración o divulgación. Estas medidas incluyen autenticación segura,
            control de accesos por roles, registros de auditoría y revisiones periódicas de seguridad.
          </p>
          <p>
            No obstante, ningún sistema de seguridad es infalible. En caso de producirse una brecha de seguridad
            que pueda afectar sus datos, Mayorista Universal lo notificará dentro de los plazos razonables
            y adoptará las medidas correctivas correspondientes conforme a la normativa vigente.
          </p>
          <p>
            Sus datos son conservados durante el tiempo que mantenga una cuenta activa en el Sitio, más un
            período adicional de hasta 5 años para cumplir con obligaciones fiscales y comerciales. Pasado
            ese plazo, los datos son eliminados o anonimizados de forma segura.
          </p>
        </Section>

        {/* Sección 4 */}
        <Section titulo="4. Compartir Información con Terceros">
          <p>
            Mayorista Universal no vende, alquila ni comercializa sus datos personales a terceros.
            Sin embargo, podemos compartir información en los siguientes casos limitados y necesarios:
          </p>
          <ul style={{ paddingLeft: 24, lineHeight: 2.2 }}>
            <li><strong style={{ color: '#F0C030' }}>Proveedores de logística y transporte:</strong> nombre, dirección de entrega y teléfono de contacto, exclusivamente para coordinar la entrega de su pedido.</li>
            <li><strong style={{ color: '#F0C030' }}>Procesadores de pago:</strong> datos de pago necesarios para acreditar transacciones (Mercado Pago u otros procesadores habilitados), quienes cuentan con sus propias políticas de privacidad.</li>
            <li><strong style={{ color: '#F0C030' }}>Organismos públicos:</strong> cuando sea requerido por ley, orden judicial o autoridad competente (AFIP, organismos de control, fuerzas de seguridad en el marco legal aplicable).</li>
            <li><strong style={{ color: '#F0C030' }}>Proveedores tecnológicos:</strong> plataformas de hosting, bases de datos y herramientas de análisis que operan como encargados del tratamiento bajo contratos de confidencialidad.</li>
          </ul>
          <p>
            Todos los terceros con quienes compartimos datos están obligados contractualmente a tratarlos
            conforme a la normativa de protección de datos aplicable y únicamente para los fines declarados.
          </p>
        </Section>

        {/* Sección 5 */}
        <Section titulo="5. Cookies">
          <p>
            Mayorista Universal utiliza cookies y tecnologías similares para mejorar la experiencia de navegación,
            mantener la sesión activa y analizar el comportamiento de los usuarios en el Sitio de forma agregada.
          </p>
          <p>
            Utilizamos los siguientes tipos de cookies:
          </p>
          <ul style={{ paddingLeft: 24, lineHeight: 2.2 }}>
            <li><strong style={{ color: '#F0C030' }}>Cookies esenciales:</strong> necesarias para el funcionamiento básico del Sitio (autenticación, carrito de pedidos). No pueden desactivarse.</li>
            <li><strong style={{ color: '#F0C030' }}>Cookies de preferencias:</strong> recuerdan sus configuraciones y preferencias de navegación.</li>
            <li><strong style={{ color: '#F0C030' }}>Cookies analíticas:</strong> nos permiten entender cómo los usuarios interactúan con el Sitio para mejorarlo continuamente. Los datos son procesados de forma agregada y anónima.</li>
          </ul>
          <p>
            Puede configurar su navegador para bloquear o eliminar cookies. Tenga en cuenta que deshabilitar
            las cookies esenciales puede afectar el correcto funcionamiento del Sitio y el acceso a algunas
            funcionalidades.
          </p>
        </Section>

        {/* Sección 6 */}
        <Section titulo="6. Derechos del Usuario">
          <p>
            Conforme a la Ley N° 25.326, usted tiene los siguientes derechos sobre sus datos personales:
          </p>
          <ul style={{ paddingLeft: 24, lineHeight: 2.2 }}>
            <li><strong style={{ color: '#F0C030' }}>Acceso:</strong> solicitar información sobre qué datos tenemos almacenados sobre usted.</li>
            <li><strong style={{ color: '#F0C030' }}>Rectificación:</strong> solicitar la corrección de datos inexactos, incompletos o desactualizados.</li>
            <li><strong style={{ color: '#F0C030' }}>Eliminación (derecho al olvido):</strong> solicitar la supresión de sus datos personales, salvo que existan obligaciones legales que requieran su conservación.</li>
            <li><strong style={{ color: '#F0C030' }}>Oposición:</strong> oponerse al tratamiento de sus datos para fines de comunicaciones comerciales.</li>
            <li><strong style={{ color: '#F0C030' }}>Portabilidad:</strong> recibir sus datos en un formato estructurado y de uso común para transferirlos a otro responsable del tratamiento.</li>
          </ul>
          <p>
            Para ejercer cualquiera de estos derechos, puede comunicarse a través del correo indicado en
            la sección de contacto a continuación. Responderemos su solicitud dentro de los 30 días hábiles
            conforme lo establece la normativa aplicable. La DIRECCIÓN NACIONAL DE PROTECCIÓN DE DATOS PERSONALES
            es el organismo competente para recibir denuncias y reclamos en materia de protección de datos
            en la República Argentina.
          </p>
        </Section>

        {/* Sección 7 */}
        <Section titulo="7. Contacto para Consultas de Privacidad">
          <p>
            Para ejercer sus derechos, realizar consultas o presentar reclamos relacionados con el tratamiento
            de sus datos personales, puede contactarse con nuestro responsable de privacidad:
          </p>
          <ul style={{ paddingLeft: 24, lineHeight: 2.5 }}>
            <li>Correo electrónico: <a href="mailto:rubenmenalled@gmail.com" style={{ color: '#D4AF37', textDecoration: 'none', fontWeight: 600 }}>rubenmenalled@gmail.com</a></li>
            <li>Asunto sugerido: <em style={{ color: '#7a8fa8' }}>"Consulta Privacidad - [su nombre]"</em></li>
            <li>Horario de respuesta: lunes a viernes de 9:00 a 17:00 hs (hora Argentina)</li>
          </ul>
          <p>
            Nos comprometemos a responder toda solicitud relacionada con privacidad dentro de los plazos
            establecidos por la legislación vigente y a tratar sus datos con la mayor confidencialidad y
            diligencia.
          </p>
        </Section>

      </div>
    </div>
  )
}

function Section({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{
        color: '#F0C030', fontWeight: 800, fontSize: 'clamp(16px, 2vw, 19px)',
        marginBottom: 16, paddingBottom: 10,
        borderBottom: '1px solid rgba(212,175,55,0.2)',
        letterSpacing: '0.03em',
      }}>
        {titulo}
      </h2>
      <div style={{ lineHeight: 1.85, fontSize: 15, color: '#c8d4e0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {children}
      </div>
    </div>
  )
}
