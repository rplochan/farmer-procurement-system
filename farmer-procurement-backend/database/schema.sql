-- Run this file against your PostgreSQL database.

CREATE TABLE IF NOT EXISTS farmers (
    farmer_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(20) UNIQUE NOT NULL,
    village VARCHAR(100),
    district VARCHAR(100),
    location VARCHAR(255),
    verification_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crops (
    crop_id SERIAL PRIMARY KEY,
    crop_name VARCHAR(100) NOT NULL,
    season VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS farmer_crops (
    farmer_id INT NOT NULL REFERENCES farmers(farmer_id) ON DELETE CASCADE,
    crop_id INT NOT NULL REFERENCES crops(crop_id) ON DELETE CASCADE,
    estimated_quantity NUMERIC(10,2),
    PRIMARY KEY (farmer_id, crop_id)
);

CREATE TABLE IF NOT EXISTS procurement_centres (
    centre_id SERIAL PRIMARY KEY,
    centre_name VARCHAR(150) NOT NULL,
    location VARCHAR(255),
    capacity INT NOT NULL
);

CREATE TABLE IF NOT EXISTS slots (
    slot_id SERIAL PRIMARY KEY,
    centre_id INT NOT NULL REFERENCES procurement_centres(centre_id),
    crop_id INT NOT NULL REFERENCES crops(crop_id),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    available_capacity INT NOT NULL CHECK (available_capacity >= 0),
    CHECK (available_capacity <= capacity)
);

CREATE TABLE IF NOT EXISTS bookings (
    booking_id SERIAL PRIMARY KEY,
    farmer_id INT NOT NULL REFERENCES farmers(farmer_id),
    slot_id INT NOT NULL REFERENCES slots(slot_id),
    status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED',
    token_number INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS procurement_records (
    record_id SERIAL PRIMARY KEY,
    booking_id INT UNIQUE NOT NULL REFERENCES bookings(booking_id),
    arrival_time TIMESTAMP,
    weight NUMERIC(10,2),
    quality_status VARCHAR(30),
    procurement_status VARCHAR(50),
    payment_status VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    farmer_id INT NOT NULL REFERENCES farmers(farmer_id),
    channel VARCHAR(30) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_slots_lookup
ON slots(centre_id, crop_id, date);

CREATE INDEX IF NOT EXISTS idx_bookings_farmer
ON bookings(farmer_id);

CREATE INDEX IF NOT EXISTS idx_bookings_slot
ON bookings(slot_id);
