import sequelize, { Op } from "sequelize";
import { Section } from "../index.js";

export default async options => {
	const {
		campus, keywords, semester, subjects
	} = options;

	if(!semester) throw new Error("No semester provided");
	else if(!campus) throw new Error("No campus provided");

	const whereOptions = {
		semester,
		campus,
		minCredits: { [Op.ne]: 0 }
	};

	if(keywords) {
		const escapedKeywords = keywords.replace(/(%|_)/g, "\\$1");

		whereOptions[Op.or] = {
			catalogNumber: { [Op.iLike]: `%${escapedKeywords}%` },
			title: { [Op.iLike]: `%${escapedKeywords}%` }
		};
	}

	if(subjects && subjects.findIndex(sub => sub.toLowerCase() === "any") === -1) whereOptions.subject = subjects;

	const competenciesGroup = {};
	const instructionModeGroup = {};
	const caGroup = {};

	if("quantative" in options) competenciesGroup.quantative = options.quantative;
	if("environmental" in options) competenciesGroup.environmental = options.environmental;
	if("writing" in options) competenciesGroup.writing = options.writing;
	if("international" in options) competenciesGroup.international = options.international;
	if("hasCompetency" in options) competenciesGroup.hasCompetency = options.hasCompetency;

	if("online" in options) instructionModeGroup.online = options.online;
	if("inPerson" in options) instructionModeGroup.inPerson = options.inPerson;

	if("ca1" in options) caGroup.ca1 = options.ca1;
	if("ca2" in options) caGroup.ca2 = options.ca2;
	if("ca3" in options) caGroup.ca3 = options.ca3;
	if("ca4" in options) caGroup.ca4 = options.ca4;
	if("hasContentArea" in options) caGroup.hasContentArea = options.hasContentArea;

	whereOptions[Op.and] = [{}];

	if(Object.keys(competenciesGroup).length !== 0) whereOptions[Op.and].push({ [Op.or]: competenciesGroup });
	if(Object.keys(instructionModeGroup).length !== 0) whereOptions[Op.and].push({ [Op.or]: instructionModeGroup });
	if(Object.keys(caGroup).length !== 0) whereOptions[Op.and].push({ [Op.or]: caGroup });

	const classes = await Section.findAll({
		attributes: [
			sequelize.literal("DISTINCT ON(\"Section\".subject, \"Section\".\"catalogNumber\") subject"),
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
		where: whereOptions
	});

	return classes.map(classSection => classSection.get());
};
