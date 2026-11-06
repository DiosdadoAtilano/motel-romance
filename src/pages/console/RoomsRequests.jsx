import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, X, Eye, Clock, Plus, LogOut, Wrench, Sparkles, DoorOpen, Phone } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { useStore } from '../../lib/store'
import { StatusPill, Countdown, typeName, STATUS, PanelHead } from './shared'
import { STATUS_REQ, DURATIONS, roomBySlug, branchById, tabTotal, money } from '../../data/mock'
import { DemoBadge } from '../../components/ui'

function RoomTile({ r }) {
  const { checkOut, addExtraHour, patchRoom } = useStore()
  const { can } = useAuth()
  const nav = useNavigate()
  const s = STATUS[r.status]
  return (
    <div className={`flex flex-col justify-between rounded-xl border p-3 ${s.ring} ${s.bg}`}>
      <div className="flex items-start justify-between">
        <div><p className="text-2xl font-semibold tracking-tight leading-none">{r.id}</p><p className="mt-1 text-xs text-slate-500">{typeName(r.type)}</p></div>
        <StatusPill status={r.status} />
      </div>
      <div className="my-3 min-h-[44px]">
        {r.status === 'ocupada' && <><Countdown endsAt={r.endsAt} big /><Link to={`/consola/servicio?room=${r.id}`} className="my-1 inline-flex min-h-[36px] items-center rounded-md bg-amber-50 px-2 text-xs font-bold text-amber-700 hover:bg-amber-50">+ Consumo{tabTotal(r) > 0 ? ` · ${money(tabTotal(r)).replace(' MXN', '')}` : ''}</Link><p className="text-xs text-slate-500">{DURATIONS.find((d) => d.key === r.duration)?.short} · {r.vehicle}{r.plate ? ` ${r.plate}` : ''}</p></>}
        {r.status === 'mantenimiento' && <p className="text-sm text-amber-700">{r.note}</p>}
        {r.status === 'limpieza' && <p className="text-sm text-blue-700">{r.cleaning?.started ? 'En proceso…' : 'Pendiente de iniciar'}</p>}
        {r.status === 'disponible' && <p className="text-sm text-emerald-700">Lista para recibir</p>}
      </div>
      {r.status === 'disponible' && <Link to={can('checkin') ? `/consola/entradas?room=${r.id}` : '#'} aria-disabled={!can('checkin')} className="cbtn aria-disabled:pointer-events-none aria-disabled:opacity-40 bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">Entrada</Link>}
      {r.status === 'ocupada' && (
        <div className="grid grid-cols-2 gap-2">
          <button disabled={!can('extend')} className="cbtn !min-h-[52px] border border-slate-300 bg-white hover:bg-slate-100" onClick={() => addExtraHour(r.id)}>Hora</button>
          <button disabled={!can('checkin')} className="cbtn !min-h-[52px] bg-rose-700 text-white hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2" onClick={() => (tabTotal(r) > 0 ? nav('/consola/servicio?room=' + r.id) : checkOut(r.id))}>Salida</button>
        </div>
      )}
      {r.status === 'limpieza' && <Link to={`/consola/limpieza?room=${r.id}`} className="cbtn bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Limpiar</Link>}
      {r.status === 'mantenimiento' && <button disabled={!can('maintenance')} className="cbtn border border-amber-300 text-amber-700 hover:bg-amber-50" onClick={() => patchRoom(r.id, { status: 'limpieza', note: undefined, cleaning: { started: false, checks: {} } })}>Liberar</button>}
    </div>
  )
}

function RequestItem({ q }) {
  const { setRequestStatus } = useStore()
  const ok = useAuth().can('requests')
  const room = roomBySlug(q.room)
  const open = q.status === 'recibida' || q.status === 'revision'
  const mins = Math.max(0, Math.round((Date.now() - q.createdAt) / 60000))
  return (
    <li className="space-y-3 border-b border-slate-300 p-4 last:border-0">
      <div className="flex items-start justify-between gap-2">
        <div><p className="text-lg font-semibold">{q.folio} <span className="font-semibold text-slate-500">· {q.alias}</span></p>
          <p className="text-sm text-slate-500">{room.name} · {branchById(q.branch).short}</p></div>
        <span className={`rounded-md px-2 py-1 text-xs font-bold uppercase ${q.status === 'confirmada' ? 'bg-emerald-50 text-emerald-700' : q.status === 'no_disponible' ? 'bg-rose-50 text-rose-700' : q.status === 'revision' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>{STATUS_REQ[q.status].label}</span>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
        <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-500" />{q.date} · <strong>{q.eta}</strong></span>
        <span>{DURATIONS.find((d) => d.key === q.duration).short}</span>
        <span className="flex items-center gap-1.5 text-slate-500"><Phone size={14} />{q.phone}</span>
        <span className="text-slate-500">hace {mins} min</span>
      </div>
      {open && (
        <div className="grid grid-cols-3 gap-2">
          <button disabled={!ok || q.status === 'revision'} className="cbtn !min-h-[52px] border border-slate-300 bg-white px-2 text-sm hover:bg-slate-100" onClick={() => setRequestStatus(q.folio, 'revision')}>Revisar</button>
          <button disabled={!ok} className="cbtn !min-h-[52px] bg-emerald-600 px-2 text-sm text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2" onClick={() => setRequestStatus(q.folio, 'confirmada')}>Confirmar</button>
          <button disabled={!ok} className="cbtn !min-h-[52px] bg-rose-700 px-2 text-sm text-white hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2" onClick={() => setRequestStatus(q.folio, 'no_disponible')}>Rechazar</button>
        </div>
      )}
    </li>
  )
}

export default function RoomsAndRequests() {
  const { vRooms: rooms, vRequests: requests } = useStore()
  const [f, setF] = useState('todas')
  const [tab, setTab] = useState('pend')
  const shown = rooms.filter((r) => f === 'todas' || r.status === f)
  const pend = requests.filter((q) => q.status === 'recibida' || q.status === 'revision')
  const done = requests.filter((q) => !(q.status === 'recibida' || q.status === 'revision'))
  const list = tab === 'pend' ? pend : done

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_400px]">
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Cuartos</h1><DemoBadge />
        </div>
        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
          {['todas', ...Object.keys(STATUS)].map((k) => {
            const n = k === 'todas' ? rooms.length : rooms.filter((r) => r.status === k).length
            return <button key={k} aria-pressed={f === k} onClick={() => setF(k)} className={`min-h-[44px] rounded-lg border px-4 text-sm font-bold transition ${f === k ? 'border-rose-500 bg-rose-50 text-slate-900' : 'border-slate-300 bg-white text-slate-500 hover:text-slate-900'}`}>{k === 'todas' ? 'Todas' : STATUS[k].label} <span className="ml-1 opacity-70">{n}</span></button>
          })}
        </div>
        <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 2xl:grid-cols-3">{shown.map((r) => <RoomTile key={r.id} r={r} />)}</div>
      </section>

      <aside className="cpanel h-fit xl:sticky xl:top-20">
        <PanelHead title="Bandeja de solicitudes web" icon={null} right={<DemoBadge />} />
        <div className="grid grid-cols-2 border-b border-slate-300">
          {[['pend', `Pendientes (${pend.length})`], ['done', `Atendidas (${done.length})`]].map(([k, l]) => <button key={k} onClick={() => setTab(k)} aria-pressed={tab === k} className={`min-h-[52px] text-sm font-bold ${tab === k ? 'border-b-2 border-rose-500 text-slate-900' : 'text-slate-500'}`}>{l}</button>)}
        </div>
        <ul className="max-h-[70vh] overflow-y-auto">{list.length ? list.map((q) => <RequestItem key={q.folio} q={q} />) : <li className="p-8 text-center text-slate-500">Nada por aquí.</li>}</ul>
      </aside>
    </div>
  )
}
