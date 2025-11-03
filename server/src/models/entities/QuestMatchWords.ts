import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import type { Quest } from './Quest';

export class QuestMatchWords extends Model<InferAttributes<QuestMatchWords>, InferCreationAttributes<QuestMatchWords>> {
	declare id: CreationOptional<number>;
	declare questId: ForeignKey<Quest['id']>;
	declare word: string;
	declare translate: string;
}

QuestMatchWords.init(
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		questId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'quest_id',
			references: {
				model: 'quest',
				key: 'id',
			},
			onDelete: 'CASCADE',
		},
		word: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		translate: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: 'quest_match_words',
		timestamps: false,
		indexes: [
			{
				fields: ['quest_id'],
			},
		],
	}
);

export default QuestMatchWords;
