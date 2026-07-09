# Harmony Development Workflow

## Development Philosophy

Build small, complete, testable increments.

Prioritize:
- Simplicity
- Maintainability
- User experience
- Reliability

---

## Workflow Stages

1. Define requirements
2. Design the solution
3. Implement the feature
4. Test locally
5. Commit meaningful work
6. Push to GitHub

---

## Branch Strategy

### Main
- Always stable.
- Always deployable.

### Feature Branches
Naming format:

feature/<feature-name>

Examples:
- feature/tab-management
- feature/ai-sidebar
- feature/bookmarks

---

## Commit Standards

One commit should represent:
- A completed feature
- A completed milestone
- A meaningful technical decision

Examples:
- feat: implement tab system
- feat: add bookmarks manager
- docs: establish Harmony technical foundations

---

## Pull Strategy

- Rebase by default.
- Keep history linear and readable.

---

## Dependency Policy

Dependencies must justify their existence through:
- Reduced complexity
- Increased reliability
- Significant development speed improvements

---

## Status

Phase: Definition