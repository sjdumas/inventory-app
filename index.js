const express = require("express");
const app = express();
const path = require("node:path");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv");
dotenv.config();

const { countAll, countInStock } = require("./models/guitar");
const { countAll: countBrands } = require("./models/brand");
const { countAll: countCategories } = require("./models/category");
const { getGuitarCountByBrand } = require("./models/guitar");
const { truncate } = require("./utils/helpers");

const assetsPath = path.join(__dirname, "public");

app.use(expressLayouts);
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "partials/layout");

app.locals.truncate = truncate;

const links = [
	{ href: "/", text: "Guitar Hub" }
]

// Routes
const guitarRoutes = require("./routes/guitars");
app.use("/guitars", guitarRoutes);

app.get("/", async (req, res) => {
	try {
		const totalGuitars = await countAll();
		const inStockCount = await countInStock();
		const outOfStockCount = totalGuitars - inStockCount;
		const brandCount = await countBrands();
		const categoryCount = await countCategories();
		const guitarsByBrand = await getGuitarCountByBrand();

		res.render("home", {
			title: "Guitar Hub",
			totalGuitars,
			inStockCount,
			outOfStockCount,
			brandCount,
			categoryCount,
			guitarsByBrand,
			links: [
				{ href: "/guitars", text: "View Inventory" },
				{ href: "/guitars/new", text: "Add New Guitar" }
			]
		});
	} catch (error) {
		console.error("Error loading homepage:", error);
		res.status(500).render("500", { title: "Error", error });
	}
});

// Error handling - 500 and 404
app.use((err, req, res, next) => {
	console.log(err.stack);
	res.status(500).render("500", {
		title: "500",
		links: links
	});
});

app.use((req, res) => {
	res.status(404).render("404", {
		title: "404",
		links: links
	});
})

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`Express + EJS app listening at http://localhost:${PORT}`);
});
