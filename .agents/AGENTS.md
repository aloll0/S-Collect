# Project Rules & Standards

## Frontend Systems Standards
Follow the frontend development standards specified in `.agents/skills/frontend-systems/SKILL.md`:
- Core stack: React, TypeScript, Vite, Tailwind CSS, React Router DOM, React Hook Form, Zustand, React Query (@tanstack/react-query), Axios, React Hot Toast.
- Keep components small, single-responsibility, and reusable. Never write monolithic components.
- Always use React Hook Form for forms and Zustand for global state.
- Keep API calls in service files with React Query hooks (never directly in UI components).
- Use TypeScript everywhere (avoid `any`).
- Extract logic into hooks and utilities.
