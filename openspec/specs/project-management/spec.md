## ADDED Requirements

### Requirement: Manage Customers
The system SHALL allow the user to create, read, update, and delete customer records.

#### Scenario: Create a new customer
- **WHEN** the user provides a valid customer name and contact information
- **THEN** the system saves the customer and makes it available for project assignment

### Requirement: Manage Projects
The system SHALL allow the user to create projects associated with a customer, including a field for "number of users" to track billing scope.

#### Scenario: Create a project for a customer
- **WHEN** the user inputs project details and selects an existing customer
- **THEN** the project is created and linked to the selected customer
