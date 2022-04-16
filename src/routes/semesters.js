import express from "express";

import getSemesters from "../database/queries/getSemesters.js";

const router = express.Router();

router.get("/", async (req, res) => {
	const semesters = await getSemesters();

	res.status(200).json(semesters);
});

export default router;
