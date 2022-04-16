import campuses from "./campuses.js";
import courses from "./courses.js";
import semesters from "./semesters.js";
import subjects from "./subjects.js";

export default function mountRoutes(app) {
	app.use("/campuses", campuses);
	app.use("/courses", courses);
	app.use("/semesters", semesters);
	app.use("/subjects", subjects);
}
