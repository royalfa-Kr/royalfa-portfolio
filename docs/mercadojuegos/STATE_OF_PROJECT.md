# State of Project - MercadoJuegos

## 1. Estado general
Proyecto en fase inicial con Sprint 0 completado para el MVP de una app web de compra, venta e intercambio de juegos de mesa.

## 2. Ruta del proyecto dentro del repo
- app/apps/tools/mercadojuegos
- components/mercadojuegos
- lib/mercadojuegos
- types/mercadojuegos
- docs/mercadojuegos

## 3. Stack aprobado
- Next.js
- Supabase
- Vercel
- GitHub

## 4. Objetivo actual
Arrancar Sprint 1 inicial para implementar autenticación con Supabase, perfil base y protección de rutas.

## 5. Alcance aprobado del MVP
- autenticación
- perfil básico
- publicaciones CRUD básicas
- búsqueda y filtros iniciales
- wishlist
- mensajería interna básica
- estados de disponibilidad
- reportes básicos

## 6. Funcionalidades implementadas
- [x] documentación base del proyecto
- [x] estructura base de carpetas de MercadoJuegos
- [x] layout base de la app
- [x] home de MercadoJuegos
- [x] placeholders de rutas principales
- [x] componentes base AppHeader, MercadoJuegosShell y SectionPlaceholder
- [x] constantes base del dominio
- [x] utilidades base
- [x] tipos base del dominio

## 7. Funcionalidades pendientes
- definir esquema SQL inicial detallado
- crear tablas en Supabase
- configurar políticas RLS
- implementar auth real con Supabase
- implementar perfil básico
- implementar protección de rutas
- implementar CRUD de publicaciones
- implementar wishlist
- implementar mensajería
- implementar reportes
- agregar validaciones
- agregar estados de carga y error más robustos
- documentar pruebas manuales por feature

## 8. Decisiones aprobadas
- nombre técnico del proyecto: mercadojuegos
- ruta principal: app/apps/tools/mercadojuegos
- documentación del proyecto: docs/mercadojuegos
- enfoque inicial: web app responsive
- mercado inicial: CDMX
- stack: Next.js + Supabase + Vercel
- no integrar pagos en MVP
- no rediseñar globalmente el sitio principal
- la app debe convivir con el portfolio existente sin romper otras secciones
- enums y tipos internos del dominio se manejan en inglés
- contenido visible al usuario puede mantenerse en español durante la fase inicial

## 9. Restricciones
- no modificar otras apps o rutas sin autorización
- no tocar estilos globales sin autorización
- no cambiar componentes aprobados sin autorización
- no cambiar stack sin autorización
- no separar esta app en otro repo sin autorización
- hacer cambios pequeños e incrementales

## 10. Riesgos abiertos
- pérdida de contexto en sesiones de IA
- diferencias entre documentación y código real
- refactors no solicitados
- crecimiento desordenado si no se modulariza bien
- posible necesidad futura de suavizar integración visual con el layout global del sitio

## 11. Última actualización
- Fecha:
- Responsable:
- Resumen: Sprint 0 completado con estructura base, rutas placeholder, componentes compartidos, utilidades, constantes, tipos y documentación inicial.