export const metadata = {
  title: 'Términos y Condiciones | Mayorista Universal',
  description: 'Términos y condiciones de uso de Mayorista Universal.',
}

export default function TerminosPage() {
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
          Términos y Condiciones
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 48 }}>
          Última actualización: Mayo 2026
        </p>

        {/* Sección 1 */}
        <Section titulo="1. Condiciones Generales de Uso">
          <p>
            Al acceder y utilizar la plataforma de Mayorista Universal (en adelante "el Sitio"), usted acepta quedar
            vinculado por los presentes Términos y Condiciones. Si no está de acuerdo con alguna de las disposiciones
            aquí establecidas, le solicitamos que se abstenga de utilizar nuestros servicios.
          </p>
          <p>
            Mayorista Universal es una plataforma de comercialización mayorista con sede en la República Argentina,
            destinada exclusivamente a comerciantes, revendedores y compradores institucionales que adquieran
            mercadería para su posterior venta o uso comercial. No se realizan ventas al público minorista.
          </p>
          <p>
            El Sitio se reserva el derecho de modificar estos términos en cualquier momento. Los cambios entrarán
            en vigencia a partir de su publicación en esta página. El uso continuado del Sitio implica la aceptación
            de las condiciones actualizadas.
          </p>
        </Section>

        {/* Sección 2 */}
        <Section titulo="2. Registro de Usuarios">
          <p>
            Para operar en Mayorista Universal es necesario crear una cuenta con datos verídicos y actualizados.
            Al registrarse, usted declara ser mayor de 18 años y tener capacidad legal para celebrar contratos en
            los términos de la legislación argentina vigente.
          </p>
          <p>
            Los datos requeridos para el registro incluyen: nombre y apellido o razón social, CUIT/CUIL, número de
            teléfono (preferentemente WhatsApp), dirección de correo electrónico y domicilio comercial o fiscal.
            Esta información será tratada conforme a nuestra Política de Privacidad.
          </p>
          <p>
            Cada usuario es responsable de mantener la confidencialidad de sus credenciales de acceso. En caso de
            detectar un uso no autorizado de su cuenta, deberá notificarlo de inmediato a nuestro equipo de
            atención al cliente. Mayorista Universal no será responsable por daños derivados del uso indebido de
            credenciales por parte de terceros.
          </p>
          <p>
            Mayorista Universal se reserva el derecho de suspender o eliminar cuentas que incurran en conductas
            fraudulentas, incumplimiento de estos términos o uso indebido de la plataforma.
          </p>
        </Section>

        {/* Sección 3 */}
        <Section titulo="3. Proceso de Compra y Pedidos">
          <p>
            La realización de un pedido implica la aceptación de los precios, condiciones y disponibilidad
            publicados al momento de la compra. Todos los pedidos están sujetos a confirmación por parte de
            Mayorista Universal, quien se reserva el derecho de rechazar o modificar un pedido en caso de error
            en el precio, falta de stock o información incompleta del comprador.
          </p>
          <p>
            Los pedidos se procesan en días hábiles entre las 9:00 y las 17:00 horas (hora Argentina, GMT-3).
            Una vez confirmado el pedido y acreditado el pago, se inicia el proceso de preparación y despacho.
            Mayorista Universal no procesa pedidos fuera del horario mencionado ni en días feriados nacionales.
          </p>
          <p>
            El comprador recibirá una confirmación por correo electrónico y/o WhatsApp con el detalle de su pedido,
            número de orden y estimación de entrega. La confirmación de pedido no implica la garantía de entrega
            inmediata en caso de circunstancias extraordinarias ajenas a nuestra voluntad.
          </p>
          <p>
            Los montos mínimos de compra por pedido podrán variar según la categoría de producto y serán
            informados en cada listado. Mayorista Universal podrá establecer cantidades mínimas por unidad,
            por docena o por bulto cerrado según el tipo de mercadería.
          </p>
        </Section>

        {/* Sección 4 */}
        <Section titulo="4. Precios y Facturación">
          <p>
            Todos los precios publicados en el Sitio están expresados en pesos argentinos (ARS) e incluyen IVA,
            salvo indicación en contrario. Mayorista Universal se reserva el derecho de actualizar los precios
            en cualquier momento sin previo aviso, en virtud de las condiciones del mercado local.
          </p>
          <p>
            La facturación se realizará conforme a la categoría impositiva del comprador (Responsable Inscripto,
            Monotributista o Consumidor Final) y a los datos fiscales declarados en el momento del registro.
            Es responsabilidad del comprador mantener actualizados su CUIT y condición frente a AFIP.
          </p>
          <p>
            Mayorista Universal emite comprobantes fiscales electrónicos (Facturas A, B o C según corresponda)
            conforme a la normativa de la Administración Federal de Ingresos Públicos (AFIP). Los comprobantes
            serán remitidos al correo electrónico registrado dentro de los 3 días hábiles posteriores al pago
            acreditado.
          </p>
          <p>
            Los métodos de pago aceptados incluyen transferencia bancaria, Mercado Pago y otros medios
            habilitados que se informarán oportunamente. El pago debe estar acreditado antes del inicio de
            la preparación del pedido.
          </p>
        </Section>

        {/* Sección 5 */}
        <Section titulo="5. Envíos y Transporte">
          <p>
            Mayorista Universal despacha pedidos a todo el territorio de la República Argentina a través de
            empresas de transporte y logística de reconocida trayectoria. Los plazos de entrega son orientativos
            y pueden variar según la zona geográfica, la disponibilidad del transportista y condiciones
            climáticas o de fuerza mayor.
          </p>
          <p>
            Los costos de envío corren por cuenta del comprador salvo promociones especiales vigentes, y serán
            calculados e informados antes de la confirmación del pedido. Para el área metropolitana de Buenos Aires
            (AMBA), la entrega estimada es de 2 a 5 días hábiles. Para el interior del país, el plazo puede
            extenderse entre 5 y 15 días hábiles según la localidad.
          </p>
          <p>
            Al recibir la mercadería, el comprador o su representante deberá verificar el estado del embalaje y
            la cantidad de bultos antes de firmar el remito de entrega. Toda observación debe ser asentada en el
            mismo momento de la recepción. Mayorista Universal no se responsabiliza por faltantes o daños no
            declarados en el momento de la entrega.
          </p>
          <p>
            En caso de retiro en depósito (disponible para ciertas zonas), el comprador deberá coordinar la
            fecha y hora de retiro con al menos 48 horas de anticipación, presentando el número de orden y
            documento de identidad.
          </p>
        </Section>

        {/* Sección 6 */}
        <Section titulo="6. Política de Devoluciones">
          <p>
            Mayorista Universal acepta devoluciones únicamente en los siguientes casos: producto con defecto de
            fábrica comprobable, error en el despacho imputable a Mayorista Universal (producto equivocado),
            o mercadería dañada durante el transporte debidamente documentada al momento de la recepción.
          </p>
          <p>
            Para gestionar una devolución, el comprador deberá comunicarse con nuestro equipo dentro de los
            7 días corridos posteriores a la recepción de la mercadería, adjuntando: número de orden, fotografías
            del producto y embalaje, y descripción del inconveniente. No se aceptarán devoluciones por
            arrepentimiento de compra dado el carácter mayorista de las operaciones.
          </p>
          <p>
            Una vez aprobada la devolución, Mayorista Universal coordinará el retiro del producto a su cargo
            y realizará el reemplazo de la mercadería o la acreditación del importe correspondiente según
            disponibilidad y acuerdo entre las partes. El proceso puede demorar hasta 15 días hábiles desde
            la aprobación de la devolución.
          </p>
        </Section>

        {/* Sección 7 */}
        <Section titulo="7. Propiedad Intelectual">
          <p>
            Todo el contenido publicado en Mayorista Universal, incluyendo textos, imágenes, logotipos, íconos,
            catálogos, diseños y software, es propiedad de Mayorista Universal o de sus proveedores y se
            encuentra protegido por las leyes de propiedad intelectual de la República Argentina y tratados
            internacionales aplicables.
          </p>
          <p>
            Queda expresamente prohibida la reproducción, distribución, modificación o uso comercial de
            cualquier contenido del Sitio sin autorización previa y escrita de Mayorista Universal. El uso
            no autorizado podrá dar lugar a acciones civiles y penales conforme a la legislación vigente.
          </p>
          <p>
            Las marcas de los productos comercializados pertenecen a sus respectivos fabricantes o titulares,
            y su mención en el Sitio se realiza únicamente con fines informativos y comerciales, sin implicar
            afiliación o endorsement por parte de Mayorista Universal salvo que se indique lo contrario.
          </p>
        </Section>

        {/* Sección 8 */}
        <Section titulo="8. Limitación de Responsabilidad">
          <p>
            Mayorista Universal no garantiza la disponibilidad continua e ininterrumpida del Sitio y no será
            responsable por daños derivados de interrupciones del servicio, errores técnicos, ataques
            informáticos o cualquier circunstancia de fuerza mayor. El Sitio se ofrece "tal como está"
            y Mayorista Universal realizará sus mejores esfuerzos para mantener su correcto funcionamiento.
          </p>
          <p>
            Mayorista Universal no será responsable por daños indirectos, lucro cesante o pérdida de negocio
            derivados del uso o imposibilidad de uso de la plataforma. En ningún caso la responsabilidad total
            de Mayorista Universal hacia un usuario podrá superar el monto efectivamente abonado por dicho
            usuario en la transacción que dio origen al reclamo.
          </p>
          <p>
            Los precios de lista y la disponibilidad de productos pueden modificarse sin previo aviso.
            Mayorista Universal no garantiza que los precios o la disponibilidad publicados permanezcan
            invariables durante un período determinado, y no asume responsabilidad por diferencias de precios
            entre el momento de la consulta y el de la confirmación del pedido.
          </p>
        </Section>

        {/* Sección 9 */}
        <Section titulo="9. Contacto">
          <p>
            Para consultas relacionadas con estos Términos y Condiciones, o para cualquier otro asunto
            vinculado a su relación comercial con Mayorista Universal, puede comunicarse con nosotros a través
            de los siguientes medios:
          </p>
          <ul style={{ paddingLeft: 24, lineHeight: 2 }}>
            <li>Correo electrónico: <a href="mailto:rubenmenalled@gmail.com" style={{ color: '#FF6A3D' }}>rubenmenalled@gmail.com</a></li>
            <li>WhatsApp: disponible en el Sitio en horario comercial</li>
            <li>Horario de atención: lunes a viernes de 9:00 a 17:00 hs (hora Argentina)</li>
          </ul>
          <p>
            Toda controversia que surja en relación con estos Términos y Condiciones se someterá a la
            jurisdicción de los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires, renunciando
            las partes a cualquier otro fuero que pudiera corresponder.
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
