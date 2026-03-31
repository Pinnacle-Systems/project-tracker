## 1. Action Layer

- [x] 1.1 Update `createSchedule` in `src/lib/actions.ts` to return a success status and timestamp.

## 2. Component Refactor

- [x] 2.1 Integrated `useActionState` into `AddScheduleForm.tsx` to handle the form lifecycle.
- [x] 2.2 Add `formRef` to the `<form>` element to allow manual programmatic reset.
- [x] 2.3 Implement `useEffect` to call `formRef.current.reset()` upon successful submission.
- [x] 2.4 Ensure the `type` state is preserved after the form reset to facilitate bulk entry.

## 3. Verification

- [x] 3.1 Verify that the Title, Amount, and **Date/Deadline** fields are cleared after adding a Payment schedule.
- [x] 3.2 Confirm that the "Payment Details" UI remains visible if "Payment" is still selected after a success.
- [x] 3.3 Ensure no schedules are unintentionally created with the "Dev" type after a reset.
