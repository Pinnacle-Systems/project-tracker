## Context

We need a quick and lightweight way to track customers, projects, and key schedules (Dev, Delivery, Payment). The user prefers a standalone dashboard layout (Option 1). They want to use `Vite`, `React`, `TypeScript`, and `pnpm`. Crucially, they want to be able to access the app across multiple devices and already have a `PostgreSQL` database available to use for persistence.

## Goals / Non-Goals

**Goals:**
- Provide a simple interface to manage Customers, Projects, and Schedules.
- Compute "Overdue", "This Week", and "Upcoming" milestones automatically.
- Multi-device accessibility using the existing PostgreSQL database.

**Non-Goals:**
- Active push notifications (email, SMS, slack).
- Advanced project management features (e.g., Gantt charts, sub-task tracking, time logging).

## Decisions

- **Framework**: `Next.js` (App Router) using React Server Components, Server Actions, and Tailwind CSS for rapid full-stack development.
- **Package Manager**: `pnpm` for fast dependency management.
- **Database**: `PostgreSQL` via `Prisma ORM`. Leveraging the user's existing Postgres server securely from the Next.js server context.
- **UI Components**: Simple HTML/Tailwind forms or a component library like `shadcn/ui` for quick aesthetic wins.
- **Data Model**:
  - `Customer` (id, name, contact)
  - `Project` (id, customerId, name, numberOfUsersForBilling)
  - `Schedule` (id, projectId, type [dev|delivery|payment], date, status)

## Risks / Trade-offs

- **Risk**: Connection pooling issues with Postgres in serverless environments if deployed to Vercel/Netlify.
  - *Mitigation*: We will ensure Prisma is configured to reuse connections or suggest a connection pooler like Supavisor/PgBouncer if deploying heavily. For basic multi-device usage, default Prisma works fine.
- **Risk**: Missing reminders because it relies on the user checking the dashboard.
  - *Mitigation*: The UI will heavily emphasize Overdue and Action-Required items in red to grab attention.
