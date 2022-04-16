import express from "express";

import getSubjects from "../database/queries/getSubjects.js";

const router = express.Router();

router.get("/", async (req, res) => {
	const subjects = await getSubjects();

	res.status(200).json(subjects);
});

export default router;
