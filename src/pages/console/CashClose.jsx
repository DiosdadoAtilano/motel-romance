import { useState } from 'react'
import { Lock, LockOpen, Banknote, TrendingUp, TrendingDown, Equal } from 'lucide-react'
import { useStore } from '../../lib/store'
import { money } from '../../data/mock'
import { DemoBadge } from '../../components/ui'
import { PanelHead } from './shared'

const KINDS = [['estancia', 'Estancias'], ['extra', 'Horas extra'], ['consumo', 'Consumos']]
const fmt = (n) => '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 2 })

export default function CashClose() {
  const { vMovements: movements, shift, setShift, conBranch, conLabel } = useStore()
  const ro = conBranch === 'all'
  const [confirm, setConfirm] = useState(false)
  const sums = Object.fromEntries(KINDS.map(([k]) => [k, movements.filter((m) => m.kind === k).reduce((a, m) => a + m.amount, 0)]))
  const subtotal = Object.values(sums).reduce((a, b) => a + b, 0)
  const expected = subtotal + shift.float
  const has = shift.counted !== '' && !isNaN(parseFloat(shift.counted))
  const counted = has ? parseFloat(shift.counted) : 0
  const diff = counted - expected
  const tone = !has ? 'text-slate-500' : diff === 0 ? 'text-emerald-700' : diff > 0 ? 'text-blue-700' : 'text-rose-700'

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-semibold tracking-tight">Corte de caja · {conLabel}</h1><p className="text-slate-500">Turno nocturno · pagos solo en efectivo</p></div><DemoBadge /></div>

      {shift.closed && <div role="status" className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"><Lock className="text-emerald-700" /><p className="flex-1 font-bold text-emerald-700">Turno cerrado. Diferencia final: {fmt(diff)}.</p><button className="cbtn !min-h-[48px] border border-emerald-500 text-emerald-700" onClick={() => { setShift({ closed: false, float: 1500, counted: '' }); setConfirm(false) }}><LockOpen size={18} />Abrir nuevo turno</button></div>}

      {ro && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-amber-700">Vista consolidada: solo lectura. Elige una sucursal para contar efectivo y cerrar turno.</p>}
      <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
        <section className="cpanel overflow-hidden">
          <PanelHead title="Movimientos del turno" icon={Banknote} />
          <div className="max-h-[520px] overflow-auto"><table className="w-full text-left text-sm">
            <thead className="sticky top-0 border-b border-slate-200 bg-slate-50"><tr><th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Hora</th><th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Cuarto</th><th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500">Concepto</th><th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 text-right">Importe</th></tr></thead>
            <tbody className="divide-y divide-slate-100">{[...movements].sort((a, b) => b.ts - a.ts).map((m) => (
              <tr key={m.id} className="transition-colors duration-200 hover:bg-slate-50"><td className="px-6 py-3.5 font-mono text-slate-500">{new Date(m.ts).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })}</td><td className="px-6 py-3.5 font-semibold text-slate-900">{m.room}</td><td className="px-6 py-3.5 text-slate-700">{m.concept}</td><td className="px-6 py-3.5 text-right font-mono font-medium text-slate-900">{fmt(m.amount)}</td></tr>
            ))}</tbody>
          </table></div>
        </section>

        <section className="cpanel h-fit">
          <PanelHead title="Cálculo de cierre" icon={Banknote} />
          <dl className="space-y-3 p-6 text-[15px]">
            {KINDS.map(([k, l]) => <div key={k} className="flex justify-between"><dt className="text-slate-500">{l}</dt><dd className="font-mono text-slate-900">{fmt(sums[k])}</dd></div>)}
            <div className="flex justify-between border-t border-slate-200 pt-3 font-semibold text-slate-900"><dt>Subtotal ingresos</dt><dd className="font-mono text-slate-900">{fmt(subtotal)}</dd></div>
            <div className="flex items-center justify-between"><dt className="text-slate-500">+ Fondo inicial</dt><dd className="font-mono text-slate-900">{fmt(shift.float)}</dd></div>
            <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3 text-lg font-semibold text-slate-900"><dt>Efectivo esperado</dt><dd className="font-mono text-slate-900">{fmt(expected)}</dd></div>
          </dl>
          <div className="space-y-4 border-t border-slate-200 p-6">
            <label htmlFor="counted" className="block text-xs font-medium uppercase tracking-wider text-slate-500">Efectivo contado (manual)</label>
            <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-500">$</span>
              <input id="counted" inputMode="decimal" disabled={shift.closed || ro} value={shift.counted} onChange={(e) => setShift({ ...shift, counted: e.target.value.replace(/[^\d.]/g, '') })} placeholder="0.00" className="min-h-[60px] w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 font-mono text-2xl font-semibold tracking-tight focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30 disabled:opacity-60" /></div>
            <div className={`flex items-center justify-between rounded-lg border border-slate-300 px-3 py-3 ${tone}`}>
              <span className="flex items-center gap-2 font-bold">{!has ? <Equal size={16} /> : diff < 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}{!has ? 'Diferencia' : diff === 0 ? 'Cuadra exacto' : diff > 0 ? 'Sobrante' : 'Faltante'}</span>
              <span className="font-mono text-xl font-semibold">{has ? fmt(diff) : '—'}</span>
            </div>
            {!confirm ? (
              <button disabled={!has || shift.closed || ro} onClick={() => setConfirm(true)} className="cbtn w-full !min-h-[56px] bg-rose-700 text-lg text-white hover:bg-rose-800 disabled:bg-slate-200 disabled:text-slate-500 disabled:opacity-100 disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2">Cerrar turno</button>
            ) : (
              <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm font-bold text-amber-700">¿Cerrar el turno con {fmt(counted)} contados? Esta acción es de demostración.</p>
                <div className="grid grid-cols-2 gap-2"><button className="cbtn border border-slate-300 bg-white" onClick={() => setConfirm(false)}>Cancelar</button><button className="cbtn bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2" onClick={() => { setShift({ ...shift, closed: true }); setConfirm(false) }}>Sí, cerrar</button></div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
