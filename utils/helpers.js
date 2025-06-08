const truncate = (str, length = 100) => {
	if (!str) return "";
	return str.length > length ? str.slice(0, length) + "..." : str;
};

module.exports = { truncate };
