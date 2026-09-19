# Entity-Relationship (ER) Diagram
## Volunteer Disaster Relief Coordination System

This document provides the complete Database Design & Entity-Relationship (ER) Diagram specification for the **Volunteer Disaster Relief Coordination System** with Real-World Emergency Response features.

---

## 1. ER Diagram

```mermaid
erDiagram
    USERS ||--o| VOLUNTEERS : "1:1 (User has Volunteer Profile)"
    USERS ||--o{ EMERGENCY_ALERTS : "1:N (Admin creates Emergency Alerts)"
    USERS ||--o{ VOICE_ALERTS : "1:N (Admin records Voice Alerts)"
    USERS ||--o{ NOTIFICATIONS : "1:N (User receives Notifications)"
    VOLUNTEERS ||--o{ TASK_ASSIGNMENTS : "1:N (Volunteer receives Assignments)"
    VOLUNTEERS ||--o{ SOS_ALERTS : "1:N (Volunteer triggers SOS Alerts)"
    VOLUNTEERS ||--o| VOLUNTEER_LOCATIONS : "1:1 (Volunteer live location)"
    
     ||--o{ TASK_ASSIGNMENTS : "1:N (Task split into Assignments)"
    DISASTERS ||--o{ TASKS : "1:N (Disaster creates Tasks)"
    DISASTERS ||--o{ RESOURCES : "1:N (Disaster requires Resources)"
    DISASTERS ||--o{ EMERGENCY_ALERTS : "1:N (Disaster linked to Alerts)"
    LOCATIONS ||--o{ DISASTERS : "1:N (Location hosts Disasters)"
    LOCATIONS ||--o{ RELIEF_CENTERS : "1:N (Location hosts Relief Centers)"

    USERS {
        BIGINT user_id PK "Primary Key"
        VARCHAR name "Full Name"
        VARCHAR email "Unique Email Address"
        VARCHAR phone "Contact Number"
        VARCHAR password "Hashed Password"
        VARCHAR role "Role (ADMIN, VOLUNTEER)"
    }

    VOLUNTEERS {
        BIGINT volunteer_id PK "Primary Key"
        BIGINT user_id FK "Foreign Key to USERS (1:1 Unique)"
        VARCHAR skills "Skills / Qualifications"
        VARCHAR availability "Availability Schedule"
        VARCHAR status "Status (AVAILABLE, ON_DUTY, INACTIVE)"
    }

    DISASTERS {
        BIGINT disaster_id PK "Primary Key"
        VARCHAR type "Type (Cyclone, Flood, Landslide)"
        VARCHAR severity "Severity (LOW, MODERATE, HIGH, CRITICAL)"
        TEXT description "Event Details"
        DATE start_date "Disaster Start Date"
        BIGINT location_id FK "Foreign Key to LOCATIONS"
    }

    LOCATIONS {
        BIGINT location_id PK "Primary Key"
        VARCHAR address "Street Address / Zone"
        VARCHAR city "City Name"
        VARCHAR district "District / Region"
        VARCHAR pincode "Postal Code"
    }

    TASKS {
        BIGINT task_id PK "Primary Key"
        BIGINT disaster_id FK "Foreign Key to DISASTERS"
        VARCHAR title "Task Title"
        TEXT description "Detailed Instructions"
        VARCHAR priority "Priority (LOW, MEDIUM, HIGH, URGENT)"
        BIGINT location_id FK "Foreign Key to LOCATIONS"
        VARCHAR status "Status (PENDING, ASSIGNED, IN_PROGRESS, COMPLETED)"
    }

    TASK_ASSIGNMENTS {
        BIGINT assignment_id PK "Primary Key"
        BIGINT task_id FK "Foreign Key to TASKS"
        BIGINT volunteer_id FK "Foreign Key to VOLUNTEERS"
        DATETIME assigned_date "Assignment Timestamp"
        VARCHAR status "Status (ASSIGNED, IN_PROGRESS, COMPLETED)"
    }

    RESOURCES {
        BIGINT resource_id PK "Primary Key"
        BIGINT disaster_id FK "Foreign Key to DISASTERS"
        VARCHAR resource_name "Item / Equipment / Ration"
        INT quantity "Quantity Count"
        VARCHAR status "Status (REQUESTED, DISPATCHED, DELIVERED)"
    }

    RELIEF_CENTERS {
        BIGINT center_id PK "Primary Key"
        VARCHAR name "Center Name"
        BIGINT location_id FK "Foreign Key to LOCATIONS"
        INT capacity "Maximum Capacity"
        VARCHAR contact "Emergency Contact Info"
    }

    EMERGENCY_ALERTS {
        BIGINT alert_id PK "Primary Key"
        VARCHAR title "Alert Headline"
        TEXT message "Detailed Warning Message"
        VARCHAR severity "Severity (LOW, MEDIUM, HIGH, CRITICAL)"
        BIGINT disaster_id FK "Foreign Key to DISASTERS (Optional)"
        BIGINT created_by FK "Foreign Key to USERS"
        DATETIME created_at "Created Timestamp"
    }

    VOICE_ALERTS {
        BIGINT voice_id PK "Primary Key"
        VARCHAR title "Voice Dispatch Title"
        LONGTEXT audio_data "Base64 WebM/WAV Audio Data"
        INT duration "Duration in Seconds"
        VARCHAR alert_level "Level (LOW, MEDIUM, HIGH, CRITICAL)"
        BIGINT created_by FK "Foreign Key to USERS"
        DATETIME created_at "Created Timestamp"
    }

    SOS_ALERTS {
        BIGINT sos_id PK "Primary Key"
        BIGINT volunteer_id FK "Foreign Key to VOLUNTEERS"
        DECIMAL latitude "GPS Latitude"
        DECIMAL longitude "GPS Longitude"
        TEXT message "Distress Situation Message"
        VARCHAR status "Status (ACTIVE, RESPONDING, RESOLVED)"
        DATETIME created_at "Created Timestamp"
    }

    EMERGENCY_RADIO_CHANNELS {
        BIGINT channel_id PK "Primary Key"
        VARCHAR channel_name "Unique Channel Name"
        VARCHAR description "Channel Purpose"
        VARCHAR status "Status (ACTIVE, INACTIVE)"
    }

    VOLUNTEER_LOCATIONS {
        BIGINT location_record_id PK "Primary Key"
        BIGINT volunteer_id FK "Foreign Key to VOLUNTEERS (1:1 Unique)"
        DECIMAL latitude "GPS Latitude"
        DECIMAL longitude "GPS Longitude"
        VARCHAR status "Status (ACTIVE, INACTIVE)"
        DATETIME updated_at "Last Geolocation Update"
    }
```

