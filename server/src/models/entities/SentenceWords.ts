import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import type { Sentence } from './Sentence';
import type { Words } from './Words';

export class SentenceWords extends Model<InferAttributes<SentenceWords>, InferCreationAttributes<SentenceWords>> {
	declare id: CreationOptional<number>;
	declare sentenceId: ForeignKey<Sentence['id']>;
	declare wordId: ForeignKey<Words['id']>;
	declare position: number;
}

SentenceWords.init(
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		sentenceId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'sentence_id',
			references: {
				model: 'sentence',
				key: 'id',
			},
			onDelete: 'CASCADE',
		},
		wordId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'word_id',
			references: {
				model: 'words',
				key: 'id',
			},
		},
		position: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: 'sentence_words',
		timestamps: false,
		indexes: [
			{
				unique: true,
				fields: ['sentence_id', 'position'],
			},
		],
	}
);

export default SentenceWords;
