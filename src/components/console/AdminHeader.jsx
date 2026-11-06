import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Building2, LogOut } from 'lucide-react'
import { BRANCHES } from '../../data/mock'
import { useAuth } from '../../lib/auth'
import { ROLES } from '../../data/roles'
import { useNow, useStore } from '../../lib/store'
import { typeName } from '../../pages/console/shared'

export default function AdminHeader() {
  const { user, can, logout } = useAuth()
  const [openU, setOpenU] = useState(false)
  const now = useNow(1000)
  const nav = useNavigate()
  const { vRooms, vRequests, shift, conBranch, setConBranch } = useStore()
  const [q, setQ] = useState('')
  const [openN, setOpenN] = useState(false)
  const [focus, setFocus] = useState(false)
  const box = useRef(null)

  useEffect(() => {
    const h = (e) => { if (box.current && !box.current.contains(e.target)) { setOpenN(false); setOpenU(false); setFocus(false) } }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const overdue = vRooms.filter((r) => r.status === 'ocupada' && r.endsAt < now)
  const pending = vRequests.filter((r) => r.status === 'recibida' || r.status === 'revision')
  const alerts = overdue.length + pending.length

  const results = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return []
    const rooms = vRooms.filter((r) => r.id.includes(t) || r.plate?.toLowerCase().includes(t)).map((r) => ({ key: 'r' + r.id, title: `Cuarto ${r.id}`, sub: r.plate ? `${typeName(r.type)} · ${r.plate}` : typeName(r.type), to: '/consola/habitaciones' }))
    const reqs = vRequests.filter((x) => x.folio.toLowerCase().includes(t) || x.alias?.toLowerCase().includes(t)).map((x) => ({ key: 'q' + x.folio, title: x.folio, sub: `Solicitud web · ${x.alias}`, to: '/consola/habitaciones' }))
    return [...rooms, ...reqs].slice(0, 6)
  }, [q, vRooms, vRequests])

  const go = (to) => { setQ(''); setFocus(false); nav(to) }
  const time = new Date(now).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <header ref={box} className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
      <p className="brand mr-1 text-2xl font-semibold text-rose-700 lg:hidden">Romance</p>

      <div className="relative order-last w-full sm:order-none sm:max-w-md sm:flex-1">
        <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <label className="sr-only" htmlFor="gsearch">Búsqueda global</label>
        <input id="gsearch" type="search" value={q} onFocus={() => setFocus(true)} onChange={(e) => setQ(e.target.value)} placeholder="Buscar placas, folio o cuarto..."
          className="min-h-[44px] w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-500 transition-colors duration-200 hover:bg-white focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30" />
        {focus && q.trim() && (
          <ul className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
            {results.length === 0 && <li className="px-4 py-3 text-sm text-slate-500">Sin resultados para “{q}”.</li>}
            {results.map((r) => (
              <li key={r.key}><button onClick={() => go(r.to)} className="block w-full px-4 py-2.5 text-left transition-colors duration-200 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none">
                <span className="block text-sm font-medium text-slate-900">{r.title}</span><span className="block text-xs text-slate-500">{r.sub}</span></button></li>
            ))}
          </ul>
        )}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <span className={`hidden items-center rounded-full border px-2.5 py-0.5 text-xs font-medium md:inline-flex ${shift.closed ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-green-200 bg-green-50 text-green-700'}`}>{shift.closed ? 'Turno cerrado' : conBranch === 'all' ? 'Vista consolidada' : 'Turno abierto'}</span>

        <label className="hidden items-center gap-2 lg:flex"><Building2 size={18} className="text-slate-400" /><span className="sr-only">Sucursal</span>
          <select value={conBranch} onChange={(e) => setConBranch(e.target.value)} className="min-h-[44px] w-56 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 shadow-sm transition-colors duration-200 hover:bg-slate-50 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30">
            {BRANCHES.filter((b) => user.branches.includes(b.id)).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}{can('consolidated') && <option value="all">Consolidado (3 sucursales)</option>}</select></label>

        <div className="relative">
          <button onClick={() => setOpenN((o) => !o)} aria-label={`Notificaciones${alerts ? `, ${alerts} nuevas` : ''}`} aria-expanded={openN}
            className="relative grid h-11 w-11 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors duration-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2">
            <Bell size={20} />
            {alerts > 0 && <span className="absolute right-2 top-2 flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-60" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" /></span>}
          </button>
          {openN && (
            <div className="absolute right-0 top-full z-40 mt-2 w-80 max-w-[85vw] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <p className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900">Notificaciones</p>
              <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                {alerts === 0 && <li className="px-4 py-6 text-center text-sm text-slate-500">Todo al día.</li>}
                {overdue.map((r) => <li key={r.id}><button onClick={() => { setOpenN(false); nav('/consola/habitaciones') }} className="block w-full px-4 py-3 text-left transition-colors duration-200 hover:bg-slate-50"><span className="block text-sm font-medium text-red-700">Cuarto {r.id} excedió su tiempo</span><span className="block text-xs text-slate-500">Registrar salida o extender</span></button></li>)}
                {pending.map((r) => <li key={r.folio}><button onClick={() => { setOpenN(false); nav('/consola/habitaciones') }} className="block w-full px-4 py-3 text-left transition-colors duration-200 hover:bg-slate-50"><span className="block text-sm font-medium text-slate-900">Solicitud {r.folio}</span><span className="block text-xs text-slate-500">{typeName(r.room)} · {r.date} {r.eta}</span></button></li>)}
              </ul>
            </div>
          )}
        </div>

        <div className="relative">
          <button onClick={() => setOpenU((o) => !o)} aria-expanded={openU} aria-label="Menú de usuario" className="flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-200 bg-white pl-1.5 pr-3 transition-colors duration-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-rose-50 text-xs font-semibold text-rose-700">{user.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</span>
            <span className="hidden text-left leading-tight xl:block"><span className="block text-sm font-medium text-slate-900">{user.name}</span><span className="block text-xs text-slate-500">{ROLES[user.role].label}</span></span>
          </button>
          {openU && (
            <div className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <div className="border-b border-slate-200 px-4 py-3"><p className="text-sm font-medium text-slate-900">{user.name}</p><p className="truncate text-xs text-slate-500">{user.email}</p></div>
              <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-700 transition-colors duration-200 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"><LogOut size={16} />Cerrar sesión</button>
            </div>
          )}
        </div>        <span className="hidden rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono sm:inline text-base font-semibold tabular-nums text-slate-900">{time}</span>
      </div>
    </header>
  )
}
