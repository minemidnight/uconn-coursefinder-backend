import fetchSections from "./fetchSections.js";
import { Section } from "../database/index.js";

const SPRING_SEMESTER = "https://files.registrar.uconn.edu/registrar_public/All_Classes_Table_Format_Spring.xlsx";
const FALL_SEMESTER = "https://files.registrar.uconn.edu/registrar_public/All_Classes_Table_Format_Fall.xlsx";

// fetch sections of the next upcoming semester
// we will manually load all previous semesters into the database, and
// update this list daily
export default async () => {
	const month = new Date().getMonth();

	let link;

	if(month >= 3 && month <= 9) link = FALL_SEMESTER;
	else link = SPRING_SEMESTER;

	const sections = await fetchSections(link);
	const instances = await Section.bulkCreate(sections, { updateOnDuplicate: Object.keys(Section.getAttributes()) });

	return instances;
};
