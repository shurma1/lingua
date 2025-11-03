import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import type { User } from './User';

export class UserTokens extends Model<InferAttributes<UserTokens>, InferCreationAttributes<UserTokens>> {
	declare id: CreationOptional<number>;
	declare userId: ForeignKey<User['id']>;
	declare token: string;
	declare expiredAt: Date;
	declare createdAt: CreationOptional<Date>;
}

UserTokens.init(
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
		token: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		expiredAt: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'expired_at',
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
			field: 'created_at',
		},
	},
	{
		sequelize,
		tableName: 'user_tokens',
		timestamps: false,
	}
);

export default UserTokens;
