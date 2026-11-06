import { useEffect } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { ConciergeBell, Building2, LayoutDashboard, BedDouble, LogIn, Sparkles, Calculator, Globe, ShieldCheck, Users } from 'lucide-react'
import AdminHeader from '../../components/console/AdminHeader'
import { BRANCHES } from '../../data/mock'
import { useNow, useStore } from '../../lib/store'

const allNav = [
  { to: '/consola', label: 'Panel', icon: LayoutDashboard, end: true, perm: 'dashboard' },
  { to: '/consola/habitaciones', label: 'Cuartos', short: 'Cuartos', icon: BedDouble, perm: 'rooms' },
  { to: '/consola/entradas', label: 'Entradas / Salidas', short: 'Entradas', icon: LogIn, perm: 'checkin' },
  { to: '/consola/servicio', label: 'Room Service', short: 'Servicio', icon: ConciergeBell, perm: 'roomservice' },
  { to: '/consola/limpieza', label: 'Limpieza', icon: Sparkles, perm: 'cleaning' },
  { to: '/consola/caja', label: 'Corte de caja', short: 'Caja', icon: Calculator, perm: 'cash' },
  { to: '/consola/usuarios', label: 'Usuarios', short: 'Usuarios', icon: Users, perm: 'users' },
]

export default function ConsoleLayout() {
  const { can, user } = useAuth()
  const nav = allNav.filter((n) => can(n.perm))
  const now = useNow(1000)
  const { vRequests, shift, conBranch, setConBranch } = useStore()
  const pending = vRequests.filter((r) => r.status === 'recibida' || r.status === 'revision').length
  const t = new Date(now)
  useEffect(() => { if (conBranch === 'all' ? !can('consolidated') : !user.branches.includes(conBranch)) setConBranch(user.branches[0]) }, [conBranch, user, can, setConBranch])
  return (
    <div className="console min-h-screen bg-slate-50 text-slate-900 lg:grid lg:grid-cols-[256px_1fr]">
      <aside className="hidden border-r border-slate-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="border-b border-slate-200 px-6 py-5">
          <p className="brand text-3xl font-semibold leading-none text-rose-700">Motel <span className="italic">Romance</span></p>
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-500"><ShieldCheck size={14} />Consola privada</p>
        </div>
        <nav className="flex-1 space-y-1 p-4" aria-label="Consola">
          {nav.map(({ to, label, icon: I, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${isActive ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <I size={20} />{label}
              {to.endsWith('habitaciones') && pending > 0 && <span className="ml-auto rounded-full bg-rose-700 px-2 py-0.5 text-xs font-semibold text-white">{pending}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-4">
          <Link to="/" className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"><Globe size={18} />Ver sitio público</Link>
        </div>
      </aside>

      <div className="min-w-0 pb-24 lg:pb-0">
        <AdminHeader />
        <main className="p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid border-t border-slate-200 bg-white lg:hidden" aria-label="Consola móvil" style={{ gridTemplateColumns: `repeat(${nav.length}, minmax(0, 1fr))` }}>
        {nav.map(({ to, label, short, icon: I, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `relative flex min-h-[64px] flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors duration-200 ${isActive ? 'text-rose-700' : 'text-slate-500 hover:bg-slate-50'}`}>
            {({ isActive }) => (<>{isActive && <span className="absolute inset-x-3 top-0 h-0.5 rounded-b bg-rose-700" />}<I size={22} />{short || label}
              {to.endsWith('habitaciones') && pending > 0 && <span className="absolute right-3 top-2 rounded-full bg-rose-700 px-1.5 text-[10px] font-semibold text-white">{pending}</span>}</>)}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
