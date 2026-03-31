## ADDED Requirements

### Requirement: Categorize Upcoming Schedules
The system SHALL surface and group all project schedules that require user attention into the categories: Overdue, This Week, and Upcoming.

#### Scenario: View dashboard
- **WHEN** the user opens the application homepage
- **THEN** the system fetches schedules ordered by date and groups them by relative time to today (Overdue, Next 7 Days, Beyond 7 Days).

### Requirement: Prompt Followups
The system SHALL clearly indicate which project and customer the schedule belongs to, so the user knows who to follow up with.

#### Scenario: Identify followup target
- **WHEN** a user looks at a schedule on the dashboard
- **THEN** the schedule card explicitly displays the project name, schedule type and associated customer contact info.
