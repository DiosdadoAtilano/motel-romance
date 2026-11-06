import { useCallback, useEffect, useMemo, useState } from 'react'
import { MapPin, Clock3, BedDouble, Check, Navigation, LocateFixed, Loader2, Store } from 'lucide-react'
import { BRANCHES, ROOMS } from '../data/mock'
import { DemoBadge } from './ui'
import { useStore } from '../lib/store'
import { haversineKm } from '../lib/utils'

let cachedPos = null /* evita volver a pedir permiso al cambiar de vista */

const fmtKm = (km) => (km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`)

export default function BranchPicker({ onPick, ask = true }) {
  const { branch } = useStore()
  const [pos, setPos] = useState(cachedPos)
  const [status, setStatus] = useState(cachedPos ? 'ok' : 'idle') // idle | asking | ok | denied | unsupported

  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) { setStatus('unsupported'); return }
    setStatus('asking')
    navigator.geolocation.getCurrentPosition(
      (p) => { cachedPos = { lat: p.coords.latitude, lng: p.coords.longitude }; setPos(cachedPos); setStatus('ok') },
      () => setStatus('denied'),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    )
  }, [])

  useEffect(() => { if (ask && !cachedPos) locate() }, [ask, locate])

  const list = useMemo(() => {
    const l = BRANCHES.map((b) => ({ ...b, km: pos ? haversineKm(pos.lat, pos.lng, b.lat, b.lng) : null }))
    return pos ? l.sort((a, b) => a.km - b.km) : l
  }, [pos])

  return (
    <div>
      <div role="status" aria-live="polite" className="mx-auto mb-8 flex max-w-xl flex-wrap items-center justify-center gap-3 rounded-2xl border border-gold/40 bg-ivory px-4 py-3 text-center text-sm text-ink-soft">
        {status === 'asking' && <><Loader2 size={18} className="animate-spin text-wine" />Buscando tu ubicación… acepta el permiso del navegador.</>}
        {status === 'ok' && <><LocateFixed size={18} className="text-wine" />Ordenadas de la más cercana a la más lejana según tu ubicación.</>}
        {status === 'idle' && <><LocateFixed size={18} className="text-wine" />Activa tu ubicación para ver cuál te queda más cerca.<button onClick={locate} className="min-h-[44px] font-semibold text-wine underline-offset-4 hover:underline">Usar mi ubicación</button></>}
        {status === 'denied' && <>No pudimos obtener tu ubicación; elige tu sucursal manualmente.<button onClick={locate} className="min-h-[44px] font-semibold text-wine underline-offset-4 hover:underline">Reintentar</button></>}
        {status === 'unsupported' && <>Tu navegador no permite ubicación; elige tu sucursal manualmente.</>}
      </div>

      <ul className="grid gap-6 md:grid-cols-3">
        {list.map((b, i) => {
          const n = ROOMS.filter((r) => r.branches.includes(b.id)).length
          const on = branch === b.id
          const nearest = status === 'ok' && i === 0
          return (
            <li key={b.id} data-reveal="" style={{ '--d': i * 120 + 'ms' }} className="flex"><div className={`card group flex w-full flex-col overflow-hidden ring-2 transition ${nearest ? 'ring-gold' : on ? 'ring-wine' : 'ring-transparent'}`}>
              <div className="relative aspect-[16/9] overflow-hidden">
                <span className="img-veil" style={{ transitionDelay: i * 120 + 'ms' }} />
                <img src={b.img} alt={`${b.name} (imagen de ejemplo)`} loading="lazy" className="zoom-in h-full w-full object-cover group-hover:scale-[1.06]" />
                <div className="absolute inset-0 bg-gradient-to-t from-wine-950/70 to-transparent" />
                {nearest && <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-wine-950 shadow-lg"><span className="h-2 w-2 animate-pulseDot rounded-full bg-wine" />Más cercana a ti</span>}
                <DemoBadge className="absolute right-3 top-3 bg-ivory/90" />
                {b.km != null && <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-ivory/90 px-3 py-1 text-xs font-semibold text-wine"><Navigation size={13} />a {fmtKm(b.km)}</span>}
              </div>
              <div className="flex flex-1 flex-col space-y-2 p-5">
                <h3 className="flex items-center gap-2 text-2xl font-semibold leading-tight text-wine">{b.name}{on && <Check size={18} className="shrink-0" aria-label="Elegida" />}</h3>
                <p className="flex gap-2 text-sm text-ink-soft"><MapPin size={16} className="mt-0.5 shrink-0 text-gold" />{b.address}</p>
                <p className="flex items-center gap-2 text-sm text-ink-soft"><Clock3 size={16} className="shrink-0 text-gold" />{b.hours}</p>
                <p className="flex items-center gap-2 text-sm text-ink-soft"><BedDouble size={16} className="shrink-0 text-gold" />{n} tipos de habitación</p>
                <div className="mt-auto grid gap-2 pt-4">
                  <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-wine w-full"><Navigation size={18} />Cómo llegar</a>
                  <button onClick={() => onPick(b.id)} className="btn btn-line w-full"><Store size={18} />Ver habitaciones aquí</button>
                </div>
              </div>
            </div></li>
          )
        })}
      </ul>
    </div>
  )
}