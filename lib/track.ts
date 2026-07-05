// Envía eventos a Google (dataLayer/GTM) para poder medir conversiones desde Google Ads/Analytics.
// GTM ya está instalado en layout.tsx; estos events se pueden usar como disparadores de conversión.
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  try {
    const w = window as unknown as { dataLayer?: unknown[] }
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({ event, ...params })
  } catch {}
}
