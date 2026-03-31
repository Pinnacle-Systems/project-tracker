# Entity CRUD — Design

## Architecture Principle

All mutations go through **Next.js Server Actions** (already our established pattern). The UI toggle between "view" and "edit" modes is handled by small **Client Components** that manage local React state — the Server Components continue to own the data fetching.

## New Server Actions (`src/lib/actions.ts`)

| Action | Behaviour |
|---|---|
| `updateCustomer(id, formData)` | Updates `name` and `contact` fields. Revalidates `/customers`. |
| `deleteCustomer(id)` | Deletes customer (cascades to Projects → Schedules). Revalidates `/customers` and `/`. |
| `updateProject(id, formData)` | Updates `name` and `numberOfUsersForBilling`. Revalidates `/projects`. |
| `deleteProject(id)` | Deletes project (cascades to Schedules). Revalidates `/projects` and `/`. |

## New Client Components

### `EditCustomerForm.tsx`
- Wraps a Customer card's read view with a toggle.
- **View mode**: Renders name + contact + `[Edit]` + `[Delete]` buttons.
- **Edit mode**: Shows a small inline form pre-populated with current values, `[Save]` + `[Cancel]` buttons.
- Delete button triggers `window.confirm("Delete Acme Corp? This will also delete all their projects and schedules.")`.

### `EditProjectForm.tsx`
- Same toggle pattern for Projects.
- Editable fields: `name`, `numberOfUsersForBilling` (customer reassignment intentionally excluded to avoid data integrity risks).
- Delete button triggers `window.confirm("Delete [project name]? This will also delete all its schedules.")`.

## UI Layout (inline toggle pattern)

```
View Mode                        Edit Mode
─────────────────────────────── ─────────────────────────────────
┌─────────────────────────────┐ ┌─────────────────────────────────┐
│ Acme Corp          [Edit]   │ │ [Acme Corp_______]              │
│ hello@acme.com     [Delete] │ │ [hello@acme.com__]              │
│  • Project Alpha            │ │ [Save]  [Cancel]    [Delete]    │
└─────────────────────────────┘ └─────────────────────────────────┘
```

## Safety Considerations

- Both delete actions cascade (schema already configured with `onDelete: Cascade`).
- `window.confirm` text explicitly warns about cascade deletion scope.
- `DeleteButton` component (already built) reused for consistency.
