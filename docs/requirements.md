# Konark HRMS

## Project Overview

Konark HRMS is a modern Human Resource Management System built using Next.js, TypeScript, Prisma, PostgreSQL, Tailwind CSS, and shadcn/ui.

The application helps organizations manage employees, attendance, leave requests, payroll, recruitment, and performance through a secure and user-friendly dashboard.

---

## Objectives

- Employee Management
- Attendance Tracking
- Leave Management
- Payroll Management
- Recruitment Management
- Performance Management
- Reports & Analytics
- AI HR Assistant
## User Roles

### Super Admin

- Full access

### HR Manager

- Manage employees
- Manage recruitment
- Manage payroll

### Department Manager

- View department employees
- Approve leave
- Review attendance

### Employee

- View profile
- Apply leave
- Mark attendance
- View salary
## Modules

- Authentication
- Dashboard
- Employee Management
- Department Management
- Attendance
- Leave
- Payroll
- Recruitment
- Performance
- Reports
- Notifications
- Settings
- AI Assistant
## Database Entities

### Core Entities

1. Company
2. User
3. Role
4. Employee
5. Department

### HR Entities

6. Attendance
7. Leave
8. Payroll
9. Performance Review

### Recruitment

10. Job
11. Candidate
12. Interview

### System

13. Notification
14. Audit Log
15. Settings
## Relationship Overview

Company
│
├── Departments
│      │
│      └── Employees
│              │
│              ├── Attendance
│              ├── Leave
│              ├── Payroll
│              ├── Performance Review
│              └── Notifications
│
├── Jobs
│      │
│      └── Candidates
│               │
│               └── Interviews
│
└── Users
       │
       └── Roles
       # Konark HRMS

## Vision

Konark HRMS is a modern Human Resource Management System designed to simplify employee management, attendance tracking, leave processing, payroll management, recruitment, performance evaluation, and reporting through a secure and scalable web application.
## User Roles

### 1. Super Admin
The Super Admin has complete control over the HRMS. This role can manage companies, departments, employees, payroll, attendance, recruitment, performance, system settings, and user permissions.

### 2. HR Manager
The HR Manager manages employees, recruitment, payroll, attendance records, leave requests, and employee documents. This role cannot change system-level settings.

### 3. Department Manager
The Department Manager supervises employees within a specific department. They can review attendance, approve or reject leave requests, assign tasks, and monitor employee performance.

### 4. Employee
Employees can access their personal dashboard, mark attendance, apply for leave, view their payroll information, update personal details, and track their performance.
## Project Modules

### 1. Authentication
- Login
- Logout
- Forgot Password
- Reset Password
- Role-Based Access Control (RBAC)

### 2. Dashboard
- Overview Cards
- Employee Statistics
- Attendance Summary
- Leave Summary
- Payroll Summary
- Quick Actions

### 3. Employee Management
- Add Employee
- Edit Employee
- Delete Employee
- View Employee Profile
- Employee Documents
- Employee Search & Filters

### 4. Department Management
- Create Department
- Update Department
- Delete Department
- Assign Department Manager

### 5. Attendance Management
- Daily Attendance
- Check-In
- Check-Out
- Attendance History
- Attendance Reports

### 6. Leave Management
- Apply Leave
- Approve Leave
- Reject Leave
- Leave Balance
- Leave History

### 7. Payroll Management
- Salary Structure
- Payslip Generation
- Bonuses
- Deductions
- Salary History

### 8. Recruitment
- Job Openings
- Candidate Management
- Interview Scheduling
- Candidate Status

### 9. Performance Management
- Employee Reviews
- KPIs
- Ratings
- Performance History

### 10. Reports & Analytics
- Attendance Reports
- Payroll Reports
- Employee Reports
- Department Reports

### 11. Notifications
- Email Notifications
- In-App Notifications
- Leave Alerts
- Payroll Alerts

### 12. Settings
- Company Settings
- User Management
- Roles & Permissions
- System Preferences

### 13. AI HR Assistant
- HR Policy Q&A
- Leave Assistance
- Employee Information Search
- AI-powered HR Support
# Database Design

## Core Entities

### 1. Company
Represents an organization using the HRMS.

### 2. Role
Defines user permissions within the system.

### 3. User
Stores login credentials and authentication details.

### 4. Employee
Stores complete employee information.

### 5. Department
Stores company departments.

---

## HR Management

### 6. Attendance
Stores employee attendance records.

### 7. Leave
Stores leave requests and approvals.

### 8. Payroll
Stores salary and payroll information.

### 9. Performance Review
Stores employee performance evaluations.

---

## Recruitment

### 10. Job
Stores job openings.

### 11. Candidate
Stores applicant information.

### 12. Interview
Stores interview schedules and results.

---

## System

### 13. Notification
Stores notifications sent to users.

### 14. Audit Log
Stores important system activities.

### 15. Settings
Stores company and system settings.
# Database Relationships

## Company

- One Company can have many Departments.
- One Company can have many Employees.
- One Company can have many Jobs.
- One Company can have many Users.

---

## Department

- One Department belongs to one Company.
- One Department has many Employees.
- One Department has one Department Manager.

---

## Role

- One Role can be assigned to many Users.

---

## User

- One User belongs to one Role.
- One User is linked to one Employee.

---

## Employee

- One Employee belongs to one Company.
- One Employee belongs to one Department.
- One Employee has one User account.
- One Employee can have many Attendance records.
- One Employee can have many Leave requests.
- One Employee can have many Payroll records.
- One Employee can have many Performance Reviews.
- One Employee can receive many Notifications.
- One Employee can upload many Documents.

---

## Attendance

- Every Attendance record belongs to one Employee.

---

## Leave

- Every Leave request belongs to one Employee.
- Every Leave request is approved by one Manager.

---

## Payroll

- Every Payroll record belongs to one Employee.

---

## Performance Review

- Every Review belongs to one Employee.
- Every Review is created by one Manager.

---

## Recruitment

- One Job can have many Candidates.
- One Candidate can attend many Interviews.

---

## Notification

- Every Notification belongs to one Employee.

---

## Audit Log

- Every Audit Log belongs to one User.
Company
│
├── Departments
│      │
│      └── Employees
│              │
│              ├── User
│              ├── Attendance
│              ├── Leave
│              ├── Payroll
│              ├── Performance Review
│              ├── Documents
│              └── Notifications
│
├── Jobs
│      │
│      └── Candidates
│               │
│               └── Interviews
│
└── Roles
        │
        └── Users