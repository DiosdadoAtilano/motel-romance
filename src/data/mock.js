export const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
export const LOREM_LONG =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

export const DURATIONS = [
  { key: 'h3', label: '3 horas', short: '3 h', hours: 3 },
  { key: 'h6', label: '6 horas', short: '6 h', hours: 6 },
  { key: 'h12', label: '12 horas', short: '12 h', hours: 12 },
]

export const THEMES = ['Clásica', 'Romántica', 'Temática', 'Pasión']
export const AMENITIES = ['Jacuzzi', 'Espejos', 'Cochera privada', 'Frigobar', 'Pantalla smart', 'Aire acondicionado']

export const ROOMS = [
  {
    slug: 'estandar', branches: ['s1', 's2', 's3'], name: 'Habitación Estándar', theme: 'Clásica', tagline: 'Confort y privacidad en un ambiente elegante.',
    img: '/img/estandar.jpg', gallery: ['/img/estandar.jpg', '/img/hero.jpg', '/img/cisnes.jpg', '/img/suite.jpg'],
    amenities: ['Cochera privada', 'Pantalla smart', 'Aire acondicionado', 'Frigobar'], prices: { h3: 280, h6: 420, h12: 650, extra: 90 }, size: '28 m²',
  },
  {
    slug: 'jacuzzi', branches: ['s1', 's2', 's3'], name: 'Habitación con Jacuzzi', theme: 'Romántica', tagline: 'Relájate y disfruta al máximo.',
    img: '/img/jacuzzi.jpg', gallery: ['/img/jacuzzi.jpg', '/img/cisnes.jpg', '/img/hero.jpg'],
    amenities: ['Jacuzzi', 'Cochera privada', 'Pantalla smart', 'Aire acondicionado', 'Frigobar'], prices: { h3: 380, h6: 560, h12: 850, extra: 120 }, size: '34 m²',
  },
  {
    slug: 'suite-romance', branches: ['s1', 's3'], name: 'Suite Romance', theme: 'Romántica', tagline: 'Lujo y detalles que enamoran.',
    img: '/img/suite.jpg', gallery: ['/img/suite.jpg', '/img/cisnes.jpg', '/img/estandar.jpg'],
    amenities: ['Jacuzzi', 'Espejos', 'Cochera privada', 'Frigobar', 'Pantalla smart', 'Aire acondicionado'], prices: { h3: 450, h6: 680, h12: 1000, extra: 140 }, size: '42 m²',
  },
  {
    slug: 'egipto', branches: ['s1', 's2'], name: 'Habitación Egipto', theme: 'Temática', tagline: 'Un viaje de otro tiempo, solo para dos.',
    img: '/img/egipto.png', gallery: ['/img/egipto.png', '/img/caballo.jpg', '/img/estandar.jpg'],
    amenities: ['Espejos', 'Cochera privada', 'Aire acondicionado', 'Frigobar'], prices: { h3: 420, h6: 620, h12: 920, extra: 130 }, size: '36 m²',
  },
  {
    slug: 'pasion', branches: ['s1', 's3'], name: 'Habitación Pasión', theme: 'Pasión', tagline: 'Luz carmesí y espacio para dejarse llevar.',
    img: '/img/neon.jpg', gallery: ['/img/neon.jpg', '/img/rojo.jpg', '/img/suite.jpg'],
    amenities: ['Espejos', 'Cochera privada', 'Pantalla smart', 'Aire acondicionado'], prices: { h3: 350, h6: 520, h12: 780, extra: 110 }, size: '32 m²',
  },
  {
    slug: 'espejos', branches: ['s1', 's2', 's3'], name: 'Habitación Espejos', theme: 'Pasión', tagline: 'Juegos de luz y reflejos en tonos rojos.',
    img: '/img/rojo.jpg', gallery: ['/img/rojo.jpg', '/img/neon.jpg', '/img/estandar.jpg'],
    amenities: ['Espejos', 'Cochera privada', 'Aire acondicionado', 'Pantalla smart'], prices: { h3: 330, h6: 490, h12: 740, extra: 100 }, size: '30 m²',
  },
]

export const money = (n) => '$' + n.toLocaleString('es-MX') + ' MXN'
export const roomBySlug = (s) => ROOMS.find((r) => r.slug === s)

const now = Date.now()
const min = (m) => now + m * 60000

export const STATUS_REQ = {
  recibida: { label: 'Recibida', hint: 'Solicitud recibida; sujeta a confirmación por recepción' },
  revision: { label: 'En revisión', hint: 'Recepción está revisando tu solicitud' },
  confirmada: { label: 'Confirmada', hint: 'Recepción confirmó tu solicitud' },
  no_disponible: { label: 'No disponible', hint: 'No fue posible atender esa fecha u hora' },
}

