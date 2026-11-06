import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { useStore } from '../../lib/store'
import { Countdown, StatusPill, typeName } from '../../pages/console/shared'
import { DURATIONS, tabTotal, money } from '../../data/mock'

export default function RoomActionModal({ room, onClose }) {
  const { addExtraHour, checkOut } = useStore()
  const nav = useNavigate()
  const { can } = useAuth()

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

  if (!room) return null
  const total = tabTotal(room)
  const btn = 'inline-flex min-h-[48px] w-full items-center justify-center rounded-lg px-4 text-sm font-semibold shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-40'

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-900/40 p-0 sm:place-items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="ram-title" className="w-full max-w-md rounded-t-2xl border border-slate-200 bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <h2 id="ram-title" className="text-2xl font-semibold tracking-tight text-slate-900">Cuarto {room.id}</h2>
            <p className="mt-1 text-sm text-slate-500">{typeName(room.type)}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill status={room.status} />
            <button onClick={onClose} aria-label="Cerrar" className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition-colors duration-200 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"><X size={18} /></button>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-4 p-6 text-sm">
          <div><dt className="text-slate-500">Tiempo restante</dt><dd className="mt-1"><Countdown endsAt={room.endsAt} /></dd></div>
          <div><dt className="text-slate-500">Estancia</dt><dd className="mt-1 font-medium text-slate-900">{DURATIONS.find((d) => d.key === room.duration)?.short ?? '—'}</dd></div>
          <div><dt className="text-slate-500">Vehículo</dt><dd className="mt-1 font-medium text-slate-900">{room.vehicle}{room.plate ? ` · ${room.plate}` : ''}</dd></div>
          <div><dt className="text-slate-500">Consumos</dt><dd className="mt-1 font-medium text-slate-900">{total > 0 ? money(total).replace(' MXN', '') : 'Sin consumos'}</dd></div>
        </dl>

        <div className="space-y-3 border-t border-slate-200 p-6">
          <button className={`${btn} bg-rose-700 text-white hover:bg-rose-800`} disabled={!can('roomservice')} onClick={() => nav('/consola/servicio?room=' + room.id)}>Agregar Room Service</button>
          <button className={`${btn} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`} disabled={!can('extend')} onClick={() => addExtraHour(room.id)}>Extender tiempo (+1 hora)</button>
          <button className={`${btn} border border-red-200 bg-white text-red-700 hover:bg-red-50`} disabled={!can('checkin')} onClick={() => { if (total > 0) nav('/consola/servicio?room=' + room.id); else { checkOut(room.id); onClose() } }}>Registrar salida</button>
        </div>
      </div>
    </div>
  )
}
