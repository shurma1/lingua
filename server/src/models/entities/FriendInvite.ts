import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import type { User } from './User';

export class FriendInvite extends Model<InferAttributes<FriendInvite>, InferCreationAttributes<FriendInvite>> {
	declare id: CreationOptional<number>;
	declare userId: ForeignKey<User['id']>;
	declare createdAt: CreationOptional<Date>;
}

FriendInvite.init(
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
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
			field: 'created_at',
		},
	},
	{
		sequelize,
		tableName: 'friend_invite',
		timestamps: false,
		indexes: [
			{
				fields: ['user_id'],
			},
		],
	}
);

export default FriendInvite;
