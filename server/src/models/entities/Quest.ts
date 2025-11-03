import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import type { Level } from './Level';
import { QuestType } from '../types/QuestType';

export class Quest extends Model<InferAttributes<Quest>, InferCreationAttributes<Quest>> {
	declare id: CreationOptional<number>;
	declare type: QuestType;
	declare levelId: ForeignKey<Level['id']>;
}

Quest.init(
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		type: {
			type: DataTypes.ENUM(...Object.values(QuestType)),
			allowNull: false,
		},
		levelId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'level_id',
			references: {
				model: 'level',
				key: 'id',
			},
			onDelete: 'CASCADE',
		},
	},
	{
		sequelize,
		tableName: 'quest',
		timestamps: false,
		indexes: [
			{
				fields: ['level_id'],
			},
		],
	}
);

export default Quest;
