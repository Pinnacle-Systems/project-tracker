## Context

We now have a `Resource` entity and the ability to assign it to schedules. The next step is to display this information in the UI (dashboard cards and project detail tables).

## Goals / Non-Goals

**Goals:**
- Display assigned resource name on dashboard cards.
- Display assigned resource name in the project detail schedule list.
- Ensure data fetching (server actions) correctly includes the `Resource` relation.

**Non-Goals:**
- Displaying multiple resources per schedule (we assume single resource as per earlier exploration).
- Adding complex resource icons or avatars.

## Decisions

- **Data Fetching**: Update `getCategorizedSchedules` and `getProjectById` to `include: { resource: true }`.
- **Dashboard UI**: Update `DashboardPage` to render `s.resource?.name` on each schedule list item.
- **Project UI**: Update the table in `ProjectDetailPage` to show a column or field for the assigned resource.

## Risks / Trade-offs

- **Performance**: Including the `Resource` relation in the fetch might slightly increase query size, but for the current scale it's negligible.
- **Empty State**: Schedules without a resource will show no name or "Unassigned".
