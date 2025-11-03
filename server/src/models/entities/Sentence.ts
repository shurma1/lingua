import type { InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import type { AudioMedia } from './AudioMedia';

export class Sentence extends Model<InferAttributes<Sentence>, InferCreationAttributes<Sentence>> {
	declare id: CreationOptional<number>;
	declare audioMediaId: ForeignKey<AudioMedia['id']> | null;
	declare text: string;
}

Sentence.init(
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
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
		text: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: 'sentence',
		timestamps: false,
	}
);

export default Sentence;
