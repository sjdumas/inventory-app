const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

const getAllGuitars = async () => {
	const result = await pool.query(`
		SELECT guitars.*, brands.name AS brand_name, categories.name AS category_name
		FROM guitars
		JOIN brands ON guitars.brand_id = brands.id
		JOIN categories ON guitars.category_id = categories.id
		ORDER BY guitars.id
	`);
	return result.rows;
};

const getGuitarById = async (id) => {
	const result = await pool.query(`
		SELECT guitars.*, brands.name AS brand_name, categories.name AS category_name
		FROM guitars
		JOIN brands ON guitars.brand_id = brands.id
		JOIN categories ON guitars.category_id = categories.id
		WHERE guitars.id = $1
	`, [id]);

	const row = result.rows[0];

	if (!row) {
		return null;
	}

	return {
		...row,
		in_stock: row.stock_quantity > 0,
	};
};

const getGuitarCountByBrand = async () => {
	const result = await pool.query(`
		SELECT brands.name AS brand, COUNT(*) AS count
		FROM guitars
		JOIN brands ON guitars.brand_id = brands.id
		GROUP BY brands.name
		ORDER BY brands.name;
	`);
	return result.rows;
};

const generateGuitarCode = () => {
	return "GTR" + Math.floor(1000 + Math.random() * 9000);
};

const createGuitar = async ({ brand_id, category_id, model, description, color, price, stock_quantity }) => {
	const guitar_code = generateGuitarCode();

	await pool.query(`
		INSERT INTO guitars (guitar_code, brand_id, category_id, model, description, color, price, stock_quantity)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`, [
		guitar_code,
		brand_id,
		category_id,
		model,
		description,
		color,
		price,
		stock_quantity
	]);
};

const updateGuitar = async (id, { brand_id, category_id, model, description, color, price, stock_quantity }) => {
	await pool.query(`
		UPDATE guitars
		SET brand_id = $1,
			category_id = $2,
			model = $3,
			description = $4,
			color = $5,
			price = $6,
			stock_quantity = $7,
			updated_at = NOW()
		WHERE id = $8
	`, [brand_id, category_id, model, description, color, price, stock_quantity, id]);
};

const deleteGuitar = async (id) => {
	await pool.query(`DELETE FROM guitars WHERE id = $1`, [id]);
};

const countAll = async () => {
	const result = await pool.query("SELECT COUNT(*) FROM guitars");
	return parseInt(result.rows[0].count);
};

const countInStock = async () => {
	const result = await pool.query("SELECT COUNT(*) FROM guitars WHERE stock_quantity > 0");
	return parseInt(result.rows[0].count);
};

module.exports = {
	getAllGuitars,
	getGuitarById,
	getGuitarCountByBrand,
	createGuitar,
	updateGuitar,
	deleteGuitar,
	countAll,
	countInStock,
	generateGuitarCode,
};
