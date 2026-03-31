## 1. Backend — Server Actions

- [x] 1.1 Add `updateCustomer(id: string, formData: FormData)` action to `src/lib/actions.ts`.
- [x] 1.2 Add `deleteCustomer(id: string)` action to `src/lib/actions.ts` with cascade-aware revalidation.
- [x] 1.3 Add `updateProject(id: string, formData: FormData)` action to `src/lib/actions.ts`.
- [x] 1.4 Add `deleteProject(id: string)` action to `src/lib/actions.ts` with cascade-aware revalidation.

## 2. Client Components

- [x] 2.1 Create `EditCustomerForm.tsx` — Client Component that toggles between view and inline edit mode for a Customer record. Includes Edit, Save, Cancel, and Delete (with confirm dialog) controls.
- [x] 2.2 Create `EditProjectForm.tsx` — Client Component that toggles between view and inline edit mode for a Project record. Editable fields: `name`, `numberOfUsersForBilling`. Delete confirm warns about cascade.

## 3. Page Integration

- [x] 3.1 Replace Customer card rendering in `src/app/customers/page.tsx` with the new `EditCustomerForm` component.
- [x] 3.2 Replace Project card rendering in `src/app/projects/page.tsx` with the new `EditProjectForm` component.
