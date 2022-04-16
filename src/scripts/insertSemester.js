import "dotenv/config";

import fetchSections from "../sections/fetchSections.js";
import { basename } from "path";

// maunally insert classes
// provide the link in argv

if(process.argv.length < 3) {
	const script = basename(process.argv[1]);

	console.error(`Usage: ${process.argv0} ${script} <semester link>`);
	process.exit(1);
} else {
	const { Section } = await import("../database/index.js");

	const [link] = process.argv.slice(2);

	const sections = await fetchSections(link);
	const instances = await Section.bulkCreate(sections, { updateOnDuplicate: ["classNumber"] });

	console.log(`Inserted ${instances.length} section instances`);
}

