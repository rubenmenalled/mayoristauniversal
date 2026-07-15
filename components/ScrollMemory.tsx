'use client'

import { useEffect, useRef } from 'react'

const KEY = 'mu_home_scroll_y'
const RESTORE_WINDOW_MS = 1200

// Recuerda el scroll de la home entre navegaciones (ej. Inicio → categoría → Inicio),
// así el usuario no tiene que volver a bajar para elegir otro catálogo.
// Reafirma la posición durante RESTORE_WINDOW_MS porque Next.js (o el propio
// navegador en un back/forward) puede resetear el scroll a 0 después del mount,
// en un momento que no controlamos — así ganamos esa carrera sin importar cuándo pase.
// Si el usuario scrollea de verdad durante esa ventana, se cancela el forzado.
export default function ScrollMemory() {
  const restored = useRef(false)

  useEffect(() => {
    const saved = sessionStorage.getItem(KEY)
    let cancelled = false
    const targetY = saved ? parseInt(saved, 10) : null

    if (targetY != null && !restored.current) {
      restored.current = true
      const start = performance.now()
      const enforce = (now: number) => {
        if (cancelled) return
        if (Math.abs(window.scrollY - targetY) > 2) {
          // behavior: 'instant' es clave — con scroll-behavior:smooth en globals.css,
          // un scrollTo(x,y) normal anima de a poco, y esos frames intermedios
          // (ej. y=150 mientras el target es 1000) el chequeo de "el usuario tomó
          // el control" de abajo los interpretaba como scroll manual y cancelaba
          // el reforzado antes de que termine de saltar.
          window.scrollTo({ top: targetY, left: 0, behavior: 'instant' })
        }
        if (now - start < RESTORE_WINDOW_MS) {
          requestAnimationFrame(enforce)
        }
      }
      requestAnimationFrame(enforce)
    }

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          const y = window.scrollY
          sessionStorage.setItem(KEY, String(y))
          // Un scroll bien lejos de lo que estamos forzando = el usuario tomó el control.
          if (targetY != null && Math.abs(y - targetY) > 80) cancelled = true
          ticking = false
        })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return null
}
