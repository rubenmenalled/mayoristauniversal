export interface Category {
  id: number; name: string; emoji: string; image: string; description: string; count: number;
}
export interface Product {
  id: number; name: string; brand: string; category: string;
  price: number; wholesalePrice: number; minOrder: number;
  rating: number; reviews: number; image: string;
  badge?: string; discount?: number; location: string;
}
export interface Supplier {
  id: number; name: string; category: string; location?: string;
  rating: number; products: number; verified: boolean;
  initials?: string; color?: string; emoji?: string; description?: string;
}
export interface Testimonial {
  id: number; name: string; company: string; role: string;
  text: string; rating: number; avatar: string; savings: string;
}

export const categories: Category[] = [
  { id:1,  name:'Electrónica',   emoji:'💻', image:'/rubros/electronica.jpg',   description:'Gadgets y electrónica',      count:2100 },
  { id:2,  name:'Belleza',       emoji:'💄', image:'/rubros/belleza.jpg',        description:'Cosméticos y cuidado',       count:890  },
  { id:3,  name:'Peluches',      emoji:'🧸', image:'/rubros/peluches.jpg',       description:'Peluches y muñecos',         count:430  },
  { id:4,  name:'Juguetería',    emoji:'🎮', image:'/rubros/jugueteria.jpg',     description:'Juguetes y entretenimiento', count:670  },
  { id:5,  name:'Bazar',         emoji:'🏺', image:'/rubros/bazar.jpg',          description:'Artículos de bazar',         count:1240 },
  { id:6,  name:'Blanquería',    emoji:'🛏️', image:'/rubros/blanqueria.jpg',    description:'Ropa de cama y baño',        count:560  },
  { id:7,  name:'Marroquinería', emoji:'👜', image:'/rubros/marroquineria.jpg',  description:'Carteras y accesorios',      count:380  },
  { id:8,  name:'Librería',      emoji:'📚', image:'/rubros/libreria.jpg',       description:'Libros y papelería',         count:430  },
  { id:9,  name:'Óptica',        emoji:'👓', image:'/rubros/optica.jpg',         description:'Anteojos y lentes',          count:290  },
  { id:10, name:'Indumentaria',  emoji:'👗', image:'/rubros/indumentaria.jpg',   description:'Ropa y accesorios',          count:3400 },
  { id:11, name:'Perfumería',    emoji:'🌸', image:'/rubros/perfumeria.jpg',     description:'Perfumes y fragancias',      count:520  },
  { id:12, name:'Rodados',       emoji:'🛴', image:'/rubros/rodados.jpg',        description:'Bicicletas y scooters',      count:310  },
  { id:13, name:'Cotillón',      emoji:'🎉', image:'/rubros/cotillon.jpg',       description:'Fiestas y decoración',       count:870  },
  { id:14, name:'Mascotas',      emoji:'🐾', image:'/rubros/mascotas.jpg',       description:'Todo para mascotas',         count:560  },
  { id:15, name:'Ferretería',    emoji:'🔧', image:'/rubros/ferreteria.jpg',     description:'Herramientas y materiales',  count:980  },
];

