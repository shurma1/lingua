import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import type { User } from './User';
import { FriendRequestStatus } from '../types/FriendRequestStatus';

export class FriendRequest extends Model<InferAttributes<FriendRequest>, InferCreationAttributes<FriendRequest>> {
	declare id: CreationOptional<number>;
	declare requesterId: ForeignKey<User['id']>;
	declare addresseeId: ForeignKey<User['id']>;
	declare status: CreationOptional<FriendRequestStatus>;
	declare createdAt: CreationOptional<Date>;
	declare respondedAt: Date | null;
}

FriendRequest.init(
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		requesterId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'requester_id',
			references: {
				model: 'user',
				key: 'id',
			},
			onDelete: 'CASCADE',
		},
		addresseeId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'addressee_id',
			references: {
				model: 'user',
				key: 'id',
			},
			onDelete: 'CASCADE',
		},
		status: {
			type: DataTypes.ENUM(...Object.values(FriendRequestStatus)),
			allowNull: false,
			defaultValue: FriendRequestStatus.PENDING,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
			field: 'created_at',
		},
		respondedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'responded_at',
		},
	},
	{
		sequelize,
		tableName: 'friend_request',
		timestamps: false,
		indexes: [
			{
				unique: true,
				fields: ['requester_id', 'addressee_id'],
			},
			{
				fields: ['addressee_id'],
				where: {
					status: FriendRequestStatus.PENDING,
				},
			},
		],
		validate: {
			checkSelfRequest() {
				if (this.requesterId === this.addresseeId) {
					throw new Error('Cannot send friend request to yourself');
				}
			},
		},
	}
);

export default FriendRequest;
