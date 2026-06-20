# lite Project Manager

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
- **Drag-and-Drop Kanban:** Smooth 5-column layout (`To Do`, `Working`, `Review`, `Dropped`, `Done`) powered by `dnd-kit`.
- **Smart Progress Bar:** A sleek progress bar that tracks the percentage of activities successfully moved to the `Done` column.
- **Checklists:** Break down activities into micro-tasks directly inside the cards.
- **Persistent Settings:** Real-time Dark/Light mode toggling and font adjustments that save directly to your local preferences.

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
