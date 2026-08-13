# Complete Project Documentation
## Volunteer Disaster Relief Coordination System

---

## 1. Project Overview
The **Volunteer Disaster Relief Coordination System** is a enterprise-grade capstone project engineered to streamline emergency response operations during natural disasters. The application connects disaster management teams with frontline volunteers, offering real-time coordination across tasks, supply resources, relief shelters, and emergency alerts.

---

## 2. System Architecture

The application adopts a decoupled 3-Tier Architecture:

```
+-------------------------------------------------------+
|                    PRESENTATION LAYER                 |
|             React.js SPA (Vite + Tailwind/CSS3)        |
|      Single Page Application with Role Dashboards     |
+---------------------------+---------------------------+
                            | HTTP / REST API (JSON)
                            v
+-------------------------------------------------------+
|                    APPLICATION LAYER                  |
|            Java Spring Boot REST Web Services         |
|   Security | Controllers | Services | Repositories    |
+---------------------------+---------------------------+
                            | Spring Data JPA / JDBC
                            v
+-------------------------------------------------------+
|                      DATA LAYER                       |
|               MySQL Relational Database               |
|            Relational Schema & Constraints            |
+-------------------------------------------------------+
```

---

## 3. Technology Stack

### Frontend:
- **Framework**: React.js (v18+) with Vite build tool
- **Styling**: Modern CSS3 custom visual system (Dark/Glassmorphism theme, CSS variables)
- **Icons**: Lucide React iconography library
- **Routing**: React Router DOM (Client-side route guards for Admin and Volunteer)
- **HTTP Client**: Custom fetch/axios API service layer with JWT header injection

### Backend:
- **Language**: Java 17 / 26
- **Framework**: Spring Boot 3.x
- **Build Tool**: Apache Maven
- **Persistence**: Spring Data JPA / Hibernate
- **Database Driver**: MySQL Connector/J
- **Security**: Spring Security + JSON Web Token (JJWT) + BCrypt Password Encoder
- **Utilities**: Lombok, Bean Validation (`jakarta.validation`)

### Database:
- **RDBMS**: MySQL 8.0+
- **Database Name**: `volunteer_disaster_relief`

---

## 4. Key Functional Modules

1. **Authentication & Authorization Module**:
   - Handles User Login, Registration, Password hashing, Role-based JWT token generation.
   - Roles: `ADMIN`, `VOLUNTEER`.

2. **Admin Dashboard Module**:
   - Central control hub featuring 8 metric widgets: Total Volunteers, Active Volunteers, Total Disasters, Active Disasters, Pending Tasks, Completed Tasks, Available Resources, Relief Centers.

3. **Volunteer Dashboard Module**:
   - Volunteer workspace presenting assigned tasks, pending actions, completion metrics, and disaster warning banners.

4. **Volunteer Management Module**:
   - Full CRUD operations, skill management (First Aid, Search & Rescue), availability status, and account filtering.

5. **Disaster Management Module**:
   - Categorize disaster events by severity level (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`), start date, description, and geographical location.

6. **Task & Assignment Lifecycle Module**:
   - Create relief tasks linked to specific disasters, assign registered volunteers, and progress tasks across `PENDING`, `ASSIGNED`, `IN_PROGRESS`, and `COMPLETED`.

7. **Resource Inventory Module**:
   - Track emergency supply items (boats, medical kits, rations) with quantities and lifecycle status (`REQUESTED`, `DISPATCHED`, `DELIVERED`, `AVAILABLE`).

8. **Relief Shelter Module**:
   - Shelter facility monitoring with occupancy capacity, emergency contact numbers, and operational state.

9. **Geographic Location Module**:
   - Standardized address repository mapping cities, districts, and postal pincodes.

10. **Reports & Analytics Module**:
    - Aggregated visual analytics breakdown across volunteers, tasks, resources, and relief centers.

11. **Notification System**:
    - In-app notification center for broadcast announcements and task assignment alerts.

---

## 5. REST API Specifications Overview

| Module | Endpoint | Method | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| **Auth** | `/api/auth/login` | `POST` | Public | Authenticate user & return JWT token |
| **Auth** | `/api/auth/register` | `POST` | Public | Register new volunteer user |
| **Volunteers** | `/api/volunteers` | `GET` | Admin/Volunteer | List all registered volunteers |
| **Volunteers** | `/api/volunteers/{id}` | `PUT` | Admin | Update volunteer details/status |
| **Disasters** | `/api/disasters` | `GET/POST` | Authenticated | List or create disaster events |
| **Tasks** | `/api/tasks` | `GET/POST` | Authenticated | List or create emergency tasks |
| **Tasks** | `/api/tasks/{id}/assign` | `POST` | Admin | Assign volunteer to task |
| **Tasks** | `/api/tasks/{id}/status` | `PATCH` | Authenticated | Update task progress status |
| **Resources** | `/api/resources` | `GET/POST` | Authenticated | Manage emergency supplies |
| **Relief Centers** | `/api/relief-centers` | `GET/POST` | Authenticated | Manage shelter facilities |
| **Locations** | `/api/locations` | `GET/POST` | Authenticated | Manage geographical locations |
| **Notifications**| `/api/notifications` | `GET` | Authenticated | Fetch notifications for logged-in user |
| **Reports** | `/api/reports/summary` | `GET` | Admin | Aggregate system metrics |

---

## 6. Future Enhancements
- Real-time WebSockets integration for live disaster chat and instant push alerts.
- Interactive Leaflet / Mapbox GIS map displaying real-time disaster zones and volunteer locations.
- Offline PWA support with background synchronization for field volunteers in low-connectivity areas.
- Automated SMS / WhatsApp notification gateway integration via Twilio.
