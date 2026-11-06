import { useEffect } from 'react'

/* Revela al entrar en pantalla. Sin JS o con menos movimiento el contenido ya se ve.
   Un MutationObserver detecta elementos nuevos (filtros, cambios de ruta). */
export function useRevealObserver() {
  useEffect(() => {
    const sel = '[data-reveal], [data-line]'
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
          entries.forEach((en) => en.target.classList.toggle('is-in', en.isIntersecting))
        }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' })
      : null
    const seen = new WeakSet()
    const scan = () => document.querySelectorAll(sel).forEach((e) => {
      if (!io) return e.classList.add('is-in')
      if (!seen.has(e)) { seen.add(e); io.observe(e) }
    })
    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.getElementById('root'), { childList: true, subtree: true })
    return () => { io?.disconnect(); mo.disconnect() }
  }, [])
}

export function useScrollFx() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const bar = document.querySelector('.scroll-bar')
    let raf = 0
    const tick = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - innerHeight
      bar?.style.setProperty('--p', max > 0 ? scrollY / max : 0)
      document.querySelectorAll('[data-parallax]').forEach((el) => {
        const r = el.parentElement.getBoundingClientRect()
        if (r.bottom < -200 || r.top > innerHeight + 200) return
        const k = parseFloat(el.dataset.parallax)
        el.style.transform = `translate3d(0,${(r.top + r.height / 2 - innerHeight / 2) * -k}px,0) scale(1.15)`
      })
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick(); addEventListener('scroll', on, { passive: true }); addEventListener('resize', on)
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on) }
  }, [])
}

export const fmtTime = (ms) => {
  const neg = ms < 0
  const a = Math.abs(Math.floor(ms / 1000))
  const h = String(Math.floor(a / 3600)).padStart(2, '0')
  const m = String(Math.floor((a % 3600) / 60)).padStart(2, '0')
  const s = String(a % 60).padStart(2, '0')
  return (neg ? '+' : '') + `${h}:${m}:${s}`
}

/* Distancia en km entre dos puntos (fórmula de Haversine) */
export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const rad = (d) => (d * Math.PI) / 180
  const dLat = rad(lat2 - lat1)
  const dLng = rad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}