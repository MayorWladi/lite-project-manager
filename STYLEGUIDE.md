# UI & Style Guide

Lite Project Manager is designed with a very specific, minimalist "Lo-Fi" aesthetic. Our goal is to provide a warm, distraction-free environment that feels more like an analog desk than a harsh corporate dashboard.

## 1. Color Palette

We avoid pure whites (`#FFFFFF`) and pitch blacks (`#000000`) to reduce eye strain. All colors are managed via CSS Variables in `app/globals.css`.

- **Light Mode (Paper/Analog):**
  - Background: `#F4F0EB` (Creamy paper texture)
  - Cards: `#FCFBF9` (Soft off-white contrast against the background)
  - Text: `#1C1A19` (Soft dark brown/gray)

- **Dark Mode (Coffee/Night):**
  - Background: `#1C1A19` (Warm dark espresso)
  - Cards: `#2A2726` (Slightly lighter to create depth)
  - Text: `#F4F0EB` (Soft cream text for readability)

- **Matcha:** A pale, desaturated sage green (`#E2E7D9`) for a calming, herbal feel.
- **Midnight:** Deep ocean blue/indigo (`#111424`) for a moody, late-night aesthetic.
- **Honey:** Warm, golden-hour yellow/cream (`#F4EEDF`) with soft mustard accents.
- **Espresso:** A cozy, rich dark brown (`#231C18`) reminiscent of wood and coffee.

> **Rule:** Do not hardcode HEX colors in Tailwind classes (e.g., `bg-[#FF0000]`). Always use the semantic variables (e.g., `bg-background`, `text-foreground`, `bg-(--color-card-bg)`).
>
> **Accessibility Rule:** Always ensure that `--color-muted` (used for secondary text like checklists) has sufficient contrast against `--color-card-bg`. Light themes require darker muted tones, while Dark themes require lighter muted tones.

### 1.1 Dynamic Theme Engine (How to Add a New Theme)

The application uses a Dynamic Theme Engine capable of swapping global aesthetics at runtime without performance penalties.

**Step 1: Define the Theme Config**
Open `app/common/constants/themes.tsx` and append your new theme object to the `THEMES` array:
```tsx
  {
    id: "ocean", // Unique identifier
    name: { en: "Ocean", es: "Océano" },
    isDark: true, // true if it requires white text on hover states, false otherwise
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        {/* Your vector icon here */}
      </svg>
    ),
  }
```

**Step 2: Inject the CSS Variables**
Open `app/globals.css` and map your chosen colors to the same CSS variables used globally. To ensure it overrides the default `dark` or `light` modes properly, prefix your class with `:root.` like this:
```css
:root.theme-ocean {
  --background: #0B141A;
  --foreground: #D4E4F0;
  --color-border: #1B2936;
  --color-muted: #5C7A99;
  --color-card-bg: #111C24;
}
```
That's it! The settings modal will automatically read the new array, render a button for the theme, and inject the class into the DOM.

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
