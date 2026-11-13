# Mythos Weaver — Tareas

#Inicio del documento

Versión del documento: 0.1

## Reglas

- Trabajar una tarea a la vez.
- Revisar dependencias antes de implementar.
- No modificar archivos ajenos sin necesidad.
- No actualizar dependencias por iniciativa propia.
- No declarar pruebas aprobadas si no se ejecutaron.
- Actualizar STATE.md al cerrar una tarea.
- Una tarea con dependencias pendientes no se considera lista.

Estados:
TODO / IN_PROGRESS / BLOCKED / DONE

## E0 — Integración segura

### T-001 — Auditar el proyecto contenedor
Estado: DONE

Evidencia: AUDIT_T001.md.
Alcance: revisión documental y de integración.
Build, lint y pruebas no ejecutados.

### T-002 — Crear estructura y shell
Estado: TODO
Depende de: T-001

- Añadir documentación.
- Crear ruta de la herramienta.
- Añadir AppShell mínimo.
- Mantener el shell del sitio.
- Añadir estados básicos de error y carga.

Aceptación:
- Ruta accesible.
- Sitio existente sin regresiones observadas.
- Build y verificación de tipos ejecutados.

## E1 — Contratos y catálogo

### T-003 — Implementar esquemas
Estado: TODO
Depende de: T-002

- Investigadores.
- Colección.
- Campaña.
- Escenario.
- Eventos.
- Entrada y salida de generación.
- Respaldo.

Aceptación:
- Casos válidos e inválidos probados.
- IDs string consistentes.
- Límites explícitos.
- Efectos y condiciones como uniones discriminadas.

### T-004 — Crear catálogo mínimo revisado
Estado: TODO
Depende de: T-003

- Elegir productos iniciales.
- Añadir códigos, cantidades y metadatos necesarios.
- Definir compatibilidad del overlay.
- Versionar catálogo.

Aceptación:
- Sin cartas inventadas.
- Fuentes y revisión registradas.
- Fixtures limitados a ese catálogo.

### T-005 — Fixtures de dos escenarios
Estado: TODO
Depende de: T-004

Aceptación:
- Ambos escenarios pasan validación.
- El segundo utiliza una consecuencia del primero.
- Existen fixtures inválidos para referencias y hooks incorrectos.

## E2 — Motor determinista

### T-006 — Condiciones y efectos
Estado: TODO
Depende de: T-005

Aceptación:
- Sin evaluación de código.
- Solo claves declaradas.
- Flags, contadores y log con límites.
- Notas libres separadas de hechos.

### T-007 — Comandos y transiciones
Estado: TODO
Depende de: T-006

Aceptación:
- Avances válidos.
- Rechazo de avances incompatibles.
- Resolución terminal.
- No duplicación de consecuencias.
- Pruebas sin React ni API.

## E3 — Persistencia y respaldo

### T-008 — IndexedDB y repositorios
Estado: TODO
Depende de: T-007

Aceptación:
- Campañas y definiciones guardadas.
- Evento y proyección en una transacción.
- Revisión optimista.
- Error de guardado visible.
- Recarga recuperable.

### T-009 — Exportación e importación
Estado: TODO
Depende de: T-008

Aceptación:
- Formato versionado.
- Límites de tamaño.
- Validación completa antes de escribir.
- Sin sobrescritura silenciosa.
- Importación atómica.
- Round-trip probado.

## E4 — Interfaz jugable sin IA real

### T-010 — Configurador
Estado: TODO
Depende de: T-005, T-008

Aceptación:
- 1–4 investigadores.
- 3 etiquetas de historia y 2 rasgos de mazo.
- IDs estables.
- Colección y tono.
- Errores claros.

### T-011 — Tablero y logbook
Estado: TODO
Depende de: T-007, T-008, T-010

Aceptación:
- Setup verificable.
- Acto y agenda actuales.
- Reversos ocultos.
- Decisiones confirmadas.
- Estado de guardado visible.
- Sin spoilers futuros por defecto.

### T-012 — Campaña completa con fixtures
Estado: TODO
Depende de: T-009, T-011

Aceptación:
- Completar ambos escenarios.
- Recargar durante la partida.
- Consecuencia transferida.
- Exportar e importar.
- Prueba end-to-end ejecutada.

## E5 — Generación real

### T-013 — Proveedor simulado y servicio
Estado: TODO
Depende de: T-012

Aceptación:
- Interfaz de proveedor aislada.
- Endpoint validado.
- Errores tipados.
- Pruebas sin llamadas reales.

### T-014 — Integrar Gemini
Estado: TODO
Depende de: T-013

- Verificar modelo y SDK.
- Configurar salida estructurada.
- Añadir límites y reintentos acotados.
- Guardar procedencia.

Aceptación:
- Salidas incorrectas rechazadas.
- Sin claves en navegador.
- Fallos no destruyen campañas.
- Prueba real documentada con consumo observado.

## E6 — Validación y publicación

### T-015 — Prueba física
Estado: TODO
Depende de: T-014

Aceptación:
- Campaña jugada.
- Incidencias registradas.
- Restricciones y reglas ambiguas corregidas.

### T-016 — Preparar despliegue
Estado: TODO
Depende de: T-015

Aceptación:
- Acceso y protección del endpoint.
- Presupuesto y cuotas.
- Logs sin secretos.
- Build y pruebas ejecutados.
- Limitaciones del producto visibles.

## Después del MVP

- Sincronización y cuentas.
- Integración con catálogos externos.
- Más productos y campañas largas.
- Impresión.
- Pulido visual y animación de volteo.
- Herramientas de corrección de campaña.
- Mejor soporte de accesibilidad y localización.

#Fin del documento