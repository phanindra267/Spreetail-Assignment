# DECISIONS.md - Decision Log

---

## Decision 1: Tech Stack
- **Options Considered**:
  - Option A: Full-stack JS (React + Node/Express + Postgres)
  - Option B: Python (FastAPI + React + Postgres)
  - Option C: Ruby on Rails
- **Chosen**: Option A (React + Node/Express + Postgres)
- **Reason**: Familiarity with the stack, strong ecosystem for CSV processing, and easy deployment options.

## Decision 2: Currency Handling
- **Options Considered**:
  - Option A: Store all amounts in INR, convert USD on import
  - Option B: Store original currency and amount, convert on display
  - Option C: Ignore USD entirely
- **Chosen**: Option B
- **Reason**: Preserves original data for audit purposes, supports Priya's request for accurate currency conversion.

## Decision 3: Group Membership Changes
- **Options Considered**:
  - Option A: Track join/leave dates and only include users in expenses during their membership
  - Option B: Ignore join/leave dates, include everyone in all expenses
  - Option C: Let user manually adjust
- **Chosen**: Option A
- **Reason**: Addresses Sam's request to not be included in March expenses (moved in mid-April).

## Decision 4: Duplicate Handling
- **Options Considered**:
  - Option A: Auto-select the most recent duplicate
  - Option B: Auto-select the duplicate with the most participants
  - Option C: Flag all duplicates for user approval
- **Chosen**: Option C
- **Reason**: Addresses Meera's request to approve any changes/deletions.

## Decision 5: Negative Amounts
- **Options Considered**:
  - Option A: Treat as refunds to the payer
  - Option B: Treat as settlements
  - Option C: Flag as errors
- **Chosen**: Option B (with user confirmation)
- **Reason**: Matches the context of a settlement logged as an expense.
