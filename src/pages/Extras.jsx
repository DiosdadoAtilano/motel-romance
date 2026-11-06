import { useRef, useState } from 'react'
import { Phone, Wine, Martini, Beer, CupSoda, Coffee, Cookie, Popcorn, Sandwich, Candy, Droplets, Flame, Flower2, Moon, Feather, Gift, Shield, Sparkles, Lock } from 'lucide-react'
import { Reveal, SectionTitle, DemoBadge } from '../components/ui'
import { PRODUCT_TABS, PRODUCTS, money } from '../data/mock'

const ICONS = { Wine, Martini, Beer, CupSoda, Coffee, Cookie, Popcorn, Sandwich, Candy, Droplets, Flame, Flower2, Moon, Feather, Gift, Shield, Sparkles }

/* Placeholder estilizado: sin fotos, solo color, patrón e ícono */
function Tile({ icon, discreet }) {
  const I = ICONS[icon] || Sparkles
  return (
    <div className={`relative grid aspect-[4/3] place-items-center overflow-hidden ${discreet ? 'bg-gradient-to-br from-night via-wine-950 to-wine-900' : 'bg-gradient-to-br from-wine-700 via-wine to-wine-950'}`} role="img" aria-label="Imagen de ejemplo">
      <span className="absolute inset-0 opacity-[.12]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #D9C08C 1px, transparent 0)', backgroundSize: '18px 18px' }} />
      <span className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-gold/30" />
      <span className="absolute -bottom-10 -left-6 h-28 w-28 rounded-full border border-gold/20" />
      <span className="relative grid h-20 w-20 place-items-center rounded-full border border-gold/70 bg-black/15 text-gold-soft transition duration-700 group-hover:scale-110"><I size={34} strokeWidth={1.3} /></span>
      <DemoBadge className="absolute right-3 top-3 bg-ivory/90" />
    </div>
  )
}

function ProductCard({ p, i, discreet }) {
  return (
    <Reveal as="article" delay={(i % 4) * 90} className="card group overflow-hidden">
      <Tile icon={p.icon} discreet={discreet} />
      <div className="p-5">
        <h4 className="font-display text-2xl font-semibold leading-tight text-wine">{p.name}</h4>
        <p className="mt-1 text-[15px] leading-snug text-ink-soft">{p.desc}</p>
        <p className="mt-4 border-t border-gold/30 pt-3 font-display text-2xl font-semibold text-wine">{money(p.price)}</p>
      </div>
    </Reveal>
  )
}

export default function Extras() {
  const [tab, setTab] = useState('bebidas')
  const refs = useRef({})
  const onKey = (e) => {
    const i = PRODUCT_TABS.findIndex((t) => t.key === tab)
    const n = e.key === 'ArrowRight' ? (i + 1) % PRODUCT_TABS.length : e.key === 'ArrowLeft' ? (i - 1 + PRODUCT_TABS.length) % PRODUCT_TABS.length : null
    if (n === null) return
    e.preventDefault(); setTab(PRODUCT_TABS[n].key); refs.current[PRODUCT_TABS[n].key]?.focus()
  }
  const discreet = tab === 'sexshop'
  const items = PRODUCTS.filter((p) => p.tab === tab)
  const groups = [...new Set(items.map((p) => p.group))]
  let n = 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20">
      <SectionTitle eyebrow="Room Service & Extras" title="Nuestro menú" sub="Un catálogo informativo para que sepas qué puedes pedir durante tu estancia." />

      <Reveal className="mx-auto mt-10 max-w-3xl">
        <div role="note" className="flex items-start gap-4 rounded-2xl border-2 border-gold bg-wine p-5 text-ivory shadow-soft sm:items-center">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold text-gold"><Phone /></span>
          <p className="text-[17px] leading-snug"><strong className="font-display text-2xl font-semibold">Disfruta de nuestro menú.</strong><br />Todos los productos y servicios se solicitan directamente desde tu habitación marcando a Recepción.</p>
        </div>
      </Reveal>

      <div className="mt-12 flex justify-center">
        <div role="tablist" aria-label="Categorías" onKeyDown={onKey} className="inline-flex w-full max-w-xl gap-1 rounded-full border border-gold/50 bg-ivory p-1.5 shadow-card">
          {PRODUCT_TABS.map((t) => (
            <button key={t.key} ref={(el) => (refs.current[t.key] = el)} role="tab" id={`tab-${t.key}`} aria-selected={tab === t.key} aria-controls={`panel-${t.key}`} tabIndex={tab === t.key ? 0 : -1} onClick={() => setTab(t.key)}
              className={`min-h-[48px] flex-1 rounded-full px-4 text-[15px] font-semibold transition duration-300 ${tab === t.key ? (t.key === 'sexshop' ? 'bg-night text-ivory shadow-soft' : 'bg-wine text-ivory shadow-soft') : 'text-ink-soft hover:text-wine'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div key={tab} role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} tabIndex={0} className="mt-10 focus:outline-none">
        {discreet && (
          <Reveal className="mb-8 flex items-start gap-3 rounded-2xl bg-night p-5 text-ivory/85">
            <Lock size={20} className="mt-0.5 shrink-0 text-gold" />
            <p className="text-sm leading-relaxed"><strong className="text-ivory">Discreción total.</strong> Solo para mayores de 18 años. Los artículos se entregan en empaque sellado y sin etiquetas, directamente en tu habitación.</p>
          </Reveal>
        )}
        {groups.map((g) => (
          <section key={g} className="mb-12 last:mb-0">
            <div className="mb-6 flex items-center gap-4"><h3 className="font-display text-3xl font-semibold text-wine">{g}</h3><span data-line className="h-px flex-1 bg-gold/60" /></div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {items.filter((p) => p.group === g).map((p) => <ProductCard key={p.id} p={p} i={n++} discreet={discreet} />)}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-12 text-center text-sm text-ink-soft">Catálogo informativo. Precios de demostración; recepción confirma disponibilidad y precio final al solicitarlo.</p>
    </div>
  )
}