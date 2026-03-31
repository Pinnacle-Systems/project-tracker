## ADDED Requirements

### Requirement: Schedule Addition Form Reset and Persistence
The system SHALL provide a form for adding schedules that preserves the user's "Type" selection across successful submissions while clearing data-specific inputs.

#### Scenario: Selection preserved on success
- **WHEN** the user adds a "Payment" schedule successfully
- **THEN** the Title, Amount, and Date fields are cleared, but the Type dropdown REMAINS "Payment"

#### Scenario: Selection remains synced with UI
- **WHEN** the form resets after a successful submission
- **THEN** the visibility of the "Payment Details" section MUST be synchronized with the selected "Type" (e.g., if type is "Payment", the payment fields MUST stay visible)
