# Noti-Toast Library Roadmap

This roadmap outlines planned improvements, bug fixes, and new features for the Noti-Toast library.

---

## Phase 1: Bug Fixes & Critical Issues

### 1.1 Fix Event Listener Memory Leak
**Priority:** High
**File:** `src/noti-toast.js:324-341`

The `pauseOnHover` setter creates new anonymous functions for `removeEventListener`, which won't actually remove the listeners since they're different function references.

```javascript
// Current (broken):
this.#toastElem.removeEventListener('mouseover', ()=>{ ... }); // Won't work

// Fix: Store function references as private fields
#handleMouseOver = () => { this.#isNotPaused = false; };
#handleMouseLeave = () => { this.#isNotPaused = true; };
```

### 1.2 XSS Vulnerability in Text/HTML Setters
**Priority:** High
**File:** `src/noti-toast.js:74-83`

The `text` setter uses `innerHTML` which allows script injection. The `text` property should escape HTML.

```javascript
// Current (vulnerable):
this.#toastElem.innerHTML = `<span class="ntl-toast-message">${value}</span>`;

// Fix for text setter:
const span = document.createElement('span');
span.className = 'ntl-toast-message';
span.textContent = value; // Safe - escapes HTML
this.#toastElem.innerHTML = '';
this.#toastElem.appendChild(span);
```

### 1.3 Input Validation
**Priority:** Medium
**File:** `src/noti-toast.js`

Add validation for:
- `position`: Validate against allowed values (top-left, top-center, top-right, etc.)
- `theme`: Validate against 'light', 'solid', 'dark'
- `type`: Validate against 'default', 'info', 'success', 'warning', 'error', 'custom'
- `autoClose`: Ensure positive number
- `animation.duration_ms`: Ensure positive number

### 1.4 Security Review of parseFunction.js
**Priority:** Medium
**File:** `lib/parseFunction.js`

The `parseFunction` utility uses `Function()` constructor which has similar risks to `eval()`. Consider:
- Documenting security implications
- Adding input sanitization
- Providing alternative callback mechanisms

---

## Phase 2: Code Quality & Refactoring

### 2.1 Refactor Type Setter
**Priority:** High
**File:** `src/noti-toast.js:88-218`

The `set type()` method is ~130 lines with repetitive code. Extract theme/type configurations into data structures.

```javascript
const TYPE_CONFIGS = {
  info: {
    light: { bgColor: 'hsla(200, 70%, 85%, 1)', color: 'hsla(200, 70%, 55%, 1)', ... },
    solid: { bgColor: 'hsla(200, 70%, 55%, 1)', ... },
    dark: { bgColor: 'hsla(200, 70%, 7%, 1)', ... }
  },
  success: { ... },
  warning: { ... },
  error: { ... },
  default: { ... }
};
```

### 2.2 Extract SVG Icon Management
**Priority:** Medium

Create a dedicated icon manager to:
- Allow custom icons
- Support inline SVG (no external file dependency)
- Enable icon customization

### 2.3 Improve Animation System
**Priority:** Medium
**File:** `src/noti-toast.js:293-323`

- Remove Firefox setTimeout hack if possible (test modern Firefox)
- Consider using Web Animations API
- Add more animation types (bounce, zoom, flip)

### 2.4 Add JSDoc Comments
**Priority:** Low

Document all public methods and options with JSDoc for better IDE support.

---

## Phase 3: Accessibility (a11y)

### 3.1 ARIA Live Regions
**Priority:** High

Add proper ARIA attributes for screen reader announcements:
```javascript
this.#toastElem.setAttribute('role', 'alert');
this.#toastElem.setAttribute('aria-live', 'polite'); // or 'assertive' for errors
this.#toastElem.setAttribute('aria-atomic', 'true');
```

### 3.2 Keyboard Navigation
**Priority:** High

- Make toasts focusable when `canClose` is true
- Allow closing with Escape key
- Support Tab navigation between multiple toasts

### 3.3 Reduced Motion Support
**Priority:** Medium

