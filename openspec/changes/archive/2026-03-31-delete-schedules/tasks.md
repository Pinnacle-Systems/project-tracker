## 1. Backend Updates
- [x] 1.1 Add `deleteSchedule` Server Action to `src/lib/actions.ts` that removes the record and flushes the Next.js cache.

## 2. Frontend Updates
- [x] 2.1 Create a new client component `DeleteButton.tsx` that wraps a native submit button and attaches a `window.confirm` dialog.
- [x] 2.2 Update the Schedule Data Table in `src/app/projects/[id]/page.tsx` to include an inline `<form action={deleteSchedule}>` using the new `DeleteButton`.