export const SEED_REQUESTS = [
  { folio: 'MR-4821', branch: 's1', alias: 'Luna', phone: '238 555 0101', room: 'jacuzzi', date: '2026-11-06', eta: '21:30', duration: 'h6', status: 'recibida', createdAt: min(-6) },
  { folio: 'MR-4822', branch: 's1', alias: 'Gato', phone: '238 555 0102', room: 'suite-romance', date: '2026-11-06', eta: '22:00', duration: 'h12', status: 'revision', createdAt: min(-22) },
  { folio: 'MR-4823', branch: 's3', alias: 'Rosa', phone: '238 555 0103', room: 'estandar', date: '2026-11-05', eta: '19:45', duration: 'h3', status: 'confirmada', createdAt: min(-55) },
  { folio: 'MR-4824', branch: 's1', alias: 'Sol', phone: '238 555 0104', room: 'egipto', date: '2026-11-05', eta: '20:15', duration: 'h3', status: 'no_disponible', createdAt: min(-80) },
  { folio: 'MR-4825', branch: 's3', alias: 'Cielo', phone: '238 555 0105', room: 'pasion', date: '2026-11-06', eta: '23:10', duration: 'h6', status: 'recibida', createdAt: min(-2) },
  { folio: 'MR-4826', branch: 's2', alias: 'Norte', phone: '238 555 0106', room: 'espejos', date: '2026-11-06', eta: '20:00', duration: 'h3', status: 'recibida', createdAt: min(-11) },
  { folio: 'MR-4827', branch: 's2', alias: 'Brisa', phone: '238 555 0107', room: 'jacuzzi', date: '2026-11-06', eta: '22:40', duration: 'h6', status: 'recibida', createdAt: min(-4) },
  { folio: 'MR-4828', branch: 's3', alias: 'Mar', phone: '238 555 0108', room: 'suite-romance', date: '2026-11-06', eta: '21:00', duration: 'h12', status: 'revision', createdAt: min(-30) },
]

/* Habitaciones de la consola (estado interno) */
export const SEED_CON_ROOMS = [
  { id: '101', branch: 's1', type: 'estandar', status: 'ocupada', endsAt: min(48), duration: 'h3', vehicle: 'Auto', plate: 'LRM-12-34' },
  { id: '102', branch: 's1', type: 'estandar', status: 'disponible' },
  { id: '103', branch: 's1', tab: [{ id: 't1', productId: 'b1', name: 'Vino tinto de la casa', qty: 1, price: 180 }, { id: 't2', productId: 'b6', name: 'Tabla de quesos y frutas', qty: 1, price: 210 }], type: 'jacuzzi', status: 'ocupada', endsAt: min(12), duration: 'h6', vehicle: 'Auto', plate: 'PBL-88-21' },
  { id: '104', branch: 's1', type: 'jacuzzi', status: 'limpieza' },
  { id: '105', branch: 's1', type: 'suite-romance', status: 'ocupada', endsAt: min(190), duration: 'h12', vehicle: 'Moto', plate: 'MX-4412' },
  { id: '106', branch: 's1', type: 'suite-romance', status: 'disponible' },
  { id: '107', branch: 's1', type: 'egipto', status: 'mantenimiento', note: 'Fuga en llave del lavabo' },
  { id: '108', branch: 's1', type: 'egipto', status: 'ocupada', endsAt: min(-4), duration: 'h3', vehicle: 'Auto', plate: 'TZC-55-09' },
  { id: '109', branch: 's1', type: 'pasion', status: 'disponible' },
  { id: '110', branch: 's1', type: 'pasion', status: 'limpieza' },
  { id: '111', branch: 's1', type: 'espejos', status: 'disponible' },
  { id: '112', branch: 's1', type: 'espejos', status: 'ocupada', endsAt: min(95), duration: 'h6', vehicle: 'Sin vehículo' },
]

export const SEED_MOVEMENTS = [
  { id: 1, branch: 's1', ts: min(-300), room: '101', concept: 'Estancia 3 h', amount: 280, kind: 'estancia' },
  { id: 2, branch: 's1', ts: min(-270), room: '104', concept: 'Estancia 6 h', amount: 560, kind: 'estancia' },
  { id: 3, branch: 's1', ts: min(-240), room: '110', concept: 'Estancia 3 h', amount: 350, kind: 'estancia' },
  { id: 4, branch: 's1', ts: min(-200), room: '104', concept: 'Hora extra ×1', amount: 120, kind: 'extra' },
  { id: 5, branch: 's1', ts: min(-160), room: '105', concept: 'Estancia 12 h', amount: 1000, kind: 'estancia' },
  { id: 6, branch: 's1', ts: min(-120), room: '108', concept: 'Estancia 3 h', amount: 420, kind: 'estancia' },
  { id: 7, branch: 's1', ts: min(-90), room: '103', concept: 'Estancia 6 h', amount: 560, kind: 'estancia' },
  { id: 8, branch: 's1', ts: min(-60), room: '112', concept: 'Estancia 6 h', amount: 490, kind: 'estancia' },
  { id: 9, branch: 's1', ts: min(-40), room: '110', concept: 'Consumo: bebidas', amount: 150, kind: 'consumo' },
]

