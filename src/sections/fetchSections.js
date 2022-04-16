import fetch from "node-fetch";
import XLSX from "xlsx";

import getProfessorByName from "../database/queries/getProfessorByName.js";

const ALL_CONTENT_AREAS = "https://files.registrar.uconn.edu/registrar_public/CS_reports/Courses_CA_All_Active.xlsx";

// given an excel sheet link, return the first sheet of the spreadsheet as an object
async function getJSONSheetFromLink(link) {
	const response = await fetch(link);
	const buffer = await response.arrayBuffer();

	const workbook = XLSX.read(buffer, { raw: true });

	const sheet = workbook.Sheets[workbook.SheetNames[0]];

	return XLSX.utils.sheet_to_json(sheet);
}

// return a Map with keys of {subject}-{catalognumber} (i.e. CSE-4300)
// with content area and course title as object value
async function getContentAreaMap() {
	const contentAreaData = await getJSONSheetFromLink(ALL_CONTENT_AREAS);
	const map = new Map();

	for(const course of contentAreaData) {
		const subject = course.SUBJ;
		const catalogNumber = course["CAT NBR"];
		const key = `${subject}-${catalogNumber}`;

		if(!map.has(key)) {
			map.set(key, {
				areas: [course.CA],
				title: course.TITLE
			});
		} else {
			map.get(key).areas.push(course.CA);
		}
	}

	return map;
}

// fetch sections from link
async function fetchSections(link) {
	const rawData = await getJSONSheetFromLink(link);
	const classToContentAreaMap = await getContentAreaMap();

	// cache sections & professor ids
	// a section is listed multiple times for multiple professors
	//   so we want to add them to the class not make 2 different sections
	// we also cache professor id's because a professor teaches multiple classes
	//   these professor id's correspond to their ratemyprofessor id's
	const professorIds = new Map();
	const sections = new Map();

	for(const section of rawData) {
		// define variables based off column names for deadability
		const rawProfessorName = section.Define_CLASSM_INSTRUCTOR_NAME;
		const rawProfessorEmployeeId = section.Define_CLASSM_INSTRUCTOR_EMPLID;
		const uniqueId = section.CLASS_CLASS_NBR;
		const rawClassMonday = section.CLASSM_MONDAY;
		const rawClassTuesday = section.CLASSM_TUESDAY;
		const rawClassWednesday = section.CLASSM_WEDNESDAY;
		const rawClassThursday = section.CLASSM_THURSDAY;
		const rawClassFriday = section.CLASSM_FRIDAY;
		const rawClassSaturday = section.CLASSM_SATURDAY;
		const rawClassSunday = section.CLASSM_SUNDAY;
		const subject = section.CLASS_SUBJECT_CD;
		const catalogNumber = section.CLASS_CATALOG_NBR;
		let title = section.CLASS_DESCR;
		const semester = section.CLASS_TERM_LDESC;
		const campus = section.CLASS_CAMPUS_LDESC;
		const subjectLong = section.CLASS_ACAD_ORG_LDESC;
		const component = section.CLASS_COMPONENT_LDESC.toLowerCase();
		const sectionNumber = section.CLASS_SECTION;
		const startTime = section.CLASSM_MEETING_TIME_START;
		const endTime = section.CLASSM_MEETING_TIME_END;
		const capacity = section.CLASS_ENRL_CAP;
		const enrolled = section.CLASS_ENRL_TOT;
		const waitlistCapacity = section.CLASS_WAIT_CAP;
		const waitlisted = section.CLASS_WAIT_TOT;
		const location = section.CLASSM_FACILITY_ID;
		const instructionMode = section.CLASS_INSTRUCTION_MODE_LDESC;
		const minCredits = section.CASSC_UNITS_MINIMUM;
		const maxCredits = section.CASSC_UNITS_MAXIMUM;

		// find the content areas this class has (and get the full-title)
		let contentAreas = [];
		const caMapKey = `${subject}-${catalogNumber}`;

		if(classToContentAreaMap.has(caMapKey)) ({ title, areas: contentAreas } = classToContentAreaMap.get(caMapKey));

		const quantative = catalogNumber.includes("Q");
		const environmental = catalogNumber.includes("E");
		const writing = catalogNumber.includes("W");
		const international = contentAreas.includes("CA4INT");

		const online = ["Online", "Distance Learning", "Hybrid/Blended"].includes(instructionMode);
		const inPerson = !online || instructionMode === "Hybrid/Blended";

		const ca1 = contentAreas.includes("CA1");
		const ca2 = contentAreas.includes("CA2");
		const ca3 = contentAreas.includes("CA3") || contentAreas.includes("CA3LAB");
		const ca4 = contentAreas.includes("CA4") || contentAreas.includes("CA4INT");

		// check if this class has a teacher
		if(rawProfessorName.trim().length === 0) continue;
		else if(isNaN(Number(rawProfessorEmployeeId))) continue;

		// extract professor name
		let [last, first] = rawProfessorName.split(",");

		if(first.includes(" ")) first = first.substring(0, first.indexOf(" "));
		if(last.includes(" ")) last = last.substring(0, last.indexOf(" "));
		const professorName = `${first} ${last}`;

		// get professor's ratemyprofessor ID
		if(!professorIds.has(professorName)) {
			const professor = await getProfessorByName(professorName, ["id"]);
			const id = professor && professor.id;

			professorIds.set(professorName, id);
		}

		const professorId = professorIds.get(professorName);

		// find which days the class is on
		const days = [];

		if(rawClassMonday === "Y") days.push("M");
		if(rawClassTuesday === "Y") days.push("Tu");
		if(rawClassWednesday === "Y") days.push("W");
		if(rawClassThursday === "Y") days.push("Th");
		if(rawClassFriday === "Y") days.push("F");
		if(rawClassSaturday === "Y") days.push("Sa");
		if(rawClassSunday === "Y") days.push("Su");

		// if this section has multiple professors, it has multiple rows in the sheet
		// so add this professor to the class professor data
		if(sections.has(uniqueId)) {
			const otherSection = sections.get(uniqueId);

			otherSection.professors.push(professorName);
			otherSection.professorIds.push(professorId);
		} else {
			sections.set(uniqueId, {
				semester,
				campus,
				catalogNumber,
				subject,
				subjectLong,
				component,
				title,
				section: sectionNumber,
				classNumber: uniqueId,
				days,
				startTime,
				endTime,
				professors: [professorName],
				professorIds: [professorId],
				capacity,
				enrolled,
				waitlistCapacity,
				waitlisted,
				location,
				instructionMode,
				minCredits,
				maxCredits,
				quantative,
				environmental,
				writing,
				international,
				online,
				inPerson,
				ca1,
				ca2,
				ca3,
				ca4,
				hasCompetency: ca1 || ca2 || ca3 || ca4,
				hasContentArea: quantative || environmental || writing || international
			});
		}
	}

	return Array.from(sections.values());
}

export default fetchSections;
