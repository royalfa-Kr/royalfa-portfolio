# Mythos Weaver — PRD

Versión del documento: 0.1
Estado: especificación inicial
Identificador técnico: arkhamengine
Ruta pública: /apps/tools/arkhamengine

## 1. Visión

Mythos Weaver es un director de campaña asistido por IA para Arkham Horror LCG.

Genera escenarios overlay que utilizan componentes de la colección declarada
por el jugador. Sustituye actos y agendas, añade narrativa y reglas explícitas,
y conserva las consecuencias entre escenarios.

No es un simulador completo de Arkham Horror LCG.

## 2. Usuario objetivo

Una persona o grupo que:
- Conoce las reglas básicas del juego.
- Posee componentes físicos o acceso autorizado a sus componentes digitales.
- Quiere jugar contenido procedural.
- Está dispuesto a confirmar en la aplicación lo sucedido en la mesa.

Una sola persona opera la aplicación para todo el grupo.

## 3. Principios de producto

1. La colección disponible limita la generación.
2. El jugador confirma hechos de la partida.
3. La IA no determina automáticamente lo sucedido en la mesa.
4. Las consecuencias persistentes se representan mediante datos estructurados.
5. Una generación aceptada no cambia durante la partida.
6. Las reglas del overlay deben ser visibles donde resulten relevantes.
7. La generación fallida no debe destruir una campaña existente.
8. El producto debe explicar sus limitaciones.

## 4. Alcance del MVP

- Interfaz en español.
- Minicampañas de dos escenarios.
- Entre 1 y 4 investigadores genéricos.
- Exactamente 3 etiquetas de historia por investigador.
- Exactamente 2 rasgos declarados de mazo por investigador.
- Colección seleccionada desde un catálogo local revisado.
- Tono narrativo introducido por el usuario.
- Generación antes de cada escenario.
- Entre 2 y 3 actos y entre 2 y 3 agendas por escenario.
- Setup y mapa con referencias a componentes permitidos.
- Un beneficio y una complicación personal por investigador.
- Avance manual y confirmado de actos y agendas.
- Decisiones, resoluciones y logbook.
- Continuidad entre el primer y segundo escenario.
- Persistencia local.
- Exportación e importación de campaña.

La calidad inicial se validará con un catálogo pequeño.
La aplicación no prometerá compatibilidad con todo el juego.

## 5. Fuera del MVP

- Simulación de combate, enemigos o mazos.
- Seguimiento completo de vida, cordura, recursos o acciones.
- Multijugador sincronizado.
- Cuentas y sincronización en la nube.
- Generación continua durante cada turno.
- Integración automática con ArkhamDB.
- Integración técnica con Tabletop Simulator.
- Editor general de cartas.
- Campañas de duración arbitraria.
- Imágenes y reproducciones completas de cartas oficiales.
- Animaciones 3D como requisito de lanzamiento.
- Funcionamiento offline completo de la web.

## 6. Flujo principal

1. Abrir Mythos Weaver.
2. Seleccionar o crear un perfil de colección.
3. Configurar el tono y los investigadores.
4. Revisar la configuración.
5. Generar el primer escenario.
6. Validar y guardar el resultado antes de iniciar.
7. Completar el checklist de preparación.
8. Jugar con los componentes físicos.
9. Confirmar avances y decisiones en la aplicación.
10. Confirmar una resolución y los resultados solicitados.
11. Guardar las consecuencias de campaña.
12. Generar el segundo escenario con el estado confirmado.
13. Completar la campaña.
14. Exportar una copia de seguridad.

## 7. Requisitos funcionales

### RF-01 — Configuración
Validar cantidad de investigadores, IDs únicos, etiquetas permitidas
y ausencia de selecciones duplicadas.

### RF-02 — Colección
La generación solo puede referenciar componentes del catálogo permitido
y de la colección declarada, respetando cantidades.

### RF-03 — Generación
La respuesta debe superar validación estructural y de dominio
antes de considerarse utilizable.

### RF-04 — Personalización
Cada investigador debe tener exactamente un beneficio y una complicación.
Sus referencias deben conservar el ID original del investigador.

En el MVP son efectos del overlay con instrucciones y activadores explícitos.
No se insertan automáticamente como cartas físicas en un mazo.

### RF-05 — Overlay
Debe indicarse qué texto impreso se conserva, ignora o sustituye,
qué reglas adicionales existen y durante cuánto tiempo se aplican.

### RF-06 — Avances
Voltear revela el reverso y abre su resolución.
No aplica consecuencias irreversibles sin confirmación.

### RF-07 — Registro
Las consecuencias estructuradas se aplican mediante operaciones permitidas.
Las notas libres no modifican automáticamente el estado de campaña.

### RF-08 — Persistencia
La aplicación debe guardar cada decisión confirmada de forma consistente
y recuperar la sesión al recargar.

### RF-09 — Respaldo
Exportar e importar campañas completas con validación y versión de formato.

### RF-10 — Errores
Un fallo de generación, guardado o importación debe mostrar una recuperación
posible sin borrar silenciosamente información previa.

## 8. Requisitos de calidad

- No exponer claves del proveedor.
- No ejecutar código o HTML arbitrario producido por IA.
- No considerar verificada una regla física solo porque aparece en el texto.
- Limitar tamaño de solicitudes, respuestas y archivos importados.
- Controlar tiempo, reintentos y consumo de generación.
- No publicar el endpoint sin controles de acceso y abuso.
- Mantener pruebas del motor y del flujo principal.
- Mantener versiones de esquema, motor, catálogo y prompt.
- Evitar spoilers en la vista de juego normal.

## 9. Criterios de aceptación del MVP

- Se completa una campaña de dos escenarios.
- Se prueba configuración de 1 y 4 investigadores.
- No se aceptan referencias físicas fuera del catálogo permitido.
- No se acepta un hook asociado a un investigador inexistente.
- Un evento repetido no duplica sus consecuencias.
- Una recarga recupera la última decisión guardada.
- El segundo escenario recibe los hechos confirmados del primero.
- Exportar e importar conserva definición, eventos y estado.
- Los errores no sustituyen una campaña válida por datos incompletos.
- Se realiza al menos una prueba física y se documentan sus incidencias.

Estos criterios no equivalen a garantizar balance o ausencia de todos
los bloqueos posibles; la jugabilidad requiere pruebas humanas.

## 10. Decisiones pendientes

- Catálogo y productos de la primera versión.
- Presupuesto por generación y cuotas.
- Modelo disponible y configuración del proveedor.
- Acceso privado o público del primer despliegue.
- Límites narrativos y contenido no deseado.
- Necesidad futura de cuentas y sincronización.