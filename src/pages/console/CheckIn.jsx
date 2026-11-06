import { useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { Car, Bike, UserRound, LogOut, CircleCheck, DoorOpen } from 'lucide-react'
import { useStore } from '../../lib/store'
import { Countdown, typeName } from './shared'
import { DURATIONS, roomBySlug, money, tabTotal } from '../../data/mock'
import { DemoBadge } from '../../components/ui'

const VEH = [{ k: 'Auto', I: Car }, { k: 'Moto', I: Bike }, { k: 'Sin vehículo', I: UserRound }]

export default function CheckIn() {
  const { vRooms: rooms, checkIn, checkOut } = useStore()
  const [sp] = useSearchParams()
  const nav = useNavigate()
  const [tab, setTab] = useState('in')
  const [room, setRoom] = useState(sp.get('room') || '')
  const [dur, setDur] = useState('')
  const [veh, setVeh] = useState('Auto')
  const [plate, setPlate] = useState('')
  const [ok, setOk] = useState(null)

  const free = rooms.filter((r) => r.status === 'disponible')
  const busy = rooms.filter((r) => r.status === 'ocupada').sort((a, b) => a.endsAt - b.endsAt)
  const sel = rooms.find((r) => r.id === room && r.status === 'disponible')
  const price = sel && dur ? roomBySlug(sel.type).prices[dur] : null

  const submit = () => {
    checkIn(sel.id, { duration: dur, vehicle: veh, plate: plate.trim().toUpperCase() })
    setOk({ id: sel.id, dur, price })
    setRoom(''); setDur(''); setPlate(''); setVeh('Auto')
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-semibold tracking-tight">Entradas y salidas</h1><DemoBadge /></div>
      <div className="grid grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
        {[['in', 'Registrar entrada', DoorOpen], ['out', 'Registrar salida', LogOut]].map(([k, l, I]) => (
          <button key={k} onClick={() => { setTab(k); setOk(null) }} aria-pressed={tab === k} className={`flex min-h-[56px] items-center justify-center gap-2 rounded-lg px-1 text-sm font-bold sm:text-base ${tab === k ? 'bg-rose-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}><I size={20} className="shrink-0" />{l}</button>
        ))}
      </div>

      {ok && tab === 'in' && (
        <div role="status" className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
          <CircleCheck /><p className="flex-1 font-bold">Entrada registrada · cuarto {ok.id} · {DURATIONS.find((d) => d.key === ok.dur).short} · {money(ok.price)} cobrado en efectivo</p>
          <Link to="/consola/habitaciones" className="font-bold underline">Ver cuartos</Link>
        </div>
      )}

      {tab === 'in' ? (
        <div className="space-y-5">
          <section className="cpanel p-4">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500"><span className="mr-2 rounded bg-rose-500 px-2 py-0.5 text-white">1</span>Habitación</h2>
            {free.length === 0 ? <p className="text-slate-500">No hay cuartos disponibles.</p> :
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                {free.map((r) => <button key={r.id} aria-pressed={room === r.id} onClick={() => setRoom(r.id)} className={`min-h-[72px] rounded-xl border p-2 transition ${room === r.id ? 'border-rose-600 bg-rose-50 text-rose-800 ring-1 ring-rose-600' : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50'}`}><span className="block text-2xl font-semibold">{r.id}</span><span className="block text-[11px] text-slate-500">{typeName(r.type)}</span></button>)}
              </div>}
          </section>
          <section className="cpanel p-4">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500"><span className="mr-2 rounded bg-rose-500 px-2 py-0.5 text-white">2</span>Duración</h2>
            <div className="grid grid-cols-3 gap-2">
              {DURATIONS.map((d) => <button key={d.key} aria-pressed={dur === d.key} onClick={() => setDur(d.key)} className={`min-h-[72px] rounded-xl border text-2xl font-semibold transition ${dur === d.key ? 'border-rose-600 bg-rose-50 text-rose-800 ring-1 ring-rose-600' : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50'}`}>{d.short}{sel && <span className="block text-sm font-semibold text-slate-500">{money(roomBySlug(sel.type).prices[d.key]).replace(' MXN', '')}</span>}</button>)}
            </div>
          </section>
          <section className="cpanel p-4">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Vehículo <span className="font-normal normal-case">(opcional)</span></h2>
            <div className="grid gap-3 sm:grid-cols-[2fr_1.4fr]">
              <div className="grid grid-cols-3 gap-2">{VEH.map(({ k, I }) => <button key={k} aria-pressed={veh === k} onClick={() => setVeh(k)} className={`flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-xl border text-xs font-bold ${veh === k ? 'border-rose-600 bg-rose-50 text-rose-800 ring-1 ring-rose-600' : 'border-slate-300 bg-white'}`}><I size={22} />{k}</button>)}</div>
              <div><label className="sr-only" htmlFor="plate">Placa</label><input id="plate" value={plate} onChange={(e) => setPlate(e.target.value)} disabled={veh === 'Sin vehículo'} placeholder="Placa (opcional)" className="h-full min-h-[64px] w-full rounded-xl border border-slate-300 bg-white px-4 text-lg font-bold uppercase placeholder:normal-case placeholder:font-normal placeholder:text-slate-500 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30 disabled:opacity-40" /></div>
            </div>
          </section>
          <div className="sticky bottom-20 z-10 rounded-xl bg-slate-50/90 py-2 backdrop-blur lg:bottom-4">
            <button disabled={!sel || !dur} onClick={submit} className="cbtn w-full !min-h-[60px] bg-emerald-600 text-lg text-white hover:bg-emerald-700 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:opacity-100 disabled:shadow-none">{sel && dur ? `Registrar entrada · ${sel.id} · ${money(price)}` : 'Elige cuarto y duración'}</button>
          </div>
        </div>
      ) : (
        <section className="cpanel divide-y divide-slate-100">
          {busy.length === 0 && <p className="p-8 text-center text-slate-500">No hay cuartos ocupados.</p>}
          {busy.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-4 p-4">
              <p className="w-16 text-4xl font-semibold">{r.id}</p>
              <div className="min-w-[120px] flex-1"><p className="font-bold">{typeName(r.type)}</p><p className="text-sm text-slate-500">{r.vehicle}{r.plate ? ` · ${r.plate}` : ''}</p></div>
              <Countdown endsAt={r.endsAt} />
              <button onClick={() => (tabTotal(r) > 0 ? nav('/consola/servicio?room=' + r.id) : checkOut(r.id))} className="cbtn bg-rose-700 text-white hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"><LogOut />Salida</button>
            </div>
          ))}
          <p className="p-3 text-xs text-slate-500">Al registrar la salida, el cuarto pasa a Limpieza.</p>
        </section>
      )}
    </div>
  )
}
