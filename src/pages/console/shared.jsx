import { KeyRound, BedDouble, Brush, Wrench } from 'lucide-react'
import { fmtTime } from '../../lib/utils'
import { useNow } from '../../lib/store'
import { roomBySlug } from '../../data/mock'

/* Badges suaves: fondo claro + texto oscuro del mismo tono */
export const STATUS = {
  disponible: { label: 'Disponible', icon: KeyRound, dot: 'bg-green-500', badge: 'bg-green-50 text-green-700 border border-green-200', text: 'text-green-700', bg: 'bg-green-50', ring: 'border-green-200', hint: 'text-green-600' },
  ocupada: { label: 'Ocupada', icon: BedDouble, dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 border border-blue-200', text: 'text-blue-700', bg: 'bg-blue-50', ring: 'border-blue-200', hint: 'text-blue-600' },
  limpieza: { label: 'Limpieza', icon: Brush, dot: 'bg-yellow-400', badge: 'bg-yellow-50 text-yellow-700 border border-yellow-200', text: 'text-yellow-700', bg: 'bg-yellow-50', ring: 'border-yellow-200', hint: 'text-yellow-600' },
  mantenimiento: { label: 'Mantenimiento', icon: Wrench, dot: 'bg-red-500', badge: 'bg-red-50 text-red-700 border border-red-200', text: 'text-red-700', bg: 'bg-red-50', ring: 'border-red-200', hint: 'text-red-600' },
}

/* Badges para solicitudes web */
export const REQ_BADGE = {
  recibida: 'bg-blue-50 text-blue-700 border border-blue-200',
  revision: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  confirmada: 'bg-green-50 text-green-700 border border-green-200',
  no_disponible: 'bg-red-50 text-red-700 border border-red-200',
}

export const Badge = ({ className = '', children }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>{children}</span>
)

export const StatusPill = ({ status }) => {
  const s = STATUS[status]
  const I = s.icon
  return <Badge className={s.badge}><I size={13} />{s.label}</Badge>
}

export const typeName = (slug) => roomBySlug(slug)?.name.replace('Habitación ', '') ?? slug

/* Temporizador de cuarto ocupado: amarillo < 15 min, badge rojo al vencer */
export function Countdown({ endsAt, big = false }) {
  const now = useNow(1000)
  const left = endsAt - now
  const over = left < 0
  const warn = !over && left < 15 * 60000
  return (
    <span className={`inline-flex items-center gap-2 font-mono font-semibold tabular-nums ${big ? 'text-3xl' : 'text-base'} ${over ? 'text-red-700' : warn ? 'text-yellow-700' : 'text-slate-900'}`}>
      {fmtTime(left)}
      {over && <span className="animate-pulseDot rounded-full border border-red-200 bg-red-50 px-2 py-0.5 font-sans text-xs font-medium text-red-700">Excedido</span>}
    </span>
  )
}

export const Kpi = ({ icon: I, label, value, sub, tone = 'text-slate-900', iconTone = 'bg-slate-100 text-slate-600' }) => (
  <div className="cpanel p-6 transition-colors duration-200 hover:bg-slate-50">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className={`grid h-9 w-9 place-items-center rounded-lg ${iconTone}`}><I size={18} /></span>
    </div>
    <p className={`mt-3 text-3xl font-semibold tabular-nums tracking-tight ${tone}`}>{value}</p>
    {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
  </div>
)

export const PanelHead = ({ title, right, icon: I }) => (
  <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-6 py-4">
    <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">{I && <I size={18} className="text-slate-400" />}{title}</h2>{right}
  </div>
)
