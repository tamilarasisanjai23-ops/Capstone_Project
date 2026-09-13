-- Smart Ration Shop MySQL Database Schema

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    mobile VARCHAR(15) NOT NULL,
    address VARCHAR(255) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer'
);

CREATE TABLE IF NOT EXISTS ration_cards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    card_number VARCHAR(50) NOT NULL UNIQUE,
    card_type VARCHAR(50) NOT NULL,
    family_members INT NOT NULL DEFAULT 1,
    address VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Active',
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    stock_quantity DOUBLE NOT NULL DEFAULT 0.0,
    monthly_quota DOUBLE NOT NULL DEFAULT 0.0,
    unit VARCHAR(20) NOT NULL DEFAULT 'kg',
    unit_price DOUBLE NOT NULL DEFAULT 0.0,
    status VARCHAR(30) NOT NULL DEFAULT 'In Stock'
);

CREATE TABLE IF NOT EXISTS distributions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ration_card_number VARCHAR(50) NOT NULL,
    product_id BIGINT,
    product_name VARCHAR(100) NOT NULL,
    quantity VARCHAR(50) NOT NULL,
    total_amount DOUBLE NOT NULL DEFAULT 0.0,
    distribution_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending'
);

CREATE TABLE IF NOT EXISTS complaints (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_number VARCHAR(50) NOT NULL UNIQUE,
    ration_card_number VARCHAR(50) NOT NULL,
    complaint_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    date_filed DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending'
);
