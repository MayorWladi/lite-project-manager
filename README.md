# Lite Project Manager

A lightning-fast, minimalist, and local-first Kanban project manager designed for personal use and ultimate focus.

## 🚀 Philosophy
**"Lite Project Manager"** was built to solve a single problem: traditional project managers are bloated. They demand sign-ups, slow loading times, complex permission models, and a barrage of notifications.

This project goes against the grain:
- **Zero Login:** Open the app and start working immediately.
- **Local-First:** All your data (projects, sprints, activities, and settings) is stored locally in your browser's `localStorage`. No cloud syncing delays, no privacy concerns. It's yours.
- **Fast & Lightweight:** Built with Next.js and Tailwind CSS v4, optimized for near-instant interactions and snappy drag-and-drop mechanics.

## ✨ Aesthetic & UI Design (Lo-Fi)
The visual identity of this manager is heavily inspired by **Lo-Fi** aesthetics—creating a relaxed, warm, and comfortable environment for focused work:
- **Warm Color Palette:** Avoids harsh pure whites and pitch blacks. Light mode uses a creamy paper texture (`#F4F0EB`), while dark mode leans into a cozy dark coffee hue (`#1C1A19`) to reduce eye strain.
- **Micro-Interactions:** Subtle hover shifts, gentle shadows that simulate physical cardboard cards, and smooth scroll entry animations.
- **Safe Centered Layout:** Designed with a "Safe Center" approach for ultra-wide screens, where your Kanban columns naturally center themselves, keeping a symmetric and balanced workspace without cutting off content on smaller screens.
- **Customizable Typography:** Choose from 4 curated Lo-Fi fonts (DM Sans, Quicksand, Comfortaa, JetBrains Mono) dynamically in the settings to match your vibe.

## 📋 Features
- **Project & Sprint Management:** Group your activities into isolated sprints under your different projects.
- **Drag-and-Drop Kanban:** Smooth 5-column layout (`To Do`, `In Progress`, `Review`, `Dropped`, `Done`) powered by `dnd-kit`.
- **Smart Progress Bar:** A sleek progress bar that tracks the percentage of activities successfully moved to the `Done` column.
- **Checklists:** Break down activities into micro-tasks directly inside the cards.
- **Bilingual Support:** Full interface translation available in English and Spanish.
- **Persistent Settings:** Real-time Dark/Light mode toggling and font adjustments that save directly to your local preferences.

## 🏗️ Architecture & Core Engines
Under the hood, Lite Project Manager is powered by robust architectural decisions designed to keep the codebase clean, performant, and highly scalable:
- **Feature-Sliced Design (FSD):** The application adheres to modular component design. Complex UI orchestrators are broken down into granular, single-responsibility micro-components, ensuring maximum reusability and maintainability.
- **Dynamic Theme Engine:** A zero-runtime-cost theme switcher powered entirely by CSS Specificity and Variables. It allows injecting entirely new aesthetics without relying on JavaScript for layout repaints, falling back gracefully to base Dark/Light mode traits based on the `isDark` flag.
- **Global Confirmation Engine:** A centralized `ConfirmationContext` protects destructive actions (like deleting projects or sprints). It uses dynamic security levels, requiring exact-name matching for high-risk deletions, ensuring data safety without cluttering the UI with repeated modal states.
- **Native Animation Synchronization:** Bypassing heavy animation libraries, the app utilizes native CSS transitions paired with synchronized `requestAnimationFrame` hooks to perfectly orchestrate complex DOM entry/exit animations without race conditions.
- **Data Portability Engine:** A robust JSON-based backup system allows users to seamlessly download their entire workspace or import data using "Merge" (safe) or "Overwrite" (destructive) strategies with strict structural validation.

## 🛠 Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 (Using custom CSS variables and `@custom-variant dark` strategies)
- **Drag & Drop:** `@dnd-kit` (Core, Sortable, Utilities)
- **State Management:** React Context API + LocalStorage Hooks

## 📦 Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) and start organizing your life. No account required.
