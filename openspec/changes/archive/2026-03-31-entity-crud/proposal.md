## Why

Currently, Customers and Projects can only be created — there is no way to edit or delete them from the UI. This makes it impossible to fix mistakes (wrong company name, wrong contact email, wrong billing user count) or clean up stale records. We need inline Edit and Delete support directly on the existing list pages, keeping navigation minimal.

## What Changes

- Add `updateCustomer`, `deleteCustomer`, `updateProject`, and `deleteProject` Server Actions to `src/lib/actions.ts`.
- Introduce a reusable `InlineEditForm` client component that toggles between a read view and an edit form in-place.
- Update `CustomerCard` and `ProjectCard` rendering to include Edit and Delete controls.
- Use a `window.confirm` guard on all destructive delete operations (cascade-safe since the schema uses `onDelete: Cascade`).

## Capabilities

### Modified Capabilities
- `project-management`: Extends the Customer and Project lifecycle with update and delete operations.

## Impact

Changes are localized to:
- `src/lib/actions.ts` — new Server Actions
- `src/app/customers/page.tsx` — inline edit/delete UI
- `src/app/projects/page.tsx` — inline edit/delete UI
- New client components under `src/components/`

No database schema migrations required.
