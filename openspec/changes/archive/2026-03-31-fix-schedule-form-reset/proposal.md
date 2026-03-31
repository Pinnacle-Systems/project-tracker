## Why

When adding a schedule, the "Type" dropdown automatically resets to "Dev" after a successful submission. This creates a "half-reset" state where browser-restored payment fields may remain visible while the internal state has switched to "Dev", leading to invalid data entry (e.g., saving a payment as a "Dev" type). Users want to preserve their selection (e.g., "Payment") when adding multiple schedules in a sequence.

## What Changes

- **Modified**: Update `AddScheduleForm` to use `useActionState` for managing form submission life cycle.
- **Improved**: Explicitly clear text and numeric inputs (Title, Amount, Date) upon successful schedule creation.
- **Enhanced**: Persist the `type` selection (e.g., "Payment") across successful submissions to facilitate bulk entry.
- **Fixed**: Ensure full synchronization between the `type` dropdown and the conditional display of "Payment Details" to prevent "ghost" UI states.

## Capabilities

### Modified Capabilities
- `schedule-tracking`: Update requirements for form reset behavior to specify that the `type` selection should be preserved while data fields are cleared.

## Impact

- `tracker-app/src/components/AddScheduleForm.tsx`: Component refactor to use `useActionState` and explicit reset logic.
- `tracker-app/src/lib/actions.ts`: Minimal impact; ensure the `createSchedule` action returns a status that can be consumed by the client component.
