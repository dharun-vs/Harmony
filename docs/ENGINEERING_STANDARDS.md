# Harmony Engineering Standards

## Philosophy

Code is written once but read many times.

Maintainability, readability, and consistency take priority over cleverness.

---

## Core Principles

- Simplicity over abstraction.
- Explicit over implicit.
- Readability over brevity.
- Consistency over preference.
- Performance where it matters.

---

## Naming Conventions

### Files
- Use `kebab-case` for files and folders.

Examples:
- `tab-manager.ts`
- `browser-window.ts`

### Components
- Use `PascalCase`.

Examples:
- `Sidebar.tsx`
- `TabBar.tsx`

### Variables and Functions
- Use `camelCase`.

Examples:
- `activeTab`
- `createBrowserWindow()`

---

## Comments

Comments should explain **why**, not **what**.

Avoid obvious comments.

Bad:

```ts
// Increment counter
counter++;