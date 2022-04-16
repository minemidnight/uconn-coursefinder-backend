import { DataTypes } from "sequelize";

export default sequelize => sequelize.define("Section", {
	classNumber: {
		type: DataTypes.INTEGER,
		primaryKey: true
	},
	semester: {
		type: DataTypes.STRING,
		allowNull: false
	},
	campus: {
		type: DataTypes.STRING,
		allowNull: false
	},
	catalogNumber: {
		type: DataTypes.STRING,
		allowNull: false
	},
	subject: {
		type: DataTypes.STRING,
		allowNull: false
	},
	subjectLong: {
		type: DataTypes.STRING,
		allowNull: false
	},
	component: {
		type: DataTypes.STRING,
		allowNull: false
	},
	title: {
		type: DataTypes.STRING,
		allowNull: false
	},
	section: {
		type: DataTypes.STRING,
		allowNull: false
	},
	days: {
		type: DataTypes.ARRAY(DataTypes.STRING),
		allowNull: false
	},
	startTime: {
		type: DataTypes.STRING,
		allowNull: false
	},
	endTime: {
		type: DataTypes.STRING,
		allowNull: false
	},
	professors: {
		type: DataTypes.ARRAY(DataTypes.STRING),
		allowNull: false
	},
	professorIds: {
		type: DataTypes.ARRAY(DataTypes.INTEGER),
		allowNull: false
	},
	capacity: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	enrolled: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	waitlistCapacity: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	waitlisted: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	location: {
		type: DataTypes.STRING,
		allowNull: false
	},
	instructionMode: {
		type: DataTypes.STRING,
		allowNull: false
	},
	minCredits: {
		type: DataTypes.FLOAT,
		allowNull: false
	},
	maxCredits: {
		type: DataTypes.FLOAT,
		allowNull: false
	},
	quantative: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	environmental: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	writing: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	international: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	online: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	inPerson: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	ca1: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	ca2: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	ca3: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	ca4: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	hasCompetency: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	hasContentArea: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	}
}, { indexes: [{ fields: ["semester", "catalogNumber"] }, { fields: ["professors"] }] });

