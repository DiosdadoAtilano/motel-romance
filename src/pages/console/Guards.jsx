import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/auth'

export function RequireAuth() {
  const { user } = useAuth()
  const loc = useLocation()
  if (!user) return <Navigate to="/consola/login" replace state={{ from: loc.pathname }} />
  return <Outlet />
}

export function Restricted() {
  return (
    <div className="cpanel mx-auto max-w-md p-8 text-center">
      <h1 className="text-xl font-semibold text-slate-900">Acceso restringido</h1>
      <p className="mt-2 text-sm text-slate-500">Tu cuenta no tiene permiso para ver esta sección. Pídelo a tu gerente.</p>
      <Link to="/consola" className="cbtn mt-5 bg-rose-700 text-white hover:bg-rose-800">Ir al panel</Link>
    </div>
  )
}

export function RequirePermission({ perm, children }) {
  const { can } = useAuth()
  return can(perm) ? children : <Restricted />
}
