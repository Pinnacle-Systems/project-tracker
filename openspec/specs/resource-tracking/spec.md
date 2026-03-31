## ADDED Requirements

### Requirement: Resource Entity
The system SHALL support a `Resource` entity with `id`, `name`, and optional `role`.

#### Scenario: Create a resource
- **WHEN** the user adds a new resource with a name and optional role
- **THEN** the system persists the resource in the global database.

### Requirement: Schedule Assignment
The system SHALL allow assigning a `Resource` to a `Schedule`.

#### Scenario: Assign resource to schedule
- **WHEN** a schedule is created or updated with an optional `resourceId`
- **THEN** the schedule is associated with the selected resource.
