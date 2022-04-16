import { Section } from "../index.js";

export default async () => {
	const rows = await Section.findAll({
		attributes: ["semester"],
		group: "semester"
	});

	return rows.map(row => row.get("semester"));
};
