# Mythos Weaver — Traspaso

## Qué estamos construyendo

Companion narrativo para Arkham Horror LCG.
Genera escenarios overlay con la colección declarada.
El jugador administra la mesa y confirma resultados.
No es un simulador.

MVP:
- Minicampaña de dos escenarios.
- 1–4 investigadores genéricos.
- 3 etiquetas de historia y 2 rasgos de mazo por investigador.
- Catálogo inicial reducido y revisado.
- Persistencia local, registro y respaldo JSON.

## Fuente de verdad

Los archivos del repositorio, no la memoria del chat.

Leer primero:
- STATE.md
- AUDIT_T001.md
- La tarea activa en TASKS.md.

Consultar PRD, ARCHITECTURE, UI_RULES y DB_SCHEMA
según la tarea, sin asumir que lo descrito ya existe.

## Estado

T-001 completada como revisión documental y de integración.
No se ejecutaron build, lint ni pruebas.

Solo se han confirmado documentación y carpetas.
No hay un motor nuevo verificado.

El código anterior está en un chat de Gemini y no es requisito
para continuar.

## Ubicaciones

- UI: app/apps/tools/arkhamengine/.
- API: app/api/arkhamengine/generate/route.ts.
- Dominio: features/arkhamengine/.
- Documentos: docs/arkhamengine/.

No modificar otras herramientas para implementar Arkham.

## Integración

Conservar inicialmente Navbar y Footer existentes.
No introducir otro main dentro del main raíz.

SeriesTrackerDB pertenece a otra herramienta.
Mythos Weaver tendrá su propia base.

No reutilizar ROY_ADMIN_PIN ni upcomingClass.

## Próxima tarea

T-002: estructura y shell mínimo.

Antes de implementar:
1. Confirmar archivos reales existentes.
2. Consultar documentación local relevante en node_modules/next/dist/docs/.
3. Presentar archivos a crear y modificar.
4. Solicitar autorización para cambios globales.
5. No instalar dependencias sin aprobación.

El shell no necesita todavía Gemini, Zustand, Zod ni persistencia.

## Reglas de trabajo

- Una tarea acotada por iteración.
- No declarar comandos ejecutados sin evidencia.
- No suponer acceso a archivos locales.
- Entregar archivos completos o cambios inequívocos si no hay acceso al repo.
- Actualizar STATE, TASKS y CHANGELOG al completar trabajo.
- Mantener cambios ajenos fuera del commit.
- No pedir ni compartir secretos.

## Pendientes posteriores

- Catálogo inicial.
- Validadores y pruebas.
- Protección y presupuesto de generación.
- Modelo disponible.
- Implementación del motor y persistencia.