## Why

The user needs a quick project tracking app to manage customer projects, billing info (users), and project schedules (dev, delivery, payment). This solves the problem of keeping track of various project milestones without the overhead of complex project management tools (like Jira or Trello). A dashboard-driven approach "Option 1" will surface overdue, current, and upcoming milestones automatically.

## What Changes

- Create a new Next.js App Router dashboard application (Option 1).
- Define basic data models for Customer, Project, and Schedule (Milestone).
- Implement a dashboard view that categorizes milestones into "Overdue", "This Week", and "Upcoming".
- Add simple forms to create Customers, Projects, and Schedules.
- Automate the generation of payment milestones based on delivery milestones if requested.

## Capabilities

### New Capabilities
- `project-management`: Core capability to track customers, projects, and custom billing information (number of users).
- `schedule-tracking`: Capability to set up Dev, Delivery, and Payment milestones.
- `dashboard-reminders`: Capability to aggregate and highlight upcoming and overdue milestones.

### Modified Capabilities

## Impact

This is a brand new independent application. It impacts the repository by introducing a new Next.js project with its own dependencies and database (likely SQLite for local usage).
