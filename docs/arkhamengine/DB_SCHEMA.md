# Mythos Weaver — Esquema de persistencia

Versión del documento: 0.1
Base propuesta: IndexedDB
Nombre: mythos-weaver
Versión inicial de estructura: 1

## 1. Principios

- La base es local al navegador.
- Los IDs son strings estables.
- Fechas como strings ISO 8601 en UTC.
- Las definiciones aceptadas son inmutables durante una partida.
- Los eventos explican cambios confirmados.
- Las proyecciones permiten recuperar rápidamente la sesión.
- No guardar claves API.
- No guardar clientes SDK ni funciones.
- No guardar toda la campaña también en localStorage.

Los nombres y tipos aquí son contratos de diseño.
Su validación ejecutable se implementa con Zod.

## 2. Object stores

### collectionProfiles

Clave primaria:
- id

Índices:
- updatedAt

Campos:
- id: string
- name: string
- catalogVersion: string
- products: array de { productId: string, quantity: integer >= 1 }
- cardOverrides: array de { cardCode: string, quantity: integer >= 0 }
- createdAt: datetime
- updatedAt: datetime

Los overrides son cantidades absolutas que sustituyen el total calculado
para esa carta; no son incrementos.

El catálogo determina las cantidades aportadas por cada producto.

### campaigns

Clave primaria:
- id

Índices:
- status
- updatedAt

Campos:
- id: string
- title: string
- tone: string
- language: "es"
- status: "active" | "completed" | "archived"
- plannedScenarioCount: 2
- investigators: Investigator[]
- collectionSnapshot: CollectionSnapshot
- activeScenarioId: string | null
- stateDefinitions: StateDefinitions
- facts: Record<string, boolean>
- counters: Record<string, integer>
- revision: integer >= 0
- schemaVersion: string
- engineVersion: string
- createdAt: datetime
- updatedAt: datetime

Investigator:
- id: string
- storyTags: exactamente 3 strings únicos permitidos
- deckTraits: exactamente 2 strings únicos permitidos

CollectionSnapshot:
- catalogVersion: string
- availableCards: array de { cardCode: string, quantity: integer >= 0 }

StateDefinitions declara las claves de flags, contadores y entradas
de registro permitidas, con sus tipos y límites.

La colección se congela para esta campaña.
Cambiar un perfil no modifica campañas ya iniciadas.

### scenarioDefinitions

Clave primaria:
- id

Índices:
- campaignId
- [campaignId, ordinal]: único

Campos:
- id: string
- campaignId: string
- ordinal: 1 | 2
- schemaVersion: string
- engineVersion: string
- catalogVersion: string
- blueprint: ScenarioBlueprint
- provenance: GenerationProvenance
- createdAt: datetime

Blueprint incluye:
- Metadatos.
- Componentes físicos requeridos y cantidades.
- Setup y checklist.
- Lugares y conexiones.
- Reglas del overlay y alcance.
- Actos.
- Agendas.
- Hooks personales.
- Decisiones.
- Resoluciones.
- Definiciones de estado utilizadas.

GenerationProvenance incluye:
- provider: "fixture" | "gemini"
- model: string | null
- promptVersion: string
- requestId: string
- generatedAt: datetime
- usage: objeto opcional con consumo informado por el proveedor

No se guarda el prompt completo por defecto.

### scenarioRuns

Clave primaria:
- id

Índices:
- campaignId
- definitionId: único

Campos:
- id: string
- campaignId: string
- definitionId: string
- status: "ready" | "playing" | "awaiting_resolution" | "resolved"
- setupChecks: Record<string, boolean>
- activeActId: string
- activeAgendaId: string
- revealedBackIds: string[]
- completedStepIds: string[]
- pendingDecisionId: string | null
- selectedChoices: Record<string, string>
- hookStates: Record<string, HookRuntimeState>
- resolutionId: string | null
- results: ConfirmedResult[]
- revision: integer >= 0
- startedAt: datetime | null
- resolvedAt: datetime | null
- updatedAt: datetime

Los IDs referenciados deben existir en la definición correspondiente.

HookRuntimeState guarda únicamente el estado necesario para activaciones
y usos limitados declarados por el overlay.

ConfirmedResult es una unión tipada de resultados soportados.
No es un objeto arbitrario que pueda cambiar reglas.

### events

Clave primaria:
- id

Índices:
- campaignId
- [campaignId, sequence]: único
- [campaignId, commandId]: único
- scenarioRunId

Campos:
- id: string
- commandId: string
- campaignId: string
- scenarioRunId: string | null
- sequence: integer >= 1
- type: EventType
- payload: payload validado según type
- engineVersion: string
- createdAt: datetime

Tipos iniciales:
- CAMPAIGN_CREATED
- SCENARIO_ACCEPTED
- SCENARIO_STARTED
- SETUP_ITEM_CONFIRMED
- CARD_BACK_REVEALED
- CARD_ADVANCE_CONFIRMED
- DECISION_CONFIRMED
- RESOLUTION_CONFIRMED
- PLAYER_NOTE_ADDED
- CAMPAIGN_COMPLETED

