import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import type { Module } from './Module';

export class Lesson extends Model<InferAttributes<Lesson>, InferCreationAttributes<Lesson>> {
	declare id: CreationOptional<number>;
	declare moduleId: ForeignKey<Module['id']>;
	declare title: string;
	declare text: string;
}

Lesson.init(
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
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		text: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: 'lesson',
		timestamps: false,
		indexes: [
			{
				fields: ['module_id'],
			},
		],
	}
);

export default Lesson;
