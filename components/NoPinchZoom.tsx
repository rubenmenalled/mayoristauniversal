'use client'

import { useEffect } from 'react'

// Refuerzo para iOS/Safari, que ignora user-scalable=no.
// Bloquea el gesto de pinch-zoom de dos dedos.
export default function NoPinchZoom() {
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault()

    // Eventos de gesto propios de Safari (pinch)
    document.addEventListener('gesturestart', prevent as EventListener, { passive: false })
    document.addEventListener('gesturechange', prevent as EventListener, { passive: false })
    document.addEventListener('gestureend', prevent as EventListener, { passive: false })

    // Multi-touch (pinch) por touchmove
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault()
    }
    document.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      document.removeEventListener('gesturestart', prevent as EventListener)
      document.removeEventListener('gesturechange', prevent as EventListener)
      document.removeEventListener('gestureend', prevent as EventListener)
      document.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return null
}
