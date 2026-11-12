# State of Project - MercadoJuegos

## 1. Estado general
Proyecto en fase de definición y preparación del MVP para una app web de compra, venta e intercambio de juegos de mesa.

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
Construir MVP web para CDMX con autenticación, publicaciones, búsqueda, wishlist y mensajería básica.

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
- [ ] documentación base del proyecto
- [ ] estructura base de carpetas de MercadoJuegos
- [ ] layout base de la app
- [ ] home de MercadoJuegos
- [ ] placeholders de rutas principales

## 7. Funcionalidades pendientes
- definir esquema SQL inicial
- crear tablas en Supabase
- configurar políticas RLS
- implementar auth
- implementar CRUD de publicaciones
- implementar wishlist
- implementar mensajería
- implementar reportes
- agregar validaciones
- agregar estados de carga y error
- documentar pruebas manuales

## 8. Decisiones aprobadas
- nombre técnico del proyecto: mercadojuegos
- ruta principal: app/apps/mercadojuegos
- documentación del proyecto: docs/mercadojuegos
- enfoque inicial: web app responsive
- mercado inicial: CDMX
- stack: Next.js + Supabase + Vercel
- no integrar pagos en MVP
- no rediseñar globalmente el sitio principal
- la app debe convivir con el portfolio existente sin romper otras secciones

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

## 11. Última actualización
- Fecha:
- Responsable:
- Resumen: