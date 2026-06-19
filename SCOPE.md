# SCOPE.md - Anomaly Log & Database Schema

---

## 1. Database Schema

### Tables
```sql
-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Groups
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Group Memberships (with effective dates)
CREATE TABLE group_memberships (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL REFERENCES groups(id),
    user_id INT NOT NULL REFERENCES users(id),
    joined_at DATE NOT NULL,
    left_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL REFERENCES groups(id),
    payer_id INT NOT NULL REFERENCES users(id),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    description TEXT,
    date DATE NOT NULL,
    split_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expense Splits
CREATE TABLE expense_splits (
    id SERIAL PRIMARY KEY,
    expense_id INT NOT NULL REFERENCES expenses(id),
    user_id INT NOT NULL REFERENCES users(id),
    amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settlements
CREATE TABLE settlements (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL REFERENCES groups(id),
    payer_id INT NOT NULL REFERENCES users(id),
    payee_id INT NOT NULL REFERENCES users(id),
    amount NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Import Reports
CREATE TABLE import_reports (
    id SERIAL PRIMARY KEY,
    group_id INT REFERENCES groups(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Import Anomalies
CREATE TABLE import_anomalies (
    id SERIAL PRIMARY KEY,
    import_report_id INT NOT NULL REFERENCES import_reports(id),
    row_number INT,
    issue_type VARCHAR(100),
    description TEXT,
    action_taken VARCHAR(100),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. Anomaly Log

| Row # | Issue Type | Description | Policy & Action |
|-------|------------|-------------|-----------------|
| TBD | Negative Amount | Expense amount is negative | Treat as refund/settlement |
| TBD | Duplicate Entry | Same expense logged multiple times with different amounts | Flag for user approval |
| TBD | Invalid Currency | Currency not supported (only INR & USD) | Flag for user approval |
| TBD | Member Post-Departure | Expense dated after user moved out | Flag for user approval |
| TBD | Invalid Split Type | Split type not recognized | Flag for user approval |
| TBD | Inconsistent Date Format | Date in non-ISO format | Parse and normalize |
| TBD | Missing Required Field | Required field is empty | Flag for user approval |
| TBD | Mismatched Total Split | Sum of splits ≠ expense amount | Flag for user approval |
| TBD | Unknown User | User not in system | Flag for user approval |
| TBD | Settlement as Expense | Settlement logged as expense | Convert to settlement |
| TBD | Inconsistent Formatting | Data in inconsistent format | Normalize |
| TBD | Empty Row | Completely empty row in CSV | Skip |
