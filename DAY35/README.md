# Addis Café (Addis Eats) — Resilient, Fast & Accessible React Architecture

A production-grade, highly resilient Ethiopian restaurant web application built with React 19, React Router, Zustand, and accessible UI primitives.

---

## 🛡️ Fault Isolation: Independent Error Boundaries

The application isolates runtime errors so a failure in one region does **not** take down the rest of the page:

1. **Menu Boundary**: Wraps `<Menu />`. If a dish or network transform throws an error (tested via the `"⚡ Test Menu Crash"` button), only the menu region unmounts, displaying the `MenuFallback` with a **"Try Reloading Menu"** button. The `<Header>`, `<CartBadge>`, navigation, and shopping cart remain 100% interactive!
2. **Cart Boundary**: Wraps `<Cart />`. If an error occurs in the cart (tested via the `"⚡ Test Cart Crash"` button), only the cart area displays the `CartFallback`, leaving the menu and header intact.
3. **Checkout Boundary**: Wraps `<Checkout />`. Catches dynamic chunk load errors (e.g. offline dropouts) and provides a retry mechanism instead of a blank white screen.

---

## ⚡ Performance: Code-Splitting & Suspense Skeletons

To guarantee fast initial page loads for visitors who only want to browse, heavy transactional routes are code-split using `React.lazy()`:

```
dist/assets/Checkout-BMJmmjkv.js      7.25 kB │ gzip:  2.18 kB
dist/assets/Cart-CEshxQZ8.js          3.71 kB │ gzip:  1.25 kB
dist/assets/DishDetail-BuubXGiF.js    3.83 kB │ gzip:  1.36 kB
dist/assets/index-Bz0JhqKg.js       261.73 kB │ gzip: 81.90 kB
```

- **Selective Download**: The checkout chunk (`Checkout-*.js`) is **never downloaded** when visiting the homepage or browsing the menu. It is only fetched over the wire when the user explicitly clicks "Checkout".
- **Pulsing Skeletons**: While lazy chunks download, React renders `<CheckoutSkeleton />` with realistic animated placeholders for form fields, cards, and payment summaries.

---

## ⌨️ Accessibility: Portal Modal (`ui/Modal.jsx`)

The dish Quick View modal escapes its card container and renders into `document.body` via `createPortal`:

- **Escapes Card Bounds**: Rendered at root level with high z-index and backdrop blur, unaffected by parent card CSS transforms or overflow clipping.
- **Escape Key Listener**: Pressing `Escape` closes the modal immediately.
- **Strict Focus Trapping**: Navigating with `Tab` and `Shift + Tab` cycles strictly through focusable elements inside the modal, preventing keyboard focus from escaping behind the overlay.
- **Focus Return**: Captures `document.activeElement` before the modal opens, and automatically returns focus to the exact card button that launched it when closed.
- **100% Keyboard Operable**: You can open, configure, and close the modal without touching the mouse.

---

## 📊 Measured Performance (`PROFILE.md`)

- **Identified Bottleneck**: Search text state changes in `Menu.jsx` were triggering unmemoized re-renders of all 8 `Dish` components on every keystroke.
- **Optimization**: Wrapped `Dish` in `React.memo`, provided stable action references from Zustand (`addItem`), and memoized filtered dish arrays.
- **Result**: Re-render latency dropped from **14.8 ms** to **1.2 ms** (**~12.6x speedup**, 91.9% reduction in execution time). See [`PROFILE.md`](./PROFILE.md) for full benchmark traces and methodology.

---

## 🎯 Self-Check Verification Checklist

| Check / Question | Status | Verification |
|---|---|---|
| **Does a thrown error in one dish leave the header and cart working?** | ✅ Yes | Triggering `"⚡ Test Menu Crash"` displays `MenuFallback`; the Header, Cart counter, and navigation remain fully functional. |
| **Does your fallback tell the person what failed and offer them something to do?** | ✅ Yes | Displays clear section-specific failure messaging and actionable buttons (**"Try Reloading Menu"**, **"View Your Cart"**). |
| **Does the checkout chunk download only when you navigate to it?** | ✅ Yes | Verified in Vite build output (`Checkout-*.js` is a separate chunk, requested on demand). |
| **Does a failed chunk download show the boundary fallback rather than a blank screen?** | ✅ Yes | Wrapped in `<ErrorBoundary name="Checkout" fallback={CheckoutFallback}>`. |
| **Does PROFILE.md show a real before-and-after difference, not just a guess?** | ✅ Yes | Comprehensive 10-keystroke benchmark table with concrete milliseconds (14.8 ms vs 1.2 ms). |
| **Can you open, use and close the modal without touching the mouse?** | ✅ Yes | Open with `Enter`/`Space` on "Quick View", navigate with `Tab`, close with `Escape` or Close button, focus returns to trigger. |

---

## 🚀 How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
