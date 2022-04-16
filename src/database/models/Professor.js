import { DataTypes } from "sequelize";

export default sequelize => sequelize.define("Professor", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	ratingCount: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	averageRating: {
		type: DataTypes.FLOAT,
		allowNull: false
	},
	department: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, { indexes: [{ fields: ["name"] }] });
