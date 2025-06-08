const express = require("express");
const router = express.Router();
const Guitar = require("../models/guitar");
const pool = require("../db");
const {
	getAllGuitars,
	getGuitarById,
	createGuitar,
	updateGuitar,
	deleteGuitar,
} = require("../models/guitar");

// GET /guitars - List all guitars
router.get("/", async (req, res) => {
	try {
		const guitars = await Guitar.getAllGuitars();

		res.render("guitars/index", {
		title: "Guitar Inventory",
		guitars
		});
	} catch (error) {
		console.error("Error fetching guitars:", error);
		res.status(500).render("500", { title: "Server Error" });
	}
});

// GET /guitars/new - Show form to add a new guitar
router.get("/new", async (req, res, next) => {
	try {
		const brandsResult = await pool.query("SELECT * FROM brands ORDER BY name");
		const categoriesResult = await pool.query("SELECT * FROM categories ORDER BY name");

		res.render("guitars/new", {
			title: "Add New Guitar",
			brands: brandsResult.rows,
			categories: categoriesResult.rows
		});
	} catch (error) {
		next(error);
	}
});

// GET /guitars/:id - View a single guitar
router.get("/:id", async (req, res, next) => {
	try {
		const guitar = await Guitar.getGuitarById(req.params.id);

		if (!guitar) return res.status(404).render("404", { title: "Guitar Not Found", links: [] });
		res.render("guitars/show", {
			title: `Guitar: ${guitar.model}`,
			guitar
		});
	} catch (error) {
		next(error);
	}
});

// GET /guitars/:id/confirm-delete - Confirmation for deleting a single guitar
router.get("/:id/confirm-delete", async (req, res) => {
	try {
		const guitar = await Guitar.getGuitarById(req.params.id);

		res.render("guitars/confirm_delete", {
			title: `Delete ${guitar.model}`,
			guitar,
			error: null
		});
	} catch (error) {
		console.log("Error loading confirm delete form: ", error);
		res.status(500).render("500", { title: "Server Error" });
	}
});

// POST /guitars - Handle form submission to create new guitar
router.post("/", async (req, res, next) => {
	try {
		const {
			brand_id,
			category_id,
			model,
			description,
			color,
			price,
			stock_quantity
		} = req.body;

		await createGuitar({
			brand_id,
			category_id,
			description,
			model,
			color,
			price: parseFloat(price),
			stock_quantity: parseInt(stock_quantity)
		});

		res.redirect("/guitars");
	} catch (error) {
		console.log("Error creating guitar:", error);
		next(error);
	}
});

// GET /guitars/:id/edit - Show form to edit a guitar
router.get("/:id/edit", async (req, res, next) => {
	try {
		const guitar = await Guitar.getGuitarById(req.params.id);

		if (!guitar) return res.status(404).render("404", { title: "Guitar Not Found", links: [] });

		const brandsResult = await pool.query("SELECT * FROM brands ORDER BY name");
		const categoriesResult = await pool.query("SELECT * FROM categories ORDER BY name");

		res.render("guitars/edit", {
			title: `Edit ${guitar.model}`,
			guitar,
			brands: brandsResult.rows,
			categories: categoriesResult.rows
		});
	} catch (error) {
		next(error);
	}
});

// POST /guitars/:id - Handle update form submission
router.post("/:id", async (req, res, next) => {
	try {
		const {
			brand_id,
			category_id,
			description,
			model,
			color,
			price,
			stock_quantity
		} = req.body;

		await Guitar.updateGuitar(req.params.id, {
			brand_id,
			category_id,
			description,
			model,
			color,
			price: parseFloat(price),
			stock_quantity: parseInt(stock_quantity)
		});
		res.redirect(`/guitars/${req.params.id}`);
	} catch (error) {
		next(error);
	}
});

// POST /guitars/:id/delete - Delete a guitar
router.post("/:id/delete", async (req, res, next) => {
	const { password } = req.body;

	if (password !== process.env.ADMIN_PASSWORD) {
		return res.status(403).render("guitars/confirm_delete", {
		title: "Delete Guitar",
		guitar: await Guitar.getGuitarById(req.params.id),
		error: "Invalid password. Please try again.",
		});
	}

	try {
		await Guitar.deleteGuitar(req.params.id);
		res.redirect("/guitars");
	} catch (error) {
		console.error("Error deleting guitar:", error);
		next(error);
	}
});

module.exports = router;
