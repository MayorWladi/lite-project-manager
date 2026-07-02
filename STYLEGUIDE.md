# UI & Style Guide

Lite Project Manager is designed with a very specific, minimalist "Lo-Fi" aesthetic. Our goal is to provide a warm, distraction-free environment that feels more like an analog desk than a harsh corporate dashboard.

## 1. Color Palette

We avoid pure whites (`#FFFFFF`) and pitch blacks (`#000000`) to reduce eye strain. All colors are managed via CSS Variables in `app/globals.css`.

- **Light Mode (Paper/Analog):**
  - Background: `#F4F0EB` (Creamy paper texture)
  - Cards: `#FFFFFF` (Soft contrast against the background)
  - Text: `#1C1A19` (Soft dark brown/gray)

- **Dark Mode (Coffee/Night):**
  - Background: `#1C1A19` (Warm dark espresso)
  - Cards: `#2A2726` (Slightly lighter to create depth)
  - Text: `#F4F0EB` (Soft cream text for readability)

> **Rule:** Do not hardcode HEX colors in Tailwind classes (e.g., `bg-[#FF0000]`). Always use the semantic variables (e.g., `bg-background`, `text-foreground`, `bg-(--color-card-bg)`).

## 2. Animations (Native CSS Only)

We value absolute performance and minimal bundle size. 

**Rule:** Do not install heavy animation libraries like `framer-motion` or `react-spring`. 

All animations are handled natively via CSS transitions and Tailwind's `@tailwindcss/animate` plugin (`animate-in`, `fade-in`, `slide-in-from-top`).

For complex orchestrations (like unmounting elements), we use our custom double `requestAnimationFrame` hooks found in `app/common/hooks/` to sync DOM states cleanly.

## 3. Typography

We allow users to dynamically change their fonts. To support this:
- Do not hardcode specific font families (like `font-sans` or `font-serif`) unless strictly necessary for a specific UI element (like `font-mono` for code/numbers).
- Rely on the inherited `font-family` from the `<body>` tag, which is dynamically controlled by our `SettingsContext`.

## 4. Modals & Dialogs

- Never use browser-native `alert()` or `confirm()`.
- Use the global `ConfirmModal` for destructive actions (via `useConfirmation` hook).
- Standard informational modals should use the generic `Modal` component found in `app/common/components/Modal.tsx`.
