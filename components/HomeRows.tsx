'use client'

import { useEffect, useState } from 'react'
import ProductRow from './ProductRow'

interface Fila {
  id: number; titulo: string; emoji: string; subtitulo: string; categorias: string; orden: number; activo: boolean
}

// Filas por defecto (si todavía no se creó la tabla home_filas)
const DEFAULT: Fila[] = [
  { id: -1, titulo: 'Destacados', emoji: '⭐', subtitulo: 'Lo mejor de nuestro catálogo, al precio mayorista', categorias: 'DESTACADOS', orden: 1, activo: true },
  { id: -2, titulo: 'Para los más chicos', emoji: '🧸', subtitulo: 'Peluches, bebé y juguetería', categorias: 'PELUCHES,BEBE,JUGUETERIA', orden: 2, activo: true },
  { id: -3, titulo: 'Lencería', emoji: '👙', subtitulo: 'Lencería y temporada de invierno', categorias: 'LENCERIA,INVIERNO 2026', orden: 3, activo: true },
  { id: -4, titulo: 'Deportes, electrónica y herramientas', emoji: '⚽', subtitulo: 'Todo para equiparte', categorias: 'TODO PARA EL DEPORTE,ELECTRONICA,HERRAMIENTAS', orden: 4, activo: true },
]

function urlsDeFila(f: Fila): { urls: string[]; max: number } {
  const cats = (f.categorias || '').trim()
  if (cats.toUpperCase() === 'DESTACADOS') {
    return { urls: ['/api/productos-publicos?destacados=true'], max: 18 }
  }
  // Productos elegidos a mano: "IDS:642,643,801"
  if (cats.toUpperCase().startsWith('IDS:')) {
    const ids = cats.slice(4).split(',').map(s => s.trim()).filter(Boolean)
    return { urls: [`/api/productos-publicos?ids=${ids.join(',')}`], max: Math.max(ids.length, 1) }
  }
  const lista = cats.split(',').map(c => c.trim()).filter(Boolean)
  return {
    urls: lista.map(c => `/api/productos-publicos?categoria=${encodeURIComponent(c)}&limit=8`),
    max: Math.max(12, lista.length * 7),
  }
}

export default function HomeRows() {
  const [filas, setFilas] = useState<Fila[]>(DEFAULT)
  useEffect(() => {
    fetch('/api/home-filas', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length > 0) setFilas(d) })
      .catch(() => {})
  }, [])

  return (
    <>
      {filas.filter(f => f.activo).map(f => {
        const { urls, max } = urlsDeFila(f)
        return <ProductRow key={f.id} title={f.titulo} emoji={f.emoji} subtitle={f.subtitulo} urls={urls} max={max} />
      })}
    </>
  )
}
