import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { CalendarHeart, Menu, X, MapPin, Phone, MessageCircle, ShieldAlert } from 'lucide-react'
import { Logo, DemoBadge } from './ui'
import { useStore } from '../lib/store'
import RomanceBot from './RomanceBot'
import { useRevealObserver, useScrollFx } from '../lib/utils'

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/habitaciones', label: 'Habitaciones' },
  { to: '/extras', label: 'Room Service' },
  { to: '/rastreo', label: 'Rastrear solicitud' },
]

export default function PublicLayout() {
  const [open, setOpen] = useState(false)
  const { branchObj, setBranch } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const loc = useLocation()
  useRevealObserver()
  useScrollFx()
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [loc.pathname])
  useEffect(() => { const f = () => setScrolled(scrollY > 10); f(); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f) }, [])

  return (
    <div className="min-h-screen bg-cream"><div className="scroll-bar" aria-hidden="true" />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-wine focus:px-4 focus:py-2 focus:text-ivory">Saltar al contenido</a>
      <header className={`sticky top-0 z-50 border-b transition-all duration-500 ${scrolled ? 'border-gold/40 bg-cream/95 shadow-soft backdrop-blur' : 'border-gold/30 bg-cream'}`}>
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-8">
          <Logo className={`transition-all duration-500 ${scrolled ? 'h-12' : 'h-14'}`} />
          <nav className="hidden items-center gap-6 md:flex lg:gap-9" aria-label="Principal">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end}
                className={({ isActive }) => `relative py-2 text-[15px] font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-wine after:transition-transform after:duration-300 ${isActive ? 'text-wine after:scale-x-100' : 'text-ink after:scale-x-0 hover:text-wine hover:after:scale-x-100'}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {branchObj && <Link to="/habitaciones" onClick={() => setBranch(null)} title="Cambiar sucursal" className="inline-flex min-h-[44px] max-w-[130px] items-center gap-1.5 rounded-full border border-gold/60 bg-ivory px-3 text-sm font-semibold text-wine"><MapPin size={16} className="shrink-0" /><span className="truncate">{branchObj.short}</span></Link>}<Link to="/reservar" className="btn btn-wine hidden sm:inline-flex"><CalendarHeart size={18} />Reservar</Link>
            <button className="grid h-12 w-12 place-items-center rounded-full text-wine md:hidden" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} onClick={() => setOpen(!open)}>
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <div className={`grid overflow-hidden border-t border-gold/30 bg-cream transition-all duration-500 md:hidden ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] border-transparent'}`}>
          <div className="min-h-0">
            <div className="flex flex-col gap-1 px-4 py-4">
              {links.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `rounded-xl px-4 py-3 text-lg ${isActive ? 'bg-wine/10 text-wine' : 'text-ink'}`}>{l.label}</NavLink>)}
              <Link to="/reservar" className="btn btn-wine mt-2"><CalendarHeart size={18} />Reservar</Link>
            </div>
          </div>
        </div>
      </header>

      <main id="main"><Outlet /></main>

      {/* Barra fija móvil */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/40 bg-cream/95 p-3 backdrop-blur sm:hidden">
        <Link to="/reservar" className="btn btn-wine w-full"><CalendarHeart size={18} />Reservar ahora</Link>
      </div>

      <RomanceBot />

      <footer className="bg-night pb-24 pt-14 text-ivory/80 sm:pb-10">
        <div data-reveal="" className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-8 md:grid-cols-[1.2fr_1.2fr_1fr]">
          <div>
            <Logo chip className="h-16" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/60">{`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Discreción y confort para tus momentos más importantes.`}</p>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-gold" />Av. Principal #123, Tehuacán, Pue. <DemoBadge dark className="ml-1 self-center" /></li>
            <li className="flex gap-3"><Phone size={18} className="shrink-0 text-gold" />238 123 4567</li>
            <li className="flex gap-3"><MessageCircle size={18} className="shrink-0 text-gold" />Contáctanos por WhatsApp</li>
            <li className="flex gap-3 pt-2"><Link to="/consola" className="text-ivory/50 underline-offset-4 hover:text-ivory hover:underline">Acceso del personal</Link></li>
          </ul>
          <div className="rounded-2xl border border-ivory/15 p-5">
            <p className="flex items-center gap-2 font-semibold text-ivory"><ShieldAlert size={18} className="text-gold" />Solo mayores de 18 años</p>
            <p className="mt-2 text-sm leading-relaxed text-ivory/60">Este sitio es exclusivo para personas adultas. No solicitamos datos personales: basta un alias. El pago se realiza en efectivo en sucursal.</p>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-2 border-t border-ivory/10 px-4 pt-6 text-xs text-ivory/50 sm:flex-row sm:justify-between sm:px-8">
          <p>© 2026 Motel Romance. Todos los derechos reservados.</p>
          <p>Aviso de privacidad · Términos y condiciones · Sitio de demostración</p>
        </div>
      </footer>
    </div>
  )
}


