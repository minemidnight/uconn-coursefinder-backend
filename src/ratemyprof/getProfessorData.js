import { BASE_URL, UNIVERSITY_ID } from "./constants.js";

import fetch from "node-fetch";
import getPaginationInfo from "./getPaginationInfo.js";

export default async () => {
	const { pages } = await getPaginationInfo();
	const queries = [];

	for(let page = 1; page <= pages; page++) {
		const url = `${BASE_URL}/filter/professor/` +
		`?&page=${page}&filter=teacherlastname_sort_s+asc` +
		`&query=*%3A*&queryoption=TEACHER&queryBy=schoolId&sid=${UNIVERSITY_ID}`;

		queries.push(fetch(url)
			.then(response => response.json())
			.then(json => json.professors));
	}

	const results = await Promise.all(queries);

	return results.flat().map(prof => {
		return {
			id: prof.tid,
			name: `${prof.tFname} ${prof.tLname}`,
			ratingCount: prof.tNumRatings,
			averageRating: prof.tNumRatings > 0 ? prof.overall_rating : 0,
			department: prof.tDept
		};
	});
};
