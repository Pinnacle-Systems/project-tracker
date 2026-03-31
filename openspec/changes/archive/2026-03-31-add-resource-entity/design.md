## Context

The current application tracks project schedules but lacks the ability to attribute these schedules to specific people or roles. Users have requested a way to track "in-flight" work per resource to better manage workload.

## Goals / Non-Goals

**Goals:**
- Implement a `Resource` entity with `name` and `role`.
- Enable optional resource assignment for "Dev" and "Delivery" schedules.
- Provide a "Lighter Lift" dashboard visualization for resource workloads.

**Non-Goals:**
- Implementing a complex resource capacity/scheduling algorithm.
- Multi-tenancy for resources (they are global).

## Decisions

- **Database Model**: Add a `Resource` table and link `Schedule` to it via an optional `resourceId` foreign key.
- **UI Integration**: Update the `AddScheduleForm` to include a dropdown of available resources.
- **Dashboard Enhancement**: Add a "Resource Load" summary card to the dashboard and a filter dropdown to view specific workloads.
- **Resource Management**: Create a simple `/resources` page for managing the global list of resources.

## Risks / Trade-offs

- **Optionality**: Making the resource optional on schedules ensures existing data isn't broken, but might lead to unassigned "in-flight" items.
- **Global Scope**: All resources are visible across all projects, which is fine for the current scope but might need refactoring if the app expands to multiple organizations.
