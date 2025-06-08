const pool = require("../db");

const findAll = async () => {
	const result = await pool.query("SELECT * FROM categories ORDER BY name");
	return result.rows;
};

const countAll = async () => {
	const result = await pool.query("SELECT COUNT(*) FROM categories");
	return parseInt(result.rows[0].count);
};

module.exports = {
	findAll,
	countAll,
};
