# Mythos Weaver — Changelog

#Inicio del documento

Registro de cambios relevantes del proyecto.

## Convenciones

- Registrar únicamente cambios realizados.
- No registrar propuestas como funcionalidades implementadas.
- No usar el changelog como lista de tareas.
- Mantener los cambios pendientes de lanzamiento en [Unreleased].
- Al publicar una versión, mover sus cambios a una sección con versión
  y fecha real de publicación.
- Formato de fecha: YYYY-MM-DD.
- Ordenar las versiones de la más reciente a la más antigua.
- No incluir secretos, claves, datos personales ni logs sensibles.

La versión de cada documento es independiente de la versión de la aplicación.

## Categorías

Utilizar solo las categorías que tengan cambios:

- Added: nuevas funcionalidades, archivos o capacidades.
- Changed: modificaciones de comportamiento existente.
- Fixed: correcciones de errores.
- Deprecated: elementos que se retirarán más adelante.
- Removed: elementos eliminados.
- Security: cambios relacionados con seguridad.
- Documentation: cambios en documentación.

Las pruebas ejecutadas y sus resultados se detallan en STATE.md
o en la evidencia de la tarea correspondiente.

## [Unreleased]

### Documentation

- Añadido PRD.md con visión, alcance del MVP y criterios de aceptación.
- Añadido STATE.md para registrar el estado verificable del proyecto.
- Añadido ARCHITECTURE.md con la arquitectura objetivo y límites del motor.
- Añadido TASKS.md con etapas, dependencias y criterios de aceptación.
- Añadido UI_RULES.md con reglas de interacción y presentación.
- Añadido DB_SCHEMA.md con el diseño propuesto de persistencia local.
- Añadido CHANGELOG.md para registrar cambios relevantes.
- Documentada la auditoría T-001 y sus verificaciones pendientes.
- Añadidos HANDOFF.md y GEMINI_RECOVERY.md para continuidad del trabajo.

## Historial anterior al reinicio

La implementación anterior se conserva como referencia histórica.

Sus funcionalidades no se consideran implementadas, migradas o verificadas
en esta nueva base hasta completar las tareas correspondientes.

No se reconstruirá retrospectivamente un historial de versiones
sin evidencia verificable.

#Fin del documento