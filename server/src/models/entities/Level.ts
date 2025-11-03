import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import type { Module } from './Module';

export class Level extends Model<InferAttributes<Level>, InferCreationAttributes<Level>> {
	declare id: CreationOptional<number>;
	declare moduleId: ForeignKey<Module['id']>;
	declare name: string;
	declare questsCount: CreationOptional<number>;
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
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		questsCount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
			field: 'quests_count',
		},
	},
	{
		sequelize,
		tableName: 'level',
		timestamps: false,
		indexes: [
			{
				unique: true,
				fields: ['module_id', 'name'],
			},
			{
				fields: ['module_id'],
			},
		],
	}
);

export default Level;
