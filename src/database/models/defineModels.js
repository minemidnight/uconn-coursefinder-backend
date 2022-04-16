import defineSection from "./Section.js";
import defineProfessor from "./Professor.js";

export default sequelize => {
	const Section = defineSection(sequelize);
	const Professor = defineProfessor(sequelize);

	return { Section, Professor };
};
