## Why

Now that we have a `Resource` entity, we need to display the assigned resource on the schedule cards in the dashboard and project details. This provides immediate visibility into who is responsible for each task without needing to filter.

## What Changes

Update the schedule display on the dashboard and project pages to show the name of the assigned resource (if any).

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `schedule-tracking`: Add resource name display to schedule cards and tables.

## Impact

- **UI**: Update `DashboardPage` cards and `ProjectDetailPage` table to render the resource name.
- **API**: Update data fetching to include the `resource` relation when loading schedules.
