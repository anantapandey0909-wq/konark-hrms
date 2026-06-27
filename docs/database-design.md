# Database Design

## 1. Company

# Database Design

## 1. Company

### Purpose

The Company entity stores information about organizations using the HRMS. Although Version 1 may support only one company, the database is designed with a multi-company (multi-tenant) architecture to support future scalability.

---

### Fields

| Field              | Type     | Required | Description                                         |
| ------------------ | -------- | -------- | --------------------------------------------------- |
| id                 | UUID     | ✅        | Primary Key                                         |
| companyCode        | String   | ✅        | Unique company code (e.g., COMP-001)                |
| companyName        | String   | ✅        | Official company name                               |
| email              | String   | ✅        | Official company email                              |
| phone              | String   | ✅        | Company contact number                              |
| website            | String   | ❌        | Company website                                     |
| logo               | String   | ❌        | Company logo URL                                    |
| taxId              | String   | ❌        | Tax identification number (GSTIN, EIN, etc.)        |
| registrationNumber | String   | ✅        | Business registration number (CIN or equivalent)    |
| baseCurrency       | Enum     | ✅        | Default payroll currency (INR, USD, EUR, etc.)      |
| timezone           | String   | ✅        | Company timezone (e.g., Asia/Kolkata)               |
| address            | String   | ✅        | Company address                                     |
| city               | String   | ✅        | City                                                |
| state              | String   | ✅        | State                                               |
| country            | String   | ✅        | Country                                             |
| postalCode         | String   | ✅        | Postal/ZIP code                                     |
| status             | Enum     | ✅        | Company status (ACTIVE, INACTIVE, TRIAL, SUSPENDED) |
| createdAt          | DateTime | ✅        | Record creation timestamp                           |
| updatedAt          | DateTime | ✅        | Last updated timestamp                              |

---

### Relationships

* One Company has many Departments.
* One Company has many Employees.
* One Company has many Users.
* One Company has many Job Openings.

---

## Database Design Standards

### Primary Keys

* Every table will use a UUID as its primary key.

### Business Codes

Human-readable business codes will be used throughout the application.

Examples:

* Company → COMP-001
* Department → DEP-001
* Employee → EMP-0001
* Job → JOB-0001

### Timestamps

Every table will include:

* createdAt
* updatedAt

### Relationships

* All relationships will use foreign keys.
* Referential integrity will be enforced by the database.

### Soft Delete

Instead of permanently deleting important records, the application will use a status field whenever possible to preserve historical data.

### Naming Conventions

* Tables: PascalCase
* Fields: camelCase
* Enums: UPPER_CASE
* Foreign Keys: entityNameId (e.g., companyId, departmentId)
