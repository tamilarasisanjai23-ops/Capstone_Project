# Entity-Relationship (ER) Diagram
## Volunteer Disaster Relief Coordination System

This document provides the full Database Design & Entity-Relationship (ER) Diagram specification for the **Volunteer Disaster Relief Coordination System**.

---

## 1. Mermaid ER Diagram

```mermaid
erDiagram
    USERS ||--o| VOLUNTEERS : "1:1 (User has Volunteer Profile)"
    USERS ||--o{ NOTIFICATIONS : "1:N (User receives Notifications)"
    VOLUNTEERS ||--o{ TASK_ASSIGNMENTS : "1:N (Volunteer accepts Task Assignments)"
    TASKS ||--o{ TASK_ASSIGNMENTS : "1:N (Task is allocated to Assignments)"
    DISASTERS ||--o{ TASKS : "1:N (Disaster spawns Tasks)"
    DISASTERS ||--o{ RESOURCES : "1:N (Disaster requires Resources)"
    LOCATIONS ||--o{ DISASTERS : "1:N (Location hosts Disasters)"
    LOCATIONS ||--o{ RELIEF_CENTERS : "1:N (Location hosts Relief Centers)"
    LOCATIONS ||--o{ TASKS : "1:N (Location grounds Tasks)"

    USERS {
        BIGINT user_id PK "Primary Key"
        VARCHAR name "Full Name"
        VARCHAR email "Unique Email Address"
        VARCHAR phone "Contact Phone Number"
        VARCHAR password "BCrypt Hashed Password"
        VARCHAR role "Role (ADMIN, VOLUNTEER)"
        DATETIME created_at "Record Creation Timestamp"
        DATETIME updated_at "Record Update Timestamp"
    }

    VOLUNTEERS {
        BIGINT volunteer_id PK "Primary Key"
        BIGINT user_id FK "Foreign Key to USERS (1:1 Unique)"
        VARCHAR skills "Specialized Skills / Qualifications"
        VARCHAR availability "Availability Schedule"
        VARCHAR status "Status (AVAILABLE, ON_DUTY, INACTIVE)"
        DATETIME created_at "Record Creation Timestamp"
        DATETIME updated_at "Record Update Timestamp"
    }

    LOCATIONS {
        BIGINT location_id PK "Primary Key"
        VARCHAR address "Street Address / Landmark"
        VARCHAR city "City Name"
        VARCHAR district "District / Region"
        VARCHAR pincode "Postal Code"
        DATETIME created_at "Record Creation Timestamp"
        DATETIME updated_at "Record Update Timestamp"
    }

    DISASTERS {
        BIGINT disaster_id PK "Primary Key"
        VARCHAR type "Disaster Type (Flood, Earthquake, Cyclone)"
        VARCHAR severity "Severity (LOW, MODERATE, HIGH, CRITICAL)"
        TEXT description "Detailed Disaster Information"
        DATE start_date "Incident Date"
        VARCHAR status "Status (ACTIVE, RESOLVED, MONITORING)"
        BIGINT location_id FK "Foreign Key to LOCATIONS"
        DATETIME created_at "Record Creation Timestamp"
        DATETIME updated_at "Record Update Timestamp"
    }

    RELIEF_CENTERS {
        BIGINT center_id PK "Primary Key"
        VARCHAR name "Relief Center Name"
        BIGINT location_id FK "Foreign Key to LOCATIONS"
        INT capacity "Shelter Occupancy Capacity"
        VARCHAR contact "Emergency Hotline / Contact"
        VARCHAR status "Status (ACTIVE, FULL, STANDBY)"
        DATETIME created_at "Record Creation Timestamp"
        DATETIME updated_at "Record Update Timestamp"
    }

    TASKS {
        BIGINT task_id PK "Primary Key"
        BIGINT disaster_id FK "Foreign Key to DISASTERS"
        VARCHAR title "Emergency Action Title"
        TEXT description "Execution Guidelines"
        VARCHAR priority "Priority (LOW, MEDIUM, HIGH, URGENT)"
        BIGINT location_id FK "Foreign Key to LOCATIONS"
        VARCHAR status "Status (PENDING, ASSIGNED, IN_PROGRESS, COMPLETED)"
        DATETIME created_at "Record Creation Timestamp"
        DATETIME updated_at "Record Update Timestamp"
    }

    TASK_ASSIGNMENTS {
        BIGINT assignment_id PK "Primary Key"
        BIGINT task_id FK "Foreign Key to TASKS"
        BIGINT volunteer_id FK "Foreign Key to VOLUNTEERS"
        DATETIME assigned_date "Assignment Timestamp"
        VARCHAR status "Status (ASSIGNED, IN_PROGRESS, COMPLETED)"
        DATETIME created_at "Record Creation Timestamp"
        DATETIME updated_at "Record Update Timestamp"
    }

    RESOURCES {
        BIGINT resource_id PK "Primary Key"
        BIGINT disaster_id FK "Foreign Key to DISASTERS"
        VARCHAR resource_name "Supply Item / Equipment"
        INT quantity "Item Quantity Count"
        VARCHAR status "Status (REQUESTED, DISPATCHED, DELIVERED, AVAILABLE)"
        DATETIME created_at "Record Creation Timestamp"
        DATETIME updated_at "Record Update Timestamp"
    }

    NOTIFICATIONS {
        BIGINT notification_id PK "Primary Key"
        BIGINT user_id FK "Foreign Key to USERS"
        VARCHAR title "Notification Header"
        TEXT message "Message Body"
        VARCHAR type "Type (TASK_ASSIGNMENT, DISASTER_ALERT, ANNOUNCEMENT)"
        BOOLEAN is_read "Read Status Flag"
        DATETIME created_at "Record Creation Timestamp"
    }
```

---

## 2. Relationships & Cardinalities Summary

| Parent Entity | Cardinality | Child Entity | Foreign Key | Description |
| :--- | :---: | :--- | :--- | :--- |
| **USERS** | **1 : 1** | **VOLUNTEERS** | `VOLUNTEERS.user_id` | Each volunteer user links to exactly one volunteer profile. |
| **USERS** | **1 : M** | **NOTIFICATIONS** | `NOTIFICATIONS.user_id` | A user can receive multiple alerts and notifications. |
| **VOLUNTEERS** | **1 : M** | **TASK_ASSIGNMENTS** | `TASK_ASSIGNMENTS.volunteer_id` | A volunteer can be assigned to multiple relief tasks. |
| **TASKS** | **1 : M** | **TASK_ASSIGNMENTS** | `TASK_ASSIGNMENTS.task_id` | A single relief task can have task assignment logs. |
| **DISASTERS** | **1 : M** | **TASKS** | `TASKS.disaster_id` | An active disaster spawns emergency response tasks. |
| **DISASTERS** | **1 : M** | **RESOURCES** | `RESOURCES.disaster_id` | A disaster requires specific relief supplies and items. |
| **LOCATIONS** | **1 : M** | **DISASTERS** | `DISASTERS.location_id` | Geographic location hosting disaster incidents. |
| **LOCATIONS** | **1 : M** | **RELIEF_CENTERS** | `RELIEF_CENTERS.location_id` | Physical location hosting relief shelter centers. |
| **LOCATIONS** | **1 : M** | **TASKS** | `TASKS.location_id` | Location target where task execution takes place. |
