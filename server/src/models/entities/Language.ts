import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

export class Language extends Model<InferAttributes<Language>, InferCreationAttributes<Language>> {
	declare id: CreationOptional<number>;
	declare name: string;
	declare icon: string | null;
}

Language.init(
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		icon: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		sequelize,
		tableName: 'language',
		timestamps: false,
	}
);

export default Language;
