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

-- -----------------------------------------------------------------
-- 10. Table: emergency_alerts
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS emergency_alerts (
    alert_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(50) NOT NULL DEFAULT 'CRITICAL', -- LOW, MEDIUM, HIGH, CRITICAL
    disaster_id BIGINT,
    created_by BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_emergency_alerts_disasters FOREIGN KEY (disaster_id) 
        REFERENCES disasters(disaster_id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_emergency_alerts_users FOREIGN KEY (created_by) 
        REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 11. Table: voice_alerts
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS voice_alerts (
    voice_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    audio_data LONGTEXT NOT NULL,
    duration INT NOT NULL DEFAULT 0,
    alert_level VARCHAR(50) NOT NULL DEFAULT 'HIGH',
    created_by BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_voice_alerts_users FOREIGN KEY (created_by) 
        REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 12. Table: sos_alerts
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sos_alerts (
    sos_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    volunteer_id BIGINT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    message TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, RESPONDING, RESOLVED
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_sos_alerts_volunteers FOREIGN KEY (volunteer_id) 
        REFERENCES volunteers(volunteer_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 13. Table: emergency_radio_channels
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS emergency_radio_channels (
    channel_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    channel_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------
-- 14. Table: volunteer_locations
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS volunteer_locations (
    location_record_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    volunteer_id BIGINT NOT NULL UNIQUE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_volunteer_locations_volunteers FOREIGN KEY (volunteer_id) 
        REFERENCES volunteers(volunteer_id) ON DELETE CASCADE ON UPDATE CASCADE
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

-- Insert Emergency Radio Channels
INSERT INTO emergency_radio_channels (channel_id, channel_name, description, status) VALUES
(1, 'Medical', 'Priority channel for emergency medical teams, triage, and doctor dispatch.', 'ACTIVE'),
(2, 'Rescue', 'Search and rescue squad coordination, boat operations, and evacuation.', 'ACTIVE'),
(3, 'Food Distribution', 'Supply chain dispatch, food ration delivery, and drinking water logistics.', 'ACTIVE'),
(4, 'Transport', 'Heavy vehicle squad, ambulance routing, and debris clearance convoy.', 'ACTIVE'),
(5, 'General Emergency', 'Main public emergency channel for general field updates and broadcasts.', 'ACTIVE')
ON DUPLICATE KEY UPDATE channel_name=VALUES(channel_name);

-- Insert Emergency Alerts Seed Data
INSERT INTO emergency_alerts (alert_id, title, message, severity, disaster_id, created_by) VALUES
(1, 'FLASH FLOOD WARNING SECTOR 14', 'Water levels rising rapidly along Sector 14 embankment. Immediate evacuation to Central Relief Shelter A required.', 'CRITICAL', 1, 1),
(2, 'MONSOON DAM SPILLWAY OPENING', 'Dam gates opening at 14:00. Lowland villages in Cuddalore must move to elevated shelters immediately.', 'HIGH', 2, 1)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Insert Voice Alerts Seed Data
INSERT INTO voice_alerts (voice_id, title, audio_data, duration, alert_level, created_by) VALUES
(1, 'Commander Emergency Audio Dispatch', 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=', 8, 'CRITICAL', 1)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Insert SOS Alerts Seed Data
INSERT INTO sos_alerts (sos_id, volunteer_id, latitude, longitude, message, status) VALUES
(1, 1, 13.0827, 80.2707, 'Trapped in rising flood water near Sector 14 Bridge. Need boat assistance!', 'ACTIVE')
ON DUPLICATE KEY UPDATE message=VALUES(message);

-- Insert Volunteer Locations Seed Data
INSERT INTO volunteer_locations (location_record_id, volunteer_id, latitude, longitude, status) VALUES
(1, 1, 13.0827, 80.2707, 'ACTIVE'),
(2, 2, 11.7480, 79.7714, 'ACTIVE'),
(3, 3, 11.6854, 76.1320, 'ACTIVE')
ON DUPLICATE KEY UPDATE status=VALUES(status);

