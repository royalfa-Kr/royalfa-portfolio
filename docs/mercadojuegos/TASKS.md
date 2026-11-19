# Tasks - MercadoJuegos

## Sprint 0
### Done
- [x] Crear carpeta docs/mercadojuegos
- [x] Crear archivos base de documentación
- [x] Crear app/apps/tools/mercadojuegos
- [x] Crear layout base
- [x] Crear página principal
- [x] Crear loading.tsx
- [x] Crear error.tsx
- [x] Crear placeholders de auth
- [x] Crear placeholders de listings
- [x] Crear placeholders de wishlist
- [x] Crear placeholders de messages
- [x] Crear placeholders de profile
- [x] Crear namespace components/mercadojuegos
- [x] Crear namespace lib/mercadojuegos
- [x] Crear namespace types/mercadojuegos
- [x] Verificar estructura base del proyecto

## Sprint 1 inicial
### Done
- [x] Definir flujo de autenticación del MVP y rutas protegidas
- [x] Crear tabla `bg_profiles` con políticas RLS en Supabase (`docs/mercadojuegos/sql/001_bg_profiles.sql`)
- [x] Definir tipos de perfil (`BgProfile`, `UpdateBgProfileInput`) en `types/mercadojuegos/index.ts`
- [x] Corregir rutas base a `/apps/tools/mercadojuegos` y agregar catálogo de alcaldías CDMX en `lib/mercadojuegos/constants.ts`
- [x] Configurar clientes base de Supabase (navegador y servidor) en `lib/mercadojuegos/supabase/`

### To Do
- [ ] Implementar helpers de sesión y estrategia de perfil al primer acceso (`lib/mercadojuegos/auth.ts` y `lib/mercadojuegos/profiles.ts`)
- [ ] Implementar login real
- [ ] Implementar registro real
- [ ] Implementar perfil base del usuario conectado a `bg_profiles`
- [ ] Actualizar `AppHeader` con estado de sesión y logout
- [ ] Proteger rutas que requieran sesión (`profile`, `wishlist`, `listings/new`)
- [ ] Documentar pruebas manuales de auth y perfil
- [ ] Actualizar STATE_OF_PROJECT y CHANGELOG al cerrar Sprint 1 inicial

## Próximos sprints
- [ ] CRUD de publicaciones
- [ ] Búsqueda y filtros
- [ ] Wishlist funcional
- [ ] Mensajería básica
- [ ] Reportes básicos