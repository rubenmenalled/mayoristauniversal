'use client'

import { useEffect, useRef } from 'react'

const KEY = 'mu_home_scroll_y'

// Recuerda el scroll de la home entre navegaciones (ej. Inicio → categoría → Inicio),
// así el usuario no tiene que volver a bajar para elegir otro catálogo.
export default function ScrollMemory() {
  const restored = useRef(false)

  useEffect(() => {
    const saved = sessionStorage.getItem(KEY)
    let restoreTimer: ReturnType<typeof setTimeout> | undefined
    if (saved && !restored.current) {
      restored.current = true
      const targetY = parseInt(saved, 10)
      window.scrollTo(0, targetY)
      // El contenido ya viene renderizado por SSR, pero por si algo layoutea tarde
      // (imágenes, fuentes), reintentamos una vez más tras el primer paint.
      restoreTimer = setTimeout(() => window.scrollTo(0, targetY), 150)
    }

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          sessionStorage.setItem(KEY, String(window.scrollY))
          ticking = false
        })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (restoreTimer) clearTimeout(restoreTimer)
    }
  }, [])

  return null
}
