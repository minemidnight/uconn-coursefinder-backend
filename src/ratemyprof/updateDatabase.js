import getProfessorData from "./getProfessorData.js";
import { Professor } from "../database/index.js";

export default async () => {
	const data = await getProfessorData();

	const instances = await Professor.bulkCreate(data, { updateOnDuplicate: Object.keys(Professor.getAttributes()) });

	return instances;
};