Respect `prefers-reduced-motion` media query:
```css
@media (prefers-reduced-motion: reduce) {
  .ntl-toast.ntl-slide,
  .ntl-toast.ntl-fade {
    transition: none;
  }
}
```

### 3.4 Focus Management
**Priority:** Medium

- Return focus to triggering element on close
- Trap focus within toast when it contains interactive elements

---

## Phase 4: New Features

### 4.1 Toast Queue Management
**Priority:** High

```javascript
NotiToast.config({
  maxToasts: 5,           // Maximum visible toasts
  newestOnTop: true,      // Stack order
  preventDuplicates: true // Prevent duplicate messages
});
```

### 4.2 Promise-Based API
**Priority:** High

```javascript
const toast = new NotiToast({ text: 'Loading...' });
await toast.open();
// Toast is now visible

await toast.close();
// Toast has been removed
```

### 4.3 Action Buttons
**Priority:** Medium

```javascript
new NotiToast({
  text: 'File deleted',
  actions: [
    { label: 'Undo', onClick: () => restoreFile() },
    { label: 'Dismiss', close: true }
  ]
});
```

### 4.4 Toast Grouping
**Priority:** Medium
**Status:** Partially Implemented

Group similar toasts together:
```javascript
new NotiToast({
  text: '3 new messages',
  group: 'messages',
  count: 3
});
```

**Current Implementation:**
- Toasts with the same `group` ID share a single slot
- New toasts update the existing grouped toast's text and increment the count badge
- Badge displays in top-left corner (red circle with count)

**Pending: Message History Feature**
Currently, only the latest message is displayed. Users cannot see the full list of grouped messages.

**Future Options to Consider:**
1. **Remove grouping entirely** - Keep toasts simple and stacked (no grouping)
2. **Keep as-is** - Shows count badge + latest message only (current behavior)
3. **Enhance with message history** - More complex implementation:
   - Store messages in an array within the grouped toast
   - Show expandable list on click/hover
   - Or link to a "notification center" panel
   - Would require additional UI components and state management

### 4.5 RTL (Right-to-Left) Support
**Priority:** Medium
**Status:** Implemented

```javascript
new NotiToast({
  text: 'مرحبا بالعالم',
  rtl: true,
  position: 'top-right'
});
```

**Current Implementation:**
- `rtl: true` affects **content direction only** (text alignment, icon position, close button position)
- Physical screen position remains as specified (top-right stays top-right)
- Auto-detects RTL from document/body `dir` attribute if `rtl` option not specified

**Future Option: Full RTL Mode**
A future `rtlMirrorPosition: true` option could be added to also flip physical positions:
- `top-right` would become `top-left`
- Useful when the entire app is RTL and positions should follow logical (start/end) rather than physical (left/right) positioning
- This would be opt-in, not default behavior

### 4.6 Custom Icons
**Priority:** Low

```javascript
new NotiToast({
  type: 'custom',
  icon: '<svg>...</svg>', // or icon URL
  iconColor: '#ff6600'
});
```

### 4.7 Toast Templates
**Priority:** Low

Pre-defined templates for common use cases:
```javascript
NotiToast.success('Operation completed!');
NotiToast.error('Something went wrong');
NotiToast.warning('Please review your input');
NotiToast.info('New update available');
```

### 4.8 Stacking Animations
**Priority:** Low

Animate toast repositioning when a toast is removed from the middle of a stack.

---

## Phase 5: Developer Experience

### 5.1 TypeScript Support
**Priority:** High

Create TypeScript definitions (`noti-toast.d.ts`):
```typescript
interface NotiToastOptions {
  text?: string;
  html?: string;
  position?: 'top-left' | 'top-center' | 'top-right' | ...;
  theme?: 'light' | 'solid' | 'dark';
  type?: 'default' | 'info' | 'success' | 'warning' | 'error' | 'custom';
  // ...
}

export default class NotiToast {
  constructor(options: NotiToastOptions);
  open(): void;
  close(): void;
  update(options: Partial<NotiToastOptions>): void;
}
```

