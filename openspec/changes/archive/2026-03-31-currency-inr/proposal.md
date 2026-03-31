## Why

The application is used in an Indian business context. All monetary amounts should be displayed and labelled in Indian Rupees (₹) rather than US Dollars ($). Currently the "Add Schedule" form labels the amount field with a `$` prefix, and the dashboard schedule cards display amounts with `$`. These should all use the `₹` symbol.

## What Changes

- Replace all `$` currency symbols with `₹` in the UI where amounts are displayed or labelled.

## Capabilities

### Modified Capabilities
- `schedule-tracking`: Amount display now uses Indian Rupee (₹) symbol throughout.

## Impact

UI-only change. No database schema, Server Actions, or backend logic is affected.
