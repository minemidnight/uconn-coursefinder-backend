import { Section } from "../index.js";

export default async () => {
	const rows = await Section.findAll({
		attributes: ["subject"],
		group: "subject",
		order: [["subject", "ASC"]]
	});

	return rows.map(row => row.get("subject"));
};
