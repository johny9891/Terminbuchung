# UI/UX-Ideen

## Designprinzipien

1. **Less is more** — keine überladene Sidebar, max. 4 Hauptbereiche
2. **Speed perception** — Skeletons, Optimistic UI, Streaming-Antworten
3. **Dark Mode first** — Standard ist Dark, weil Power-User dort leben
4. **Mobile-Tauglich** — Bottom-Nav statt Burger; jede Aktion mit Daumen erreichbar
5. **Konsistente Akzentfarbe** — Purple/Pink-Gradient als Wiedererkennung

## Design-System

| Token        | Wert                                       |
|--------------|--------------------------------------------|
| Primary      | `hsl(262 83% 58%)` (Purple)                |
| Akzent       | Gradient Purple → Pink → Orange            |
| Border-Radius| `0.75rem` (lg) — runder = freundlicher     |
| Spacing      | Tailwind-Standard (4-Pixel-Grid)           |
| Font         | Inter (Variable, via `next/font/google`)   |
| Schatten     | Subtil, dezent — keine harten Drop-Shadows |

## Layout-Patterns

### Dashboard
```
┌──────────────────────────────────────────────────┐
│ Sidebar │  Topbar (Plan, Theme, User)            │
│         │ ─────────────────────────────────────  │
│ ▸ Home  │  Welcome, {firstName} 👋               │
│ ▸ Docs  │                                        │
│ ▸ Chat  │  [Stat] [Stat] [Stat] [Stat]           │
│ ▸ Settn │                                        │
│         │  ┌─ Upload-Zone (Dropzone) ────────┐  │
│ Upgrade │  │                                  │  │
│         │  └──────────────────────────────────┘  │
│         │                                        │
│         │  Recent Documents                      │
│         │  [Card] [Card] [Card]                  │
└─────────┴────────────────────────────────────────┘
```

### Document Detail
3-Tab-Switch im Glass-Container: Summary | Chat | Flashcards.
Klare visuelle Trennung statt Modal-Stacking.

### Mobile
- Sidebar collapse → Bottom-Tab-Bar mit 4 Icons
- Topbar bleibt, nur User-Menü als Sheet
- Tab-Switcher full-width für Touch-Targets

## Micro-Interactions

- **Card-Hover**: `-translate-y-0.5 + shadow-md` (subtiler Lift)
- **Button-Loading**: Spinner inline, Text bleibt sichtbar
- **Toast-Animations**: Top-Right-Slide-In, auto-dismiss 3s
- **Dropzone-Drag**: Border+Background ändern Farbe + sanftes Pulsieren
- **Tab-Switch**: 200ms cross-fade, kein Layout-Shift
- **Chat-Typing-Indicator**: 3 bouncing Dots im Bot-Bubble

## Empty States

Statt leerer Listen immer:
- Icon (subtil)
- Klare Headline („Noch keine Dokumente")
- Erklärender Subtext (1 Satz)
- Primary-CTA, falls Aktion möglich

## Onboarding-Ideen (Phase 2)

1. **Pre-loaded Demo-PDF** für neue User („Probiere DocuAI mit einem
   Beispieldokument").
2. **Inline-Tooltips** beim ersten Dashboard-Besuch (driver.js o.ä.).
3. **Email-Drip-Sequenz** (Tag 1, 3, 7) mit Tipps + Pro-Hint.
4. **Sample-Prompts** im leeren Chat-State (3 vorgeschlagene Fragen).

## Accessibility

- Alle interaktiven Elemente haben `aria-label` oder Text
- Focus-Ring auf `--ring` (sichtbar in Light + Dark)
- Kontrast min. WCAG-AA für Body-Text
- `prefers-reduced-motion` respektieren (Framer-Motion hat eingebauten Support)
- Semantic HTML (`<header>`, `<main>`, `<nav>`, `<aside>`)

## Verbesserungen für später

- **Command-Palette** (CMD+K) für Power-User: schneller Doc-Wechsel,
  Aktionen wie „Generate Flashcards", „Toggle Theme".
- **Multi-Doc-Chat**: einen Chat mit Kontext aus mehreren Dokumenten.
- **Annotated PDF-Viewer** mit Highlight-to-Chat („was bedeutet diese Stelle?").
- **AI-generierte Cover-Bilder** für Document-Cards (kleines Visual-Detail).
- **Reading-Time-Estimate** in Document-Cards.
- **Pro-Badge mit Stern-Glow** in Topbar für Pro-User.
