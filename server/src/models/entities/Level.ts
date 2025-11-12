import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import type { Module } from './Module';

export class Level extends Model<InferAttributes<Level>, InferCreationAttributes<Level>> {
	declare id: CreationOptional<number>;
	declare moduleId: ForeignKey<Module['id']>;
	declare icon: string;
}

Level.init(
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		moduleId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'module_id',
			references: {
				model: 'module',
				key: 'id',
			},
			onDelete: 'CASCADE',
		},
		icon: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: 'level',
		timestamps: false,
		indexes: [
			{
				fields: ['module_id'],
			},
		],
	}
);

export default Level;
