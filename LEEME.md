# Motel Romance · Maqueta UI (sitio público + consola privada)

Solo diseño e interactividad. **Sin backend**: todo vive en memoria del navegador y se reinicia al recargar.

## Cómo correrlo
```
npm install
npm run dev      # http://localhost:5173
npm run build    # genera /dist
```
Rutas (HashRouter, funciona abriendo en cualquier carpeta):
- Público: `#/`, `#/habitaciones`, `#/habitaciones/jacuzzi`, `#/reservar`, `#/rastreo`
- Consola: `#/consola`, `/habitaciones`, `/entradas`, `/limpieza`, `/caja`

## Dirección de arte (sacada de las referencias)
| Papel | Valor |
|---|---|
| Fondo | crema `#FBF3EA` / `#F5EADB` |
| Tarjetas | marfil `#FFFAF3` |
| Botón principal y títulos | vino `#7A1220` (hover `#4A0A13`) |
| Rojo de logo | `#D4141F` (solo errores/detalle) |
| Líneas y detalles | dorado `#B8924A` |
| Footer | azul noche `#0F1A2B` |
| Títulos | Cormorant Garamond (con cursiva de acento solo en el hero) |
| Texto | Inter |

Movimiento: titular que sube línea por línea, línea dorada que se dibuja, zoom lento en el hero, revelado suave al hacer scroll (`data-reveal`, `data-line`). Con "reducir movimiento" o sin JS todo se ve completo.

Consola: oscura y neutra a propósito (contraste con el sitio), botones de 52–72 px, estados: verde Disponible, rojo Ocupada, azul Limpieza, ámbar Mantenimiento.

## Qué está conectado entre sí (estado compartido, `src/lib/store.jsx`)
- Una solicitud enviada en `/reservar` aparece en la bandeja de la consola; al Confirmar/Rechazar allí, cambia en `/rastreo`.
- Folios de prueba: `MR-4821` (recibida), `MR-4822` (en revisión), `MR-4823` (confirmada), `MR-4824` (no disponible).
- Registrar entrada → cuarto ocupado con temporizador + movimiento en caja. Salida → Limpieza → Finalizar → Disponible.

## Reglas de negocio aplicadas
- Modo `request_only`: sin anticipos, sin disponibilidad exacta; estado inicial siempre "Solicitud recibida; sujeta a confirmación por recepción". Nunca aparece "Confirmado" al enviar.
- Calculadora con la leyenda obligatoria "El total es una estimación; recepción confirma la tarifa final".
- Insignia "Demostración" en datos de prueba.

## Por validar (decisiones mías)
1. **Imágenes**: son recortes de las maquetas de referencia y fotos reales del motel; algunas se ven suaves. Sustituir por fotos reales en `public/img/`.
2. **Precios, tarifas, horarios, dirección y teléfono**: ficticios.
3. El logo es el JPG con fondo blanco, integrado con `mix-blend-mode: multiply`. Conviene pedir SVG/PNG transparente.
4. Verbo único del botón: "Reservar". Es una solicitud, no una reserva firme; el texto de apoyo lo aclara.
5. Consola sin login (en producción debe ir tras autenticación).
6. Turno "nocturno", fondo inicial $1,500 y 12 habitaciones: supuestos.
7. Aviso +18 solo en el pie; si se requiere una verificación de entrada, se agrega aparte.

## Pendientes
- Backend, autenticación y roles, notificaciones de nuevas solicitudes.
- Política de privacidad y términos reales.
- Mapa/ubicación real y WhatsApp.
