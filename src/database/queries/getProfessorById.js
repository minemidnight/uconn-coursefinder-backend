import { Professor } from "../index.js";

export default async (key, attributes = {}) => {
	const professor = await Professor.findByPk(key, { attributes });

	return professor && professor.get();
};
