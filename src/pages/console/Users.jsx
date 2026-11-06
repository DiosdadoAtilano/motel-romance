import { useState } from 'react'
import { useAuth } from '../../lib/auth'
import { ROLES, PERMISSIONS } from '../../data/roles'
import { BRANCHES } from '../../data/mock'
import { Badge } from './shared'

const blank = () => ({ id: 'u' + Date.now(), name: '', email: '', password: 'demo1234', role: 'recepcion', perms: ROLES.recepcion.perms, branches: ['s1'], active: true })
const field = 'min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30 disabled:bg-slate-50 disabled:text-slate-500'
const th = 'px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-500'

export default function Users() {
  const { user, users, saveUser } = useAuth()
  const [edit, setEdit] = useState(null)
  const [err, setErr] = useState('')
  const isSuper = user.role === 'super'
  const self = edit && edit.id === user.id

  const open = (u) => { setErr(''); setEdit(u ? { ...u } : blank()) }
  const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])
  const submit = (e) => {
    e.preventDefault()
    if (!edit.name.trim() || !edit.email.trim()) return setErr('Nombre y correo son obligatorios.')
    const msg = saveUser(edit)
    msg ? setErr(msg) : setEdit(null)
  }
  const canEditRow = (u) => isSuper || u.role !== 'super'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-2xl font-semibold tracking-tight text-slate-900">Usuarios y permisos</h1><p className="mt-1 text-sm text-slate-500">Crea cuentas, asigna roles y ajusta permisos de cada persona.</p></div>
        <button onClick={() => open(null)} className="cbtn bg-rose-700 text-white hover:bg-rose-800">Nuevo usuario</button>
      </div>

      <div className={`grid gap-6 ${edit ? 'xl:grid-cols-[1fr_420px]' : ''}`}>
        <section className="cpanel overflow-hidden"><div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50"><tr><th className={th}>Usuario</th><th className={th}>Rol</th><th className={th}>Sucursales</th><th className={th}>Estado</th><th className={`${th} text-right`}>Acción</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="transition-colors duration-200 hover:bg-slate-50">
                  <td className="px-6 py-4"><p className="font-medium text-slate-900">{u.name}</p><p className="text-slate-500">{u.email}</p></td>
                  <td className="px-6 py-4"><Badge className={ROLES[u.role].badge}>{ROLES[u.role].label}</Badge></td>
                  <td className="px-6 py-4 text-slate-600">{u.branches.map((b) => BRANCHES.find((x) => x.id === b)?.short || b).join(', ')}</td>
                  <td className="px-6 py-4"><Badge className={u.active ? 'border border-green-200 bg-green-50 text-green-700' : 'border border-slate-200 bg-slate-50 text-slate-600'}>{u.active ? 'Activo' : 'Inactivo'}</Badge></td>
                  <td className="px-6 py-4 text-right"><button disabled={!canEditRow(u)} onClick={() => open(u)} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-40 disabled:pointer-events-none">Editar</button></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </section>

        {edit && (
          <form onSubmit={submit} className="cpanel h-fit space-y-5 p-6 xl:sticky xl:top-24" noValidate>
            <h2 className="text-base font-semibold text-slate-900">{users.some((u) => u.id === edit.id) ? 'Editar usuario' : 'Nuevo usuario'}</h2>
            {err && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
            <div><label htmlFor="un" className="mb-1.5 block text-sm font-medium text-slate-700">Nombre</label><input id="un" className={field} value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></div>
            <div><label htmlFor="ue" className="mb-1.5 block text-sm font-medium text-slate-700">Correo</label><input id="ue" type="email" className={field} value={edit.email} onChange={(e) => setEdit({ ...edit, email: e.target.value })} /></div>
            <div><label htmlFor="up" className="mb-1.5 block text-sm font-medium text-slate-700">Contraseña (demo)</label><input id="up" className={field} value={edit.password} onChange={(e) => setEdit({ ...edit, password: e.target.value })} /></div>
            <div><label htmlFor="ur" className="mb-1.5 block text-sm font-medium text-slate-700">Rol</label>
              <select id="ur" disabled={self} className={field} value={edit.role} onChange={(e) => setEdit({ ...edit, role: e.target.value, perms: ROLES[e.target.value].perms })}>
                {Object.entries(ROLES).filter(([k]) => isSuper || k !== 'super').map(([k, r]) => <option key={k} value={k}>{r.label}</option>)}
              </select>
              <p className="mt-1 text-xs text-slate-500">Al cambiar el rol se cargan sus permisos por defecto.</p></div>
            <fieldset><legend className="mb-2 text-sm font-medium text-slate-700">Sucursales</legend>
              <div className="flex flex-wrap gap-2">{BRANCHES.map((b) => <label key={b.id} className={`flex min-h-[40px] cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm transition-colors duration-200 ${edit.branches.includes(b.id) ? 'border-rose-600 bg-rose-50 text-rose-800' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'}`}><input type="checkbox" className="accent-rose-700" checked={edit.branches.includes(b.id)} onChange={() => setEdit({ ...edit, branches: toggle(edit.branches, b.id) })} />{b.short}</label>)}</div></fieldset>
            <fieldset><legend className="mb-2 text-sm font-medium text-slate-700">Permisos</legend>
              <div className="space-y-4">{PERMISSIONS.map((g) => (
                <div key={g.group}><p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">{g.group}</p>
                  {g.items.map(([k, l]) => {
                    const locked = edit.role === 'super' || self || (k === 'users' && !isSuper)
                    return <label key={k} className={`flex min-h-[40px] items-center gap-3 rounded-lg px-2 text-sm text-slate-700 transition-colors duration-200 ${locked ? 'opacity-60' : 'cursor-pointer hover:bg-slate-50'}`}><input type="checkbox" className="accent-rose-700" disabled={locked} checked={edit.role === 'super' || edit.perms.includes(k)} onChange={() => setEdit({ ...edit, perms: toggle(edit.perms, k) })} />{l}</label>
                  })}</div>
              ))}</div></fieldset>
            <label className="flex items-center gap-3 text-sm text-slate-700"><input type="checkbox" className="accent-rose-700" disabled={self} checked={edit.active} onChange={() => setEdit({ ...edit, active: !edit.active })} />Cuenta activa</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setEdit(null)} className="cbtn">Cancelar</button>
              <button type="submit" className="cbtn bg-rose-700 text-white hover:bg-rose-800">Guardar</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
