import express from "express";

import getCourse from "../database/queries/getCourse.js";
import getCourses from "../database/queries/getCourses.js";

const router = express.Router();

router.get("/", async (req, res) => {
	const {
		campus, semester, keywords,
		subjects, quantative, environmental,
		writing, international, hasCompetency,
		online, inPerson,
		ca1, ca2, ca3, ca4, hasContentArea
	} = req.query;

	if(!campus) {
		return res.status(400).json({ error: "Campus needed in querystring" });
	} else if(!semester) {
		return res.status(400).json({ error: "Semester needed in querystring" });
	} else {
		const options = { campus, semester };

		if(keywords) options.keywords = keywords;
		if(subjects) {
			if(!Array.isArray(subjects)) options.subjects = [subjects];
			else options.subjects = subjects;
		}

		if(quantative) options.quantative = quantative === "true";
		if(environmental) options.environmental = environmental === "true";
		if(writing) options.writing = writing === "true";
		if(international) options.international = international === "true";
		if(hasCompetency) options.hasCompetency = hasCompetency === "true";
		if(online) options.online = online === "true";
		if(inPerson) options.inPerson = inPerson === "true";
		if(ca1) options.ca1 = ca1 === "true";
		if(ca2) options.ca2 = ca2 === "true";
		if(ca3) options.ca3 = ca3 === "true";
		if(ca4) options.ca4 = ca4 === "true";
		if(hasContentArea) options.hasContentArea = hasContentArea === "true";

		const courses = await getCourses(options);

		return res.status(200).json(courses);
	}
});

router.get("/:subject-:number", async (req, res) => {
	const { subject, number: catalogNumber } = req.params;
	const { campus, semester } = req.query;

	const course = await getCourse(subject, catalogNumber, semester, campus);

	if(!course) res.status(404).json({ error: "Course not found" });
	else res.status(200).json(course);
});

export default router;
