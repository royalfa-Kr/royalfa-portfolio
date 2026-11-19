# Royalfa & Clases 1a1 - Mapa de Arquitectura del Proyecto

## 1. Stack Tecnológico
* **Framework:** Next.js (App Router)
* **Lenguaje:** TypeScript + React
* **Estilos:** Tailwind CSS + Lucide React (Iconos)
* **Base de Datos:** Upstash Redis (API REST)
* **Despliegue:** Vercel

## 2. Estructura de Directorios Principal
* `/app`: Contiene el enrutador principal de Next.js (páginas y APIs).
* `/components`: Componentes reutilizables de UI (ej. Navbar, Footer, CurrentFocus).
* `/data`: Archivos locales estáticos `.ts` que actúan como base de datos de respaldo e información dura.
* `/public`: Assets estáticos (imágenes, logos como `LogoClases1a1big.png`).

## 3. Mapa de Rutas (App Router)

### 🌐 Rutas de Páginas Principales
* `/` : Landing page de Royalfa (Portafolio principal).
* `/clases` : Landing page de Clases 1a1. Contiene:
  * Hero section con CTA a WhatsApp.
  * Carrusel de testimonios conectado a Upstash (combinado con datos locales).
  * Panel de Próxima Sesión (`CurrentFocus` aislado para evitar errores de hidratación).

### 🧩 Hub de Aplicaciones (`/app/apps/`)
* `/apps/page.tsx`: Índice general de todas las aplicaciones.
* `/apps/educativas/`: Subdividido por materias para mejor categorización de URLs.
  * `/fisica/`
  * `/matematicas/` -> `/memorama-tablas/`
  * `/quimica/` -> `/simbolos/`
  * `/celula/` (Visor interactivo 2D de biología)
  * Otras apps: `/estructura-atomica`, `/memorama-geometrico`, `/SMD`, `/tablas-verdad`, `/venn`.
* `/apps/juegos/`: Hub para proyectos lúdicos.
* `/apps/tools/`: Herramientas internas o utilidades.
* `/apps/testimonios/`: Formulario frontend para que los alumnos dejen reseñas.

### ⚙️ Backend y APIs (`/app/apps/api/`)
* `/apps/api/testimonios/route.ts`: Endpoint GET/POST conectado a Upstash Redis.
  * **Regla Crítica:** Tiene `export const dynamic = 'force-dynamic';` para evitar que Vercel congele el caché y siempre muestre las reseñas más recientes.

## 4. Estructura de Datos Locales (`/data/`)
* `apps.ts`: Catálogo de las aplicaciones interactivas.
* `comunidad.ts`: Contiene `casosDeExito` y `resenasLocales` (Respaldo en caso de que Upstash falle).
* `now.ts`: Contiene `currentFocusData` (Proyectos activos en el radar).
* `mundos.ts`, `investigators.ts`, `legendary.ts`, `books.ts`: Lore, personajes y publicaciones de World Anvil/Amazon.

## 5. Reglas y Contexto de Desarrollo Reciente
* **Componentes de Cliente vs Servidor:** Cuidado al mezclar llamadas a base de datos en tiempo real (async) dentro de páginas marcadas con `"use client"` (ej. `ClasesLandingPage`). Componentes como `CurrentFocus` deben importarse cuidadosamente o manejar su propio estado para evitar ciclos infinitos.
* **Errores de Hidratación:** Evitar el uso de etiquetas `<style>` dentro del renderizado de componentes (como el carrusel marquee). El CSS global debe ir en `globals.css` y las etiquetas anidadas deben respetar la jerarquía HTML (`<p>` no puede contener `<footer>`).