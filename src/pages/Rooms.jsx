import { useMemo, useState } from 'react'
import { SlidersHorizontal, X, MapPin } from 'lucide-react'
import BranchPicker from '../components/BranchPicker'
import { useStore } from '../lib/store'
import { Reveal, SectionTitle } from '../components/ui'
import RoomCard from '../components/RoomCard'
import { ROOMS, THEMES, AMENITIES } from '../data/mock'

export default function Rooms() {
  const { branch, branchObj: b, setBranch } = useStore()
  const [theme, setTheme] = useState('Todas')
  const [am, setAm] = useState([])
  const [showF, setShowF] = useState(false)
  const toggle = (a) => setAm((x) => (x.includes(a) ? x.filter((i) => i !== a) : [...x, a]))
  const list = useMemo(() => ROOMS.filter((r) => r.branches.includes(branch) && (theme === 'Todas' || r.theme === theme) && am.every((a) => r.amenities.includes(a))), [theme, am, branch])
  if (!branch) return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20">
      <SectionTitle eyebrow="Paso 1" title="¿En qué sucursal te esperamos?" sub="Elige una sucursal para ver sus habitaciones disponibles en el catálogo." />
      <div className="mt-12"><BranchPicker onPick={setBranch} /></div>
    </div>
  )
  const active = (theme !== 'Todas' ? 1 : 0) + am.length

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20">
      <SectionTitle eyebrow="Catálogo" title="Nuestras habitaciones" sub="Filtra por temática y amenidades. Imágenes y precios de demostración." />

      <Reveal className="mt-10">
        <button className="btn btn-line mb-4 w-full sm:hidden" onClick={() => setShowF(!showF)} aria-expanded={showF}><SlidersHorizontal size={18} />Filtros{active ? ` (${active})` : ''}</button>
        <div className={`${showF ? 'block' : 'hidden'} space-y-5 rounded-2xl bg-ivory p-5 shadow-card sm:block`}>
          <fieldset>
            <legend className="eyebrow mb-3">Temática</legend>
            <div className="flex flex-wrap gap-2">
              {['Todas', ...THEMES].map((t) => <button key={t} className="chip" aria-pressed={theme === t} onClick={() => setTheme(t)}>{t}</button>)}
            </div>
          </fieldset>
          <fieldset>
            <legend className="eyebrow mb-3">Amenidades</legend>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((a) => <button key={a} className="chip" aria-pressed={am.includes(a)} onClick={() => toggle(a)}>{a}</button>)}
            </div>
          </fieldset>
          {active > 0 && <button className="inline-flex items-center gap-1 text-sm font-semibold text-wine underline-offset-4 hover:underline" onClick={() => { setTheme('Todas'); setAm([]) }}><X size={14} />Limpiar filtros</button>}
        </div>
      </Reveal>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/40 bg-ivory px-4 py-3 text-sm"><span className="flex items-center gap-2 text-wine"><MapPin size={16} /><strong>{b.name}</strong><span className="text-ink-soft">· {b.address}</span></span><button onClick={() => setBranch(null)} className="min-h-[44px] font-semibold text-wine underline-offset-4 hover:underline">Cambiar sucursal</button></div><p className="mt-4 text-sm text-ink-soft" aria-live="polite">{list.length} {list.length === 1 ? 'habitación' : 'habitaciones'}</p>
      {list.length ? (
        <div className="mt-4 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">{list.map((r, i) => <RoomCard key={r.slug} room={r} delay={(i % 3) * 100} />)}</div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-gold bg-ivory p-10 text-center text-ink-soft">Ninguna habitación reúne todos esos filtros. Prueba quitando alguno.</div>
      )}
    </div>
  )
}
