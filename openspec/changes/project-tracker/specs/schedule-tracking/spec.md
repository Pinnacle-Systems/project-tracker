## ADDED Requirements

### Requirement: Manage Project Schedules
The system SHALL allow users to create and manage schedules or milestones for any project, explicitly capturing Dev, Delivery, and Payment types.

#### Scenario: Create a schedule
- **WHEN** the user adds a new schedule to a project specifying type (e.g., Delivery) and a due date
- **THEN** the system persists the schedule and associates it to the project

### Requirement: Automatically Generate Payment Schedule
The system SHALL offer the ability to auto-generate a Payment schedule based on the date of a Delivery schedule.

#### Scenario: Auto-generate payment milestone
- **WHEN** a Delivery schedule is created or updated
- **THEN** the system optionally auto-creates a Payment schedule offset by a predefined default duration (e.g., 14 days)
