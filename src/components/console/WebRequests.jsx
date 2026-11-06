import { Link } from 'react-router-dom'
import { Inbox, ArrowRight } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { useStore } from '../../lib/store'
import { Badge, PanelHead, REQ_BADGE, typeName } from '../../pages/console/shared'
import { STATUS_REQ } from '../../data/mock'

export default function WebRequests({ requests, limit = 5 }) {
  const { setRequestStatus } = useStore()
  const { can } = useAuth()
  const ok = can('requests')
  const pending = requests.filter((r) => r.status === 'recibida' || r.status === 'revision')

  return (
    <section className="cpanel">
      <PanelHead title="Solicitudes web pendientes" icon={Inbox} right={<Link to="/consola/habitaciones" className="flex items-center gap-1 rounded-md text-sm font-medium text-rose-700 transition-colors duration-200 hover:text-rose-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500">Abrir bandeja<ArrowRight size={14} /></Link>} />
      <ul className="space-y-3 p-4 sm:p-6">
        {pending.length === 0 && <li className="py-6 text-center text-sm text-slate-500">Sin solicitudes por atender.</li>}
        {pending.slice(0, limit).map((r) => (
          <li key={r.folio} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors duration-200 hover:bg-slate-50">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{r.folio} <span className="font-normal text-slate-500">· {r.alias}</span></p>
                <p className="mt-0.5 text-sm text-slate-500">{typeName(r.room)} · {r.date} · {r.eta}</p>
              </div>
              <Badge className={REQ_BADGE[r.status]}>{STATUS_REQ[r.status].label}</Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button disabled={!ok} onClick={() => setRequestStatus(r.folio, 'confirmada')} className="disabled:pointer-events-none disabled:opacity-40 min-h-[44px] rounded-lg border border-green-200 bg-white px-3 text-sm font-semibold text-green-700 transition-colors duration-200 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">Aprobar</button>
              <button disabled={!ok} onClick={() => setRequestStatus(r.folio, 'no_disponible')} className="disabled:pointer-events-none disabled:opacity-40 min-h-[44px] rounded-lg border border-red-200 bg-white px-3 text-sm font-semibold text-red-700 transition-colors duration-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Rechazar</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
