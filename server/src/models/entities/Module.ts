import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import type { Language } from './Language';

export class Module extends Model<InferAttributes<Module>, InferCreationAttributes<Module>> {
	declare id: CreationOptional<number>;
	declare languageId: ForeignKey<Language['id']>;
	declare name: string;
	declare icon: string | null;
}

Module.init(
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		languageId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'language_id',
			references: {
				model: 'language',
				key: 'id',
			},
			onDelete: 'CASCADE',
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		icon: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		sequelize,
		tableName: 'module',
		timestamps: false,
		indexes: [
			{
				unique: true,
				fields: ['language_id', 'name'],
			},
			{
				fields: ['language_id'],
			},
		],
	}
);

export default Module;
