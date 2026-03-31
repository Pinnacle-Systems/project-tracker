## Why

The current system tracks schedules for "Dev", "Delivery", and "Payment" types but doesn't track *who* is responsible for them. This makes it difficult to see what items are currently "in flight" for a particular team member or resource.

## What Changes

This change introduces a `Resource` entity to the system. Resources will be global (available across all projects) and will allow tracking of "in-flight" work for individuals. 

Key changes include:
- A new `Resource` model with `name` and `role`.
- Updating the `Schedule` model to allow an optional link to a `Resource`.
- Adding a way to manage resources (Create/Read/Delete).
- Enhancing the dashboard to show work filtered by resource or a summary of resource loads.

## Capabilities

### New Capabilities
- `resource-tracking`: Manage a global list of resources (personnel) and assign them to project schedules.

### Modified Capabilities
- `schedule-tracking`: Extend the existing schedule management to support optional resource assignment for "Dev" and "Delivery" types.

## Impact

- **Database**: New `Resource` table and a foreign key in the `Schedule` table.
- **API**: New server actions for managing resources and updating schedules with resource IDs.
- **UI**: Added fields in `AddScheduleForm` and a new resource management interface, plus dashboard enhancements for filtering.
