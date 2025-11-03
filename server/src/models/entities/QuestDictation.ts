import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import type { Quest } from './Quest';
import type { Sentence } from './Sentence';
import type { AudioMedia } from './AudioMedia';
import type { Distractor } from './Distractor';

export class QuestDictation extends Model<InferAttributes<QuestDictation>, InferCreationAttributes<QuestDictation>> {
	declare id: CreationOptional<number>;
	declare questId: ForeignKey<Quest['id']>;
	declare audioMediaId: ForeignKey<AudioMedia['id']> | null;
	declare correctSentenceId: ForeignKey<Sentence['id']>;
	declare distractorId: ForeignKey<Distractor['id']> | null;
}

QuestDictation.init(
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
		audioMediaId: {
			type: DataTypes.BIGINT,
			allowNull: true,
			field: 'audio_media_id',
			references: {
				model: 'audio_media',
				key: 'id',
			},
			onDelete: 'SET NULL',
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
		// NOTE: column name provided by user: distrctor_id (single 'a' missing). Using that exact spelling.
		distractorId: {
			type: DataTypes.BIGINT,
			allowNull: true,
			field: 'distrctor_id',
			references: {
				model: 'distractor',
				key: 'id',
			},
			onDelete: 'SET NULL',
		},
	},
	{
		sequelize,
		tableName: 'quest_dictation',
		timestamps: false,
	}
);

export default QuestDictation;
