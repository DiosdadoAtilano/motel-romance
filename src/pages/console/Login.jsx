import { useState } from 'react'
import { Navigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/auth'

export default function Login() {
  const { user, login } = useAuth()
  const loc = useLocation()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  if (user) return <Navigate to={loc.state?.from || '/consola'} replace />

  const submit = (e) => { e.preventDefault(); setErr(login(email, pass) || '') }
  const field = 'min-h-[48px] w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-200 hover:bg-slate-50 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30'

  return (
    <div className="console grid min-h-screen place-items-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="brand text-4xl font-semibold text-rose-700">Motel <span className="italic">Romance</span></p>
          <p className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-500">Consola privada</p>
        </div>
        <form onSubmit={submit} className="cpanel space-y-5 p-8" noValidate>
          <div><h1 className="text-xl font-semibold text-slate-900">Iniciar sesión</h1><p className="mt-1 text-sm text-slate-500">Ingresa con tu cuenta de personal.</p></div>
          {err && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
          <div><label htmlFor="em" className="mb-1.5 block text-sm font-medium text-slate-700">Correo</label><input id="em" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@romance.demo" className={field} required /></div>
          <div><label htmlFor="pw" className="mb-1.5 block text-sm font-medium text-slate-700">Contraseña</label><input id="pw" type="password" autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} className={field} required /></div>
          <button type="submit" className="cbtn w-full bg-rose-700 text-white hover:bg-rose-800">Iniciar sesión</button>
        </form>
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500 shadow-sm">
          <p className="font-medium text-slate-700">Cuentas de demostración (contraseña: demo1234)</p>
          <ul className="mt-2 space-y-1">
            {['super', 'gerente', 'recepcion', 'limpieza'].map((r) => <li key={r}><button type="button" onClick={() => { setEmail(`${r}@romance.demo`); setPass('demo1234') }} className="rounded text-left transition-colors duration-200 hover:text-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500">{r}@romance.demo</button></li>)}
          </ul>
        </div>
        <p className="mt-4 text-center text-sm"><Link to="/" className="text-slate-500 transition-colors duration-200 hover:text-slate-900">Volver al sitio público</Link></p>
      </div>
    </div>
  )
}
