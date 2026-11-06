import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Minus, Plus, Info, CalendarHeart, Ruler } from 'lucide-react'
import { Reveal, DemoBadge, SectionTitle } from '../components/ui'
import BranchPicker from '../components/BranchPicker'
import { useStore } from '../lib/store'
import { ROOMS, DURATIONS, LOREM_LONG, LOREM, money, roomBySlug } from '../data/mock'

export default function RoomDetail() {
  const { slug } = useParams()
  const room = roomBySlug(slug)
  const { branch, branchObj, setBranch } = useStore()
  const [img, setImg] = useState(0)
  const [dur, setDur] = useState('h3')
  const [extra, setExtra] = useState(0)
  useEffect(() => { setImg(0); setDur('h3'); setExtra(0) }, [slug])
  if (room && !branch) return <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8"><SectionTitle eyebrow="Paso 1" title="Elige tu sucursal" sub="Para ver esta habitación, primero indica en qué sucursal te esperamos." /><div className="mt-12"><BranchPicker onPick={setBranch} /></div></div>
  if (room && !room.branches.includes(branch)) return <div className="mx-auto max-w-xl px-4 py-24 text-center"><p className="text-ink-soft">{room.name} no está disponible en {branchObj.name}.</p><Link to="/habitaciones" className="btn btn-wine mt-6">Ver catálogo de esta sucursal</Link><button onClick={() => setBranch(null)} className="btn btn-line ml-3 mt-6">Cambiar sucursal</button></div>
  if (!room) return <div className="mx-auto max-w-xl px-4 py-24 text-center"><p className="text-ink-soft">No encontramos esa habitación.</p><Link to="/habitaciones" className="btn btn-wine mt-6">Ver habitaciones</Link></div>

  const base = room.prices[dur]
  const total = base + extra * room.prices.extra
  const d = DURATIONS.find((x) => x.key === dur)
  const others = ROOMS.filter((r) => r.slug !== slug && r.branches.includes(branch)).slice(0, 3)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14">
      <Link to="/habitaciones" className="inline-flex items-center gap-2 text-sm font-medium text-wine hover:underline"><ArrowLeft size={16} />Todas las habitaciones</Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.35fr_1fr]">
        <div>
          {/* Galería */}
          <Reveal kind="wipe">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-cream-3 shadow-card">
              {room.gallery.map((g, i) => (
                <img key={g} src={g} alt={`${room.name}, foto ${i + 1} (ejemplo)`} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === img ? 'opacity-100' : 'opacity-0'}`} />
              ))}
              <DemoBadge className="absolute right-3 top-3 bg-ivory/90" />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {room.gallery.map((g, i) => (
                <button key={g} onClick={() => setImg(i)} aria-label={`Ver foto ${i + 1}`} aria-current={i === img} className={`aspect-[4/3] overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-cream transition ${i === img ? 'ring-wine' : 'ring-transparent opacity-70 hover:opacity-100'}`}>
                  <img src={g} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal className="mt-10">
            <p className="eyebrow">{room.theme}</p>
            <h1 className="mt-2 text-4xl font-semibold text-wine sm:text-5xl">{room.name}</h1>
            <p className="mt-2 flex items-center gap-2 text-ink-soft"><Ruler size={16} />{room.size} · <span>{room.tagline}</span></p>
            <p className="mt-6 leading-relaxed text-ink-soft">{LOREM_LONG}</p>
            <p className="mt-3 leading-relaxed text-ink-soft">{LOREM}</p>
          </Reveal>

          <Reveal className="mt-8">
            <h2 className="text-2xl font-semibold text-wine">Amenidades</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {room.amenities.map((a) => <li key={a} className="flex items-center gap-3 rounded-xl bg-ivory px-4 py-3 text-[15px]"><Check size={18} className="text-wine" />{a}</li>)}
            </ul>
          </Reveal>
        </div>

        {/* Calculadora */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Reveal kind="right" delay={200} className="overflow-hidden rounded-2xl bg-ivory shadow-card">
            <div className="flex items-center justify-between bg-wine px-5 py-4 text-ivory">
              <h2 className="text-2xl font-medium">Calculadora de tarifa</h2><DemoBadge className="bg-ivory/90" />
            </div>
            <div className="space-y-6 p-5">
              <fieldset>
                <legend className="label">Duración de la estancia</legend>
                <div className="grid grid-cols-3 gap-2" role="radiogroup">
                  {DURATIONS.map((x) => (
                    <button key={x.key} role="radio" aria-checked={dur === x.key} onClick={() => setDur(x.key)}
                      className={`rounded-xl border px-2 py-3 text-center transition ${dur === x.key ? 'border-wine bg-wine text-ivory shadow-soft' : 'border-cream-3 hover:border-wine/50'}`}>
                      <span className="block text-lg font-bold">{x.short}</span>
                      <span className={`block text-xs ${dur === x.key ? 'text-ivory/80' : 'text-ink-soft'}`}>{money(room.prices[x.key]).replace(' MXN', '')}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <div>
                <p className="label">Hora extra <span className="font-normal text-ink-soft">({money(room.prices.extra)} c/u)</span></p>
                <div className="flex items-center justify-between rounded-xl border border-cream-3 p-1.5">
                  <button className="grid h-11 w-11 place-items-center rounded-lg text-wine hover:bg-cream-2 disabled:opacity-30" onClick={() => setExtra(Math.max(0, extra - 1))} disabled={!extra} aria-label="Quitar hora extra"><Minus size={18} /></button>
                  <span className="font-semibold" aria-live="polite">{extra} {extra === 1 ? 'hora' : 'horas'}</span>
                  <button className="grid h-11 w-11 place-items-center rounded-lg text-wine hover:bg-cream-2 disabled:opacity-30" onClick={() => setExtra(Math.min(6, extra + 1))} disabled={extra >= 6} aria-label="Agregar hora extra"><Plus size={18} /></button>
                </div>
              </div>

              <dl className="space-y-2 border-t border-gold/40 pt-4 text-[15px]">
                <div className="flex justify-between"><dt className="text-ink-soft">Estancia {d.short}</dt><dd>{money(base)}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-soft">Horas extra ×{extra}</dt><dd>{money(extra * room.prices.extra)}</dd></div>
                <div className="flex items-baseline justify-between rounded-xl bg-cream-2 px-4 py-3"><dt className="font-display text-2xl font-semibold text-wine">Total estimado</dt><dd className="font-display text-3xl font-semibold text-wine" aria-live="polite">{money(total)}</dd></div>
              </dl>

              <p className="flex gap-2 rounded-xl border border-gold/50 bg-gold/10 p-3 text-sm leading-snug text-ink"><Info size={18} className="mt-0.5 shrink-0 text-gold" />El total es una estimación; recepción confirma la tarifa final.</p>

              <Link to={`/reservar?room=${room.slug}&dur=${dur}`} className="btn btn-wine w-full"><CalendarHeart size={18} />Reservar esta habitación</Link>
              <p className="text-center text-xs text-ink-soft">Pago en efectivo en sucursal. Sin anticipos en línea.</p>
            </div>
          </Reveal>
        </aside>
      </div>

      <section className="mt-20">
        <h2 className="text-3xl font-semibold text-wine">Otras habitaciones</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {others.map((r, i) => (
            <Link key={r.slug} to={`/habitaciones/${r.slug}`} className="card group overflow-hidden">
              <div className="aspect-[16/9] overflow-hidden"><img src={r.img} alt="" loading="lazy" className="h-full w-full object-cover transition duration-1000 group-hover:scale-105" /></div>
              <p className="p-4 font-display text-xl font-semibold text-wine">{r.name}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

