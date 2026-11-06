import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { SEED_REQUESTS, SEED_CON_ROOMS, SEED_MOVEMENTS, BRANCHES, branchById, roomBySlug, DURATIONS } from '../data/mock'

const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)

export function useNow(ms = 1000) {
  const [n, setN] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setN(Date.now()), ms); return () => clearInterval(t) }, [ms])
  return n
}

const newShift = () => ({ closed: false, float: 1500, counted: '' })

export function StoreProvider({ children }) {
  const [requests, setRequests] = useState(SEED_REQUESTS)
  const [rooms, setRooms] = useState(SEED_CON_ROOMS)
  const [movements, setMovements] = useState(SEED_MOVEMENTS)
  const [shifts, setShifts] = useState(() => Object.fromEntries(BRANCHES.map((b) => [b.id, newShift()])))
  const [lastFolio, setLastFolio] = useState(null)

  /* ---------- sucursal elegida en el sitio público ---------- */
  const [branch, setBranchState] = useState(() => { try { return sessionStorage.getItem('mr_branch') } catch { return null } })
  const setBranch = useCallback((id) => {
    setBranchState(id)
    try { id ? sessionStorage.setItem('mr_branch', id) : sessionStorage.removeItem('mr_branch') } catch {}
  }, [])
  const branchObj = branch ? branchById(branch) : null

  /* ---------- sucursal activa en la consola ('s1' | 's2' | 's3' | 'all') ---------- */
  const [conBranch, setConBranch] = useState('s1')
  const conLabel = conBranch === 'all' ? 'Consolidado' : branchById(conBranch).name
  const inScope = useCallback((x) => conBranch === 'all' || x.branch === conBranch, [conBranch])
  const vRooms = useMemo(() => rooms.filter(inScope), [rooms, inScope])
  const vRequests = useMemo(() => requests.filter(inScope), [requests, inScope])
  const vMovements = useMemo(() => movements.filter(inScope), [movements, inScope])

  const shift = useMemo(() => {
    if (conBranch !== 'all') return shifts[conBranch]
    return { closed: false, float: Object.values(shifts).reduce((a, s) => a + s.float, 0), counted: '' }
  }, [shifts, conBranch])
  const setShift = useCallback((next) => { if (conBranch !== 'all') setShifts((s) => ({ ...s, [conBranch]: next })) }, [conBranch])

  /* ---------- sitio público ---------- */
  const addRequest = useCallback((data) => {
    const folio = 'MR-' + Math.floor(4830 + Math.random() * 4000)
    const req = { ...data, folio, status: 'recibida', createdAt: Date.now() }
    setRequests((r) => [req, ...r])
    setLastFolio(folio)
    return req
  }, [])
  const findRequest = useCallback((f) => requests.find((r) => r.folio.toLowerCase() === f.trim().toLowerCase()), [requests])
  const setRequestStatus = useCallback((folio, status) => setRequests((r) => r.map((x) => (x.folio === folio ? { ...x, status } : x))), [])

  /* ---------- consola ---------- */
  const patchRoom = useCallback((id, patch) => setRooms((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r))), [])

  const checkIn = useCallback((id, { duration, vehicle, plate }) => {
    const room = rooms.find((r) => r.id === id)
    const d = DURATIONS.find((x) => x.key === duration)
    const price = roomBySlug(room.type).prices[duration]
    patchRoom(id, { status: 'ocupada', duration, vehicle, plate, endsAt: Date.now() + d.hours * 3600000 })
    setMovements((m) => [...m, { id: Date.now(), branch: room.branch, ts: Date.now(), room: id, concept: `Estancia ${d.short}`, amount: price, kind: 'estancia' }])
  }, [rooms, patchRoom])

  const checkOut = useCallback((id) => patchRoom(id, { status: 'limpieza', endsAt: undefined, cleaning: { started: false, checks: {} } }), [patchRoom])
  const addExtraHour = useCallback((id) => {
    const room = rooms.find((r) => r.id === id)
    patchRoom(id, { endsAt: room.endsAt + 3600000 })
    setMovements((m) => [...m, { id: Date.now(), branch: room.branch, ts: Date.now(), room: id, concept: 'Hora extra ×1', amount: roomBySlug(room.type).prices.extra, kind: 'extra' }])
  }, [rooms, patchRoom])

  /* ---------- Room Service: cuenta por cuarto ---------- */
  const addToTab = useCallback((id, item) => setRooms((rs) => rs.map((r) => {
    if (r.id !== id) return r
    const tab = r.tab || []
    const ex = item.productId && tab.find((l) => l.productId === item.productId)
    return { ...r, tab: ex ? tab.map((l) => (l === ex ? { ...l, qty: l.qty + 1 } : l)) : [...tab, { id: 'l' + Date.now() + Math.random().toString(36).slice(2, 5), qty: 1, ...item }] }
  })), [])
  const changeQty = useCallback((id, lineId, d) => setRooms((rs) => rs.map((r) => (r.id !== id ? r : { ...r, tab: (r.tab || []).map((l) => (l.id === lineId ? { ...l, qty: l.qty + d } : l)).filter((l) => l.qty > 0) }))), [])
  const removeFromTab = useCallback((id, lineId) => setRooms((rs) => rs.map((r) => (r.id !== id ? r : { ...r, tab: (r.tab || []).filter((l) => l.id !== lineId) }))), [])
  const settleAndCheckOut = useCallback((id) => {
    const room = rooms.find((r) => r.id === id)
    const lines = room?.tab || []
    if (lines.length) {
      const ts = Date.now()
      setMovements((m) => [...m, ...lines.map((l, i) => ({ id: ts + i, branch: room.branch, ts, room: id, concept: `Room Service: ${l.name} ×${l.qty}`, amount: l.qty * l.price, kind: 'consumo' }))])
    }
    patchRoom(id, { status: 'limpieza', endsAt: undefined, tab: [], cleaning: { started: false, checks: {} } })
  }, [rooms, patchRoom])

  const value = useMemo(() => ({
    requests, addRequest, findRequest, setRequestStatus, lastFolio,
    rooms, patchRoom, checkIn, checkOut, addExtraHour, addToTab, changeQty, removeFromTab, settleAndCheckOut,
    movements, setMovements, shift, setShift,
    branch, setBranch, branchObj,
    conBranch, setConBranch, conLabel, vRooms, vRequests, vMovements,
  }), [requests, rooms, movements, shift, setShift, lastFolio, branch, setBranch, branchObj, conBranch, conLabel, vRooms, vRequests, vMovements, addRequest, findRequest, setRequestStatus, patchRoom, checkIn, checkOut, addExtraHour, addToTab, changeQty, removeFromTab, settleAndCheckOut])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}