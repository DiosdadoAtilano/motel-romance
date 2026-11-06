/* Catálogo de permisos, agrupados para la matriz de casillas */
export const PERMISSIONS = [
  { group: 'Operación', items: [
    ['dashboard', 'Ver panel'],
    ['rooms', 'Ver cuartos y solicitudes'],
    ['checkin', 'Registrar entradas y salidas'],
    ['extend', 'Extender tiempo'],
    ['roomservice', 'Room Service'],
    ['requests', 'Aprobar o rechazar solicitudes'],
    ['cleaning', 'Limpieza'],
    ['maintenance', 'Liberar mantenimiento'],
  ] },
  { group: 'Caja', items: [['cash', 'Corte de caja']] },
  { group: 'Administración', items: [
    ['consolidated', 'Ver consolidado de sucursales'],
    ['users', 'Gestionar usuarios'],
  ] },
]
export const PERM_LABEL = Object.fromEntries(PERMISSIONS.flatMap((g) => g.items))
export const ALL_PERMS = Object.keys(PERM_LABEL)

export const ROLES = {
  super: { label: 'Superusuario', badge: 'bg-rose-50 text-rose-700 border border-rose-200', perms: ALL_PERMS },
  gerente: { label: 'Gerente', badge: 'bg-blue-50 text-blue-700 border border-blue-200', perms: ALL_PERMS.filter((p) => p !== 'users').concat('users') },
  recepcion: { label: 'Recepción', badge: 'bg-green-50 text-green-700 border border-green-200', perms: ['dashboard', 'rooms', 'checkin', 'extend', 'roomservice', 'requests', 'cash'] },
  limpieza: { label: 'Limpieza / Mantenimiento', badge: 'bg-yellow-50 text-yellow-700 border border-yellow-200', perms: ['dashboard', 'cleaning', 'maintenance'] },
}

/* Usuarios de demostración (contraseñas de ejemplo, sin valor real) */
export const SEED_USERS = [
  { id: 'u1', name: 'Ana Superusuario', email: 'super@romance.demo', password: 'demo1234', role: 'super', perms: ROLES.super.perms, branches: ['s1', 's2', 's3'], active: true },
  { id: 'u2', name: 'Gabriel Gerente', email: 'gerente@romance.demo', password: 'demo1234', role: 'gerente', perms: ROLES.gerente.perms, branches: ['s1', 's2', 's3'], active: true },
  { id: 'u3', name: 'Rosa Recepción', email: 'recepcion@romance.demo', password: 'demo1234', role: 'recepcion', perms: ROLES.recepcion.perms, branches: ['s1'], active: true },
  { id: 'u4', name: 'Marta Mucama', email: 'limpieza@romance.demo', password: 'demo1234', role: 'limpieza', perms: ROLES.limpieza.perms, branches: ['s1'], active: true },
]