---

## 2. Relationships & Cardinalities

| Parent Entity | Relationship | Child Entity | Foreign Key | Description |
| :--- | :---: | :--- | :--- | :--- |
| **USERS** | **1 : 1** | **VOLUNTEERS** | `VOLUNTEERS.user_id` | User with volunteer role has one volunteer profile. |
| **USERS** | **1 : M** | **EMERGENCY_ALERTS** | `EMERGENCY_ALERTS.created_by` | Admin creates emergency alert broadcasts. |
| **USERS** | **1 : M** | **VOICE_ALERTS** | `VOICE_ALERTS.created_by` | Admin records voice audio alerts. |
| **VOLUNTEERS** | **1 : M** | **TASK_ASSIGNMENTS** | `TASK_ASSIGNMENTS.volunteer_id` | Volunteer assigned to multiple task assignments. |
| **VOLUNTEERS** | **1 : M** | **SOS_ALERTS** | `SOS_ALERTS.volunteer_id` | Volunteer triggers SOS distress calls. |
| **VOLUNTEERS** | **1 : 1** | **VOLUNTEER_LOCATIONS** | `VOLUNTEER_LOCATIONS.volunteer_id` | Volunteer transmits live GPS coordinates. |
| **TASKS** | **1 : M** | **TASK_ASSIGNMENTS** | `TASK_ASSIGNMENTS.task_id` | Task allocated to one or multiple volunteers. |
| **DISASTERS** | **1 : M** | **TASKS** | `TASKS.disaster_id` | Disaster requires multiple emergency tasks. |
| **LOCATIONS** | **1 : M** | **TASKS** | `TASKS.location_id` | Location is associated with multiple emergency tasks. |
| **DISASTERS** | **1 : M** | **RESOURCES** | `RESOURCES.disaster_id` | Disaster requires multiple emergency resources. |
| **LOCATIONS** | **1 : M** | **TASKS** | `TASKS.location_id` | Location is associated with multiple emergency tasks. |
| **DISASTERS** | **1 : M** | **EMERGENCY_ALERTS** | `EMERGENCY_ALERTS.disaster_id` | Disaster links to emergency warnings. |
| **LOCATIONS** | **1 : M** | **DISASTERS** | `DISASTERS.location_id` | Location hosts disaster events. |
| **LOCATIONS** | **1 : M** | **RELIEF_CENTERS** | `RELIEF_CENTERS.location_id` | Location contains relief center shelters. |
