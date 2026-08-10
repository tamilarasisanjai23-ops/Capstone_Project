
Problem Statement
1. Title
Volunteer Disaster Relief Coordination System

2. Domain
Disaster Management / Emergency Response

3. Who is the user?
Admin – manages disasters, volunteers, tasks, and relief activities.

Volunteer – registers, views assigned tasks, and updates task status.

Relief Coordinator – coordinates volunteers, resources, and relief operations.

4. What problem are we solving?
During natural disasters such as floods, cyclones, and earthquakes, coordinating volunteers and relief activities manually can cause delays and confusion. There is no centralized system to manage volunteer registration, task assignment, resource requirements, and task progress. The proposed system provides a centralized platform to efficiently coordinate volunteers and track disaster relief activities in real time.

5. Proposed Solution
A web-based Volunteer Disaster Relief Coordination System will allow volunteers to register and admins to verify and manage them. Admins can create disaster events, assign tasks to suitable volunteers, and track task completion. The system will maintain disaster, volunteer, task, resource, and location information in a database.

6. Core Entities / Database Tables
Users

Volunteers

Disasters

Tasks

Resources

Task Assignments

Relief Centers

Locations

7. User Roles & Permissions
Admin: Manage users, disasters, volunteers, tasks, resources, and reports.

Volunteer: Register/login, view assigned tasks, update task status, and view relief information.

Coordinator: Assign volunteers, monitor tasks, and coordinate relief activities.

8. Success Criteria
Volunteer should be able to register and log in successfully.

Admin should be able to create and manage disaster events.

Admin/Coordinator should be able to assign tasks to volunteers.

Volunteers should be able to update task status.

System should provide accurate tracking of ongoing and completed relief activities.

9. Out of Scope
Direct emergency ambulance/police dispatch.

Real-time satellite disaster prediction.

Online donation/payment processing.

Advanced AI-based disaster prediction.

10. Chosen Track
Java (Spring Boot) + MySQL + HTML/CSS/JavaScript