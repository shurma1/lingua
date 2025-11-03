import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import type { Distractor } from './Distractor';
import type { Words } from './Words';

export class DistractorWords extends Model<InferAttributes<DistractorWords>, InferCreationAttributes<DistractorWords>> {
	declare id: CreationOptional<number>;
	declare distractorId: ForeignKey<Distractor['id']>;
	declare wordId: ForeignKey<Words['id']>;
}

DistractorWords.init(
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		distractorId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'distractor_id',
			references: {
				model: 'distractor',
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
			onDelete: 'CASCADE',
		},
	},
	{
		sequelize,
		tableName: 'distractor_words',
		timestamps: false,
		indexes: [
			{ fields: ['distractor_id'] },
			{ fields: ['word_id'] },
		],
	}
);

export default DistractorWords;
