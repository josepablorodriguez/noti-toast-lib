# CLAUDE.md - Noti-Toast Library

## Project Overview

**Noti-Toast** is a lightweight, zero-dependency JavaScript library for displaying toast notifications in web applications. Built with vanilla ES6+ JavaScript and CSS Custom Properties.

## Directory Structure

```
noti-toast-lib/
├── src/
│   ├── noti-toast.js         # Main library class (NotiToast)
│   └── noti-toast.css        # Core toast styling
├── lib/
│   ├── jsonToHTMLParser.js   # JSON syntax highlighting utility
│   ├── jsonToHTMLParser.css  # Syntax highlighting styles
│   ├── parseFunction.js      # Function string parser (avoids eval)
│   └── svg/
│       └── symbols.svg       # SVG icon symbols for notification types
├── index.html                # Interactive demo page
├── script.js                 # Demo script
└── style.css                 # Demo page styling
```

## Technology Stack

- **Language**: Vanilla JavaScript (ES6+)
- **Module System**: ES6 Modules (`import`/`export`)
- **Styling**: CSS3 with CSS Custom Properties
- **Build Tools**: None (pure library, no build process)
- **Dependencies**: None

## Running the Project

No build process required. Open `index.html` directly in a modern browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using PHP
php -S localhost:8000
```

## Key Files

| File | Purpose |
|------|---------|
| `src/noti-toast.js` | Main `NotiToast` class with all toast functionality |
| `src/noti-toast.css` | CSS styles, themes (light/solid/dark), animations |
| `lib/jsonToHTMLParser.js` | `jsonToHTML` class for JSON visualization in demo |
| `lib/parseFunction.js` | Safe function string parsing utility |

## Coding Conventions

### JavaScript

- **ES6 Classes** with private fields (`#privateField`)
- **camelCase** for variables, methods, and properties
- **Private methods** prefixed with `#`: `#methodName()`
- **Configuration objects** with sensible defaults merged via spread operator

### CSS

- **Prefix**: All classes use `ntl-` prefix (Noti Toast Library)
- **CSS Variables**: Use `--ntl-` prefix for custom properties
- **Themes**: Defined via class modifiers (`.ntl-toast-solid`, `.ntl-toast-dark`)

### Naming Examples

```javascript
// JavaScript
#toastElem;           // Private field
autoClose_duration;   // Configuration property
createContainer();    // Public utility function
#applyStyle();        // Private method

// CSS
.ntl-toast            // Main element
.ntl-toast-solid      // Theme modifier
--ntl-background-color // CSS variable
```

## Architecture Patterns

### Private Field Pattern
```javascript
class NotiToast {
    #toastElem;
    #theme;
    #autoClose_duration;
    // Internal state isolated via private fields
}
```

### Configuration-Driven API
```javascript
const DEFAULT_OPTIONS = {
    position: 'top-right',
    theme: 'light',
    type: 'default',
    autoClose: 20,
    // ...
};
```

### Setter-Based Updates
```javascript
set text(value) { /* validation + DOM update */ }
set theme(value) { /* validation + class update */ }
```

## API Reference

### NotiToast Constructor
```javascript
new NotiToast({
    text: 'Message',           // Plain text content
    html: '<b>Bold</b>',       // HTML content (overrides text)
    position: 'top-right',     // 9 positions: top/middle/bottom + left/center/right
    theme: 'light',            // 'light', 'solid', 'dark'
    type: 'default',           // 'default', 'info', 'success', 'warning', 'error', 'custom'
    canClose: false,           // Show close button
    autoClose: 20,             // Auto-close duration (ms)
    showProgressBar: false,    // Progress bar visibility
    pauseOnHover: false,       // Pause timer on hover
    pauseOnFocusLoss: false,   // Pause when window loses focus
    animation: {
        type: 'none',          // 'none', 'slide', 'fade'
        duration_ms: 10
    },
    style: { /* CSS variable overrides */ },
    onOpen: () => {},          // Open callback
    onClose: () => {}          // Close callback
});
```

### Main Methods
- `open()` - Display the toast
- `close()` - Manually close the toast
- `update(options)` - Update configuration

## CSS Variables

Override these in the `style` option:
```javascript
style: {
    'background-color': '#fff',
    'color': '#333',
    'border': '1px solid #ccc',
    'progress-bar-color': '#007bff'
}
```

Variables are automatically prefixed with `--ntl-`.

## Animation System

- Uses CSS transitions + `requestAnimationFrame`
- Animation frames tracked for proper cleanup (`cancelAnimationFrame`)
- Firefox compatibility: 50ms delay before animation start

## Common Tasks

### Adding a New Theme
1. Add theme colors to `noti-toast.css`
2. Create `.ntl-toast-{themename}` class with appropriate styles
3. Update theme validation in `set theme()` setter

### Adding a New Notification Type
1. Add SVG icon to `lib/svg/symbols.svg`
2. Define type colors in CSS for each theme
3. Update type validation in `set type()` setter

### Adding a New Position
1. Add position styles to `.ntl-toast-container-{position}` in CSS
2. Update position validation in `createContainer()`

## Browser Support

Requires modern browsers with support for:
- ES6 Classes and Modules
- CSS Custom Properties
- `requestAnimationFrame`
- CSS Transitions

## Git Workflow

- **Main branch**: `main`
- **Current feature branch**: `claude-code-improvement`
- Commit messages should be concise and descriptive

## Development Workflow

**Important:** When working through the ROADMAP.md phases:
- Complete all tasks in a phase before moving to the next
- **Always commit changes before moving to another phase**
- Do not start a new phase until the previous phase's changes are committed
- Each phase should result in at least one commit

## Debug Mode

Enable debug logging:
```javascript
new NotiToast({ debug: true, ... });
```

Console warnings use styled output via `ntlConsoleWarning()`.
