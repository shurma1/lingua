import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

export class AudioMedia extends Model<InferAttributes<AudioMedia>, InferCreationAttributes<AudioMedia>> {
	declare id: CreationOptional<number>;
	declare filename: string;
	declare mimeType: string | null;
	declare duration: number | null;
	declare fileSize: number | null;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

AudioMedia.init(
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		filename: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		mimeType: {
			type: DataTypes.STRING(50),
			allowNull: true,
			field: 'mime_type',
		},
		duration: {
			type: DataTypes.FLOAT,
			allowNull: true,
			comment: 'Duration in seconds',
		},
		fileSize: {
			type: DataTypes.BIGINT,
			allowNull: true,
			field: 'file_size',
			comment: 'Size in bytes',
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
			field: 'created_at',
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
			field: 'updated_at',
		},
	},
	{
		sequelize,
		tableName: 'audio_media',
		timestamps: true,
		underscored: true,
		indexes: [
			{
				fields: ['filename'],
				unique: true,
			},
		],
	}
);

export default AudioMedia;
