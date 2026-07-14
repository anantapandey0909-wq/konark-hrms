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
## 2. Department

### Purpose

The Department entity organizes employees into functional units within a company. Each department belongs to one company and can have one designated manager.

---

### Fields

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | ✅ | Primary Key |
| departmentCode | String | ✅ | Unique department code (e.g., DEP-001) |
| departmentName | String | ✅ | Department name |
| description | String | ❌ | Department description |
| companyId | UUID | ✅ | Reference to Company |
| managerId | UUID | ❌ | Department Manager (Employee) |
| status | Enum | ✅ | ACTIVE / INACTIVE |
| createdAt | DateTime | ✅ | Record creation timestamp |
| updatedAt | DateTime | ✅ | Last updated timestamp |

### Relationships

- One Department belongs to one Company.
- One Department has many Employees.
- One Department has one Department Manager.
## 3. Role

### Purpose

The Role entity defines the permissions assigned to users within the HRMS. It enables Role-Based Access Control (RBAC), ensuring users only access features they are authorized to use.

---

### Fields

| Field       | Type     | Required | Description                                                       |
| ----------- | -------- | -------- | ----------------------------------------------------------------- |
| id          | UUID     | ✅        | Primary Key                                                       |
| roleCode    | String   | ✅        | Unique role code (e.g., ROLE-001)                                 |
| roleName    | String   | ✅        | Role name (Super Admin, HR Manager, Department Manager, Employee) |
| description | String   | ❌        | Description of the role                                           |
| status      | Enum     | ✅        | ACTIVE / INACTIVE                                                 |
| createdAt   | DateTime | ✅        | Record creation timestamp                                         |
| updatedAt   | DateTime | ✅        | Last updated timestamp                                            |

---

### Relationships

* One Role can be assigned to many Users.
* Every User belongs to one Role.
## 4. User

### Purpose

The User entity manages authentication and authorization. It stores login credentials, account status, and role information. Each user can optionally be linked to an employee profile.

---

### Fields

| Field               | Type     | Required | Description                       |
| ------------------- | -------- | -------- | --------------------------------- |
| id                  | UUID     | ✅        | Primary Key                       |
| userCode            | String   | ✅        | Unique user code (e.g., USER-001) |
| email               | String   | ✅        | Login email (must be unique)      |
| password            | String   | ✅        | Hashed password                   |
| roleId              | UUID     | ✅        | Reference to Role                 |
| companyId           | UUID     | ✅        | Reference to Company              |
| employeeId          | UUID     | ❌        | Reference to Employee (optional)  |
| isEmailVerified     | Boolean  | ✅        | Email verification status         |
| lastLogin           | DateTime | ❌        | Last successful login             |
| accountStatus       | Enum     | ✅        | ACTIVE, INACTIVE, LOCKED          |
| failedLoginAttempts | Integer  | ✅        | Failed login counter              |
| createdAt           | DateTime | ✅        | Record creation timestamp         |
| updatedAt           | DateTime | ✅        | Last updated timestamp            |

---

### Relationships

* One User belongs to one Company.
* One User belongs to one Role.
* One User may be linked to one Employee.
## 5. Employee

### Purpose

The Employee entity stores all professional and personal information about employees working in the organization. It acts as the central entity of the HRMS and connects with attendance, leave, payroll, performance reviews, employee documents, and notifications.

---

### Fields

| Field                 | Type     | Required | Description                            |
| --------------------- | -------- | -------- | -------------------------------------- |
| id                    | UUID     | ✅        | Primary Key                            |
| employeeCode          | String   | ✅        | Unique employee code (e.g., EMP-0001)  |
| firstName             | String   | ✅        | Employee first name                    |
| lastName              | String   | ✅        | Employee last name                     |
| email                 | String   | ✅        | Official email address                 |
| phone                 | String   | ✅        | Mobile number                          |
| gender                | Enum     | ✅        | MALE, FEMALE, OTHER                    |
| dateOfBirth           | Date     | ✅        | Employee date of birth                 |
| profileImage          | String   | ❌        | Profile image URL                      |
| designation           | String   | ✅        | Job designation                        |
| employmentType        | Enum     | ✅        | FULL_TIME, PART_TIME, INTERN, CONTRACT |
| joiningDate           | Date     | ✅        | Joining date                           |
| status                | Enum     | ✅        | ACTIVE, ON_LEAVE, RESIGNED, TERMINATED |
| emergencyContactName  | String   | ❌        | Emergency contact person               |
| emergencyContactPhone | String   | ❌        | Emergency contact number               |
| companyId             | UUID     | ✅        | Reference to Company                   |
| departmentId          | UUID     | ✅        | Reference to Department                |
| userId                | UUID     | ✅        | Reference to User                      |
| managerId             | UUID     | ❌        | Reporting manager (Employee)           |
| createdAt             | DateTime | ✅        | Record creation timestamp              |
| updatedAt             | DateTime | ✅        | Last updated timestamp                 |

---

### Relationships

* One Employee belongs to one Company.
* One Employee belongs to one Department.
* One Employee has one User account.
* One Employee may report to one Manager.
* One Employee can manage many Employees.
* One Employee has many Attendance records.
* One Employee has many Leave requests.
* One Employee has many Payroll records.
* One Employee has many Performance Reviews.
* One Employee has many Documents.
* One Employee can receive many Notifications.
