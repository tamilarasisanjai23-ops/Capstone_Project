-- Smart Ration Shop Database Seed Data

-- Insert Initial Users (Admin, Sanjai Kumar & Customer Ramesh Kumar)
INSERT IGNORE INTO users (id, full_name, email, mobile, address, password, role) VALUES 
(1, 'Ramesh Kumar', 'user@gmail.com', '9876543210', '124, Gandhi Street, Sector 4, City', '12345', 'customer'),
(2, 'Administrator', 'admin@gmail.com', '9999988888', 'PDS HQ Office, Ward 1', 'admin123', 'admin'),
(3, 'Sanjai Kumar', 'sanjai123@gmail.com', '9876500000', '45, Anna Nagar, 2nd Main Road, City', '12345', 'customer');

-- Insert Ration Cards
INSERT IGNORE INTO ration_cards (id, card_number, card_type, family_members, address, status, user_id) VALUES 
(1, 'RC-9876543210', 'PHH (Priority Household)', 4, '124, Gandhi Street, Sector 4, City', 'Active', 1),
(2, 'RC-5566778899', 'PHH (Priority Household)', 4, '45, Anna Nagar, 2nd Main Road, City', 'Active', 3);

-- Insert Essential Products
INSERT IGNORE INTO products (id, product_name, stock_quantity, monthly_quota, unit, unit_price, status) VALUES 
(1, 'Rice', 1500.0, 5.0, 'kg', 3.00, 'In Stock'),
(2, 'Wheat', 800.0, 2.5, 'kg', 2.00, 'In Stock'),
(3, 'Sugar', 250.0, 2.0, 'kg', 13.50, 'In Stock'),
(4, 'Dal', 300.0, 2.0, 'kg', 60.00, 'Limited Stock'),
(5, 'Kerosene', 500.0, 3.0, 'Liters', 25.00, 'In Stock');

-- Insert Initial Distribution History
INSERT IGNORE INTO distributions (id, ration_card_number, product_id, product_name, quantity, total_amount, distribution_date, status) VALUES 
(1, 'RC-9876543210', 5, 'Kerosene Oil', '3 Liters', 75.00, '2026-08-28', 'Pending'),
(2, 'RC-9876543210', 3, 'Refined Sugar', '2 kg', 27.00, '2026-08-15', 'Completed'),
(3, 'RC-9876543210', 1, 'Rice & Wheat', '30 kg', 80.00, '2026-07-10', 'Distributed');

-- Insert Initial Complaints
INSERT IGNORE INTO complaints (id, complaint_number, ration_card_number, complaint_type, description, date_filed, status) VALUES 
(1, 'CMP-801', 'RC-9876543210', 'Quantity Shortage', 'Received 18 kg rice instead of 20 kg monthly quota.', '2026-08-10', 'Resolved'),
(2, 'CMP-802', 'RC-9876543210', 'Shop Closed', 'Fair Price Shop was closed during official operational hours.', '2026-08-20', 'Pending');
