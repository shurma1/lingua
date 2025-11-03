import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import type { Quest } from './Quest';
import type { Sentence } from './Sentence';
import type { Distractor } from './Distractor';

export class QuestTranslate extends Model<InferAttributes<QuestTranslate>, InferCreationAttributes<QuestTranslate>> {
	declare id: CreationOptional<number>;
	declare questId: ForeignKey<Quest['id']>;
	declare sourceSentence: string; // например предложение  на исходном языке
	declare correctSentenceId: ForeignKey<Sentence['id']>; // перевод
	declare distractorId: ForeignKey<Distractor['id']> | null;
}

QuestTranslate.init(
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		questId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			unique: true,
			field: 'quest_id',
			references: {
				model: 'quest',
				key: 'id',
			},
			onDelete: 'CASCADE',
		},
		sourceSentence: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'source_sentence',
		},
		correctSentenceId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'correct_sentence_id',
			references: {
				model: 'sentence',
				key: 'id',
			},
		},
		distractorId: {
			type: DataTypes.BIGINT,
			allowNull: true,
			field: 'distrctor_id', // preserving provided column spelling
			references: {
				model: 'distractor',
				key: 'id',
			},
			onDelete: 'SET NULL',
		},
	},
	{
		sequelize,
		tableName: 'quest_translate',
		timestamps: false,
	}
);

export default QuestTranslate;
