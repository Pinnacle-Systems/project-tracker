# Delete Schedules - Design

## Architecture
The deletion mechanism will follow our existing Next.js App Router paradigm, using a Server Component to render an inline `<form>` that posts to a Server Action.

## Database
- No schema changes are required.

## Backend (Server Actions)
- Create `deleteSchedule(scheduleId: string)` in `src/lib/actions.ts`.
- The action will invoke `prisma.schedule.delete({ where: { id: scheduleId } })`.
- Utilize `revalidatePath('/projects/[id]', 'page')` and `revalidatePath('/')` to instantly refresh the Next.js cache so the deleted item vanishes from the UI immediately.

## Frontend UI
- **Location**: `src/app/projects/[id]/page.tsx`.
- In the existing Schedule Data Table, add a new nested `<form>` inside the rightmost "Actions" column.
- Use a small, understated button (maybe red-tinted text like "Delete") grouped next to the "Mark Complete" button.
- Extract the submit button into a Client Component (e.g., `DeleteButton.tsx`) to attach an `onClick` event that triggers `window.confirm("Are you sure you want to delete this schedule?")`. If canceled, call `e.preventDefault()` to stop the Server Action.
