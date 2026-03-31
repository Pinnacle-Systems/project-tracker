## ADDED Requirements

### Requirement: Show Resource Name on Dashboard Cards
The system SHALL display the assigned resource's name on each schedule card in the dashboard.

#### Scenario: Verify resource name displayed
- **WHEN** a schedule is assigned to a resource and viewed in the dashboard
- **THEN** name of the resource (e.g. "John Doe") should be clearly visible on the card.

### Requirement: Show Resource Name in Project Table
The system SHALL display a column for the assigned resource's name in the schedule table on the project detail page.

#### Scenario: Verify resource name in table
- **WHEN** a project's schedules are viewed in the table
- **THEN** an additional column (or existing column update) shows the name of the assigned resource for each row.
