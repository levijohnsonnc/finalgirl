

# Trademark Compliance Changes

## Summary
Three requirements to address, with minimal visual impact:

1. **Remove the word "companion"** from all app-facing text
2. **Add a trademark disclaimer** wherever the "Final Girl" brand is used
3. **Add "UNOFFICIAL" conspicuously on the landing page**

---

## Change 1: Replace "Companion" everywhere

The word "Companion" appears in 4 code locations referring to this app. Each will be changed to **"Slasher Manager"** (or a similar neutral term). One occurrence in character lore (Uki's backstory) is not about the app and will be left alone.

| File | Current Text | New Text |
|---|---|---|
| `index.html` (title) | "Final Girl Slasher Companion" | "Final Girl Slasher Manager" |
| `index.html` (meta description) | "A horror board game companion app for Final Girl" | "An unofficial fan-made slasher manager for Final Girl" |
| `index.html` (og:title, twitter:title) | "Final Girl Slasher Companion" | "Final Girl Slasher Manager" |
| `index.html` (og:description, twitter:description) | "A horror board game companion app for Final Girl" | "An unofficial fan-made slasher manager for Final Girl" |
| `AppHeader.tsx` | "Slasher Companion" | "Slasher Manager" |
| `Index.tsx` footer | "FINAL GIRL (TM) SLASHER COMPANION" | "FINAL GIRL (TM) SLASHER MANAGER" |
| `VCRNavigation.tsx` | "SLASHER COMPANION" | "SLASHER MANAGER" |

---

## Change 2: Add "UNOFFICIAL" to the landing page

On the Marquee (landing/splash screen), add the word **"UNOFFICIAL"** in a visible position above the subtitle. It will be styled in the VHS font, small but clearly legible, with a slightly different color (e.g., `text-primary/50` for a subtle red tint) so it reads as intentional branding rather than an afterthought.

Placement: directly above or next to the "Slasher Manager" subtitle in the `AppHeader`, so when the Marquee loads, the user sees:

```
FINAL GIRL
UNOFFICIAL Slasher Manager
```

The word "UNOFFICIAL" will also appear in the footer bar on inner pages in the same spot.

---

## Change 3: Add trademark disclaimer

A small disclaimer line will be added in two places:

1. **Marquee landing page** -- at the very bottom of the screen, below the navigation links, in very small muted text. Styled to match the VHS aesthetic (small, low-opacity, tracking-wider). The full text:
   > "This is an unofficial fan-made application that is not endorsed by or affiliated with Van Ryder Games who is the registered trademark owner of Final Girl and all associated intellectual property rights."

2. **Footer bar on inner pages** (`Index.tsx` footer) -- a tooltip or always-visible micro-text. Given the footer is already compact, the cleanest approach is to make the "FINAL GIRL(TM)" text in the footer clickable/hoverable, showing the full disclaimer in a small tooltip. Alternatively, a small static line above the footer.

The disclaimer will also be included in the HTML `<meta name="description">` tags for search engine visibility.

---

## Files Modified

- **`index.html`** -- Update title, description, and social meta tags
- **`src/components/AppHeader.tsx`** -- Change "Slasher Companion" to "UNOFFICIAL Slasher Manager"
- **`src/components/Marquee.tsx`** -- Add disclaimer text at the bottom of the landing page
- **`src/pages/Index.tsx`** -- Update footer text, add disclaimer (tooltip on trademark text)
- **`src/components/VCRNavigation.tsx`** -- Change "SLASHER COMPANION" to "SLASHER MANAGER"

No changes to game logic, data files, styling framework, or backend.

