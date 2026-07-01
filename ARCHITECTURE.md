# Arquitectura Basada en Features (Feature-Sliced Design) en Next.js

Esta guía documenta la filosofía de arquitectura recomendada e implementada en este proyecto, basada en el aislamiento por dominios funcionales o vistas. Es el estándar moderno altamente recomendado para aplicaciones medianas y grandes, especialmente en el ecosistema de **Next.js (App Router)**.

## 1. El Problema de la Arquitectura Clásica

Típicamente, al aprender Next.js, los proyectos se organizan por **Tipos de Archivos**:
```text
app/
 ├─ page.tsx
 ├─ components/ (Sidebar, Button, Modal, Board)
 ├─ hooks/ (useAuth, useDragAndDrop)
 ├─ controllers/ (userController, boardController)
 ├─ context/ (AuthContext, BoardContext)
```
**El problema:** Si necesitas modificar o eliminar una sola funcionalidad (ej. "El Tablero"), tienes que buscar como un detective en 4 carpetas diferentes repartidas por todo el proyecto. Al eliminar algo, es fácil dejar código basura (hooks huérfanos) o romper otras dependencias sin querer.

## 2. La Solución: Aislamiento por Funcionalidad (Feature) en Next.js

En esta arquitectura, agrupamos los archivos por **Dominio de Negocio** o **Vista**. Todo lo que pertenece a una característica específica vive junto en un solo ecosistema cerrado.

En **Next.js App Router**, la carpeta `app/` se utiliza para crear rutas web. Si creas una carpeta llamada `app/board`, Next.js intentará crear la ruta `tusitio.com/board`. 
Para evitar esto y almacenar nuestra arquitectura de forma segura, podemos usar **Rutas Agrupadas** como `(features)` (los paréntesis le dicen a Next.js que ignore la carpeta para el enrutamiento), o simplemente llamarla `features/` si no contiene ningún archivo `page.tsx`.

La estructura queda así:

```text
app/
 ├─ page.tsx         <-- Consume los componentes de los features
 ├─ features/
 │   ├─ common/          <-- Única carpeta para código global/compartido
 │   │   ├─ components/  (Button, Modal, AppLayout)
 │   │   └─ context/     (ProjectContext)
 │   │
 │   ├─ board/           <-- Dominio: Tablero Kanban
 │   │   ├─ components/  (KanbanBoard, Column, Card)
 │   │   ├─ hooks/       (useDragAndDrop)
 │   │   └─ controllers/ (boardController)
 │   │
 │   └─ sidebar/         <-- Dominio: Panel Lateral
 │       ├─ components/  (Sidebar, ProjectList)
 │       └─ data/        (sidebarMenuItems)
```

### Ventajas en Next.js:
1. **Alta Cohesión:** Todo lo relacionado al tablero está en la carpeta `board`.
2. **Componentes de Servidor vs Cliente:** Al tener los features aislados, es mucho más fácil saber qué partes completas de la app necesitan `"use client"` y cuáles pueden seguir siendo de servidor.
3. **Escalabilidad y Eliminación Segura:** Si decides que la app ya no tendrá "Sidebar", simplemente borras la carpeta `features/sidebar/` entera.

## 3. Reglas de Oro de esta Arquitectura

- **Prohibido importar entre features hermanos:** El código dentro de `features/board/` NO DEBERÍA importar un hook de `features/sidebar/`. Si necesitan compartir algo, ese hook debe extraerse y moverse a `features/common/`.
- **Common es sagrado:** Solo pon en `common/` cosas que se utilicen genuinamente en 2 o más features diferentes.
- **Jerarquía Visual:** Trata de que tus "features" se mapeen a grandes bloques visuales de tu pantalla (ej. `header`, `sidebar`, `feed`, `activity-details`).

---

## 4. Prompt para IAs: Reestructuración Automática

Si en el futuro inicias otro proyecto de Next.js, terminas con un espagueti de código y quieres que una Inteligencia Artificial ordene el desastre usando esta arquitectura, cópiale el siguiente prompt exacto:

> **PROMPT PARA ESTRUCTURAR PROYECTOS NEXT.JS:**
> 
> "Actúa como un Arquitecto de Software Senior especializado en React y Next.js (App Router). Actualmente, mi proyecto está estructurado de forma plana por tipos de archivos (components, hooks, utils, types, etc.) regados en el directorio raíz o dentro de app/ y quiero migrarlo a una Arquitectura Basada en Features (Feature-Sliced Design).
> 
> Necesito que analices todos los archivos de mi proyecto y propongas un plan detallado para moverlos a una nueva carpeta llamada `app/features/` (o `src/features/` si uso src).
> 
> REGLAS DE LA MIGRACIÓN:
> 1. Crea carpetas de 'features' basadas en dominios funcionales de mi app o bloques visuales grandes (ej. 'auth', 'dashboard', 'sidebar', 'checkout').
> 2. Cada feature debe contener internamente sus propias subcarpetas dependiendo de lo que use (ej. `features/dashboard/components`, `features/dashboard/hooks`, `features/dashboard/controllers`).
> 3. Crea una carpeta `features/common/` (o `shared/`) exclusivamente para botones, modales genéricos, contextos globales y hooks de utilidad que se utilicen en más de 2 features simultáneamente.
> 4. Regla estricta: Ningún feature (ej. 'sidebar') puede importar cosas de otro feature hermano (ej. 'dashboard'). Todo código cruzado debe aislarse y enviarse a 'common/'.
> 5. Ten cuidado de no romper el enrutamiento de Next.js (los archivos page.tsx y layout.tsx principales deben quedarse donde están y solo actualizar sus imports).
> 
> Preséntame primero el árbol de carpetas exacto de cómo quedará el código. Una vez que te lo apruebe, por favor crea los scripts de terminal, de node, o los reemplazos necesarios para mover los archivos físicos y actualizar recursivamente todas las rutas de los 'imports' que se rompan en el proceso."
