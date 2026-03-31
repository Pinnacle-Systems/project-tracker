## 1. Database Schema Update

- [x] 1.1 Add `Resource` model to `schema.prisma`.
- [x] 1.2 Add `resourceId` to `Schedule` model with a relation to `Resource`.
- [x] 1.3 Run `npx prisma generate` and `npx prisma db push` (or migrate).

## 2. Server Actions (API)

- [x] 2.1 Implement `createResource` and `getResources` in `src/lib/actions.ts`.
- [x] 2.2 Update `createSchedule` to accept `resourceId`.
- [x] 2.3 Update `getCategorizedSchedules` to allow optional filtering by `resourceId`.

## 3. Resource Management UI

- [x] 3.1 Create a basic `/resources` page to list and add resources.
- [x] 3.2 Add a navigation link to the sidebar/header for "Resources".

## 4. Schedule Form UI

- [x] 4.1 Update `AddScheduleForm.tsx` to fetch the list of resources.
- [x] 4.2 Add an optional `Resource` selection dropdown to the form.

## 5. Dashboard Enhancement

- [x] 5.1 Implement a "Resource Load" summary card on the main dashboard.
- [x] 5.2 Add a "Filter by Resource" selector to the dashboard to filter pending tasks.
