import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { DemoBadge } from './ui'
import { money } from '../data/mock'

export default function RoomCard({ room, delay = 0 }) {
  return (
    <article data-reveal="" style={{ '--d': delay + 'ms' }} className="card group overflow-hidden">
      <Link to={`/habitaciones/${room.slug}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden"><span className="img-veil" style={{ transitionDelay: delay + "ms" }} />
          <img src={room.img} alt={`${room.name} (imagen de ejemplo)`} loading="lazy" className="zoom-in h-full w-full object-cover group-hover:scale-[1.06]" />
          <div className="absolute inset-0 bg-gradient-to-t from-wine-950/70 via-transparent to-transparent" />
          <span className="absolute left-3 top-3 rounded-full bg-ivory/90 px-3 py-1 text-xs font-semibold text-wine">{room.theme}</span>
          <DemoBadge className="absolute right-3 top-3 bg-ivory/90" />
          <span className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full border border-ivory/80 text-ivory transition group-hover:bg-ivory group-hover:text-wine"><ArrowRight size={18} /></span>
        </div>
        <div className="p-5">
          <h3 className="text-2xl font-semibold leading-tight text-wine">{room.name}</h3>
          <p className="mt-1 text-[15px] text-ink-soft">{room.tagline}</p>
          <p className="mt-4 flex items-baseline gap-1.5 border-t border-gold/30 pt-3 text-sm text-ink-soft">Desde <strong className="font-display text-2xl text-wine">{money(room.prices.h3)}</strong> · 3 h</p>
        </div>
      </Link>
    </article>
  )
}