export const products: Product[] = [
  { id:1, name:'Freidora de Aire 5.5L Digital',     brand:'SmartCook',  category:'Hogar',        price:159900, wholesalePrice:89900,  minOrder:6,  rating:4.8, reviews:128, image:'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&auto=format&fit=crop', badge:'OFERTA',  discount:15, location:'Buenos Aires' },
  { id:2, name:'Smartphone 128GB Pantalla 6.7"',    brand:'TechPro',    category:'Tecnología',   price:399900, wholesalePrice:159900, minOrder:5,  rating:4.7, reviews:95,  image:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop', badge:'NUEVO',   discount:10, location:'Córdoba'      },
  { id:3, name:'Perfume Importado 100ml Premium',   brand:'Premium',    category:'Belleza',      price:85900,  wholesalePrice:24500,  minOrder:12, rating:4.9, reviews:76,  image:'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&auto=format&fit=crop', badge:'HOT',                  location:'Rosario'     },
  { id:4, name:'Set de Herramientas 108 Pzs Prof.', brand:'UltraTools', category:'Ferretería',   price:95000,  wholesalePrice:45900,  minOrder:4,  rating:4.6, reviews:112, image:'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&auto=format&fit=crop', badge:'OFERTA',  discount:20, location:'Santa Fe'     },
  { id:5, name:'Zapatillas Deportivas Running',     brand:'Sport Max',  category:'Deportes',     price:89900,  wholesalePrice:38900,  minOrder:10, rating:4.5, reviews:64,  image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop', badge:'TOP',                  location:'Mendoza'     },
  { id:6, name:'Set de Ollas Acero Inox Premium x6',brand:'HomeChef',   category:'Hogar',        price:62000,  wholesalePrice:32000,  minOrder:6,  rating:4.7, reviews:203, image:'https://images.unsplash.com/photo-1584990347449-a8f74fdb76ec?w=400&auto=format&fit=crop', badge:'OFERTA',  discount:18, location:'Buenos Aires' },
  { id:7, name:'Kit Maquillaje Profesional 48pcs',  brand:'GlamPro',    category:'Belleza',      price:48000,  wholesalePrice:22000,  minOrder:12, rating:4.8, reviews:189, image:'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&auto=format&fit=crop', badge:'NUEVO',                location:'Buenos Aires'},
  { id:8, name:'Auriculares TWS Bluetooth 5.3',     brand:'SoundMax',   category:'Tecnología',   price:35000,  wholesalePrice:18750,  minOrder:10, rating:4.6, reviews:456, image:'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&auto=format&fit=crop', badge:'HOT',     discount:25, location:'Buenos Aires' },
];

export const featuredOffer: Product = {
  id:99, name:'Auriculares Inalámbricos Bluetooth Premium', brand:'SoundMax', category:'Tecnología',
  price:26000, wholesalePrice:18750, minOrder:10, rating:4.8, reviews:328,
  image:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop',
  badge:'OFERTA', discount:25, location:'Buenos Aires',
};

export const suppliers: Supplier[] = [
  { id:1, name:'Megalmport S.A.',    category:'Electrónica · CABA',       rating:4.9, products:1240, verified:true,  initials:'MI', color:'#1a4a8c' },
  { id:2, name:'Beauty & Care',      category:'Belleza · Buenos Aires',   rating:4.8, products:890,  verified:true,  initials:'B&C',color:'#7c3d8c' },
  { id:3, name:'Hogar y Diseño',     category:'Hogar · Córdoba',          rating:4.7, products:670,  verified:true,  initials:'HD', color:'#1a6a3c' },
  { id:4, name:'AutoPartes Global',  category:'Automotor · Rosario',      rating:4.6, products:980,  verified:false, initials:'APG',color:'#8c3a1a' },
];

export const testimonials = [
  { id:1, name:'María González',    company:'Bazar El Bueno',         role:'Dueña',              text:'Desde que uso Mayorista Universal mis ventas crecieron un 40%. Los proveedores son de primera y los precios son realmente mayoristas.', rating:5, avatar:'👩‍💼', savings:'40%' },
  { id:2, name:'Carlos Rodríguez',  company:'TecnoShop Mendoza',      role:'Gerente de Compras', text:'La plataforma más completa para comprar al por mayor en Argentina. Encontré todo lo que necesito en un solo lugar.', rating:5, avatar:'👨‍💼', savings:'35%' },
  { id:3, name:'Laura Pérez',       company:'Distribuidora La Mejor', role:'Directora Comercial',text:'Increíble variedad de proveedores verificados. El soporte es excelente y los envíos siempre llegan a tiempo.', rating:5, avatar:'👩‍🏫', savings:'45%' },
  { id:4, name:'Roberto Fernández', company:'Ferreterías Unidos',     role:'Comprador',          text:'Los mejores precios del mercado mayorista. Ahorro hasta un 32% comparado con otros proveedores.', rating:4, avatar:'👨‍🔧', savings:'32%' },
];

export const stats = [
  { value:25000,  label:'Productos',    suffix:'+', icon:'📦' },
  { value:8000,   label:'Proveedores',  suffix:'+', icon:'🏭' },
  { value:100000, label:'Compradores',  suffix:'+', icon:'👥' },
  { value:24,     label:'Provincias',   suffix:'',  icon:'🗺️' },
];

export const benefits = [
  { icon:'🚚', title:'Envíos a todo el país',      desc:'Rápidos y seguros' },
  { icon:'💰', title:'Precios mayoristas',          desc:'Los mejores del mercado' },
  { icon:'📦', title:'Miles de productos',          desc:'Todas las categorías' },
  { icon:'🛡️', title:'Pagos seguros',              desc:'Protegemos tu compra' },
  { icon:'📞', title:'Atención personalizada',      desc:'Estamos para ayudarte' },
  { icon:'✅', title:'Garantía de confianza',       desc:'Comprá con tranquilidad' },
];

export const promoMessages = [
  '🔥 OFERTA DEL DÍA: 30% de descuento en Tecnología',
  '🚚 Envío gratis en pedidos +$50.000',
  '⚡ Nuevos proveedores verificados cada semana',
  '💎 Precios exclusivos para compradores registrados',
  '📦 Más de 25.000 productos disponibles',
  '🏆 El marketplace mayorista #1 de Argentina',
  '✅ +8.000 proveedores verificados',
  '💰 Ahorrá hasta un 50% vs precio minorista',
];
