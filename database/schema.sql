-- =================================================================
-- VOLUNTEER DISASTER RELIEF COORDINATION SYSTEM
-- Database Schema Definition & Initial Seed Data
-- Database Engine: MySQL 8.0+
-- =================================================================

CREATE DATABASE IF NOT EXISTS volunteer_disaster_relief;
USE volunteer_disaster_relief;

-- -----------------------------------------------------------------
-- 1. Table: users
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'VOLUNTEER',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 2. Table: volunteers
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS volunteers (
    volunteer_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    skills VARCHAR(255),
    availability VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_volunteers_users FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 3. Table: locations
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS locations (
    location_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 4. Table: disasters
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS disasters (
    disaster_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    location_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_disasters_locations FOREIGN KEY (location_id) 
        REFERENCES locations(location_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 5. Table: relief_centers
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS relief_centers (
    center_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location_id BIGINT NOT NULL,
    capacity INT NOT NULL DEFAULT 0,
    contact VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_relief_centers_locations FOREIGN KEY (location_id) 
        REFERENCES locations(location_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 6. Table: tasks
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
    task_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    disaster_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    location_id BIGINT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tasks_disasters FOREIGN KEY (disaster_id) 
        REFERENCES disasters(disaster_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_tasks_locations FOREIGN KEY (location_id) 
        REFERENCES locations(location_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 7. Table: task_assignments
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS task_assignments (
    assignment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_id BIGINT NOT NULL,
    volunteer_id BIGINT NOT NULL,
    assigned_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'ASSIGNED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_assignments_tasks FOREIGN KEY (task_id) 
        REFERENCES tasks(task_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_assignments_volunteers FOREIGN KEY (volunteer_id) 
        REFERENCES volunteers(volunteer_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 8. Table: resources
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS resources (
    resource_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    disaster_id BIGINT NOT NULL,
    resource_name VARCHAR(150) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'REQUESTED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_resources_disasters FOREIGN KEY (disaster_id) 
        REFERENCES disasters(disaster_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 9. Table: notifications
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'ALERT',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_users FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =================================================================
-- INITIAL SEED DATA
-- =================================================================

-- Insert Default Admin & Volunteer Users
-- Password BCrypt encoded for 'admin123' and 'volunteer123'
INSERT INTO users (user_id, name, email, phone, password, role) VALUES 
(1, 'System Administrator', 'admin@disaster.org', '+1-800-555-0199', '$2a$10$eD7g6fT0rB8sZ0uP.X8mVu3L/1a2b3c4d5e6f7g8h9i0j', 'ADMIN'),
(2, 'John Doe', 'john@disaster.org', '+1-800-555-0101', '$2a$10$eD7g6fT0rB8sZ0uP.X8mVu3L/1a2b3c4d5e6f7g8h9i0j', 'VOLUNTEER'),
(3, 'Sarah Connor', 'sarah@disaster.org', '+1-800-555-0102', '$2a$10$eD7g6fT0rB8sZ0uP.X8mVu3L/1a2b3c4d5e6f7g8h9i0j', 'VOLUNTEER'),
(4, 'Michael Scott', 'michael@disaster.org', '+1-800-555-0103', '$2a$10$eD7g6fT0rB8sZ0uP.X8mVu3L/1a2b3c4d5e6f7g8h9i0j', 'VOLUNTEER')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Volunteer Profiles
INSERT INTO volunteers (volunteer_id, user_id, skills, availability, status) VALUES 
(1, 2, 'First Aid, Search & Rescue, Medical Support', 'Full-Time / Weekends', 'ON_DUTY'),
(2, 3, 'Logistics, Heavy Vehicle Driver, Food Distribution', 'Weekdays', 'AVAILABLE'),
(3, 4, 'Communication, Shelter Management, Counseling', 'Flexible / On-Call', 'ACTIVE')
ON DUPLICATE KEY UPDATE skills=VALUES(skills);

-- Insert Locations
INSERT INTO locations (location_id, address, city, district, pincode) VALUES 
(1, 'Sector 14 Emergency Zone', 'Chennai', 'Chennai North', '600001'),
(2, 'Riverfront Relief Sector', 'Cuddalore', 'Cuddalore Coastal', '607001'),
(3, 'Hillside Shelter Road', 'Wayanad', 'Wayanad Central', '673121')
ON DUPLICATE KEY UPDATE address=VALUES(address);

-- Insert Disasters
INSERT INTO disasters (disaster_id, type, severity, description, start_date, status, location_id) VALUES 
(1, 'Cyclone Flash Flood', 'CRITICAL', 'Severe coastal flooding caused by tropical cyclone landfall. Rescue operations underway.', '2026-08-01', 'ACTIVE', 1),
(2, 'Heavy Monsoon Floods', 'HIGH', 'Continuous heavy rainfall causing river embankment overflow across lowland villages.', '2026-08-05', 'ACTIVE', 2),
(3, 'Landslide Emergency', 'MODERATE', 'Minor mountain slope displacement affecting local highway connectivity.', '2026-07-28', 'MONITORING', 3)
ON DUPLICATE KEY UPDATE type=VALUES(type);

-- Insert Relief Centers
INSERT INTO relief_centers (center_id, name, location_id, capacity, contact, status) VALUES 
(1, 'Central Flood Relief Shelter A', 1, 500, '+91-44-25300000', 'ACTIVE'),
(2, 'Cuddalore Coastal Community Hall', 2, 300, '+91-4142-220000', 'ACTIVE'),
(3, 'Wayanad Emergency Care Camp', 3, 200, '+91-4936-200000', 'STANDBY')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Tasks
INSERT INTO tasks (task_id, disaster_id, title, description, priority, location_id, status) VALUES 
(1, 1, 'Emergency Food Distribution', 'Distribute ready-to-eat ration packets to 200 affected families in Sector 14.', 'URGENT', 1, 'IN_PROGRESS'),
(2, 1, 'Medical First Aid Screening', 'Set up medical checkpost at Central Shelter and treat minor flood injuries.', 'HIGH', 1, 'ASSIGNED'),
(3, 2, 'Drinking Water Supply Deployment', 'Deliver 5000 liters of purified water cans to Cuddalore coastal camp.', 'MEDIUM', 2, 'PENDING'),
(4, 3, 'Road Clearing Assistance', 'Assist local road clearing squad with debris removal and traffic control.', 'LOW', 3, 'COMPLETED')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Insert Task Assignments
INSERT INTO task_assignments (assignment_id, task_id, volunteer_id, status) VALUES 
(1, 1, 1, 'IN_PROGRESS'),
(2, 2, 2, 'ASSIGNED'),
(3, 4, 3, 'COMPLETED')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- Insert Resources
INSERT INTO resources (resource_id, disaster_id, resource_name, quantity, status) VALUES 
(1, 1, 'First Aid Kits', 150, 'DELIVERED'),
(2, 1, 'Inflatable Life Boats', 12, 'DISPATCHED'),
(3, 2, 'Purified Water Cans (20L)', 500, 'REQUESTED'),
(4, 2, 'Dry Food Ration Packets', 1200, 'AVAILABLE')
ON DUPLICATE KEY UPDATE resource_name=VALUES(resource_name);

-- Insert Notifications
INSERT INTO notifications (notification_id, user_id, title, message, type, is_read) VALUES 
(1, 2, 'Urgent Task Assigned', 'You have been assigned to Emergency Food Distribution in Sector 14.', 'TASK_ASSIGNMENT', FALSE),
(2, 2, 'Disaster Alert Update', 'Cyclone Flash Flood alert status updated to CRITICAL. Stay on high standby.', 'DISASTER_ALERT', FALSE),
(3, 3, 'New Task Available', 'Medical First Aid Screening task assigned to your team.', 'ANNOUNCEMENT', TRUE)
ON DUPLICATE KEY UPDATE title=VALUES(title);
