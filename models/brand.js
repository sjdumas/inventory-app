const pool = require("../db");

const findAll = async () => {
	const result = await pool.query("SELECT * FROM brands ORDER BY name");
	return result.rows;
};

const countAll = async () => {
	const result = await pool.query("SELECT COUNT(*) FROM brands");
	return parseInt(result.rows[0].count);
};

module.exports = {
	findAll,
	countAll,
};
