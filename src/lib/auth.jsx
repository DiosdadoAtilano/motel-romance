import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { SEED_USERS, ROLES } from '../data/roles'

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

const read = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch { return d } }
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

/* Demo: la sesión y los usuarios viven en el navegador. No es seguridad real. */
export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => read('mr_users', SEED_USERS))
  const [uid, setUid] = useState(() => read('mr_session', null))
  useEffect(() => write('mr_users', users), [users])
  useEffect(() => write('mr_session', uid), [uid])

  const user = useMemo(() => users.find((u) => u.id === uid && u.active) || null, [users, uid])

  const login = useCallback((email, password) => {
    const u = users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password)
    if (!u) return 'Correo o contraseña incorrectos.'
    if (!u.active) return 'Esta cuenta está desactivada. Habla con tu gerente.'
    setUid(u.id); return null
  }, [users])
  const logout = useCallback(() => setUid(null), [])
  const can = useCallback((p) => !!user && (user.role === 'super' || user.perms.includes(p)), [user])

  const superCount = (list) => list.filter((u) => u.role === 'super' && u.active).length
  /* Devuelve un mensaje de error o null si se guardó */
  const saveUser = useCallback((data) => {
    if (!user) return 'Sin sesión.'
    const prev = users.find((u) => u.id === data.id)
    if (user.role !== 'super') {
      if (data.role === 'super' || prev?.role === 'super') return 'Solo un superusuario puede gestionar superusuarios.'
      if (data.perms.includes('users') && !prev?.perms.includes('users')) return 'Solo un superusuario puede dar el permiso “Gestionar usuarios”.'
    }
    if (prev && prev.id === user.id && (data.role !== prev.role || !data.active)) return 'No puedes cambiar tu propio rol ni desactivarte.'
    if (users.some((u) => u.id !== data.id && u.email.toLowerCase() === data.email.toLowerCase())) return 'Ya existe un usuario con ese correo.'
    const next = prev ? users.map((u) => (u.id === data.id ? data : u)) : [...users, data]
    if (superCount(next) < 1) return 'Debe quedar al menos un superusuario activo.'
    setUsers(next); return null
  }, [user, users])

  const value = useMemo(() => ({ user, users, login, logout, can, saveUser, roleLabel: user ? ROLES[user.role].label : '' }), [user, users, login, logout, can, saveUser])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
