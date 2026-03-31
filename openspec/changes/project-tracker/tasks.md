## 1. Project Setup & Data Model

- [x] 1.1 Scaffold Next.js App Router workspace using `pnpm`.
- [x] 1.2 Initialize `PostgreSQL` using Prisma ORM.
- [x] 1.3 Define schema for `Customer`, `Project`, and `Schedule` models in `schema.prisma`.
- [ ] 1.4 Generate Prisma client and seed basic test data via a script.

## 2. Server Actions & Backend API

- [ ] 2.1 Create Server Actions to fetch, create, update, and delete Customers, Projects, and Schedules.
- [ ] 2.2 Handle auto-generation of Payment schedule when a Delivery schedule is created via the Server Action wrapper.

## 3. Shared Components

- [ ] 3.1 Setup basic layout and navigation (Dashboard vs Settings) in Next.js.
- [ ] 3.2 Create common UI components (Cards, Tables, Forms) possibly utilizing a component library.

## 4. Creating & Managing Records (UI)

- [ ] 4.1 Implement "Create Customer" Server Component with Client Action handler.
- [ ] 4.2 Implement "Create Project" form.
- [ ] 4.3 Implement "Add Schedule" form within a project view.

## 5. Dashboard Implementation

- [ ] 5.1 Build data fetching logic (Server Component) to categorize schedules: Overdue, This Week, and Upcoming.
- [ ] 5.2 Build Dashboard UI to visualize the categorized lists.
- [ ] 5.3 Ensure each schedule card displays the associated Project name, Schedule type, and Customer contact info.

## 6. Polish and Verification

- [ ] 6.1 Add manual tests to verify Server Actions correctly persist to PostgreSQL.
- [ ] 6.2 Validate dashboard properly filters states dynamically.
- [ ] 6.3 Quick responsive design check.
