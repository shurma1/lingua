import type { InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import type { AudioMedia } from './AudioMedia';

export class Words extends Model<InferAttributes<Words>, InferCreationAttributes<Words>> {
	declare id: CreationOptional<number>;
	declare audioMediaId: ForeignKey<AudioMedia['id']> | null;
	declare value: string;
}

Words.init(
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
		value: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
	},
	{
		sequelize,
		tableName: 'words',
		timestamps: false,
	}
);

export default Words;
