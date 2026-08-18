export interface BlogPost {
  slug: string
  title: string
  metaDescription: string
  excerpt: string
  coverImage: string
  categoryLink?: { nombre: string; label: string }
  publishedAt: string // ISO date
  content: string // HTML
}

const p = (s: string) => `<p>${s}</p>`
const h2 = (s: string) => `<h2>${s}</h2>`
const ul = (items: string[]) => `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'como-comprar-al-por-mayor-en-argentina-guia-para-revendedores',
    title: 'Cómo comprar al por mayor en Argentina: guía completa para revendedores',
    metaDescription: 'Guía práctica para arrancar o mejorar tu negocio de reventa: cómo elegir un mayorista confiable, calcular márgenes, armar el primer pedido y evitar los errores más comunes.',
    excerpt: 'Todo lo que necesitás saber antes de hacer tu primer pedido mayorista: cómo elegir proveedor, calcular precios de reventa y armar un pedido inteligente.',
    coverImage: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&q=80',
    publishedAt: '2026-08-18',
    content: `
      ${p('Si estás por arrancar un local, un puesto de feria, una tienda online o simplemente querés revender productos por WhatsApp, comprar al por mayor es el paso que más impacta en tu rentabilidad. Acá te contamos, en criollo, cómo hacerlo bien desde el primer pedido.')}
      ${h2('1. Elegí un mayorista multirubro antes que varios monorubro')}
      ${p('Si estás empezando, comprarle a un solo proveedor que tenga varios rubros (juguetería, bazar, bijouterie, perfumería, etc.) te simplifica la logística: un solo pedido, un solo envío, un solo mínimo de compra a alcanzar. Recién cuando tu negocio crece y sabés bien qué rubro te funciona mejor, tiene sentido sumar proveedores especializados.')}
      ${h2('2. Entendé cómo funciona el precio mayorista')}
      ${p('El precio mayorista NO es el precio final al público — es el costo al que vos comprás para después revender con tu propio margen. Un margen sano para reventa suele rondar el 40-100% sobre el precio mayorista, dependiendo del rubro (bijouterie y juguetes chicos suelen dejar más margen porcentual que electrónica, por ejemplo).')}
      ${h2('3. Calculá bien el mínimo de compra')}
      ${p('Casi todos los mayoristas piden un monto mínimo de compra por catálogo (en Mayorista Universal, por ejemplo, el mínimo general es de $150.000 por rubro). Antes de armar tu pedido, sumá mentalmente qué productos necesitás de verdad — no compres de más solo para "llegar al mínimo", elegí variedad real que vayas a poder vender.')}
      ${h2('4. Diversificá sin perder el foco')}
      ${p('Un error común de quien arranca es comprar de TODO un poco. Funciona mejor elegir 2 o 3 rubros donde detectaste demanda real (por ejemplo: juguetería + bijouterie, o bazar + perfumería) y profundizar ahí, en vez de tener 15 rubros con 3 productos cada uno.')}
      ${h2('5. Mirá siempre el pedido mínimo por artículo')}
      ${p('Además del mínimo en pesos por catálogo, cada producto tiene su propio "pedido mínimo" (por ejemplo, se vende de a 6, 12 o 25 unidades). Fijate ese número antes de calcular cuánto necesitás invertir por producto — comprar de a 1 unidad casi nunca es una opción al por mayor.')}
      ${h2('6. Pedí fotos y códigos reales')}
      ${p('Para vender bien (en Instagram, WhatsApp o un local físico) necesitás fotos de calidad y, si es posible, el código o SKU de cada producto — te va a servir para hacer pedidos de reposición rápido, sin tener que explicar "el que tiene el osito rosa".')}
      ${h2('En resumen')}
      ${ul([
        'Empezá con un mayorista multirubro para simplificar.',
        'Definí tu margen antes de comprar, no después.',
        'Elegí 2-3 rubros y profundizá en vez de dispersarte.',
        'Prestá atención al pedido mínimo por artículo, no solo al mínimo general.',
      ])}
      ${p('Si querés arrancar hoy mismo, mirá <a href="/catalogo">nuestro catálogo completo</a> — más de 28 rubros con envíos a todo el país.')}
    `,
  },
  {
    slug: 'jugueteria-por-mayor-guia-para-elegir-mercaderia',
    title: 'Juguetería por mayor: guía para elegir la mercadería que más se vende',
    metaDescription: 'Qué tipo de juguetes conviene comprar al por mayor en Argentina, cómo armar un surtido equilibrado y qué categorías dejan mejor margen para revendedores y jugueterías.',
    excerpt: 'Cómo armar un surtido de juguetería que realmente se venda: qué categorías priorizar, cómo mezclar precios y qué evitar en tu primer pedido.',
    coverImage: 'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?w=1200&q=80',
    categoryLink: { nombre: 'JUGUETERIA', label: 'Ver catálogo de Juguetería' },
    publishedAt: '2026-08-18',
    content: `
      ${p('La juguetería es uno de los rubros más elegidos por quien arranca a revender, porque tiene ticket bajo, alta rotación y compra por impulso. Pero "comprar juguetes" a lo loco no alcanza — así lo hacés bien.')}
      ${h2('Armá 3 franjas de precio')}
      ${p('Un surtido equilibrado tiene productos de entrada (económicos, para venta rápida), productos medios (el grueso del catálogo) y algunos productos "estrella" más caros que llaman la atención en la vidriera o en las fotos. Mezclar las tres franjas mejora el ticket promedio.')}
      ${h2('Priorizá licencias y tendencias del momento')}
      ${p('Personajes de moda (los que están sonando en redes, series o películas del momento) rotan mucho más rápido que juguetes genéricos. Vale la pena destinar una parte del presupuesto a lo que está de moda, aunque cueste un poco más.')}
      ${h2('No te olvides de los llaveros y accesorios chicos')}
      ${p('Los <a href="/categorias/LLAVEROS%20DE%20GOMA">llaveros de goma</a> y productos chicos de bajo costo son excelentes para venta por impulso en el mostrador — el cliente que ya está comprando algo más grande suele sumar uno o dos sin pensarlo mucho.')}
      ${h2('Juguetes didácticos: menor rotación, mejor margen')}
      ${p('Los juguetes didácticos y educativos rotan más lento que los de personajes, pero suelen tolerar un margen más alto porque los padres los valoran especialmente en épocas de regreso a clases.')}
      ${h2('En resumen')}
      ${ul([
        'Mezclá franjas de precio: económico, medio y "estrella".',
        'Sumá lo que está de moda, aunque cueste más.',
        'Los llaveros y productos chicos son ideales para venta por impulso.',
        'Los juguetes didácticos rinden mejor en épocas escolares.',
      ])}
      ${p('Mirá el catálogo completo de <a href="/categorias/JUGUETERIA">Juguetería al por mayor</a>, con miles de productos y nuevos ingresos cada semana.')}
    `,
  },
  {
    slug: 'peluches-por-mayor-guia-de-tamanos-y-personajes',
    title: 'Peluches por mayor: guía de tamaños y personajes que más se venden',
    metaDescription: 'Guía práctica sobre qué tamaños de peluches convienen para cada tipo de venta (kioscos, jugueterías, regalería) y qué personajes están más buscados.',
    excerpt: 'Qué tamaño de peluche conviene para cada tipo de negocio y qué personajes son valores seguros para tu próximo pedido.',
    coverImage: 'https://images.unsplash.com/photo-1562040506-a9b32cb69591?w=1200&q=80',
    categoryLink: { nombre: 'PELUCHES', label: 'Ver catálogo de Peluches' },
    publishedAt: '2026-08-18',
    content: `
      ${p('Los peluches son uno de los productos más nobles para revender: casi no se rompen, no vencen y tienen demanda todo el año (con picos fuertes en Día del Niño, Navidad y San Valentín). Así elegís bien el surtido.')}
      ${h2('Tamaños chicos (20-30cm): tu base del catálogo')}
      ${p('Son los que más rotan porque tienen el ticket más accesible. Ideales para kioscos, puestos de feria y regalería chica. Conviene tener siempre stock variado en este rango.')}
      ${h2('Tamaños medianos (35-50cm): el "regalo lindo"')}
      ${p('Este rango es el más elegido para regalos de cumpleaños y ocasiones especiales — vale la pena tener buena variedad de personajes y colores.')}
      ${h2('Tamaños grandes y gigantes: menos rotación, más impacto')}
      ${p('Los peluches gigantes rotan mucho más lento, pero funcionan como "producto ancla" — llaman la atención, se sacan fotos con ellos y generan tráfico. No hace falta tener muchas unidades, con 1 o 2 en vidriera alcanza.')}
      ${h2('Personajes que son valores seguros')}
      ${p('Más allá de las modas del momento (que cambian rápido), hay personajes que nunca dejan de venderse: ositos clásicos, animales genéricos (perros, gatos, conejos) y personajes con base de fans muy amplia. Conviene tener siempre stock de estos "clásicos" además de lo que está de moda.')}
      ${h2('Fechas clave para stockearte con anticipación')}
      ${ul([
        'Día del Niño (tercer domingo de agosto): el pico más fuerte del año.',
        'Navidad: segundo pico más importante.',
        'San Valentín (14 de febrero): peluches temáticos con corazones.',
        'Día de la Madre: peluches medianos y de regalo.',
      ])}
      ${p('Explorá el catálogo completo de <a href="/categorias/PELUCHES">Peluches al por mayor</a>, con miles de modelos y tamaños, y la línea especial de <a href="/categorias/ENAMORADOS">Enamorados</a> para San Valentín.')}
    `,
  },
  {
    slug: 'bijouterie-por-mayor-que-materiales-elegir',
    title: 'Bijouterie por mayor: qué materiales elegir y cómo armar combos que se vendan',
    metaDescription: 'Guía sobre los materiales de bijouterie más resistentes para reventa (acero, bronce) y cómo armar combos de pulseras, collares y aros que aumenten el ticket promedio.',
    excerpt: 'Acero, bronce o fantasía: qué material conviene según tu público, y cómo armar combos que hagan crecer el ticket promedio de cada venta.',
    coverImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&q=80',
    categoryLink: { nombre: 'BIJOUTERIE', label: 'Ver catálogo de Bijouterie' },
    publishedAt: '2026-08-18',
    content: `
      ${p('La bijouterie es uno de los rubros con mejor margen porcentual del mercado mayorista, pero elegir bien el material marca la diferencia entre un cliente que vuelve y uno que se queja porque "se puso verde".')}
      ${h2('Acero dorado y plateado: la opción más segura')}
      ${p('El acero no se oxida ni pierde el color con el uso diario, así que genera menos reclamos y más satisfacción del cliente final. Es el material recomendado si estás armando tu primer surtido o vendés a un público que usa las piezas todos los días.')}
      ${h2('Bronce: buen equilibrio precio-calidad')}
      ${p('El bronce dorado y plateado suele costar un poco menos que el acero y tiene buena durabilidad. Es una alternativa sólida para ampliar variedad sin subir demasiado el costo del surtido.')}
      ${h2('Fantasía: la más económica, para volumen')}
      ${p('Ideal para promociones, combos y productos de entrada de precio muy bajo — pero avisale a tu cliente que es fantasía, para evitar reclamos por decoloración.')}
      ${h2('Armá combos que suban el ticket promedio')}
      ${p('Vender pulsera + collar + aros en conjunto (mismo diseño o colores combinables) aumenta naturalmente el ticket promedio, porque el cliente ve "un look completo" en vez de una pieza suelta. Es una de las técnicas más simples y efectivas del rubro.')}
      ${h2('En resumen')}
      ${ul([
        'Acero: para durabilidad y menos reclamos.',
        'Bronce: buen equilibrio precio-calidad.',
        'Fantasía: para volumen y promociones.',
        'Combos de pulsera+collar+aros suben el ticket promedio.',
      ])}
      ${p('Mirá el catálogo completo de <a href="/categorias/BIJOUTERIE">Bijouterie al por mayor</a>, organizado por material.')}
    `,
  },
  {
    slug: 'bazar-y-hogar-por-mayor-productos-que-nunca-faltan',
    title: 'Bazar y Hogar por mayor: los productos que nunca deberían faltar en tu local',
    metaDescription: 'Qué productos de bazar y hogar tienen demanda constante todo el año y cuáles conviene stockear antes de fin de año y las fiestas.',
    excerpt: 'Los básicos de bazar que se venden los 365 días del año, y qué conviene sumar antes de las fiestas de fin de año.',
    coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
    categoryLink: { nombre: 'BAZAR Y HOGAR', label: 'Ver catálogo de Bazar y Hogar' },
    publishedAt: '2026-08-18',
    content: `
      ${p('El rubro de bazar y hogar tiene algo que pocos otros tienen: demanda constante, sin estacionalidad marcada, más algunos picos previsibles en fin de año. Así armás un surtido que rote todo el año.')}
      ${h2('Los básicos que se venden siempre')}
      ${p('Tazas, vasos, organizadores, artículos de limpieza y productos de cocina chicos (utensilios, coladores, tablas) tienen demanda pareja los doce meses del año — son la base que nunca debería faltar en tu góndola.')}
      ${h2('Decoración: el margen más alto del rubro')}
      ${p('Los artículos decorativos (floreros, portavelas, cuadros, adornos) suelen tener el margen porcentual más alto de todo el bazar, porque el cliente no compara tanto el precio como con productos "funcionales" de uso diario.')}
      ${h2('Anticipate a fin de año')}
      ${p('Noviembre y diciembre son el pico fuerte del rubro: vajilla para las fiestas, artículos de regalería y decoración navideña. Conviene empezar a stockearte desde septiembre-octubre para no quedarte sin mercadería en el momento de mayor demanda.')}
      ${h2('Organizadores: la categoría que más creció')}
      ${p('Los productos organizadores (cajas, canastos, percheros) vienen creciendo fuerte en los últimos años, impulsados por tendencias de orden y minimalismo en redes sociales — vale la pena darles buen espacio en tu surtido.')}
      ${h2('En resumen')}
      ${ul([
        'Tazas, vasos y utensilios de cocina: demanda constante todo el año.',
        'Decoración: el margen más alto del rubro.',
        'Stockeate para fin de año desde septiembre-octubre.',
        'Los organizadores son una categoría en crecimiento.',
      ])}
      ${p('Explorá el catálogo completo de <a href="/categorias/BAZAR%20Y%20HOGAR">Bazar y Hogar al por mayor</a>.')}
    `,
  },
  {
    slug: 'perfumeria-y-skin-care-por-mayor-guia-para-empezar',
    title: 'Perfumería y skin care por mayor: guía para empezar a revender sin errores',
    metaDescription: 'Qué tener en cuenta al comprar perfumería y productos de cuidado personal al por mayor: presentaciones, packs miniatura y cómo armar combos de regalo.',
    excerpt: 'Presentaciones grandes, miniaturas y combos de regalo: cómo armar un surtido de perfumería y skin care que convierta bien.',
    coverImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80',
    categoryLink: { nombre: 'BELLEZA Y PERFUMERIA WT', label: 'Ver catálogo de Belleza y Perfumería' },
    publishedAt: '2026-08-18',
    content: `
      ${p('La perfumería y el cuidado personal (skin care) son de los rubros con más frecuencia de recompra: un cliente satisfecho vuelve a comprar el mismo producto cada 1-2 meses. Así armás un surtido que fideliza.')}
      ${h2('Miniaturas: la puerta de entrada')}
      ${p('Los perfumes en formato miniatura (30ml) tienen ticket bajo y son ideales para que un cliente nuevo "pruebe" tu local sin comprometerse con un frasco grande. Muchos vuelven después a buscar el tamaño completo.')}
      ${h2('Tubos y formatos grandes: mejor margen por unidad')}
      ${p('Los perfumes en tubo y formatos más grandes dejan mejor margen en pesos por unidad vendida, aunque roten un poco más lento que las miniaturas — conviene tener de los dos formatos en el surtido.')}
      ${h2('Skin care: la categoría que más creció')}
      ${p('Mascarillas, tónicos, cremas y productos de limpieza facial vienen con una demanda en fuerte crecimiento en los últimos años, impulsada por tendencias de cuidado de la piel en redes sociales — es un buen momento para sumar variedad en esta categoría.')}
      ${h2('Armá combos de regalo')}
      ${p('Perfume + crema + accesorio de belleza en un combo con caja o bolsa de regalo es una de las formas más simples de aumentar el ticket promedio, sobre todo cerca de fechas como Día de la Madre o San Valentín.')}
      ${h2('En resumen')}
      ${ul([
        'Miniaturas: ticket bajo, puerta de entrada para clientes nuevos.',
        'Tubos y formatos grandes: mejor margen por unidad.',
        'Skin care: categoría en fuerte crecimiento, vale la pena invertir ahí.',
        'Los combos de regalo suben el ticket promedio en fechas clave.',
      ])}
      ${p('Mirá el catálogo completo de <a href="/categorias/BELLEZA%20Y%20PERFUMERIA%20WT">Belleza y Perfumería</a> y la línea de <a href="/categorias/SALUD%20Y%20BIENESTAR">Salud y Bienestar</a>.')}
    `,
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug)
}
