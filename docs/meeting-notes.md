# 📝 Meeting Notes & Decisions

This document acts as the master record of discussions, design decisions, and action items for **Genesis AI**.

---

## [2026-07-13] Project Kickoff & Workspace Structure

**Attendees**: Development Team, Lead Architect

### 🎯 Agenda
1. Define monorepo structure.
2. Outline core files & documentation templates.
3. Align on tech stack options.

### 💡 Key Decisions
- **Monorepo setup**: Voted to go with `npm workspaces` for simple package resolution across `client`, `server`, and `shared`.
- **Database selection**: PostgreSQL selected as the primary relational database with vector extension compatibility.
- **Client stack**: Target framework will be Next.js or Vite React depending on server-side rendering needs.

### 📋 Action Items
- [x] Create base repository structure.
- [x] Create project documentation outline (`architecture.md`, `database.md`, `api.md`, `roadmap.md`).
- [ ] Align on exact Sprint 2 requirements.
