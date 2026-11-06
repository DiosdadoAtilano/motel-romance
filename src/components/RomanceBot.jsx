import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, X, Send, Heart, Headset } from 'lucide-react'
import { DemoBadge } from './ui'
import { useStore } from '../lib/store'
import { ROOMS, BRANCHES, money } from '../data/mock'

/* WhatsApp de recepción: pendiente de recibir el número real.
   Con el número vacío, wa.me abre el selector de contacto de WhatsApp. */
const WA_NUMBER = '' // [NÚMERO REAL DE RECEPCIÓN, formato 52XXXXXXXXXX]
const waUrl = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`

const NO_AVAIL = 'No puedo verificar la disponibilidad en tiempo real. Por favor, envía una solicitud de reservación desde nuestro catálogo y recepción te confirmará en breve.'

const QUICK = ['Ver tarifas', '¿Cómo funciona la reserva?', '¿Hay disponibilidad?', 'Hablar con recepción']

const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const has = (t, words) => words.some((w) => t.includes(w))

export default function RomanceBot() {
  const { branch, branchObj } = useStore()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const [msgs, setMsgs] = useState([{ id: 0, from: 'bot', text: 'Hola, soy RomanceBot. Puedo orientarte sobre tarifas, cómo solicitar tu reservación y nuestras sucursales. ¿En qué te ayudo?' }])
  const end = useRef(null)
  const inputRef = useRef(null)
  const timer = useRef(null)

  const handoff = useMemo(() => waUrl('Hola, quisiera hablar con recepción de Motel Romance (desde RomanceBot en el sitio web).'), [])

  const reply = (raw) => {
    const t = norm(raw)
    const catalog = { label: 'Ir al catálogo', to: '/habitaciones' }
    const request = { label: 'Solicitar reservación', to: '/reservar' }
    if (has(t, ['disponib', 'hay cuarto', 'hay habitacion', 'hay lugar', 'esta libre', 'estan libres', 'libre hoy', 'ocupad', 'tiempo real', 'queda alguna'])) return { text: NO_AVAIL, actions: [catalog, request] }
    if (has(t, ['confirm', 'apartar', 'aparta', 'ya quedo', 'asegura'])) return { text: 'No puedo confirmar reservaciones. Tu solicitud queda como “Solicitud recibida; sujeta a confirmación por recepción”, y es el personal de recepción quien la confirma.', actions: [request, { label: 'Rastrear mi solicitud', to: '/rastreo' }] }
    if (has(t, ['recepcion', 'humano', 'persona', 'asesor', 'whatsapp', 'hablar', 'llamar', 'agente'])) return { text: 'Con gusto. Te dirijo con recepción por WhatsApp para que una persona te atienda.', actions: [{ label: 'Hablar con recepción', href: handoff }] }
    if (has(t, ['tarifa', 'precio', 'cuesta', 'costo', 'cuanto', 'cobran', 'hora extra'])) {
      const rooms = ROOMS.filter((r) => !branch || r.branches.includes(branch))
      const lines = rooms.map((r) => `• ${r.name.replace('Habitación ', '')}: 3 h ${money(r.prices.h3).replace(' MXN', '')} · 6 h ${money(r.prices.h6).replace(' MXN', '')} · 12 h ${money(r.prices.h12).replace(' MXN', '')}`).join('\n')
      return { text: `Tarifas de demostración${branchObj ? ' · ' + branchObj.name : ''}:\n${lines}\n\nEl total es una estimación; recepción confirma la tarifa final. Pago en efectivo en sucursal.`, actions: [catalog] }
    }
    if (has(t, ['reserva', 'reservar', 'solicitud', 'solicitar', 'como funciona', 'pasos', 'apartado'])) return { text: 'Funciona por solicitud, sin anticipos en línea:\n1. Elige sucursal y habitación.\n2. Envía tu solicitud con alias, teléfono, fecha, hora estimada de llegada y duración.\n3. Recibirás un folio para seguirla.\n4. Recepción la revisa y te confirma. El pago es en efectivo al llegar.', actions: [request, { label: 'Rastrear solicitud', to: '/rastreo' }] }
    if (has(t, ['folio', 'rastre', 'estado de mi', 'seguimiento'])) return { text: 'Puedes consultar el estado de tu solicitud con tu folio (por ejemplo MR-4821).', actions: [{ label: 'Rastrear solicitud', to: '/rastreo' }] }
    if (has(t, ['menu', 'bebida', 'botana', 'comida', 'room service', 'extras', 'sex shop', 'sexshop', 'productos'])) return { text: 'Nuestro menú es informativo. Todos los productos y servicios se solicitan directamente desde tu habitación marcando a Recepción.', actions: [{ label: 'Ver menú', to: '/extras' }] }
    if (has(t, ['pago', 'pagar', 'efectivo', 'tarjeta', 'anticipo', 'deposito'])) return { text: 'El pago se realiza únicamente en efectivo en la sucursal. No cobramos anticipos ni pedimos datos de tarjeta en línea.' }
    if (has(t, ['sucursal', 'ubicacion', 'donde', 'direccion', 'llegar', 'mapa', 'cerca'])) return { text: 'Tenemos 3 sucursales:\n' + BRANCHES.map((b) => `• ${b.name}`).join('\n') + '\n\nEn la selección de sucursal puedes ver cuál te queda más cerca y abrir la ruta.', actions: [{ label: 'Elegir sucursal', to: '/habitaciones' }] }
    if (has(t, ['privacidad', 'discrec', 'datos', 'alias', 'anonim'])) return { text: 'Tu discreción es primero: solo pedimos un alias y un teléfono, y no mostramos disponibilidad exacta. Este sitio es solo para mayores de 18 años.' }
    if (has(t, ['hola', 'buenas', 'buen dia', 'buenas tardes', 'buenas noches', 'hey'])) return { text: '¡Hola! ¿Quieres ver tarifas, saber cómo solicitar tu reservación o hablar con recepción?' }
    if (has(t, ['gracias', 'adios', 'hasta luego'])) return { text: 'Gracias a ti. Aquí estaré si necesitas algo más.' }
    return { text: 'No estoy seguro de entender. Puedo ayudarte con tarifas, el proceso de solicitud, sucursales o pasarte con recepción.', actions: [{ label: 'Hablar con recepción', href: handoff }] }
  }

  const send = (raw) => {
    const v = raw.trim()
    if (!v || typing) return
    setMsgs((m) => [...m, { id: Date.now(), from: 'user', text: v }])
    setText('')
    setTyping(true)
    const r = reply(v)
    timer.current = setTimeout(() => { setMsgs((m) => [...m, { id: Date.now() + 1, from: 'bot', ...r }]); setTyping(false) }, 650)
  }

  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => { end.current?.scrollIntoView({ block: 'end', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }) }, [msgs, typing, open])
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 250) }, [open])
  useEffect(() => { const k = (e) => e.key === 'Escape' && setOpen(false); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [])

  const Action = ({ a }) => {
    const cls = 'inline-flex min-h-[40px] items-center rounded-full border border-wine/40 bg-ivory px-4 text-sm font-semibold text-wine transition hover:bg-wine hover:text-ivory'
    return a.href
      ? <a href={a.href} target="_blank" rel="noopener noreferrer" className={cls}>{a.label}</a>
      : <Link to={a.to} onClick={() => setOpen(false)} className={cls}>{a.label}</Link>
  }

  return (
    <>
      {/* Botones flotantes */}
      <div className="fixed bottom-[5.5rem] right-4 z-[45] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
        <a href={handoff} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp de recepción" className="grid h-12 w-12 place-items-center rounded-full bg-[#1f9d55] text-white shadow-lg transition hover:scale-105 active:scale-95">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.200 8.200 0 0 1-4.200-1.200l-.3-.2-3 .8.8-2.900-.2-.3A8.200 8.200 0 1 1 12 20.200Zm4.500-6.100c-.2-.1-1.500-.7-1.700-.8s-.4-.1-.6.100-.6.800-.8 1-.3.200-.6.100a6.700 6.700 0 0 1-3.300-2.900c-.2-.4.200-.4.700-1.300.1-.2 0-.3 0-.5l-.8-1.900c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.300 3 3 0 0 0-.9 2.200 5.200 5.200 0 0 0 1.100 2.800 11.900 11.900 0 0 0 4.600 4c1.700.7 2.400.8 3.200.7a2.700 2.700 0 0 0 1.800-1.300 2.200 2.200 0 0 0 .2-1.300c-.1-.1-.3-.2-.5-.3Z" /></svg>
        </a>
        <button onClick={() => setOpen(!open)} aria-label={open ? 'Cerrar RomanceBot' : 'Abrir RomanceBot'} aria-expanded={open} aria-controls="romancebot"
          className="relative grid h-14 w-14 place-items-center rounded-full bg-wine text-ivory shadow-xl ring-2 ring-gold/70 transition hover:bg-wine-900 active:scale-95">
          {open ? <X /> : <MessageCircle />}
          {!open && <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 animate-pulseDot rounded-full bg-gold ring-2 ring-cream" />}
        </button>
      </div>

      {/* Ventana de chat */}
      <section id="romancebot" role="dialog" aria-label="RomanceBot" aria-hidden={!open} inert={!open ? '' : undefined}
        className={`fixed inset-x-3 bottom-[10.5rem] z-[46] flex h-[min(520px,calc(100svh-13rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-gold/50 bg-cream shadow-2xl transition duration-300 sm:inset-x-auto sm:bottom-24 sm:right-6 sm:h-[min(560px,calc(100svh-8rem))] sm:w-[380px] ${open ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-4 scale-95 opacity-0'}`}>
        <header className="flex items-center gap-3 border-b-2 border-gold bg-wine px-4 py-3 text-ivory">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-gold bg-wine-900 text-gold"><Heart size={18} fill="currentColor" /></span>
          <div className="min-w-0 flex-1"><p className="font-display text-2xl font-semibold leading-none">RomanceBot</p><p className="mt-1 text-xs text-ivory/75">Asistente virtual · no confirma reservaciones</p></div>
          <DemoBadge className="bg-ivory/90" />
          <button onClick={() => setOpen(false)} aria-label="Cerrar chat" className="grid h-10 w-10 place-items-center rounded-full hover:bg-ivory/10"><X size={20} /></button>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
          {msgs.map((m) => (
            <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[88%] space-y-2 rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${m.from === 'user' ? 'rounded-br-md bg-wine text-ivory' : 'rounded-bl-md bg-ivory text-ink shadow-card'}`}>
                <p className="whitespace-pre-line">{m.text}</p>
                {m.actions && <div className="flex flex-wrap gap-2 pt-1">{m.actions.map((a) => <Action key={a.label} a={a} />)}</div>}
              </div>
            </div>
          ))}
          {typing && <div className="flex"><div className="flex gap-1 rounded-2xl rounded-bl-md bg-ivory px-4 py-3 shadow-card" aria-label="RomanceBot está escribiendo">{[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 animate-pulseDot rounded-full bg-gold" style={{ animationDelay: i * 180 + 'ms' }} />)}</div></div>}
          <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Respuestas rápidas">
            {QUICK.map((q) => <button key={q} disabled={typing} onClick={() => (q === 'Hablar con recepción' ? send(q) : send(q))} className="min-h-[40px] rounded-full border border-gold bg-cream-2 px-4 text-sm font-semibold text-wine transition hover:bg-wine hover:text-ivory disabled:opacity-50">{q}</button>)}
          </div>
          <div ref={end} />
        </div>

        <a href={handoff} target="_blank" rel="noopener noreferrer" className="flex min-h-[48px] items-center justify-center gap-2 border-t border-gold/40 bg-cream-2 text-sm font-bold text-wine hover:bg-wine hover:text-ivory"><Headset size={18} />Hablar con recepción</a>

        <form onSubmit={(e) => { e.preventDefault(); send(text) }} className="flex items-center gap-2 border-t border-gold/40 bg-ivory p-3">
          <label htmlFor="bot-input" className="sr-only">Escribe tu mensaje</label>
          <input ref={inputRef} id="bot-input" value={text} onChange={(e) => setText(e.target.value)} maxLength={200} autoComplete="off" placeholder="Escribe tu mensaje…" className="field !min-h-[48px] flex-1 !text-base" />
          <button type="submit" disabled={!text.trim() || typing} aria-label="Enviar mensaje" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-wine text-ivory transition hover:bg-wine-900 disabled:opacity-40"><Send size={20} /></button>
        </form>
      </section>
    </>
  )
}