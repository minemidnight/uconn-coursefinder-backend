// load env from .env
import "dotenv/config";

import express from "express";
import cors from "cors";

const app = express();

app.disable("etag");
app.disable("x-powered-by");

app.set("case sensitive routing", false);
app.set("strict routing", false);
app.set("env", process.env.NODE_ENV);

app.use(express.json());
app.use(cors());

import mountRoutes from "./routes/index.js";

mountRoutes(app);

app.all("*", (req, res) => {
	res.status("404").json({ error: "404: Method not found" });
});

app.listen(process.env.PORT, () => {
	console.log(`API started on port ${process.env.PORT}`);
});

import updateProfessors from "./ratemyprof/updateDatabase.js";
import updateSections from "./sections/updateDatabase.js";

async function updateDatabase() {
	const profUpdates = await updateProfessors();
	const sectionUpdates = await updateSections();

	console.log(`Updated ${profUpdates.length} professor ratings and ${sectionUpdates.length} sections`);
}

updateDatabase();
setInterval(() => updateDatabase(), 24 * 60 * 60 * 1000);
