import { Section } from "../index.js";

export default async () => {
	const rows = await Section.findAll({
		attributes: ["campus"],
		group: "campus",
		order: [["campus", "ASC"]]
	});

	return rows.map(row => row.get("campus"));
};
