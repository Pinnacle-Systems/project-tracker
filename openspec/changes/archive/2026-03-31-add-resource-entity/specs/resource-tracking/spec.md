## ADDED Requirements

### Requirement: Manage Global Resources
The system SHALL allow users to manage a global list of resources (people/entities) with a name and an optional role.

#### Scenario: Add a new resource
- **WHEN** a user creates a new resource with a name (e.g., "John Doe") and a role (e.g., "Developer")
- **THEN** the resource is saved globally and becomes available for assignment to schedules.

### Requirement: Resource Assignment to Schedules
The system SHALL allow users to optionally assign a resource to "Dev" and "Delivery" project schedules.

#### Scenario: Assign resource to a Dev schedule
- **WHEN** a user creates or updates a "Dev" schedule and selects a resource
- **THEN** the schedule is associated with that resource.

### Requirement: View Resource Workload
The system SHALL provide a way to see all "in-flight" (pending) schedules assigned to a specific resource.

#### Scenario: View in-flight items for a resource
- **WHEN** a user filters the dashboard by a specific resource
- **THEN** only the "pending" schedules assigned to that resource are displayed.

#### Scenario: Dashboard Load Summary
- **WHEN** viewing the dashboard
- **THEN** a summary of "in-flight" items per resource is displayed.
