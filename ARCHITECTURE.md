# Feature-Sliced Design (FSD) in Next.js

This guide documents the architectural philosophy recommended and implemented in this project, based on isolation by functional domains or views. It is the modern standard highly recommended for medium to large applications, especially in the **Next.js (App Router)** ecosystem.

## 1. The Problem with Classical Architecture

Typically, when learning Next.js, projects are organized by **File Types**:
```text
app/
 ├─ page.tsx
 ├─ components/ (Sidebar, Button, Modal, Board)
 ├─ hooks/ (useAuth, useDragAndDrop)
 ├─ controllers/ (userController, boardController)
 ├─ context/ (AuthContext, BoardContext)
```
**The problem:** If you need to modify or remove a single feature (e.g., "The Board"), you have to play detective across 4 different folders scattered throughout the project. When removing something, it's easy to leave behind dead code (orphaned hooks) or accidentally break other dependencies.

## 2. The Solution: Feature Isolation in Next.js

In this architecture, we group files by **Business Domain** or **View**. Everything belonging to a specific feature lives together in a single, closed ecosystem.

In **Next.js App Router**, the `app/` folder is used to create web routes. If you create a folder named `app/board`, Next.js will attempt to create the route `yoursite.com/board`. 
To avoid this and store our architecture safely, we can use **Route Groups** like `(features)` (the parentheses tell Next.js to ignore the folder for routing), or simply name it `features/` if it doesn't contain any `page.tsx` file.

The structure looks like this:

```text
app/
 ├─ page.tsx         <-- Consumes components from features
 ├─ common/          <-- (Shared Layer) Global code tied to React
 │   ├─ components/  (Button, Modal, AppLayout)
 │   └─ context/     (ProjectContext)
 │
 ├─ utils/           <-- Agnostic code (pure JS/TS) reusable in any framework
 │   ├─ helpers/     (notifications)
 │   └─ storage/     (collaborators)
 │
 ├─ features/
 │   ├─ board/           <-- Domain: Kanban Board
 │   │   ├─ KanbanBoard.tsx  <-- PUBLIC API (Single entry point)
 │   │   ├─ components/      (Isolated internal components like KanbanCell)
 │   │   └─ hooks/           (useDragAndDrop)
 │   │
 │   └─ sidebar/         <-- Domain: Sidebar
 │       ├─ Sidebar.tsx      <-- PUBLIC API
 │       └─ components/      (ProjectList, ProjectForm)
```

### Advantages in Next.js:
1. **High Cohesion:** Everything related to the board is in the `board` folder.
2. **Server vs Client Components:** Having features isolated makes it much easier to know which entire parts of the app need `"use client"` and which can remain as server components.
3. **Scalability and Safe Deletion:** If you decide the app no longer needs a "Sidebar", you simply delete the entire `features/sidebar/` folder.

## 3. Golden Rules of this Architecture

- **No importing between sibling features:** Code inside `features/board/` SHOULD NOT import internal code from `features/sidebar/`.
- **Public API Pattern:** Each feature exposes **only** its main component at the root of its folder (e.g., `features/board/KanbanBoard.tsx`). You should never import anything from inside a `components/` subfolder of a feature from the outside.
- **`common/` vs `utils/`:** `common/` is the ecosystem for global components and **React** hooks (e.g., Modals, Themes). `utils/` is purely **JavaScript/TypeScript** functions with no React dependencies (you can copy them to other non-React projects).

---

## 4. AI Prompt: Automatic Restructuring

If you start another Next.js project in the future, end up with spaghetti code, and want an Artificial Intelligence to organize the mess using this architecture, copy the exact prompt below:

> **PROMPT FOR STRUCTURING NEXT.JS PROJECTS:**
> 
> "Act as a Senior Software Architect specializing in React and Next.js (App Router). Currently, my project is structured flatly by file types (components, hooks, utils, types, etc.) scattered in the root directory or inside app/, and I want to migrate it to a Feature-Sliced Design (FSD) architecture.
> 
> I need you to analyze all the files in my project and propose a detailed plan to move them to a new folder called `app/features/` (or `src/features/` if I use src).
> 
> MIGRATION RULES:
> 1. Create 'features' folders based on functional domains of my app or large visual blocks (e.g., 'auth', 'dashboard', 'sidebar', 'checkout').
> 2. Each feature must internally contain its own subfolders depending on what it uses (e.g., `features/dashboard/components`, `features/dashboard/hooks`, `features/dashboard/controllers`).
> 3. Extract all React-agnostic code (helpers, math functions, constants, storage) into a root-level `app/utils/` folder.
> 4. Create a root-level `app/common/` (or `shared/`) folder exclusively for generic visual components, modals, global contexts, and React hooks used across more than 2 features.
> 5. Implement the "Public API" pattern: each feature must expose its main component(s) directly at the root of its folder (e.g., `features/dashboard/Dashboard.tsx`). The rest of its code goes into internal subfolders and CANNOT be imported from the outside.
> 6. Strict rule: No feature can import internal code from a sibling feature. All cross-cutting code must go to 'common/'.
> 7. Be careful not to break Next.js routing (the main page.tsx and layout.tsx files should stay where they are and only update their imports).
> 
> Present to me first the exact folder tree of how the code will look. Once I approve it, please create the terminal scripts, Node scripts, or necessary replacements to move the physical files and recursively update all 'import' paths that break in the process."

---

## 5. Next.js Anti-FOUC Strategy

To provide a seamless experience with multiple themes (dark, light, matcha, etc.), this architecture implements a strict **Anti-FOUC (Flash of Unstyled Content)** strategy. 

In Next.js App Router, injecting theme classes dynamically on the client often causes a **Hydration Mismatch**, where the server renders one HTML layout (e.g., Light) and the client immediately switches it (e.g., Dark), causing React to throw errors or the screen to flash white.

**The Solution Implemented:**
- We extract the theme evaluation logic into an isolated component: `app/common/components/ThemeScript.tsx`.
- This component returns a raw HTML `<script>` tag using `dangerouslySetInnerHTML`.
- It is imported and placed directly inside the `<head>` of the root `layout.tsx`.
- Because this script executes **synchronously** before the browser renders the `<body>`, it applies the correct CSS variables *before* React even wakes up.
- To satisfy Next.js's strict Turbopack parser, the script tag is explicitly closed (`<script></script>`), preventing `Unterminated regexp literal` AST parsing errors.
