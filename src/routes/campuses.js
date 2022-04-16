import express from "express";
import getCampuses from "../database/queries/getCampuses.js";

const router = express.Router();

router.get("/", async (req, res) => {
	const campuses = await getCampuses();

	res.status(200).json(campuses);
});

export default router;
