Voy a retomar MercadoJuegos desde este handoff. Tómalo como fuente de verdad operativa para esta sesión.

# SESSION HANDOFF — MercadoJuegos

Actúa como arquitecto y desarrollador senior asistiendo en la construcción del MVP **MercadoJuegos**, un módulo embebido dentro de un sitio existente en Next.js llamado `royalfa-portfolio`.

Toma este documento como **fuente de verdad operativa para retomar la siguiente sesión**.  
No inventes avances, no reinterpretes el proyecto desde cero y no asumas trabajo no implementado.

---

## 1. Resumen del producto
- **Nombre técnico:** `mercadojuegos`
- **Propósito:** Aplicación web responsive para compra, venta e intercambio de juegos de mesa entre particulares.
- **Mercado inicial:** Ciudad de México (CDMX)
- **Evolución futura prevista:** expansión nacional e internacional

### Alcance general del MVP
- autenticación con email/contraseña
- perfil básico de usuario
- publicaciones para venta/intercambio/ambos
- estados visibles de disponibilidad
- búsqueda y filtros básicos
- wishlist
- mensajería interna
- reportes básicos

### Fuera de alcance del MVP
- pagos dentro de la plataforma
- envíos o paqueterías integradas
- verificación avanzada/KYC
- múltiples monedas o idiomas
- imágenes múltiples / storage avanzado
- app móvil nativa
- notificaciones push
- panel admin complejo

---

## 2. Stack confirmado
- **Framework:** Next.js `16.2.9` (App Router)
- **UI:** React `19.2.4`
- **Lenguaje:** TypeScript `5`
- **Estilos:** Tailwind CSS `4`
- **Backend / Auth / DB:** Supabase
  - `@supabase/supabase-js`
  - `@supabase/ssr`
- **Deploy / repositorio:** Vercel + GitHub

### Variables de entorno confirmadas
En `.env.local` ya están configuradas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Estado actual en Supabase
- proveedor **Email** activo
- opción **Confirm email** desactivada temporalmente para agilizar pruebas locales

### Restricción actual importante
- **No existe `middleware.ts` ni `proxy.ts` global en la raíz**
- **No se debe introducir middleware global en esta fase**

---

## 3. Estructura permitida del proyecto
Solo se puede trabajar dentro de estas rutas:

- `app/apps/tools/mercadojuegos/*`
- `components/mercadojuegos/*`
- `lib/mercadojuegos/*`
- `types/mercadojuegos/*`
- `docs/mercadojuegos/*`

### Ruta canónica obligatoria
La ruta correcta incluye `/tools/`:

```txt
/app/apps/tools/mercadojuegos

Antes de escribir código, dame:
1. resumen del estado actual
2. archivos que revisarías
3. archivos que crearías o modificarías
4. riesgos o validaciones previas
5. plan paso a paso

No generes código todavía.