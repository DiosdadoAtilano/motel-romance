import { Link } from 'react-router-dom'

export const Logo = ({ className = 'h-14', chip = false }) => (
  <Link to="/" aria-label="Motel Romance, inicio" className={chip ? 'inline-block rounded-xl bg-cream px-3 py-1' : 'inline-block'}>
    <img src="/img/logo.jpg" alt="Motel Romance, Rinconcito de los Enamorados" className={`${className} w-auto mix-blend-multiply`} />
  </Link>
)

export const DemoBadge = ({ className = '', dark = false }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-[2px] text-[10px] font-bold uppercase tracking-wider ${dark ? 'bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/40' : 'bg-gold/15 text-[#7a5a17] ring-1 ring-gold/50'} ${className}`}>
    Demostración
  </span>
)

export const Reveal = ({ as: Tag = 'div', kind = '', delay = 0, className = '', children, ...p }) => (
  <Tag data-reveal={kind || undefined} style={{ '--d': delay + 'ms' }} className={className} {...p}>{children}</Tag>
)

export const Flourish = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-4 text-gold ${className}`} aria-hidden="true">
    <span data-line className="h-px w-16 bg-gold sm:w-28" style={{ transformOrigin: 'right' }} />
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.700A4.500 4.500 0 0 1 20 10c0 6-8 11-8 11z" /></svg>
    <span data-line className="h-px w-16 bg-gold sm:w-28" />
  </div>
)

export const SectionTitle = ({ eyebrow, title, sub, align = 'center', light = false }) => (
  <div className={`mx-auto max-w-2xl ${align === 'center' ? 'text-center' : ''}`}>
    {eyebrow && <Reveal><p className="eyebrow mb-3">{eyebrow}</p></Reveal>}
    <Reveal delay={80}><h2 className={`text-[2.1rem] font-semibold leading-[1.1] sm:text-5xl ${light ? 'text-ivory' : 'text-wine'}`}>{title}</h2></Reveal>
    <Flourish className="mt-5" />
    {sub && <Reveal delay={160}><p className={`mt-5 text-[17px] leading-relaxed ${light ? 'text-ivory/80' : 'text-ink-soft'}`}>{sub}</p></Reveal>}
  </div>
)