### 5.2 NPM Package
**Priority:** High

- Create `package.json` with proper metadata
- Set up build process (if needed)
- Publish to npm registry
- Support both ESM and CommonJS

### 5.3 CDN Distribution
**Priority:** Medium

Make available via:
- unpkg: `https://unpkg.com/noti-toast`
- jsDelivr: `https://cdn.jsdelivr.net/npm/noti-toast`

### 5.4 Unit Tests
**Priority:** High

Set up testing with Vitest or Jest:
- Test all configuration options
- Test lifecycle methods (open, close, update)
- Test animation states
- Test accessibility attributes

### 5.5 E2E Tests
**Priority:** Medium

Use Playwright or Cypress to test:
- Visual appearance across browsers
- Animation behavior
- User interactions
- Accessibility compliance

### 5.6 Documentation Site
**Priority:** Medium

Create a documentation site with:
- Interactive playground
- API reference
- Examples and recipes
- Migration guides

### 5.7 Framework Integrations
**Priority:** Low

Create wrapper packages for:
- React: `@noti-toast/react`
- Vue: `@noti-toast/vue`
- Angular: `@noti-toast/angular`
- Svelte: `@noti-toast/svelte`

---

## Phase 6: Performance

### 6.1 Bundle SVG Icons
**Priority:** Medium

Inline SVG icons to eliminate external file dependency and reduce HTTP requests.

### 6.2 Optimize CSS
**Priority:** Low

- Use CSS containment for better rendering performance
- Minimize reflows during animation

### 6.3 Lazy Initialization
**Priority:** Low

Only create DOM elements when `open()` is called, not in constructor.

---

## Phase 7: Styling & Theming

### 7.1 CSS Custom Properties API
**Priority:** Medium

Expose more CSS variables for deeper customization:
```css
--ntl-font-family
--ntl-font-size
--ntl-line-height
--ntl-padding
--ntl-border-radius
--ntl-box-shadow
--ntl-z-index
--ntl-max-width
--ntl-icon-size
```

### 7.2 Auto Dark Mode
**Priority:** Medium

Automatically detect and respect `prefers-color-scheme`:
```javascript
new NotiToast({
  theme: 'auto' // Uses light/dark based on system preference
});
```

### 7.3 Additional Themes
**Priority:** Low

- Glassmorphism theme
- Minimal/flat theme
- Gradient themes
- Custom theme builder

### 7.4 Toast Width Options
**Priority:** Low

```javascript
new NotiToast({
  width: 'auto',      // Fit content
  width: '300px',     // Fixed width
  width: 'full',      // Full container width
  maxWidth: '400px'
});
```

---

## Implementation Priority Summary

| Priority | Items |
|----------|-------|
| **Critical** | 1.1, 1.2, 1.3 (Bug fixes) |
| **High** | 2.1, 3.1, 3.2, 4.1, 4.2, 5.1, 5.2, 5.4 |
| **Medium** | 1.4, 2.2, 2.3, 3.3, 3.4, 4.3, 4.4, 4.5, 5.3, 5.5, 5.6, 6.1, 7.1, 7.2 |
| **Low** | 2.4, 4.6, 4.7, 4.8, 5.7, 6.2, 6.3, 7.3, 7.4 |

---

## Version Planning

### v1.1.0 - Stability Release
- All Phase 1 bug fixes
- TypeScript definitions
- Basic unit tests

### v1.2.0 - Accessibility Release
- ARIA live regions
- Keyboard navigation
- Reduced motion support

### v2.0.0 - Feature Release
- Refactored codebase
- Toast queue management
- Promise-based API
- Action buttons
- NPM package

### v2.1.0 - DX Release
- Documentation site
- E2E tests
- CDN distribution
- Framework integrations

---

## Contributing

Want to help? Pick an item from this roadmap and:
1. Open an issue to discuss the implementation
2. Fork the repository
3. Create a feature branch
4. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
