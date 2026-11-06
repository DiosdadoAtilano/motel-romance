import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Check, Loader2, Inbox, XCircle, CircleCheck } from 'lucide-react'
import { Reveal, DemoBadge } from '../components/ui'
import { useStore } from '../lib/store'
import { roomBySlug, DURATIONS, branchById } from '../data/mock'

const order = { recibida: 0, revision: 1, confirmada: 2, no_disponible: 2 }

export default function Track() {
  const { state } = useLocation()
  const { findRequest } = useStore()
  const [q, setQ] = useState(state?.folio || '')
  const [res, setRes] = useState(() => (state?.folio ? 'init' : null))
  const [searched, setSearched] = useState(state?.folio || '')
  const found = searched ? findRequest(searched) : null

  const go = (e) => { e.preventDefault(); setSearched(q); setRes(q.trim() ? 'done' : null) }
  const step = found ? order[found.status] : -1
  const bad = found?.status === 'no_disponible'

  const steps = [
    { t: 'Recibida', d: 'Tu solicitud llegó a recepción.', I: Inbox },
    { t: 'En revisión', d: 'Recepción está revisando tu solicitud.', I: Loader2 },
    bad ? { t: 'No disponible', d: 'No fue posible atender esa fecha u hora. Puedes enviar otra solicitud.', I: XCircle }
        : { t: 'Confirmada', d: 'Recepción confirmó tu solicitud. Te esperamos.', I: CircleCheck },
  ]

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
      <Reveal className="text-center">
        <p className="eyebrow">Rastreo de solicitud</p>
        <h1 className="mt-2 text-4xl font-semibold text-wine sm:text-5xl">¿Cómo va tu solicitud?</h1>
        <p className="mt-3 text-ink-soft">Ingresa el folio que recibiste al enviarla.</p>
      </Reveal>

      <Reveal delay={100}>
        <form onSubmit={go} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="folio" className="sr-only">Folio</label>
          <input id="folio" value={q} onChange={(e) => setQ(e.target.value)} className="field flex-1 text-center font-display text-2xl uppercase tracking-widest sm:text-left" placeholder="MR-0000" autoComplete="off" />
          <button className="btn btn-wine"><Search size={18} />Consultar</button>
        </form>
        <p className="mt-3 text-center text-sm text-ink-soft">Prueba con <DemoBadge className="mx-1" />
          {['MR-4821', 'MR-4822', 'MR-4823', 'MR-4824'].map((f) => <button key={f} type="button" onClick={() => { setQ(f); setSearched(f); setRes('done') }} className="mx-1 font-semibold text-wine underline-offset-4 hover:underline">{f}</button>)}
        </p>
      </Reveal>

      {res && !found && <div role="alert" className="card mt-8 p-6 text-center text-ink-soft">No encontramos el folio <strong className="text-wine">{searched}</strong>. Revisa que esté completo (ej. MR-4821).</div>}

      {found && (
        <div className="card mt-8 overflow-hidden" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-wine px-6 py-4 text-ivory">
            <p className="font-display text-3xl font-medium">{found.folio}</p>
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${bad ? 'bg-rose-brand' : step === 2 ? 'bg-emerald-600' : 'bg-gold text-wine-950'}`}>{step === 0 ? 'Solicitud recibida' : step === 1 ? 'En revisión' : bad ? 'No disponible' : 'Confirmada'}</span>
          </div>
          <div className="p-6">
            {step === 0 && <p className="mb-6 rounded-xl bg-cream-2 p-4 text-sm font-medium text-wine-900">Solicitud recibida; sujeta a confirmación por recepción.</p>}
            <ol className="relative">
              {steps.map((s, i) => {
                const reached = i <= step
                const current = i === step
                const last = i === 2
                const tone = reached ? (last && bad ? 'bg-rose-brand border-rose-brand text-ivory' : 'bg-wine border-wine text-ivory') : 'border-cream-3 bg-cream text-ink-soft/50'
                return (
                  <li key={s.t} className="relative flex gap-4 pb-8 last:pb-0">
                    {!last && <span className={`absolute left-[21px] top-11 h-[calc(100%-2.75rem)] w-0.5 ${i < step ? 'bg-wine' : 'bg-cream-3'}`} />}
                    <span className={`relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 ${tone}`}>
                      {reached && !current ? <Check size={20} /> : <s.I size={20} className={current && i === 1 ? 'animate-spin [animation-duration:3s]' : ''} />}
                    </span>
                    <div className={reached ? '' : 'opacity-50'}><p className="font-display text-2xl font-semibold text-wine">{s.t}</p><p className="text-sm text-ink-soft">{reached ? s.d : 'Pendiente'}</p></div>
                  </li>
                )
              })}
            </ol>
            <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-gold/40 pt-5 text-sm">
              <div><dt className="text-ink-soft">Habitación</dt><dd className="font-semibold">{roomBySlug(found.room).name}</dd></div>
              <div><dt className="text-ink-soft">Fecha y hora</dt><dd className="font-semibold">{found.date} · {found.eta}</dd></div>
              <div><dt className="text-ink-soft">Duración</dt><dd className="font-semibold">{DURATIONS.find((d) => d.key === found.duration).label}</dd></div>
              <div className="col-span-2"><dt className="text-ink-soft">Sucursal</dt><dd className="font-semibold">{branchById(found.branch).name}</dd></div><div><dt className="text-ink-soft">Alias</dt><dd className="font-semibold">{found.alias}</dd></div>
            </dl>
            {bad && <Link to="/reservar" className="btn btn-wine mt-6 w-full">Enviar otra solicitud</Link>}
          </div>
        </div>
      )}
    </div>
  )
}
