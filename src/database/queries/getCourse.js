import { Op } from "sequelize";
import getProfessorById from "./getProfessorById.js";
import { Section } from "../index.js";

export default async (subject, catalogNumber, semester, campus) => {
	const whereOptions = {
		subject: subject.toUpperCase(),
		catalogNumber,
		minCredits: { [Op.ne]: 0 }
	};

	if(semester) whereOptions.semester = semester;
	if(campus) whereOptions.campus = campus;

	const classInfo = await Section.findOne({
		attributes: [
			"subject",
			"subjectLong",
			"catalogNumber",
			"title",
			"minCredits",
			"maxCredits",
			"ca1",
			"ca2",
			"ca3",
			"ca4",
			"quantative",
			"environmental",
			"writing",
			"international",
			"hasCompetency",
			"hasContentArea"
		],
		where: whereOptions,
		order: ["updatedAt"]
	});

	const sections = await Section.findAll({
		attributes: [
			"section",
			"days",
			"startTime",
			"endTime",
			"professors",
			"professorIds",
			"capacity",
			"enrolled",
			"waitlistCapacity",
			"waitlisted",
			"location",
			"instructionMode",
			"online",
			"inPerson"
		],
		where: {
			subject: subject.toUpperCase(),
			catalogNumber,
			semester,
			campus
		}
	});

	const sectionsWithProfData = [];
	const professorCache = new Map();

	for(const section of sections) {
		const data = section.get();

		data.rateMyProfessor = [];

		for(let i = 0; i < data.professors.length; i++) {
			const professorName = data.professors[i];
			const professorId = data.professorIds[i];

			if(professorId === null) {
				data.rateMyProfessor.push({ name: professorName });
			} else {
				if(!professorCache.has(professorId)) {
					const profData = await getProfessorById(professorId);

					professorCache.set(professorId, profData);
				}

				data.rateMyProfessor.push(professorCache.get(professorId));
			}
		}

		sectionsWithProfData.push(data);
	}

	return {
		subject: classInfo.get("subject"),
		subjectLong: classInfo.get("subjectLong"),
		catalogNumber: classInfo.get("catalogNumber"),
		title: classInfo.get("title"),
		minCredits: classInfo.get("minCredits"),
		maxCredits: classInfo.get("maxCredits"),
		ca1: classInfo.get("ca1"),
		ca2: classInfo.get("ca2"),
		ca3: classInfo.get("ca3"),
		ca4: classInfo.get("ca4"),
		quantative: classInfo.get("quantative"),
		environmental: classInfo.get("environmental"),
		writing: classInfo.get("writing"),
		international: classInfo.get("international"),
		hasCompetency: classInfo.get("hasCompetency"),
		hasContentArea: classInfo.get("hasContentArea"),
		sections: sectionsWithProfData
	};
};