Un evento puede contener varios efectos derivados de un comando.
No se crea un nuevo evento para cada renderizado de la interfaz.

### logEntries

Clave primaria:
- id

Índices:
- campaignId
- scenarioRunId
- [campaignId, sequence, position]: único

Campos:
- id: string
- campaignId: string
- scenarioRunId: string | null
- sourceEventId: string
- sequence: integer
- position: integer >= 0
- kind: "fact" | "decision" | "result" | "note"
- entryKey: string | null
- text: string
- createdAt: datetime

Es una proyección para lectura del registro.
No se utiliza como sustituto de facts y counters.

### settings

Clave primaria:
- key

Campos:
- key: string
- value: valor validado para esa preferencia

Solo preferencias de UI y metadatos locales.
No secretos.

## 3. Operaciones de estado permitidas

setFlag:
- key declarada como flag.
- value boolean.

incrementCounter:
- key declarada como contador.
- amount entero.
- resultado dentro de sus límites.

appendLog:
- entryKey declarada.
- text dentro del límite permitido.
- destino de registro controlado por el motor.

Las claves no son rutas de acceso a objetos.
Se rechazan claves reservadas o no declaradas.

No hay operaciones de borrado general o ejecución de código en el MVP.

## 4. Condiciones permitidas

Primera versión:
- flagEquals.
- counterAtLeast.
- counterAtMost.
- choiceEquals.
- all.
- any.

Limitar profundidad y cantidad de condiciones.

Los costes físicos requieren confirmación del jugador.
No se evalúan consultando un estado de mesa que la aplicación no conoce.

## 5. Escritura transaccional de comandos

1. Abrir transacción readwrite sobre los stores afectados.
2. Buscar commandId.
3. Si ya existe, devolver resultado "ya aplicado".
4. Leer campaña y partida actuales.
5. Comprobar expectedRevision.
6. Validar comando contra la definición.
7. Calcular evento y nuevas proyecciones.
8. Insertar evento.
9. Actualizar campaña, partida y log.
10. Confirmar transacción.
11. Actualizar la UI desde el resultado guardado.

No realizar llamadas HTTP dentro de la transacción.

En un conflicto entre pestañas se rechaza la revisión obsoleta
y se recarga el estado.

## 6. Aceptación de un escenario

La definición, la partida inicial, las nuevas claves de estado compatibles
y el evento SCENARIO_ACCEPTED se guardan de forma atómica.

No aceptar:
- Otro escenario para el mismo ordinal ya ocupado.
- IDs duplicados.
- Referencias inválidas.
- Claves que cambien el tipo de una definición existente.
- Componentes no disponibles.
- Una segunda partida del mismo escenario dentro del MVP.

## 7. Integridad

IndexedDB no sustituye las validaciones del dominio.

Los repositorios deben comprobar:
- Existencia de entidades relacionadas.
- Pertenencia a la campaña.
- Versiones compatibles.
- Unicidad de IDs y ordinales.
- Coherencia de revisiones.
- Coherencia entre definición, eventos y proyección.

## 8. Respaldo

Formato conceptual:

{
  "format": "mythos-weaver-backup",
  "formatVersion": 1,
  "exportedAt": "...",
  "campaign": {},
  "scenarioDefinitions": [],
  "scenarioRuns": [],
  "events": [],
  "logEntries": []
}

Incluye todo lo necesario para recuperar esa campaña.
No necesita incluir otros perfiles de colección ni preferencias globales.

## 9. Importación

Antes de escribir:
- Comprobar tamaño.
- Parsear JSON.
- Validar el formato completo.
- Comprobar referencias y versiones.
- Comprobar consistencia de eventos y proyecciones.
- Mostrar resumen al usuario.

MVP:
- Importar campañas cuyo ID no exista.
- Rechazar colisiones con explicación.
- No reemplazar automáticamente una campaña existente.

La escritura se realiza en una transacción.
Si falla, no deja una campaña parcial.

Importar no ejecuta efectos nuevamente sobre el estado ya incluido.

## 10. Borrado

Eliminar una campaña borra sus:
- Definiciones.
- Partidas.
- Eventos.
- Entradas de registro.

La operación requiere confirmación y es transaccional.

No elimina perfiles de colección compartidos.

## 11. Migraciones

Versiones independientes:
- Estructura IndexedDB.
- Datos de dominio.
- Formato de respaldo.

Nunca resolver una incompatibilidad borrando silenciosamente la base.

Antes de una migración destructiva:
- Ofrecer respaldo.
- Documentar transformación.
- Probar con fixtures de la versión anterior.

Si una versión no es compatible:
- No continuar la partida.
- Permitir conservar o exportar los datos.
- Mostrar explicación.

## 12. Evolución a nube

El esquema separa entidades para permitir una migración futura.

Esa migración deberá añadir:
- Identidad y propiedad.
- Autorización por campaña.
- Sincronización y resolución de conflictos.
- Restricciones equivalentes en servidor.
- Política de respaldo y recuperación.

No forma parte del MVP local-first.