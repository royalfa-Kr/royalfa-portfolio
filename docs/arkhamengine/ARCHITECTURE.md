# Mythos Weaver — Arquitectura

Versión del documento: 0.1

## 1. Estilo

Monolito modular dentro del proyecto Next.js existente.

No se incorporan microservicios, agentes múltiples ni búsqueda vectorial
en el MVP.

## 2. Capas

### app/
Entradas de navegación, layouts y endpoint HTTP.
Los archivos de página son delgados.

### components/
Primitivas visuales compartidas por el sitio.

### features/arkhamengine/components/
Interfaz específica del producto.

### schemas/
Contratos Zod.
Los tipos TypeScript se derivan de estos contratos cuando corresponda.

### catalogs/
Identificadores y metadatos revisados de etiquetas, rasgos y componentes.

### engine/
Lógica pura de condiciones, efectos, comandos y transiciones.
No importa React, Next.js, Zustand, IndexedDB ni el SDK de Gemini.

### application/
Casos de uso que coordinan motor, repositorios y generación.

### server/
Proveedor de IA, configuración, prompt y políticas del endpoint.
Estos módulos no deben llegar al bundle cliente.

### persistence/
Acceso a IndexedDB, repositorios y migraciones.

### store/
Estado de interfaz y proyección de la campaña abierta.

## 3. Dirección de dependencias

UI → casos de uso → motor y repositorios
Endpoint → servicio de generación → proveedor
Motor → esquemas y tipos del dominio

El motor no depende de la UI.
El proveedor no depende del store.
Los componentes no llaman directamente al SDK.

## 4. Conceptos separados

### Definición
Contenido aceptado de un escenario.
Inmutable durante la partida.

### Estado
Situación actual de una campaña y su escenario activo.

### Evento
Hecho confirmado y persistido que explica un cambio.

### Comando
Solicitud de una acción. Puede rechazarse por ser inválida.

### Proyección
Estado calculado que utiliza la interfaz.

## 5. Flujo de generación

1. El usuario configura colección y equipo.
2. El cliente valida para ofrecer feedback.
3. El endpoint valida nuevamente.
4. El servidor resuelve las referencias contra su catálogo.
5. El servidor construye el contexto permitido.
6. El proveedor genera una propuesta estructurada.
7. Zod valida la estructura.
8. El validador de dominio comprueba referencias y restricciones.
9. El cliente recibe una definición aceptada y sus metadatos.
10. Se guarda antes de habilitar el inicio de partida.

El cliente no puede ampliar el catálogo permitido enviando cartas inventadas.

## 6. Contexto enviado al modelo

- Tono del usuario.
- Investigadores con IDs estables.
- Rasgos declarados.
- Componentes permitidos y cantidades.
- Hechos y contadores confirmados de campaña.
- Resumen limitado de resultados anteriores.
- Operaciones permitidas.
- Reglas del overlay.
- Contrato de salida y versiones.

El tono y las notas se tratan como datos no confiables,
no como instrucciones con autoridad para cambiar el contrato.

## 7. Contrato HTTP inicial

POST /api/arkhamengine/generate

Entrada conceptual:
- requestId
- schemaVersion
- catalogVersion
- campaignContext
- collectionSnapshot
- investigators
- tone
- scenarioOrdinal

Salida correcta:
{
  "ok": true,
  "requestId": "...",
  "scenario": {},
  "generation": {}
}

Salida de error:
{
  "ok": false,
  "requestId": "...",
  "error": {
    "code": "...",
    "message": "...",
    "retryable": false
  }
}

Códigos iniciales:
- INVALID_INPUT
- CATALOG_MISMATCH
- INVALID_GENERATION
- PROVIDER_UNAVAILABLE
- GENERATION_TIMEOUT
- RATE_LIMITED
- ACCESS_DENIED
- INTERNAL_ERROR

Los detalles internos del proveedor no se devuelven directamente al cliente.

## 8. Comandos y efectos

Los componentes solicitan comandos.
El motor valida el comando y calcula el resultado.

Ejemplos:
- revealCardBack
- confirmCardAdvance
- confirmDecision
- confirmResolution
- appendPlayerNote

Operaciones iniciales sobre campaña:
- setFlag
- incrementCounter
- appendLog

No se permite:
- eval.
- JavaScript generado.
- HTML arbitrario.
- Expresiones de condiciones ejecutadas como código.
- Escritura en rutas arbitrarias del estado.

Las condiciones usan una unión tipada de operaciones limitadas.

## 9. Alcance de las condiciones

Las condiciones automáticas solo evalúan datos que la aplicación conoce.

Ejemplos:
- Flag de campaña.
- Contador de campaña.
- Decisión registrada.
- Estado del escenario.

Los requisitos físicos, como pagar pistas o controlar un apoyo,
se presentan al jugador para que confirme su cumplimiento.

La app no afirma haberlos verificado automáticamente.

## 10. Avances del MVP

Los actos forman una secuencia ordenada.
Las agendas forman otra secuencia ordenada.

Cada reverso:
- Avanza al siguiente elemento de su secuencia; o
- Abre una resolución válida.

No se permiten bucles de avance en el MVP.

Una decisión pendiente bloquea nuevos avances incompatibles.
La app no decide automáticamente el orden de eventos físicos simultáneos.

Al confirmar una resolución:
- El escenario queda cerrado.
- Se bloquean nuevos avances.
- Se guardan resultados y consecuencias.
- Se habilita el siguiente escenario, si corresponde.

## 11. Persistencia consistente

Los eventos y las proyecciones afectadas se guardan en una misma
transacción IndexedDB.

Cada comando persistente incluye:
- ID único.
- ID de campaña.
- Revisión esperada.

Si la revisión ya cambió:
- No se sobrescribe silenciosamente.
- Se recarga el estado.
- Se solicita repetir o revisar la acción.

Un comando ya aplicado no vuelve a aplicar sus efectos.

## 12. Zustand

Se crea un store mediante provider para la instancia de la herramienta.

Contiene:
- Estado de hidratación.
- Campaña cargada.
- Estado de operaciones.
- Preferencias y paneles de interfaz.

No contiene:
- Clave API.
- Cliente Gemini.
- Fuente persistente única de campañas.

No se persiste toda la campaña mediante persist middleware como
segunda fuente de verdad paralela a IndexedDB.

## 13. Errores y límites

- Reintentos solo para errores transitorios.
- Límite total de intentos y tiempo.
- Validación de tamaño antes de generar o importar.
- Logs con requestId.
- Sin prompts completos ni notas personales en logs por defecto.
- Generación en servidor.
- Acceso privado o controles de abuso antes de publicar.
- No considerar un contador en memoria de una instancia como
  protección suficiente para un despliegue distribuido.

La implementación concreta del control de acceso se define
tras revisar el sistema del sitio contenedor.

## 14. Estrategia de pruebas

Unitarias:
- Esquemas.
- Condiciones.
- Efectos.
- Reducer.
- Transiciones.

Integración:
- Repositorios.
- Transacciones.
- Duplicados.
- Conflictos de revisión.
- Endpoint con proveedor simulado.

End-to-end:
- Configurar.
- Generar con fixture.
- Jugar.
- Recargar.
- Resolver.
- Continuar.
- Exportar e importar.

Las pruebas normales no consumen la API real.

## 15. Versionado

Versiones independientes:
- Formato de respaldo.
- Esquema del escenario.
- Motor de reglas.
- Catálogo.
- Prompt.

Una actualización no modifica silenciosamente escenarios guardados.

No se promete reproducir exactamente una salida de IA.
Se conserva la definición aceptada y su procedencia.