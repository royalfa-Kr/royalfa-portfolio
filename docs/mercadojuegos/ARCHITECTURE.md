# Architecture - MercadoJuegos

## 1. Objetivo técnico
Construir una app modular dentro del sitio existente, sin romper otras secciones del repo y permitiendo crecimiento progresivo del marketplace.

## 2. Stack
- Next.js App Router
- Supabase
  - Auth
  - Postgres
  - Storage (futuro)
- Vercel para despliegue
- GitHub para control de versiones

## 3. Ubicación dentro del repo
### Rutas
- app/apps/tools/mercadojuegos/*

### Componentes
- components/mercadojuegos/*

### Lógica
- lib/mercadojuegos/*

### Tipos
- types/mercadojuegos/*

## 4. Principios de arquitectura
- modularidad por dominio
- bajo acoplamiento con otras apps del sitio
- cambios incrementales
- documentación como fuente de verdad operativa

## 5. Módulos principales
- autenticación
- perfiles
- publicaciones
- wishlist
- mensajería
- reportes
- utilidades compartidas

## 6. Estrategia de desarrollo
1. estructura base
2. auth
3. perfiles
4. publicaciones
5. búsqueda
6. wishlist
7. mensajería
8. reportes