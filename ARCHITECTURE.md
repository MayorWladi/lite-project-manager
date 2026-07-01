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
 ├─ common/          <-- (Capa Shared) Código global ligado a React
 │   ├─ components/  (Button, Modal, AppLayout)
 │   └─ context/     (ProjectContext)
 │
 ├─ utils/           <-- Código agnóstico (puro JS/TS) reutilizable en cualquier framework
 │   ├─ helpers/     (notifications)
 │   └─ storage/     (collaborators)
 │
 ├─ features/
 │   ├─ board/           <-- Dominio: Tablero Kanban
 │   │   ├─ KanbanBoard.tsx  <-- API PÚBLICA (Único punto de entrada)
 │   │   ├─ components/      (Componentes internos aislados como KanbanCell)
 │   │   └─ hooks/           (useDragAndDrop)
 │   │
 │   └─ sidebar/         <-- Dominio: Panel Lateral
 │       ├─ Sidebar.tsx      <-- API PÚBLICA
 │       └─ components/      (ProjectList, ProjectForm)
```

### Ventajas en Next.js:
1. **Alta Cohesión:** Todo lo relacionado al tablero está en la carpeta `board`.
2. **Componentes de Servidor vs Cliente:** Al tener los features aislados, es mucho más fácil saber qué partes completas de la app necesitan `"use client"` y cuáles pueden seguir siendo de servidor.
3. **Escalabilidad y Eliminación Segura:** Si decides que la app ya no tendrá "Sidebar", simplemente borras la carpeta `features/sidebar/` entera.

## 3. Reglas de Oro de esta Arquitectura

- **Prohibido importar entre features hermanos:** El código dentro de `features/board/` NO DEBERÍA importar algo interno de `features/sidebar/`.
- **Patrón de API Pública:** Cada feature expone **solamente** su componente principal en la raíz de su carpeta (ej. `features/board/KanbanBoard.tsx`). Nunca debes importar nada que esté dentro de una subcarpeta `components/` de un feature desde afuera.
- **`common/` vs `utils/`:** `common/` es el ecosistema de componentes globales y hooks de **React** (ej. Modales, Temas). `utils/` es puramente funciones **JavaScript/TypeScript** sin dependencias de React (puedes copiarlos a otros proyectos no-React).

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
> 3. Saca todo el código agnóstico de React (helpers, funciones matemáticas, constantes, storage) a una carpeta `app/utils/` a nivel raíz.
> 4. Crea una carpeta `app/common/` (o `shared/`) a nivel raíz exclusivamente para componentes visuales genéricos, modales, contextos globales y hooks de React que se utilicen en más de 2 features.
> 5. Implementa el patrón "Public API": cada feature debe exponer su(s) componente(s) principal(es) directamente en la raíz de su carpeta (ej. `features/dashboard/Dashboard.tsx`). El resto de su código va en subcarpetas internas y NO puede ser importado desde afuera.
> 6. Regla estricta: Ningún feature puede importar cosas internas de otro feature hermano. Todo código cruzado debe ir a 'common/'.
> 5. Ten cuidado de no romper el enrutamiento de Next.js (los archivos page.tsx y layout.tsx principales deben quedarse donde están y solo actualizar sus imports).
> 
> Preséntame primero el árbol de carpetas exacto de cómo quedará el código. Una vez que te lo apruebe, por favor crea los scripts de terminal, de node, o los reemplazos necesarios para mover los archivos físicos y actualizar recursivamente todas las rutas de los 'imports' que se rompan en el proceso."
