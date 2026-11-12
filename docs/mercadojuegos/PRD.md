# PRD - MercadoJuegos

## 1. Resumen del producto
MercadoJuegos es una aplicación web enfocada en la compra, venta e intercambio de juegos de mesa entre usuarios, iniciando en Ciudad de México (CDMX) como mercado inicial, con posibilidad de expansión nacional e internacional.

## 2. Problema
Actualmente, la compra, venta e intercambio de juegos de mesa entre particulares ocurre de forma dispersa en redes sociales, grupos de mensajería o canales informales. Esto provoca:
- poca confianza entre usuarios
- dificultad para verificar el estado real del juego
- falta de evidencia clara de acuerdos
- dificultad para buscar títulos específicos
- poca trazabilidad de precios
- mayor riesgo de fraude o malos entendidos

## 3. Objetivo del producto
Construir un MVP funcional que permita a usuarios:
- registrarse e iniciar sesión
- publicar juegos para venta o intercambio
- buscar juegos disponibles
- crear una wishlist de juegos deseados
- conversar dentro de la plataforma
- marcar disponibilidad de publicaciones
- reducir riesgo mediante trazabilidad básica y verificación mínima

## 4. Público objetivo
### Público inicial
- aficionados a los juegos de mesa en CDMX
- personas que quieren vender juegos usados
- personas que desean intercambiar títulos
- compradores que buscan mejores precios o juegos difíciles de conseguir

### Público futuro
- usuarios a nivel nacional en México
- coleccionistas
- tiendas o vendedores recurrentes
- mercado internacional especializado

## 5. Propuesta de valor
MercadoJuegos centraliza la compra, venta e intercambio de juegos de mesa en una plataforma especializada, con mejor búsqueda, más trazabilidad y mayor confianza que canales generalistas.

## 6. Alcance del MVP
### Incluye
- autenticación de usuarios
- perfil básico
- publicaciones de juegos
- publicación para venta, intercambio o ambos
- listado de publicaciones
- detalle de publicación
- búsqueda básica
- filtros básicos
- wishlist básica
- mensajería interna básica
- estados de disponibilidad
- reportes básicos
- arquitectura preparada para reputación futura

### No incluye en MVP
- pagos dentro de la plataforma
- integración con paqueterías
- envíos automatizados
- verificación oficial avanzada de identidad
- múltiples monedas
- expansión internacional
- fotos múltiples avanzadas
- comparación automática con tiendas externas
- app móvil nativa
- notificaciones push avanzadas
- panel administrativo complejo

## 7. Fases del producto
### Fase 1 - MVP CDMX
- operación inicial centrada en CDMX
- usuarios registrados
- publicaciones básicas
- búsqueda y filtros
- wishlist
- chat interno
- estados de disponibilidad

### Fase 2 - Nacional México
- expansión geográfica
- fotos múltiples
- reputación básica
- alertas
- mejor antifraude
- mayor robustez en filtros y precios de referencia

### Fase 3 - Internacional
- múltiples países
- monedas
- idiomas
- políticas diferenciadas
- mayor sofisticación en trust & safety

## 8. Funcionalidades clave
### 8.1 Usuarios y autenticación
- registro con email y contraseña
- inicio y cierre de sesión
- recuperación de contraseña
- perfil básico
- email verificado

### 8.2 Publicaciones
Cada publicación debe permitir:
- título del juego
- tipo de operación: venta / intercambio / ambos
- precio
- estado del juego
- descripción
- ubicación general
- disponibilidad
- relación con el propietario

### 8.3 Estado del juego
Valores sugeridos:
- nuevo
- como nuevo
- buen estado
- usado con detalles
- incompleto

### 8.4 Disponibilidad
Valores sugeridos:
- disponible
- en negociación
- apartado
- vendido
- intercambiado
- pausado

### 8.5 Wishlist
Permitir que los usuarios registren juegos deseados.

### 8.6 Búsqueda
Buscar por:
- nombre
- tipo de operación
- rango de precio
- estado
- ubicación
- disponibilidad

### 8.7 Mensajería
- conversación entre usuarios
- historial básico
- vínculo con publicación
- trazabilidad de acuerdos

### 8.8 Seguridad
- email verificado
- reportes básicos
- lineamientos de uso
- base para reputación futura

## 9. Requerimientos no funcionales
- responsive design
- arquitectura simple y escalable
- claridad en estructura del código
- uso de Supabase con RLS
- despliegue en Vercel
- trazabilidad vía GitHub
- consistencia visual con el sitio principal

## 10. Métricas de éxito iniciales
- usuarios registrados
- publicaciones activas
- conversaciones iniciadas
- publicaciones marcadas como vendidas o intercambiadas
- usuarios recurrentes
- número de wishlists activas

## 11. Riesgos
- fraude entre usuarios
- baja liquidez al inicio
- dificultad para normalizar nombres de juegos
- complejidad del intercambio
- sobrealcance del MVP

## 12. Principios del producto
- construir rápido pero con orden
- priorizar claridad y confianza
- no sobreingenierizar
- separar MVP de futuras mejoras
- mantener trazabilidad documental y técnica