import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Plus, Minus, Trash2, Banknote, CircleCheck, ConciergeBell, PencilLine } from 'lucide-react'
import { useStore } from '../../lib/store'
import { Countdown, typeName, PanelHead } from './shared'
import { DemoBadge } from '../../components/ui'
import { PRODUCTS, PRODUCT_TABS, tabTotal } from '../../data/mock'

const fmt = (n) => '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 2 })

export default function RoomService() {
  const { vRooms, conBranch, addToTab, changeQty, removeFromTab, settleAndCheckOut } = useStore()
  const [sp] = useSearchParams()
  const [sel, setSel] = useState(sp.get('room') || '')
  const [tab, setTab] = useState('bebidas')
  const [free, setFree] = useState({ name: '', price: '' })
  const [confirm, setConfirm] = useState(false)
  const [done, setDone] = useState(null)
  const ro = conBranch === 'all'

  const occupied = vRooms.filter((r) => r.status === 'ocupada').sort((a, b) => a.id.localeCompare(b.id))
  const room = occupied.find((r) => r.id === sel) || occupied[0]
  const lines = room?.tab || []
  const total = room ? tabTotal(room) : 0
  const freePrice = parseFloat(free.price)
  const canFree = free.name.trim().length > 1 && freePrice > 0

  const pick = (id) => { setSel(id); setConfirm(false); setDone(null) }
  const settle = () => { setDone({ id: room.id, total }); settleAndCheckOut(room.id); setConfirm(false); setSel('') }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-semibold tracking-tight">Room Service</h1><p className="text-slate-500">Cargos a la cuenta del cuarto · se cobran en efectivo en la salida</p></div><DemoBadge /></div>

      {ro && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-amber-700">Vista consolidada: solo lectura. Elige una sucursal para cargar consumos.</p>}
      {done && <p role="status" className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 font-bold text-emerald-700"><CircleCheck />Cuarto {done.id}: {done.total > 0 ? `${fmt(done.total)} de consumos cobrados en efectivo. ` : ''}Salida registrada; pasó a Limpieza.</p>}

      {!room ? <p className="cpanel p-10 text-center text-slate-500">No hay cuartos ocupados en esta vista.</p> : (
        <>
          <section className="cpanel p-3">
            <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-slate-500">Cuarto ocupado</h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
              {occupied.map((r) => (
                <button key={r.id} aria-pressed={r.id === room.id} onClick={() => pick(r.id)} className={`relative min-h-[68px] rounded-xl border p-2 text-center transition ${r.id === room.id ? 'border-rose-600 bg-rose-50 ring-1 ring-rose-600' : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50'}`}>
                  <span className="block text-2xl font-semibold">{r.id}</span><span className="block text-[11px] text-slate-500">{typeName(r.type)}</span>
                  {tabTotal(r) > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-amber-500 px-1.5 text-[11px] font-semibold text-white">${tabTotal(r)}</span>}
                </button>
              ))}
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
            <section className="cpanel">
              <div className="grid grid-cols-2 border-b border-slate-300" role="tablist">
                {PRODUCT_TABS.map((t) => <button key={t.key} role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)} className={`min-h-[56px] text-sm font-bold ${tab === t.key ? 'border-b-2 border-rose-500 text-slate-900' : 'text-slate-500'}`}>{t.label}</button>)}
              </div>
              <div className="grid grid-cols-1 gap-2 p-3 min-[480px]:grid-cols-2 2xl:grid-cols-3">
                {PRODUCTS.filter((p) => p.tab === tab).map((p) => {
                  const q = lines.find((l) => l.productId === p.id)?.qty || 0
                  return (
                    <button key={p.id} disabled={ro} onClick={() => addToTab(room.id, { productId: p.id, name: p.name, price: p.price })} className="relative flex min-h-[72px] items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white px-4 text-left transition hover:border-rose-500 active:scale-[.98] disabled:opacity-40">
                      <span><span className="block text-[15px] font-bold leading-tight">{p.name}</span><span className="text-xs text-slate-500">{p.group}</span></span>
                      <span className="font-mono text-lg font-semibold">${p.price}</span>
                      {q > 0 && <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-rose-500 px-1 text-xs font-semibold text-white">{q}</span>}
                    </button>
                  )
                })}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); if (canFree && !ro) { addToTab(room.id, { productId: null, name: free.name.trim(), price: freePrice }); setFree({ name: '', price: '' }) } }} className="border-t border-slate-300 p-3">
                <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500"><PencilLine size={14} />Artículo libre</p>
                <div className="grid gap-2 sm:grid-cols-[1fr_130px_auto]">
                  <label className="sr-only" htmlFor="fname">Concepto</label>
                  <input id="fname" value={free.name} disabled={ro} onChange={(e) => setFree({ ...free, name: e.target.value })} placeholder="Concepto" className="min-h-[56px] rounded-xl border border-slate-300 bg-white px-4 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30 disabled:opacity-40" />
                  <label className="sr-only" htmlFor="fprice">Monto</label>
                  <input id="fprice" inputMode="decimal" value={free.price} disabled={ro} onChange={(e) => setFree({ ...free, price: e.target.value.replace(/[^\d.]/g, '') })} placeholder="Monto $" className="min-h-[56px] rounded-xl border border-slate-300 bg-white px-4 font-mono focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30 disabled:opacity-40" />
                  <button type="submit" disabled={!canFree || ro} className="cbtn border border-slate-300 bg-white hover:bg-slate-100">Agregar</button>
                </div>
              </form>
            </section>

            <aside className="cpanel h-fit xl:sticky xl:top-20">
              <PanelHead title={`Cuenta · cuarto ${room.id}`} icon={ConciergeBell} right={<Countdown endsAt={room.endsAt} />} />
              {lines.length === 0 ? <p className="p-8 text-center text-slate-500">Sin consumos. Toca un producto para cargarlo.</p> : (
                <ul>{lines.map((l) => (
                  <li key={l.id} className="flex items-center gap-2 border-b border-slate-300 px-4 py-3 last:border-0">
                    <div className="min-w-0 flex-1"><p className="truncate font-bold">{l.name}{!l.productId && <span className="ml-2 rounded bg-white px-1.5 text-[10px] uppercase text-slate-500">libre</span>}</p><p className="font-mono text-sm text-slate-500">${l.price} c/u</p></div>
                    <div className="flex items-center gap-1">
                      <button aria-label="Quitar uno" disabled={ro} onClick={() => changeQty(room.id, l.id, -1)} className="grid h-11 w-11 place-items-center rounded-lg bg-white hover:bg-slate-100 disabled:opacity-40"><Minus size={18} /></button>
                      <span className="w-7 text-center font-mono text-lg font-semibold">{l.qty}</span>
                      <button aria-label="Agregar uno" disabled={ro} onClick={() => changeQty(room.id, l.id, 1)} className="grid h-11 w-11 place-items-center rounded-lg bg-white hover:bg-slate-100 disabled:opacity-40"><Plus size={18} /></button>
                      <button aria-label="Eliminar renglón" disabled={ro} onClick={() => removeFromTab(room.id, l.id)} className="grid h-11 w-11 place-items-center rounded-lg text-rose-700 hover:bg-rose-50 disabled:opacity-40"><Trash2 size={18} /></button>
                    </div>
                    <p className="w-20 text-right font-mono font-bold">{fmt(l.qty * l.price)}</p>
                  </li>
                ))}</ul>
              )}
              <div className="space-y-3 border-t border-slate-300 p-4">
                <div className="flex items-center justify-between rounded-lg bg-white px-3 py-3 text-lg font-semibold"><span>Consumos por cobrar</span><span className="font-mono">{fmt(total)}</span></div>
                <p className="text-xs text-slate-500">La estancia y las horas extra ya se cobraron al registrarlas. Aquí solo se suman los consumos.</p>
                {!confirm ? (
                  <button disabled={ro} onClick={() => setConfirm(true)} className="cbtn w-full !min-h-[68px] bg-rose-700 text-lg text-white hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2">{total > 0 ? 'Cobrar y registrar salida' : 'Registrar salida'}</button>
                ) : (
                  <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <p className="text-sm font-bold text-amber-700">{total > 0 ? `Cobrar ${fmt(total)} en efectivo y dar salida al cuarto ${room.id}?` : `Dar salida al cuarto ${room.id} sin consumos?`} Demostración.</p>
                    <div className="grid grid-cols-2 gap-2"><button className="cbtn border border-slate-300 bg-white" onClick={() => setConfirm(false)}>Cancelar</button><button className="cbtn bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2" onClick={settle}>Confirmar</button></div>
                  </div>
                )}
                <Link to="/consola/habitaciones" className="block text-center text-sm font-semibold text-slate-500 underline-offset-4 hover:underline">Dejar en cuenta y volver a cuartos</Link>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  )
}