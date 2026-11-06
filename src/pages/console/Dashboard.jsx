import { Link } from 'react-router-dom'
import { Building2, BedDouble, DoorOpen, KeyRound, Brush, Wrench, Inbox, Banknote, ArrowRight } from 'lucide-react'
import { useStore, useNow } from '../../lib/store'
import { Kpi, PanelHead, Badge, REQ_BADGE, Countdown, typeName, STATUS } from './shared'
import { STATUS_REQ, money, BRANCHES, tabTotal } from '../../data/mock'
import WebRequests from '../../components/console/WebRequests'
import RoomGrid from '../../components/console/RoomGrid'
import { DemoBadge } from '../../components/ui'

export default function Dashboard() {
  const { rooms: allRooms, requests: allReq, movements: allMov, vRooms: rooms, vRequests: requests, vMovements: movements, conBranch, conLabel } = useStore()
  const now = useNow(1000)
  const count = (s) => rooms.filter((r) => r.status === s).length
  const total = rooms.length
  const pending = requests.filter((r) => r.status === 'recibida' || r.status === 'revision')
  const income = movements.reduce((a, m) => a + m.amount, 0)
  const exits = rooms.filter((r) => r.status === 'ocupada').sort((a, b) => a.endsAt - b.endsAt)

  const th = 'px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500'
  const tr = 'transition-colors duration-200 hover:bg-slate-50'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-2xl font-semibold tracking-tight text-slate-900">Resumen del turno · {conLabel}</h1><p className="mt-1 text-sm text-slate-500">Turno nocturno · datos de demostración</p></div>
        <Link to="/consola/entradas" className="cbtn bg-rose-700 text-white hover:bg-rose-800"><DoorOpen size={20} />Registrar entrada</Link>
      </div>

      {conBranch === 'all' && (
        <section className="cpanel overflow-hidden">
          <PanelHead title="Comparativo por sucursal" icon={Building2} right={<DemoBadge />} />
          <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-slate-50"><tr><th className={th}>Sucursal</th><th className={th}>Ocupadas</th><th className={th}>Disponibles</th><th className={th}>Limpieza</th><th className={th}>Solicitudes</th><th className={`${th} text-right`}>Ingresos</th></tr></thead>
            <tbody className="divide-y divide-slate-100">{BRANCHES.map((b) => {
              const rs = allRooms.filter((r) => r.branch === b.id)
              const n = (s) => rs.filter((r) => r.status === s).length
              return <tr key={b.id} className={tr}><td className="px-6 py-4 font-medium text-slate-900">{b.name}</td><td className="px-6 py-4 font-semibold text-blue-700">{n('ocupada')}/{rs.length}</td><td className="px-6 py-4 font-semibold text-green-700">{n('disponible')}</td><td className="px-6 py-4 font-semibold text-yellow-700">{n('limpieza')}</td><td className="px-6 py-4 text-slate-600">{allReq.filter((q) => q.branch === b.id && (q.status === 'recibida' || q.status === 'revision')).length}</td><td className="px-6 py-4 text-right font-mono font-medium text-slate-900">{money(allMov.filter((m) => m.branch === b.id).reduce((a, m) => a + m.amount, 0)).replace(' MXN', '')}</td></tr>
            })}</tbody>
          </table></div>
        </section>
      )}

      {/* StatsCards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-6">
        <Kpi icon={BedDouble} label="Ocupadas" value={`${count('ocupada')}/${total}`} sub={`${Math.round((count('ocupada') / total) * 100)}% de ocupación`} iconTone="bg-blue-50 text-blue-700" />
        <Kpi icon={KeyRound} label="Disponibles" value={count('disponible')} sub="listas para entrada" iconTone="bg-green-50 text-green-700" />
        <Kpi icon={Brush} label="Limpiezas pend." value={count('limpieza')} sub="por atender" iconTone="bg-yellow-50 text-yellow-700" />
        <Kpi icon={Wrench} label="Mantenimiento" value={count('mantenimiento')} sub="fuera de servicio" iconTone="bg-red-50 text-red-700" />
        <Kpi icon={Inbox} label="Solicitudes web" value={pending.length} sub="por responder" />
        <Kpi icon={Banknote} label="Ingresos turno" value={money(income).replace(' MXN', '')} sub={`+ ${money(rooms.reduce((a, r) => a + tabTotal(r), 0)).replace(' MXN', '')} por cobrar`} />
      </div>

      {/* Barra segmentada de ocupación */}
      <div className="cpanel p-6">
        <div className="flex h-3 overflow-hidden rounded-full bg-slate-100" role="img" aria-label="Distribución de habitaciones por estado">
          {Object.keys(STATUS).map((s) => <div key={s} className={`${STATUS[s].dot} transition-all duration-700`} style={{ width: `${(count(s) / total) * 100}%` }} />)}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
          {Object.keys(STATUS).map((s) => <span key={s} className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${STATUS[s].dot}`} />{STATUS[s].label} <strong className="font-semibold text-slate-900">{count(s)}</strong></span>)}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="cpanel overflow-hidden">
          <PanelHead title="Próximas salidas" icon={DoorOpen} right={<DemoBadge />} />
          <div className="overflow-x-auto"><table className="w-full text-left text-sm">
            <thead className="bg-slate-50"><tr><th className={th}>Cuarto</th><th className={th}>Tipo</th><th className={th}>Vehículo</th><th className={`${th} text-right`}>Tiempo restante</th></tr></thead>
            <tbody className="divide-y divide-slate-100">{exits.map((r) => (
              <tr key={r.id} className={tr}><td className="px-6 py-4 text-lg font-semibold text-slate-900">{r.id}</td><td className="px-6 py-4 text-slate-700">{typeName(r.type)}</td><td className="px-6 py-4 text-slate-500">{r.vehicle}{r.plate ? ` · ${r.plate}` : ''}</td><td className="px-6 py-4 text-right"><Countdown endsAt={r.endsAt} /></td></tr>
            ))}</tbody>
          </table></div>
        </section>

        <WebRequests requests={requests} />
      </div>

      <RoomGrid rooms={rooms} />
    </div>
  )
}
