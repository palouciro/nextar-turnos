# Nextar Solutions · App de turnos

Web de turnos para servicio técnico. El cliente elige servicio, fecha y horario, y el turno te llega por **WhatsApp**.

- **Front:** React + Vite + Tailwind + TypeScript (`/client`)
- **Back:** Node + Express + TypeScript + Zod (`/server`)

## Correr en local

```bash
npm install
cp server/.env.example server/.env   # y completá WHATSAPP_DESTINO como mínimo
npm run dev
```

- Front: http://localhost:5173 · API: http://localhost:3001
- Sin credenciales de Meta, la app igual funciona: tras enviar el formulario aparece un botón **"Enviar por WhatsApp"** (link `wa.me`) con el turno ya escrito. Solo necesitás `WHATSAPP_DESTINO` (ej. `5493476123456`).

Otros comandos: `npm run typecheck`, `npm run build`, `npm start` (API compilada).

## Qué editar

| Qué | Dónde |
|---|---|
| **Colores** (paleta Nextar) | `client/tailwind.config.js` (objeto `palette`) |
| Nombre, ubicación, Instagram, servicios, horarios | `client/src/config/business.ts` |
| Los mismos servicios/horarios para validar en el server | `server/src/schedule.ts` (mantener igual) |
| Texto del mensaje de WhatsApp | `server/src/whatsappTemplate.ts` |
| Imágenes | `client/public/img/` (ver `LEEME.txt`) |

Logo: ahora es una versión dibujada en SVG. Para usar el tuyo, ponelo en `client/public/img/logo.png` y en `business.ts` cambiá `logoSrc: '/img/logo.png'`.

Domingos no se atiende (no se pueden elegir). Los horarios salen de tu historia de Instagram: lun–vie 8:30–12:30 y 16:30–19:15, sábados 9:00–12:30. Corregilos si cambian.

## WhatsApp Cloud API (Meta)

1. En [developers.facebook.com](https://developers.facebook.com) creá una app tipo *Business* y agregá el producto **WhatsApp**.
2. Copiá el **Phone number ID** → `WHATSAPP_PHONE_NUMBER_ID`.
3. Creá un **token permanente** (Meta Business → Usuarios del sistema) → `WHATSAPP_TOKEN`.
4. Creá y aprobá el template `nuevo_turno` (idioma `es_AR`, categoría Utilidad). El cuerpo exacto está comentado al inicio de `server/src/whatsappTemplate.ts`.
5. Poné tu número en `WHATSAPP_DESTINO`. Ojo: con la API, el negocio solo puede escribirle a un número que figure como destinatario de prueba hasta que verifiques el negocio.

Si Meta rechaza el envío (template no aprobado, token vencido, etc.), el server lo registra en el log (sin datos del cliente) y le devuelve al cliente el botón de fallback `wa.me`, así el turno no se pierde.

## Deploy (un solo servicio)

En **Render** subí este mismo repositorio como un solo **Web Service**:

- **Root directory:** `.` (raíz)
- **Build command:** `npm install && npm run build`
- **Start command:** `npm start`
- **Variables de entorno:** las de `server/.env.example` (al menos `WHATSAPP_DESTINO`; `PORT` lo define Render solo).

El server compilado sirve también el front ya construido (`client/dist`), así que con un solo servicio tenés la web + la API. Probá `https://TU-URL/api/health` y después el link del front directamente.

Alternativa en dos servicios (opcional):
- **Backend** en Render/Railway: Root directory `server` · Build `npm install && npm run build` · Start `npm start`. `CLIENT_ORIGIN` = URL de tu front.
- **Frontend** en Vercel/Netlify: Root directory `client` · Build `npm run build` · Output `dist` · `VITE_API_URL=https://TU-API` (sin `/` final).

Nota: en el plan gratuito de Render el server se duerme; el primer turno después de un rato puede tardar unos segundos.

## Estructura

```
client/   src/{components,config,lib}  public/img  tailwind.config.js
server/   src/{index,config,schema,schedule,whatsapp,whatsappTemplate}.ts  .env.example
```