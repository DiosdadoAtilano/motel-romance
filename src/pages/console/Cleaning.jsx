import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Play, CircleCheck, Square, CheckSquare, Timer } from 'lucide-react'
import { useStore, useNow } from '../../lib/store'
import { StatusPill, typeName } from './shared'
import { CLEAN_TASKS } from '../../data/mock'
import { DemoBadge } from '../../components/ui'
import { fmtTime } from '../../lib/utils'

export default function Cleaning() {
  const { vRooms: rooms, patchRoom } = useStore()
  const [sp] = useSearchParams()
  const queue = rooms.filter((r) => r.status === 'limpieza')
  const [sel, setSel] = useState(sp.get('room') || '')
  const room = queue.find((r) => r.id === sel) || queue[0]
  const now = useNow(1000)
  const [done, setDone] = useState(null)

  useEffect(() => { if (!room) setSel('') }, [room])

  if (!room) return (
    <div className="mx-auto max-w-2xl space-y-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Limpieza</h1>
      {done && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 font-bold text-emerald-700">Cuarto {done} listo y disponible.</p>}
      <p className="cpanel p-10 text-slate-500">No hay limpiezas pendientes. Buen trabajo.</p>
    </div>
  )

  const cl = room.cleaning || { started: false, checks: {} }
  const doneCount = CLEAN_TASKS.filter((_, i) => cl.checks[i]).length
  const all = doneCount === CLEAN_TASKS.length
  const setCl = (p) => patchRoom(room.id, { cleaning: { ...cl, ...p } })
  const toggle = (i) => cl.started && setCl({ checks: { ...cl.checks, [i]: !cl.checks[i] } })
  const finish = () => { patchRoom(room.id, { status: 'disponible', cleaning: undefined }); setDone(room.id); setSel('') }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-semibold tracking-tight">Limpieza</h1><DemoBadge /></div>
      {done && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 font-bold text-emerald-700">Cuarto {done} listo y disponible.</p>}
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <section className="cpanel p-3">
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-slate-500">Cola ({queue.length})</h2>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {queue.map((r) => <button key={r.id} onClick={() => { setSel(r.id); setDone(null) }} aria-pressed={r.id === room.id} className={`flex min-h-[64px] items-center justify-between rounded-xl border px-4 text-left ${r.id === room.id ? 'border-rose-600 bg-rose-50 ring-1 ring-rose-600' : 'border-slate-300 bg-white'}`}><span><span className="block text-2xl font-semibold">{r.id}</span><span className="text-xs text-slate-500">{typeName(r.type)}</span></span>{r.cleaning?.started && <Timer size={18} className="text-blue-700" />}</button>)}
          </div>
        </section>

        <section className="cpanel">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300 p-4">
            <div className="flex items-center gap-3"><p className="text-5xl font-semibold">{room.id}</p><div><p className="font-bold">{typeName(room.type)}</p><StatusPill status="limpieza" /></div></div>
            {cl.started && <p className="flex items-center gap-2 font-mono text-3xl font-bold tabular-nums text-blue-700"><Timer />{fmtTime(now - cl.startedAt)}</p>}
          </div>

          <div className="px-4 pt-4">
            <div className="flex justify-between text-sm font-bold"><span>Checklist</span><span>{doneCount}/{CLEAN_TASKS.length}</span></div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-white"><div className="h-full bg-blue-400 transition-all duration-500" style={{ width: `${(doneCount / CLEAN_TASKS.length) * 100}%` }} /></div>
          </div>

          <ul className="grid gap-2 p-4 sm:grid-cols-2">
            {CLEAN_TASKS.map((t, i) => {
              const on = !!cl.checks[i]
              return (
                <li key={t}><button disabled={!cl.started} onClick={() => toggle(i)} aria-pressed={on} className={`flex min-h-[64px] w-full items-center gap-3 rounded-xl border px-4 text-left text-[15px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${on ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-300 bg-white'}`}>
                  {on ? <CheckSquare className="shrink-0 text-emerald-700" /> : <Square className="shrink-0 text-slate-500" />}<span className={on ? 'line-through decoration-emerald-400/60' : ''}>{t}</span></button></li>
              )
            })}
          </ul>
          {!cl.started && <p className="px-4 pb-2 text-sm text-slate-500">Toca “Iniciar limpieza” para habilitar el checklist.</p>}

          <div className="grid gap-3 border-t border-slate-300 p-4 sm:grid-cols-2">
            <button disabled={cl.started} onClick={() => setCl({ started: true, startedAt: Date.now() })} className="cbtn !min-h-[72px] bg-blue-600 text-xl text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Iniciar limpieza</button>
            <button disabled={!cl.started || !all} onClick={finish} className="cbtn !min-h-[72px] bg-emerald-600 text-xl text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">Finalizar limpieza</button>
          </div>
          {cl.started && !all && <p className="px-4 pb-4 text-sm text-amber-700">Faltan {CLEAN_TASKS.length - doneCount} tareas para poder finalizar.</p>}
        </section>
      </div>
    </div>
  )
}
