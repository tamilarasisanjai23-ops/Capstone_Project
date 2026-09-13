# Complete Project Documentation
## Volunteer Disaster Relief Coordination System

---

## 1. Project Overview
The **Volunteer Disaster Relief Coordination System** is an enterprise-grade capstone project engineered to streamline emergency response operations during natural disasters. The application connects disaster management teams with frontline volunteers, offering real-time coordination across tasks, supply resources, relief shelters, emergency warning alerts, voice dispatches, walkie-talkie PTT channels, live location tracking, and SOS distress calls.

---

## 2. System Architecture

The application adopts a decoupled 3-Tier Architecture:

```
+-------------------------------------------------------+
|                    PRESENTATION LAYER                 |
|      React.js SPA (Vite + Web Audio + WebRTC + CSS3)  |
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
- **Audio & Media**: Web Audio API (`AudioContext`), `MediaRecorder` API, WebRTC audio streams (`BroadcastChannel` stream loopback)
- **Geolocation**: HTML5 Browser Geolocation API (`navigator.geolocation`)
- **Styling**: Modern CSS3 custom visual system (Dark/Glassmorphism theme, CSS variables)
- **Icons**: Lucide React iconography library
- **Routing**: React Router DOM (Client-side route guards for Admin and Volunteer)
- **HTTP Client**: Custom fetch API service layer with JWT header injection and localStorage fallback

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
   - Central control hub featuring real-time metric widgets, emergency warning alert creation, voice alert recorder, and SOS distress queue.

3. **Volunteer Dashboard Module**:
   - Volunteer workspace presenting assigned tasks, pending actions, prominent SOS emergency button with live GPS capture, and voice alert player.

4. **Real-World Emergency Response Subsystem**:
   - **Emergency Alert System**: Create broadcast warnings with alert levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`). Critical alerts trigger prominent warning banners and Web Audio API alarm sirens.
   - **Voice Alert / Microphone Feature**: Admin records audio messages via browser microphone. Persists voice metadata (`voice_alerts`) and enables volunteers to listen via an inline player with Play, Pause, and Stop controls.
   - **Emergency Radio / Push-to-Talk (PTT)**: Dedicated `/emergency-radio` tactical walkie-talkie page supporting 5 channels (*Medical*, *Rescue*, *Food Distribution*, *Transport*, *General Emergency*), real-time WebRTC audio streams, microphone permission indicators, mute/unmute, and frequency visualizers.
   - **SOS Emergency Button**: Prominent SOS button on Volunteer Dashboard capturing live GPS coordinates (`navigator.geolocation`), notifying Command Center Admins, updating SOS status, and providing an Admin `/sos-alerts` portal.
   - **Live Location & Emergency Map**: Dedicated `/emergency-map` page rendering interactive pins for Disasters, Relief Shelters, SOS Emergency calls, and Live Volunteer coordinates with layer filters.
   - **Enhanced Notification Center**: Unified notification hub for Emergency Warnings, Voice Alerts, SOS Alerts, Task Assignments, and Announcements.

5. **Volunteer Management Module**:
   - Full CRUD operations, skill management (First Aid, Search & Rescue), availability status, and account filtering.

6. **Disaster Management Module**:
   - Categorize disaster events by severity level (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`), start date, description, and geographical location.

7. **Task & Assignment Lifecycle Module**:
   - Create relief tasks linked to specific disasters, assign registered volunteers, and progress tasks across `PENDING`, `ASSIGNED`, `IN_PROGRESS`, and `COMPLETED`.

8. **Resource Inventory Module**:
   - Track emergency supply items (boats, medical kits, rations) with quantities and lifecycle status (`REQUESTED`, `DISPATCHED`, `DELIVERED`, `AVAILABLE`).

9. **Relief Shelter Module**:
   - Shelter facility monitoring with occupancy capacity, emergency contact numbers, and operational state.

10. **Geographic Location Module**:
    - Standardized address repository mapping cities, districts, and postal pincodes.

11. **Reports & Analytics Module**:
    - Aggregated visual analytics breakdown across volunteers, tasks, resources, and relief centers.

---

## 5. Database Schema & Tables

The system comprises 14 relational tables:
1. `users` - User authentication credentials & roles
2. `volunteers` - Volunteer profiles & skills
3. `locations` - Address & district definitions
4. `disasters` - Disaster incidents & severity
5. `relief_centers` - Shelter facilities & capacity
6. `tasks` - Emergency relief task requirements
7. `task_assignments` - Task allocations to volunteers
8. `resources` - Emergency supply items
9. `notifications` - In-app system alerts & notifications
10. `emergency_alerts` - Admin emergency broadcast alerts
11. `voice_alerts` - Audio voice alert dispatches
12. `sos_alerts` - Volunteer distress signals with GPS
13. `emergency_radio_channels` - Walkie-talkie PTT channels
14. `volunteer_locations` - Live volunteer GPS coordinates