export const CLEAN_TASKS = ['Cambiar sábanas y fundas', 'Tender cama y colocar detalles', 'Trapear piso y aspirar', 'Limpiar baño y regadera', 'Limpiar y desinfectar jacuzzi / tina', 'Reponer amenidades y toallas', 'Revisar frigobar y control remoto', 'Sacar basura y ventilar']

export const BRANCHES = [
  { id: 's1', lat: 18.401944, lng: -97.329528, mapsUrl: 'https://maps.app.goo.gl/iRogRedSY1GwuLPe9', name: 'Sucursal 1 · Centro', short: 'Centro', address: 'Av. Principal #123, Centro, Tehuacán, Pue.', phone: '238 123 4567', hours: 'Atención 24 horas', img: '/img/fachada.jpg', blurb: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { id: 's2', lat: 18.4869436, lng: -97.3845499, mapsUrl: 'https://maps.app.goo.gl/y18GeHcUjKGYdTg68', name: 'Sucursal 2 · Norte', short: 'Norte', address: 'Blvd. Norte #456, Col. Lorem, Tehuacán, Pue.', phone: '238 123 4568', hours: 'Atención 24 horas', img: '/img/hero.jpg', blurb: 'Sed do eiusmod tempor incididunt ut labore et dolore.' },
  { id: 's3', lat: 18.4768712, lng: -97.4089833, mapsUrl: 'https://maps.app.goo.gl/tXapfNxzAta1xT9N6', name: 'Sucursal 3 · Sur', short: 'Sur', address: 'Carr. Sur km 3, Col. Ipsum, Tehuacán, Pue.', phone: '238 123 4569', hours: 'Atención 24 horas', img: '/img/suite.jpg', blurb: 'Ut enim ad minim veniam, quis nostrud exercitation.' },
]
export const branchById = (id) => BRANCHES.find((b) => b.id === id) || BRANCHES[0]

SEED_CON_ROOMS.push(
  { id: '201', branch: 's2', type: 'estandar', status: 'ocupada', endsAt: min(75), duration: 'h3', vehicle: 'Auto', plate: 'PBL-20-11' },
  { id: '202', branch: 's2', type: 'estandar', status: 'disponible' },
  { id: '203', branch: 's2', type: 'jacuzzi', status: 'ocupada', endsAt: min(8), duration: 'h6', vehicle: 'Auto', plate: 'PBL-31-77' },
  { id: '204', branch: 's2', type: 'jacuzzi', status: 'disponible' },
  { id: '205', branch: 's2', type: 'egipto', status: 'limpieza' },
  { id: '206', branch: 's2', type: 'egipto', status: 'disponible' },
  { id: '207', branch: 's2', type: 'espejos', status: 'mantenimiento', note: 'Foco de espejo fundido' },
  { id: '208', branch: 's2', type: 'espejos', status: 'ocupada', endsAt: min(160), duration: 'h12', vehicle: 'Moto', plate: 'MX-9087' },
  { id: '301', branch: 's3', type: 'estandar', status: 'disponible' },
  { id: '302', branch: 's3', tab: [{ id: 't3', productId: 'b3', name: 'Cerveza nacional', qty: 2, price: 55 }], type: 'jacuzzi', status: 'ocupada', endsAt: min(33), duration: 'h3', vehicle: 'Auto', plate: 'TZC-14-62' },
  { id: '303', branch: 's3', type: 'suite-romance', status: 'ocupada', endsAt: min(-9), duration: 'h6', vehicle: 'Auto', plate: 'LRM-70-05' },
  { id: '304', branch: 's3', type: 'suite-romance', status: 'limpieza' },
  { id: '305', branch: 's3', type: 'pasion', status: 'disponible' },
  { id: '306', branch: 's3', type: 'espejos', status: 'limpieza' },
)
SEED_MOVEMENTS.push(
  { id: 101, branch: 's2', ts: min(-210), room: '201', concept: 'Estancia 3 h', amount: 280, kind: 'estancia' },
  { id: 102, branch: 's2', ts: min(-150), room: '203', concept: 'Estancia 6 h', amount: 560, kind: 'estancia' },
  { id: 103, branch: 's2', ts: min(-100), room: '208', concept: 'Estancia 12 h', amount: 740, kind: 'estancia' },
  { id: 104, branch: 's2', ts: min(-35), room: '205', concept: 'Consumo: bebidas', amount: 90, kind: 'consumo' },
  { id: 201, branch: 's3', ts: min(-260), room: '302', concept: 'Estancia 3 h', amount: 380, kind: 'estancia' },
  { id: 202, branch: 's3', ts: min(-190), room: '303', concept: 'Estancia 6 h', amount: 680, kind: 'estancia' },
  { id: 203, branch: 's3', ts: min(-70), room: '303', concept: 'Hora extra ×1', amount: 140, kind: 'extra' },
  { id: 204, branch: 's3', ts: min(-20), room: '304', concept: 'Consumo: snacks', amount: 120, kind: 'consumo' },
)
/* Room Service & Extras (catálogo informativo, sin carrito) */
export const PRODUCT_TABS = [
  { key: 'bebidas', label: 'Bebidas y Botanas' },
  { key: 'sexshop', label: 'Sex Shop' },
]
export const PRODUCTS = [
  { id: 'b1', tab: 'bebidas', group: 'Bebidas', icon: 'Wine', name: 'Vino tinto de la casa', desc: 'Copa o botella, servido a temperatura ideal.', price: 180 },
  { id: 'b2', tab: 'bebidas', group: 'Bebidas', icon: 'Martini', name: 'Coctel clásico', desc: 'Preparado al momento con licor de tu elección.', price: 120 },
  { id: 'b3', tab: 'bebidas', group: 'Bebidas', icon: 'Beer', name: 'Cerveza nacional', desc: 'Botella bien fría, clara u oscura.', price: 55 },
  { id: 'b4', tab: 'bebidas', group: 'Bebidas', icon: 'CupSoda', name: 'Refresco o agua mineral', desc: 'Variedad de sabores, con hielo.', price: 35 },
  { id: 'b5', tab: 'bebidas', group: 'Bebidas', icon: 'Coffee', name: 'Café o té caliente', desc: 'Para cerrar la noche con calma.', price: 40 },
  { id: 'b6', tab: 'bebidas', group: 'Botanas', icon: 'Cookie', name: 'Tabla de quesos y frutas', desc: 'Selección ligera para compartir.', price: 210 },
  { id: 'b7', tab: 'bebidas', group: 'Botanas', icon: 'Popcorn', name: 'Palomitas y botana mixta', desc: 'Lorem ipsum dolor sit amet, consectetur.', price: 70 },
  { id: 'b8', tab: 'bebidas', group: 'Botanas', icon: 'Sandwich', name: 'Sándwich de la casa', desc: 'Pan artesanal con ingredientes frescos.', price: 95 },
  { id: 'b9', tab: 'bebidas', group: 'Botanas', icon: 'Candy', name: 'Fresas con chocolate', desc: 'Un detalle dulce para la ocasión.', price: 130 },
  { id: 's1', tab: 'sexshop', group: 'Aromas y masaje', icon: 'Droplets', name: 'Aceite de masaje aromático', desc: 'Fragancia suave de vainilla y ámbar.', price: 160 },
  { id: 's2', tab: 'sexshop', group: 'Aromas y masaje', icon: 'Flame', name: 'Velas de masaje', desc: 'Cera tibia con aroma relajante.', price: 190 },
  { id: 's3', tab: 'sexshop', group: 'Aromas y masaje', icon: 'Flower2', name: 'Perfume de ambiente', desc: 'Notas florales para tu habitación.', price: 120 },
  { id: 's4', tab: 'sexshop', group: 'Accesorios', icon: 'Moon', name: 'Antifaz de satén', desc: 'Suave, ajustable y elegante.', price: 85 },
  { id: 's5', tab: 'sexshop', group: 'Accesorios', icon: 'Feather', name: 'Pluma decorativa', desc: 'Detalle ligero para juegos de pareja.', price: 70 },
  { id: 's6', tab: 'sexshop', group: 'Accesorios', icon: 'Gift', name: 'Kit de juegos para parejas', desc: 'Tarjetas y retos, en empaque discreto.', price: 220 },
  { id: 's7', tab: 'sexshop', group: 'Cuidado', icon: 'Shield', name: 'Protección (caja x3)', desc: 'Marcas reconocidas, entrega discreta.', price: 90 },
  { id: 's8', tab: 'sexshop', group: 'Cuidado', icon: 'Sparkles', name: 'Gel hidratante a base de agua', desc: 'Sin fragancia, dermatológicamente probado.', price: 110 },
]
export const tabTotal = (r) => (r.tab || []).reduce((a, l) => a + l.qty * l.price, 0)
