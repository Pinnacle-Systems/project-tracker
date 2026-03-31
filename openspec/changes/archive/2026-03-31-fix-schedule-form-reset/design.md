## Context

The `AddScheduleForm` is a controlled component that uses `useState` for its `type` dropdown. Currently, it uses a plain form `action`, which leads to a "half-reset" state after successful submission: the browser resets the DOM (reverting the dropdown to its default "Dev" appearance), but React's state remains "Payment", keeping the payment detail fields visible. This causes accidental invalid submissions.

## Goals / Non-Goals

**Goals:**
- **Synchronized State**: Ensure the dropdown UI and the conditional rendering of payment fields are always in sync.
- **Selection Persistence**: Maintain the user's "Type" selection (e.g., "Payment") across successful submissions.
- **Data Clearing**: Automatically clear the Title, Amount, and **Date/Deadline** fields after a successful addition.

**Non-Goals:**
- **Persistent Error Handling**: Complex client-side validation (keeping server-side validation for now).

## Decisions

### D1: useActionState for Lifecycle Management

**Decision**: Refactor `AddScheduleForm` to use the React 19 `useActionState` hook.
**Rationale**: This provides a structured way to handle the result of a Server Action. We can return a specific success indicator (e.g., a timestamp or ID) that the client can use to trigger a form reset.

### D2: Manual Form Reset with Ref

**Decision**: Use a `useRef` on the `<form>` element and call `formRef.current.reset()` inside a `useEffect` that listens for action success.
**Rationale**: This clears all uncontrolled inputs (Title, Amount, **Date/Deadline**) using the browser's native mechanism, ensuring a clean state for the next entry.

### D3: Explicit State Persistence

**Decision**: After calling `formRef.current.reset()`, the `type` state will deliberately NOT be changed.
**Rationale**: This satisfies the user requirement to preserve the selection for bulk entry. Because the dropdown is controlled (`value={type}`), React will immediately re-sync the dropdown to the preserved state after the browser reset.

## Risks / Trade-offs

- **[Risk] -> Mitigation**: Controlled vs Uncontrolled conflict during browser reset. **Mitigation**: Using `useActionState` ensures that React's state update happens *after* the browser reset, and the `key` or `value` binding will force the DOM to match the preserved state.
