# Currency INR — Design

## Scope

UI-only change. Three files contain literal `$` currency markers that need to become `₹`:

| File | Location | Current | Target |
|---|---|---|---|
| `src/components/AddScheduleForm.tsx` | Amount field label | `Amount ($)` | `Amount (₹)` |
| `src/app/projects/[id]/page.tsx` | Schedule table amount cell | `` `$${s.amount}` `` | `` `₹${s.amount}` `` |
| `src/app/page.tsx` | Dashboard cards (×3) | `` `${s.amount}` `` in JSX `$` prefix | `₹{s.amount}` |

## No Backend Changes

The `amount` field is stored as a raw `Float` in the database — no currency encoding is baked in. The symbol is purely a display concern.
