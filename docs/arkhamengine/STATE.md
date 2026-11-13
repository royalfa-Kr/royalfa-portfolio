# Mythos Weaver — Estado del proyecto

# Inicio del documento

Versión del documento: 0.1

## 1. Estado actual

El proyecto está en reinicio de implementación.

Existe una especificación inicial y un expediente de una implementación
anterior. El código anterior no se considera integrado, validado ni aprobado
para esta nueva arquitectura.

No se ha verificado todavía:
- El repositorio completo.
- Las versiones instaladas.
- El layout y footer del sitio contenedor.
- La configuración de despliegue.
- El catálogo físico inicial.
- La disponibilidad del modelo en la cuenta del proyecto.

## 2. Decisiones base

- Integración dentro del proyecto Next.js existente.
- Ruta: /apps/tools/arkhamengine.
- Código del dominio en features/arkhamengine.
- Zod como contrato ejecutable.
- Motor determinista para consecuencias.
- Gemini como proveedor de contenido, no como autoridad del estado.
- IndexedDB como persistencia propuesta del MVP.
- Zustand no será la fuente persistente de verdad.
- Primera campaña: dos escenarios.
- Catálogo pequeño y revisado antes de ampliar compatibilidad.

## 3. Implementación verificada

Ninguna funcionalidad de la nueva implementación está verificada todavía.

## 4. Etapa activa

## Etapa activa

E0 — Auditoría completada; shell pendiente.

## Última tarea completada

T-001 — Auditoría documental y de integración.
Evidencia y limitaciones en AUDIT_T001.md.

## Próxima tarea

T-002 — Crear el shell mínimo sin IA ni persistencia.

## Verificaciones pendientes

Build, lint, tipos y navegador no ejecutados.
La existencia de la documentación local de Next.js está confirmada,
pero su contenido aún no fue revisado.

## 5. Siguiente tarea

T-001:
Inspeccionar el repositorio y presentar un plan de integración
sin modificar todavía funcionalidades existentes.

## 6. Bloqueantes

- Falta package.json real y archivo de lock.
- Falta revisar layout raíz y rutas existentes.
- Falta seleccionar el catálogo inicial.
- Falta definir política de acceso al endpoint de generación.

## 7. Evidencias

Aún no existen resultados de build, pruebas o partidas
correspondientes a la nueva implementación.

Cada evidencia futura debe incluir:
- Comando o procedimiento.
- Fecha de ejecución.
- Resultado real.
- Commit, cuando corresponda.

## 8. Convenciones para actualizar este archivo

- No marcar una tarea como terminada sin verificar su aceptación.
- Distinguir implementado de probado.
- Registrar los bloqueantes reales.
- Indicar la próxima tarea concreta.
- No copiar como hechos las afirmaciones de otro asistente sin comprobarlas.
- Si una prueba no se ejecutó, escribir "no ejecutada" y explicar por qué.

## 9. Registro de avances

| Fecha | Tarea | Cambio | Evidencia | Pendientes |
|---|---|---|---|---|
| — | — | Especificación inicial | Documentos | Auditoría del repositorio |

#Fin del documento