# Mythos Weaver — Auditoría T-001

Estado: completada con verificaciones de ejecución pendientes.

## 1. Alcance

Revisión del proyecto contenedor para integrar Mythos Weaver
sin alterar las otras herramientas del portfolio.

Revisión realizada mediante archivos y capturas compartidos por el propietario.
No hubo acceso directo al repositorio ni ejecución de comandos por el asistente.

## 2. Archivos revisados

- package.json
- tsconfig.json
- next.config.ts
- app/layout.tsx
- app/globals.css
- components/layout/NavbarSwitcher.tsx
- components/layout/Footer.tsx
- postcss.config.mjs
- .gitignore
- AGENTS.md
- CLAUDE.md
- royalfa_arquitectura.md
- app/royAdmin/page.tsx
- app/royAdmin/actions.ts
- app/apps/tools/seriestracker/db.ts

También se revisaron capturas parciales del árbol y resultados
de comandos ejecutados por el propietario.

No se revisó íntegramente package-lock.json.

## 3. Configuración observada

- Proyecto: royalfa-portfolio.
- Next.js declarado: 16.2.9.
- React y React DOM declarados: 19.2.4.
- TypeScript con strict activado.
- Alias @/* hacia la raíz.
- Tailwind CSS 4 con plugin PostCSS.
- Dexie y dexie-react-hooks ya declarados.
- Upstash Redis ya declarado.
- Gestor previsto: npm; existe package-lock.json.
- Despliegue en Vercel según documentación del proyecto.

No aparecen declarados Zod, Zustand, @google/genai ni un test runner.

## 4. Integración acordada

- URL: /apps/tools/arkhamengine.
- Endpoint: /api/arkhamengine/generate.
- Código exclusivo: features/arkhamengine/.
- No crear capas del dominio en la raíz.
- No repartir el dominio entre features/ y lib/.
- Conservar inicialmente navegación y footer del portfolio.
- NavbarSwitcher seleccionará Navbar para esta ruta.
- AppShell no introduce otro main dentro del main del layout raíz.

app/arkham/ corresponde a investigadores personalizados
y queda fuera del alcance.

El motor anterior solo existe en una conversación de Gemini;
no hay código que migrar identificado en el repositorio.

## 5. Persistencia

Series Tracker utiliza:
- Base: SeriesTrackerDB.
- Versión: 1.
- Tabla: series.

Mythos Weaver tendrá una base independiente:
- Nombre propuesto: mythos-weaver.
- Ubicación: features/arkhamengine/persistence/database.ts.

No modificar ni importar la base de Series Tracker.

## 6. Acceso y servicios

royAdmin muestra el formulario con cualquier PIN no vacío.

La escritura compara el PIN contra ROY_ADMIN_PIN en servidor.
No se identificó una sesión autenticada reutilizable.

En las funciones revisadas no se observaron:
- Validación de argumentos en tiempo de ejecución.
- Limitación de intentos.
- Comprobación explícita de configuración del PIN.

No se evaluaron todas las posibles protecciones de infraestructura.

Upstash se utiliza con la clave upcomingClass.
No reutilizar esa clave ni ROY_ADMIN_PIN para Mythos Weaver.

La protección del endpoint de generación sigue pendiente.
El desarrollo inicial debe usar fixtures y proveedor simulado.

## 7. Hallazgos y propuestas

### H-01 — Envoltura del footer
El layout introduce Footer dentro de un p y otro footer.
Propuesta: renderizar Footer directamente.
También existe copyright duplicado.

### H-02 — Plantilla de entorno ignorada
.env* también coincide con .env.example.
Propuesta: añadir !.env.example después de esa regla.
La plantilla nunca contendrá secretos.

### H-03 — Colores globales duplicados
body tiene colores en globals.css y utilidades de color en el layout.
No bloqueante. Evitar cambios visuales globales durante el shell inicial.

### H-04 — Variables de fuentes
Evaluar @theme inline para tokens que referencian variables de next/font.
No se confirmó un fallo visual.

### H-05 — Administración existente
Registrar mejoras de validación y recuperación de errores.
No ampliar T-002 para rediseñar royAdmin.

### H-06 — Idioma
El documento raíz declara inglés; la herramienta será inicialmente española.
Definir una solución acotada sin cambiar el idioma de todo el portfolio.

## 8. Evidencias aportadas

- node --version: v24.17.0.
- git ls-files -- ".env*": sin resultados.
- Existe app/api/arkhamengine/generate.
- Existe node_modules/next/dist/docs.
- Git muestra documentación y scaffold pendientes de commit.
- También hay cambios de Mercadojuegos preparados; mantenerlos separados.

## 9. No verificado

- Build.
- Lint.
- Comprobación de tipos.
- Renderizado en navegador.
- Estado real de servicios y variables en Vercel.
- Versiones resueltas completas del lock.
- Ausencia de secretos en el historial.
- Autenticación o middleware fuera de los archivos revisados.

## 10. Veredicto

T-001 completada dentro de su alcance de auditoría,
sin certificar funcionamiento ni preparación para producción.

No se identificó una necesidad de reemplazar el proyecto contenedor.

T-002 puede comenzar con cambios mínimos y sin integrar IA real.
Las verificaciones pendientes deben registrarse y ejecutarse
cuando el entorno lo permita.