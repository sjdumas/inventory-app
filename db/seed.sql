-- Clear existing data
TRUNCATE guitars, brands, categories CASCADE;

-- Seed brands
INSERT INTO brands (name) VALUES
	('Gibson'),
	('Fender'),
	('Ibanez'),
	('Jackson Guitars'),
	('PRS Guitars'),
	('ESP Guitars'),
	('Taylor Guitars'),
	('Gretsch');

-- Seed categories
INSERT INTO categories (name) VALUES
	('Electric Guitar'),
	('Bass Guitar'),
	('Acoustic Guitar');

-- Seed guitars
INSERT INTO guitars (
	guitar_code, brand_id, category_id, model, color, description, price, stock_quantity
) VALUES
	('GTR001', (SELECT id FROM brands WHERE name = 'Gibson'),
	(SELECT id FROM categories WHERE name = 'Electric Guitar'),
	'Les Paul Standard', 'Sunburst', 'Classic tone and sustain', 2499.99, 5),

	('GTR002', (SELECT id FROM brands WHERE name = 'Fender'),
	(SELECT id FROM categories WHERE name = 'Electric Guitar'),
	'Stratocaster', 'Olympic White', 'Iconic clean tones and design', 1199.99, 3),

	('GTR003', (SELECT id FROM brands WHERE name = 'Ibanez'),
	(SELECT id FROM categories WHERE name = 'Acoustic Guitar'),
	'SR305E Bass', 'Deep Twilight', 'Comfortable neck and solid tone', 599.99, 2),

	('GTR004', (SELECT id FROM brands WHERE name = 'Jackson Guitars'),
	(SELECT id FROM categories WHERE name = 'Electric Guitar'),
	'Jackson Soloist', 'Gloss Black', 'Made for shredders', 1099.99, 4),

	('GTR005', (SELECT id FROM brands WHERE name = 'PRS Guitars'),
	(SELECT id FROM categories WHERE name = 'Electric Guitar'),
	'PRS Custom 24', 'Charcoal Burst', 'Versatile high-end guitar', 3499.99, 2),

	('GTR006', (SELECT id FROM brands WHERE name = 'ESP Guitars'),
	(SELECT id FROM categories WHERE name = 'Electric Guitar'),
	'ESP Eclipse', 'Snow White', 'Aggressive and sleek', 1499.99, 1),

	('GTR007', (SELECT id FROM brands WHERE name = 'Taylor Guitars'),
	(SELECT id FROM categories WHERE name = 'Bass Guitar'),
	'Taylor 214ce', 'Natural', 'Bright acoustic tone', 1299.99, 3),

	('GTR008', (SELECT id FROM brands WHERE name = 'Gretsch'),
	(SELECT id FROM categories WHERE name = 'Electric Guitar'),
	'Gretsch G5420T', 'Orange Stain', 'Classic hollow body sound', 899.99, 2);
