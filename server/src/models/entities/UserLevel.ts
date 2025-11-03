import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import type { User } from './User';
import type { Level } from './Level';

export class UserLevel extends Model<InferAttributes<UserLevel>, InferCreationAttributes<UserLevel>> {
	declare id: CreationOptional<number>;
	declare userId: ForeignKey<User['id']>;
	declare levelId: ForeignKey<Level['id']>;
	declare questsCount: CreationOptional<number>;
	declare score: CreationOptional<number>;
}

UserLevel.init(
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		userId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'user_id',
			references: {
				model: 'user',
				key: 'id',
			},
			onDelete: 'CASCADE',
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
		questsCount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
			field: 'quests_count',
		},
		score: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
			validate: {
				min: 0,
			},
		},
	},
	{
		sequelize,
		tableName: 'user_level',
		timestamps: false,
		indexes: [
			{
				unique: true,
				fields: ['user_id', 'level_id'],
			},
			{
				fields: ['user_id'],
			},
		],
	}
);

export default UserLevel;
