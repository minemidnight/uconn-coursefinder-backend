import { Professor } from "../index.js";

export default async (name, attributes = {}) => {
	const professor = await Professor.findOne({
		attributes,
		where: { name },
		order: [["ratingCount", "DESC"]]
	});

	return professor && professor.get();
};
