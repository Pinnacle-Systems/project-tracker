# Delete Schedules

## Why
Currently, there is no way to remove a schedule once it has been created. If duplicate schedules are mistakenly generated or test data needs cleanup, the user is stuck with cluttered project views and inaccurate alerts. We need support for deleting schedules.

## What Changes
- Add a new Server Action `deleteSchedule(id: string)` to interact with the database.
- Update the schedule table in the specific project view to include a "Delete" action button.

## Capabilities
### Modified Capabilities
- `schedule-tracking`: Extends the milestone lifecycle by adding the `delete` operation.

## Impact
This change is localized to the Next.js Server Actions and the `projects/[id]` UI. No database schema migrations or new packages are required.
