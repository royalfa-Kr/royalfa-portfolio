# Mythos Weaver — Reglas de interfaz

Versión del documento: 0.1

## 1. Objetivo visual

Una mesa de dirección legible, no un simulador de cartas.

La estética puede sugerir misterio y horror cósmico,
pero nunca debe dificultar la lectura de reglas.

## 2. Integración con el sitio

- Mantener inicialmente layout y footer existentes.
- Usar AppShell dentro de la herramienta.
- No cambiar estilos globales para resolver un detalle local.
- Reutilizar primitivas compartidas cuando sean adecuadas.
- No crear un segundo sistema visual completo sin necesidad.
- Logo provisional tipográfico hasta definir identidad.

## 3. Jerarquía de la partida

Orden de prioridad:
1. Acción o decisión pendiente.
2. Acto y agenda actuales.
3. Reglas activas del overlay.
4. Contexto narrativo.
5. Registro y herramientas secundarias.

## 4. Navegación

Secciones:
- Inicio.
- Nueva campaña.
- Campaña.
- Escenario.
- Registro.
- Respaldo.

No añadir rutas para cada modal o pestaña sin una necesidad real.

## 5. Cartas

Cada acto y agenda distingue:
- Identificador y posición.
- Anverso.
- Reverso.
- Requisitos.
- Reglas activas.
- Consecuencias.

El reverso no aparece en la lectura normal del anverso.

Voltear y confirmar avance son acciones diferentes.

Una animación nunca es necesaria para entender el estado.
Debe existir una alternativa sin movimiento.

## 6. Spoilers

- No mostrar actos o agendas futuros por defecto.
- No mostrar resoluciones antes de que correspondan.
- El modo de inspección debe advertir que contiene spoilers.
- Ocultar spoilers es una regla de experiencia, no una medida de seguridad:
  los datos pueden estar almacenados localmente.

## 7. Configurador

- Mostrar selección actual y máximo permitido.
- No permitir selecciones duplicadas.
- Explicar diferencia entre historia y rasgos del mazo.
- Mostrar errores junto al campo correspondiente.
- Explicar por qué no se puede continuar.
- No depender únicamente del color.

## 8. Confirmaciones

Pedir confirmación para:
- Aplicar una decisión irreversible.
- Resolver un escenario.
- Eliminar una campaña.
- Reemplazar datos durante importación.

Evitar confirmaciones para acciones reversibles de navegación.

## 9. Estados obligatorios

Cada operación relevante contempla:
- Inicial.
- Cargando.
- Correcta.
- Error.
- Vacío, cuando corresponda.

La generación no utiliza porcentajes ficticios.
Puede mostrar fases reales como solicitar, recibir y validar.

## 10. Guardado

Mostrar:
- Guardando.
- Guardado.
- Error de guardado.

No afirmar "guardado" antes de completar la transacción.

Si el guardado falla, no presentar la acción como confirmada
ni permitir continuar silenciosamente con una proyección divergente.

## 11. Registro

Distinguir visualmente:
- Hechos de campaña.
- Decisiones.
- Resultados.
- Notas libres.

Las notas libres deben indicar que no alteran por sí solas las reglas.

## 12. Accesibilidad

- Navegación por teclado.
- Foco visible.
- Etiquetas accesibles.
- Diálogos con gestión de foco.
- Texto comprensible en botones.
- Contraste revisado.
- Respeto a la preferencia de movimiento reducido.

## 13. Responsive

- Móvil: flujo en una columna.
- Pantalla amplia: acto y agenda pueden mostrarse lado a lado.
- El registro puede ocupar un panel secundario.
- No exigir arrastrar elementos para una acción esencial.

## 14. Representación segura

- Texto de IA como texto, no HTML.
- Sin renderizado HTML arbitrario.
- Referencias de cartas resueltas mediante catálogo.
- Alias narrativo acompañado de la identidad física necesaria para preparar.

## 15. Fuera de prioridad inicial

- Efectos 3D.
- Partículas.
- Audio automático.
- Ilustraciones generadas.
- Réplica exacta del diseño oficial de cartas.