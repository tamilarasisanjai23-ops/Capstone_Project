# Problem Statement Document
## Volunteer Disaster Relief Coordination System

---

## 1. Introduction
Natural disasters such as flash floods, cyclones, landslides, and earthquakes create immediate life-threatening crises that demand swift, coordinated response from emergency personnel, local government, non-governmental organizations (NGOs), and community volunteers. When disaster strikes, hundreds of willing citizens offer assistance, yet managing this rapid surge of humanitarian goodwill requires streamlined coordination, clear communication, and centralized tracking.

---

## 2. Existing Problem
In traditional disaster management scenarios, relief operations suffer from critical operational bottlenecks:
- **Fragmented Communication**: Volunteer registration and task distribution are conducted through informal chat groups, phone calls, or manual paper logs, leading to miscommunication.
- **Resource Mismatch**: Emergency medical supplies, food packets, and heavy rescue tools are dispatched haphazardly without real-time tracking of demand and delivery status.
- **Volunteer Under-utilization or Overload**: Skilled volunteers (e.g., medical paramedics, boat drivers) are deployed inefficiently due to lack of a centralized skills registry.
- **Lack of Operational Visibility**: Disaster response coordinators lack a single-pane-of-glass dashboard to monitor active disasters, task completion rates, shelter capacities, and critical shortages.

---

## 3. Proposed System
The **Volunteer Disaster Relief Coordination System** is a modern, full-stack web application designed to bridge the gap between disaster administrators and field volunteers. Built with a responsive React frontend, Java Spring Boot REST backend, and MySQL database, the system automates:
1. Online volunteer registration, skill profiling, and availability tracking.
2. Disaster incident creation, severity grading, and geolocation tagging.
3. Rapid task creation, priority assignment, and real-time status updates (Pending $\rightarrow$ Assigned $\rightarrow$ In Progress $\rightarrow$ Completed).
4. Supply and resource inventory tracking (Requested, Dispatched, Delivered).
5. Relief center shelter management (Occupancy, contact info, capacity monitoring).
6. Automated notifications and executive reporting dashboards.

---

## 4. Objectives
- Establish a unified digital platform for emergency disaster management.
- Automate volunteer registration and skill-based task allocation.
- Provide real-time tracking of disaster events, task lifecycles, and relief resources.
- Enable transparent role-based access control (Admin vs. Volunteer).
- Reduce disaster response turnaround time during emergency relief campaigns.

---

## 5. System Scope
### In Scope:
- User registration, authentication (JWT), and role-based authorization.
- Admin dashboard for complete system oversight and statistics.
- Volunteer dashboard for task acceptance and status reporting.
- Full CRUD management for Volunteers, Disasters, Tasks, Resources, Relief Centers, and Locations.
- Statistical reports and instant notifications.

### Out of Scope:
- Direct emergency 911 / police dispatch integration.
- Real-time satellite imagery / AI weather forecasting algorithms.
- Payment gateway integration for monetary donations.

---

## 6. Target Users
1. **Disaster Relief Administrator**: System manager responsible for creating disaster alerts, allocating tasks, tracking resources, managing shelters, and viewing performance reports.
2. **Field Volunteer**: Registered community responder who views assigned emergency duties, updates task progress, and accesses relief center information.

---

## 7. Functional Requirements
- **FR-1 Authentication**: Secure user registration, login, JWT token issuance, and password verification.
- **FR-2 Volunteer Management**: Profile creation, skills categorization (First Aid, Search & Rescue, Logistics), availability status, and account approval.
- **FR-3 Disaster Management**: Logging disaster incidents with type, severity (Low, Moderate, High, Critical), description, start date, and status.
- **FR-4 Task Management & Assignment**: Creating tasks, assigning specific volunteers, updating task status (Pending, Assigned, In Progress, Completed), and priority tagging.
- **FR-5 Resource Tracking**: Requesting, dispatching, and tracking supplies (water, medical kits, rations) tied to specific disasters.
- **FR-6 Relief Center Management**: Registering shelters, capacity monitoring, contact details, and location linking.
- **FR-7 Location Management**: Managing standardized geographic address records (Address, City, District, Pincode).
- **FR-8 Reporting & Notifications**: Generating system statistics (volunteers count, completed tasks, resource fulfillment) and broadcasting broadcast/user notifications.

---

## 8. Non-Functional Requirements
- **NFR-1 Security**: Role-based authorization, BCrypt password hashing, and CORS control.
- **NFR-2 Performance**: RESTful endpoints with sub-second response times under concurrent request loads.
- **NFR-3 Usability**: Modern visual interface with responsive dark theme, glassmorphism design, clear metrics cards, and intuitive navigation.
- **NFR-4 Reliability & Resilience**: Clean exception handling on backend with graceful fallback mechanisms.
