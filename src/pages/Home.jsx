import { Link, useNavigate } from 'react-router-dom'
import BranchPicker from '../components/BranchPicker'
import { useStore } from '../lib/store'
import { CalendarHeart, ArrowRight, ShieldCheck, Banknote, EyeOff, BedDouble, Send, SearchCheck, KeyRound } from 'lucide-react'
import { Reveal, SectionTitle, DemoBadge } from '../components/ui'
import RoomCard from '../components/RoomCard'
import { ROOMS } from '../data/mock'

const features = [
  { icon: ShieldCheck, label: 'Privacidad' },
  { icon: Banknote, label: 'Pago en efectivo en sucursal' },
  { icon: EyeOff, label: 'Discreción' },
]
const steps = [
  { icon: BedDouble, t: 'Elige tu espacio', d: 'Explora las habitaciones y calcula una estimación de tu estancia.' },
  { icon: Send, t: 'Envía tu solicitud', d: 'Solo un alias, un teléfono y tu hora estimada de llegada.' },
  { icon: SearchCheck, t: 'Sigue tu folio', d: 'Consulta el estado de tu solicitud cuando quieras.' },
  { icon: KeyRound, t: 'Llega y paga en sucursal', d: 'Recepción confirma. El pago es en efectivo al llegar.' },
]

export default function Home() {
  const { branch, setBranch } = useStore()
  const navigate = useNavigate()
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative isolate overflow-hidden bg-wine-950">
        <div className="absolute inset-0 -z-20 overflow-hidden"><img data-parallax="0.18" src="/img/hero.jpg" alt="" className="animate-kb h-full w-full object-cover object-[70%_center]" /></div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-wine-950 via-wine-950/80 to-wine-950/10 max-md:bg-gradient-to-t max-md:from-wine-950 max-md:via-wine-950/70 max-md:to-wine-950/20" />
        <div className="mx-auto flex min-h-[calc(100svh-76px-84px)] max-w-7xl flex-col justify-end px-4 pb-14 pt-24 sm:min-h-[600px] sm:justify-center sm:px-8 sm:py-24">
          <p className="eyebrow mb-5 flex items-center gap-3 animate-rise [animation-delay:.1s]">Reserva tu habitación <span className="h-px w-14 bg-gold" /></p>
          <h1 className="max-w-3xl text-[2.9rem] font-medium leading-[1.02] text-ivory sm:text-7xl">
            <span className="block overflow-hidden pb-[.12em]"><span className="block animate-rise [animation-delay:.25s]">Rinconcito de</span></span>
            <span className="block overflow-hidden pb-[.12em]"><span className="block animate-rise italic [animation-delay:.45s]">los Enamorados</span></span>
          </h1>
          <span className="animate-draw my-6 block h-0.5 w-24 origin-left bg-gold" />
          <p className="max-w-md text-lg leading-relaxed text-ivory/85 animate-rise [animation-delay:.8s]">Privacidad, confort y un ambiente especial para tus momentos más importantes.</p>
          <div className="mt-8 flex flex-wrap gap-3 animate-rise [animation-delay:1s]">
            <Link to="/reservar" className="btn btn-light"><CalendarHeart size={18} />Reservar ahora<ArrowRight size={18} /></Link>
            <Link to="/habitaciones" className="btn btn-ghost">Conocer habitaciones</Link>
          </div>
        </div>
      </section>

      {/* ===== BARRA DE CARACTERÍSTICAS ===== */}
      <section className="border-b border-gold/30 bg-cream-2" aria-label="Características">
        <ul className="mx-auto grid max-w-5xl grid-cols-1 divide-gold/40 px-4 sm:grid-cols-3 sm:divide-x sm:px-8">
          {features.map(({ icon: I, label }, i) => (
            <Reveal as="li" key={label} kind={i === 0 ? "left" : i === 2 ? "right" : ""} delay={i * 110} className="flex items-center justify-center gap-3 py-5 text-[17px] text-ink">
              <I className="text-wine" size={28} strokeWidth={1.5} />{label}
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ===== SUCURSALES ===== */}
      <section id="sucursales" className="mx-auto max-w-7xl px-4 pt-20 sm:px-8 sm:pt-28">
        <SectionTitle eyebrow="Tres sucursales" title="Elige tu sucursal" sub="Cada sucursal tiene su propio catálogo de habitaciones. Selecciona una para continuar." />
        <div className="mt-12"><BranchPicker ask={false} onPick={(id) => { setBranch(id); navigate('/habitaciones') }} /></div>
      </section>

      {/* ===== HABITACIONES DESTACADAS ===== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-8 sm:py-28">
        <SectionTitle eyebrow="Nuestras habitaciones" title="Encuentra tu espacio ideal" sub="Elige el ambiente perfecto para tu ocasión. Lorem ipsum dolor sit amet." />
        <div className="mt-14 grid gap-7 md:grid-cols-3">
          {(branch ? ROOMS.filter((r) => r.branches.includes(branch)) : ROOMS).slice(0, 3).map((r, i) => <RoomCard key={r.slug} room={r} delay={i * 120} />)}
        </div>
        <Reveal className="mt-12 text-center"><Link to="/habitaciones" className="btn btn-line">Ver todas las habitaciones<ArrowRight size={18} /></Link></Reveal>
      </section>

      {/* ===== CÓMO RESERVAR ===== */}
      <section className="bg-ivory py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <SectionTitle eyebrow="Así de fácil" title="Cuatro pasos, sin complicaciones" sub="Sin anticipos en línea. Tu solicitud queda sujeta a la confirmación de recepción." />
          <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
            <span data-line className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-gold/60 md:block" aria-hidden="true" />
            {steps.map(({ icon: I, t, d }, i) => (
              <Reveal as="li" key={t} kind="pop" delay={i * 160} className="relative flex gap-5 md:flex-col md:items-center md:text-center">
                <span className="relative z-10 grid h-16 w-16 shrink-0 place-items-center rounded-full border border-gold bg-cream text-wine"><I strokeWidth={1.5} /><span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-wine text-xs font-bold text-ivory">{i + 1}</span></span>
                <div><h3 className="text-2xl font-semibold text-wine">{t}</h3><p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{d}</p></div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== BANDA FINAL ===== */}
      <section className="relative isolate overflow-hidden bg-wine py-16">
        <div className="absolute inset-0 -z-10 overflow-hidden"><img data-parallax="0.12" src="/img/cisnes.jpg" alt="" className="h-full w-full object-cover opacity-20 mix-blend-luminosity" /></div>
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-8">
          <Reveal kind="left"><h2 className="text-4xl font-medium text-ivory">Haz tu reservación hoy</h2><p className="mt-2 text-ivory/80">Vive una experiencia inolvidable en Motel Romance.</p></Reveal>
          <Reveal kind="right" delay={150}><Link to="/reservar" className="btn btn-ghost float-soft"><CalendarHeart size={18} />Reservar ahora<ArrowRight size={18} /></Link></Reveal>
        </div>
      </section>
      <p className="sr-only"><DemoBadge /></p>
    </>
  )
}
