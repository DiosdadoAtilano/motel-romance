import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Send, Lock, Banknote, EyeOff, Copy, Check, Clock3, SearchCheck } from 'lucide-react'
import { Reveal, DemoBadge } from '../components/ui'
import { useStore } from '../lib/store'
import { ROOMS, DURATIONS, BRANCHES, branchById } from '../data/mock'

const today = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)

export default function Reserve() {
  const [sp] = useSearchParams()
  const { addRequest, branch, setBranch } = useStore()
  const bid0 = branch || BRANCHES[0].id
  const avail0 = ROOMS.filter((r) => r.branches.includes(bid0))
  const [f, setF] = useState({
    alias: '', phone: '', date: '', eta: '',
    duration: DURATIONS.some((d) => d.key === sp.get('dur')) ? sp.get('dur') : 'h3',
    branch: bid0, room: avail0.some((r) => r.slug === sp.get('room')) ? sp.get('room') : avail0[0].slug, notes: '',
  })
  const [err, setErr] = useState({})
  const [done, setDone] = useState(null)
  const [copied, setCopied] = useState(false)
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setErr({ ...err, [k]: undefined }) }

  const changeBranch = (e) => { const bb = e.target.value; const a = ROOMS.filter((r) => r.branches.includes(bb)); setBranch(bb); setF({ ...f, branch: bb, room: a.some((r) => r.slug === f.room) ? f.room : a[0].slug }) }
  const submit = (e) => {
    e.preventDefault()
    const x = {}
    if (f.alias.trim().length < 2) x.alias = 'Escribe un alias (no pedimos tu nombre real).'
    if (f.phone.replace(/\D/g, '').length < 10) x.phone = 'Ingresa un teléfono de 10 dígitos.'
    if (!f.date) x.date = 'Elige una fecha.'
    else if (f.date < today()) x.date = 'La fecha ya pasó.'
    if (!f.eta) x.eta = 'Indica tu hora estimada de llegada.'
    setErr(x)
    if (Object.keys(x).length) { document.querySelector('[aria-invalid="true"]')?.focus(); return }
    setDone(addRequest(f))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const copy = async () => { try { await navigator.clipboard.writeText(done.folio) } catch {} setCopied(true); setTimeout(() => setCopied(false), 1800) }

  if (done) {
    const room = ROOMS.find((x) => x.slug === done.room)
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 sm:py-20">
        <div className="card overflow-hidden text-center">
          <div className="bg-wine px-6 py-8 text-ivory">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold text-gold"><Clock3 /></span>
            <h1 className="mt-4 text-4xl font-medium">Solicitud recibida</h1>
            <p className="mt-2 text-ivory/85">Solicitud recibida; sujeta a confirmación por recepción.</p>
          </div>
          <div className="space-y-6 p-6 sm:p-8">
            <div>
              <p className="eyebrow">Tu folio</p>
              <p className="mt-1 font-display text-5xl font-semibold tracking-wide text-wine">{done.folio}</p>
              <button onClick={copy} className="mt-2 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-wine hover:underline">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copiado' : 'Copiar folio'}</button>
            </div>
            <dl className="grid grid-cols-2 gap-3 rounded-xl bg-cream-2 p-4 text-left text-sm">
              {[['Sucursal', branchById(done.branch).name], ['Alias', done.alias], ['Habitación', room.name], ['Fecha', done.date], ['Llegada aprox.', done.eta], ['Duración', DURATIONS.find((d) => d.key === done.duration).label], ['Estado', 'Recibida']].map(([k, v]) => (
                <div key={k}><dt className="text-ink-soft">{k}</dt><dd className="font-semibold text-ink">{v}</dd></div>
              ))}
            </dl>
            <p className="text-sm leading-relaxed text-ink-soft">Esto <strong>no es una confirmación</strong>. Recepción revisará tu solicitud y puedes seguirla con tu folio. El pago se hace en efectivo en sucursal.</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/rastreo" state={{ folio: done.folio }} className="btn btn-wine"><SearchCheck size={18} />Rastrear mi solicitud</Link>
              <button className="btn btn-line" onClick={() => { setDone(null); setF({ ...f, alias: '', phone: '', notes: '' }) }}>Enviar otra solicitud</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const Err = ({ k }) => err[k] ? <p id={`e-${k}`} className="mt-1.5 text-sm font-medium text-rose-brand">{err[k]}</p> : null
  const props = (k) => ({ id: k, value: f[k], onChange: set(k), 'aria-invalid': !!err[k], 'aria-describedby': err[k] ? `e-${k}` : undefined })

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-8 sm:py-20 lg:grid-cols-[1.4fr_1fr]">
      <Reveal>
        <p className="eyebrow">Solicitud de reservación</p>
        <h1 className="mt-2 text-4xl font-semibold text-wine sm:text-5xl">Cuéntanos cuándo llegas</h1>
        <p className="mt-3 text-ink-soft">Cinco datos y listo. Recepción revisará tu solicitud y te confirmará.</p>

        <form onSubmit={submit} noValidate className="card mt-8 space-y-5 p-5 sm:p-8">
          <div className="flex justify-end"><DemoBadge /></div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div><label className="label" htmlFor="alias">Alias</label><input {...props('alias')} className="field" placeholder="Cómo quieres que te llamemos" autoComplete="off" /><Err k="alias" /></div>
            <div><label className="label" htmlFor="phone">Teléfono</label><input {...props('phone')} className="field" type="tel" inputMode="tel" placeholder="10 dígitos" autoComplete="tel" /><Err k="phone" /></div>
          </div>
          <div>
            <label className="label" htmlFor="branch">Sucursal</label><select id="branch" value={f.branch} onChange={changeBranch} className="field mb-5">{BRANCHES.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select><label className="label" htmlFor="room">Habitación</label>
            <select id="room" value={f.room} onChange={set('room')} className="field">{ROOMS.filter((r) => r.branches.includes(f.branch)).map((r) => <option key={r.slug} value={r.slug}>{r.name}</option>)}</select>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div><label className="label" htmlFor="date">Fecha</label><input {...props('date')} className="field" type="date" min={today()} /><Err k="date" /></div>
            <div><label className="label" htmlFor="eta">Hora estimada de llegada (ETA)</label><input {...props('eta')} className="field" type="time" /><Err k="eta" /></div>
          </div>
          <fieldset>
            <legend className="label">Duración</legend>
            <div className="grid grid-cols-3 gap-2">
              {DURATIONS.map((d) => <button type="button" key={d.key} aria-pressed={f.duration === d.key} onClick={() => setF({ ...f, duration: d.key })} className="chip justify-center !min-h-[48px] font-semibold">{d.short}</button>)}
            </div>
          </fieldset>
          <button type="submit" className="btn btn-wine w-full"><Send size={18} />Enviar solicitud</button>
        </form>
      </Reveal>

      <Reveal delay={120} className="space-y-4 lg:pt-28">
        {[[Lock, 'Sin anticipos en línea', 'No pedimos tarjeta ni pagos por adelantado.'], [Banknote, 'Pago en efectivo', 'Se realiza en sucursal al llegar.'], [EyeOff, 'Tu discreción primero', 'Solo un alias. No mostramos disponibilidad exacta.']].map(([I, t, d]) => (
          <div key={t} className="flex gap-4 rounded-2xl border border-gold/40 bg-ivory p-5"><I className="shrink-0 text-wine" strokeWidth={1.5} /><div><p className="font-semibold text-wine">{t}</p><p className="text-sm text-ink-soft">{d}</p></div></div>
        ))}
        <p className="rounded-2xl bg-wine p-5 text-sm leading-relaxed text-ivory/90">Tu solicitud siempre inicia como <strong>“Solicitud recibida; sujeta a confirmación por recepción”</strong>.</p>
      </Reveal>
    </div>
  )
}
