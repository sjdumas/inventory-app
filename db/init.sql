-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Brands table
DROP TABLE IF EXISTS brands CASCADE;
CREATE TABLE brands (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL
);

-- Categories table
DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL
);

-- Guitars table
DROP TABLE IF EXISTS guitars CASCADE;
CREATE TABLE guitars (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	guitar_code TEXT UNIQUE NOT NULL,
	model TEXT,
	color TEXT,
	description TEXT,
	price NUMERIC(10, 2) NOT NULL,
	stock_quantity INTEGER NOT NULL DEFAULT 0,
	brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
	category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

-- Auto-update 'updated_at' column on guitar updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = now();
	RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_guitar_updated_at
BEFORE UPDATE ON guitars
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
