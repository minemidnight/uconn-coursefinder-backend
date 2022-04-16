import { BASE_URL, UNIVERSITY_ID } from "./constants.js";

import fetch from "node-fetch";

export default async () => {
	const url = `${BASE_URL}/filter/professor/` +
				"?&page=1&filter=teacherlastname_sort_s+asc&query=*%3A*" +
				`&queryoption=TEACHER&queryBy=schoolId&sid=${UNIVERSITY_ID}`;

	const response = await fetch(url);
	const body = await response.json();

	const perPage = body.professors.length;
	const total = body.remaining + perPage;

	return {
		total,
		pages: Math.ceil(total / perPage),
		perPage
	};
};
