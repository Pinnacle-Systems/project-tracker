## Requirements

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

### Requirement: Schedule Addition Form Reset and Persistence
The system SHALL provide a form for adding schedules that preserves the user's "Type" selection across successful submissions while clearing data-specific inputs.

#### Scenario: Selection preserved on success
- **WHEN** the user adds a "Payment" schedule successfully
- **THEN** the Title, Amount, and Date fields are cleared, but the Type dropdown REMAINS "Payment"

#### Scenario: Selection remains synced with UI
- **WHEN** the form resets after a successful submission
- **THEN** the visibility of the "Payment Details" section MUST be synchronized with the selected "Type" (e.g., if type is "Payment", the payment fields MUST stay visible)

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
