import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BedDouble } from 'lucide-react'
import { useNow } from '../../lib/store'
import { STATUS, Badge, PanelHead, typeName } from '../../pages/console/shared'
import RoomActionModal from './RoomActionModal'

/* Personal asignado (demo): M# mucama, T# técnico, según el número de cuarto */
const staffFor = (r) => {
  const n = parseInt(r.id.slice(-2), 10) || 0
  if (r.status === 'limpieza') return { code: `M${(n % 3) + 1}`, label: `Mucama ${(n % 3) + 1}`, tone: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
  if (r.status === 'mantenimiento') return { code: `T${(n % 2) + 1}`, label: `Técnico ${(n % 2) + 1}`, tone: 'bg-red-100 text-red-800 border-red-200' }
  return null
}

export default function RoomGrid({ rooms }) {
  const now = useNow(1000)
  const nav = useNavigate()
  const [sel, setSel] = useState(null)

  const open = (r) => {
    if (r.status === 'ocupada') setSel(r.id)
    else if (r.status === 'disponible') nav('/consola/entradas?room=' + r.id)
    else if (r.status === 'limpieza') nav('/consola/limpieza?room=' + r.id)
    else nav('/consola/habitaciones')
  }
  const selected = rooms.find((r) => r.id === sel)

  return (
    <section className="cpanel">
      <PanelHead title="Estado de cuartos" icon={BedDouble} />
      <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
        {rooms.map((r) => {
          const s = STATUS[r.status]
          const over = r.status === 'ocupada' && r.endsAt < now
          const staff = staffFor(r)
          return (
            <button key={r.id} type="button" onClick={() => open(r)} className={`flex cursor-pointer flex-col items-start rounded-xl border bg-white p-4 text-left shadow-sm transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 ${over ? 'border-red-200' : 'border-slate-200'}`}>
              <div className="flex w-full items-start justify-between">
                <span className="text-3xl font-semibold tracking-tight text-slate-900">{r.id}</span>
                {staff && <span title={staff.label} aria-label={staff.label} className={`grid h-8 w-8 place-items-center rounded-full border text-xs font-semibold ${staff.tone}`}>{staff.code}</span>}
              </div>
              <span className="mt-1 text-xs text-slate-500">{typeName(r.type)}</span>
              <span className="mt-3">{over ? <Badge className="border border-red-200 bg-red-50 text-red-700">Excedido</Badge> : <Badge className={s.badge}>{s.label}</Badge>}</span>
            </button>
          )
        })}
      </div>
      {selected && <RoomActionModal room={selected} onClose={() => setSel(null)} />}
    </section>
  )
}
