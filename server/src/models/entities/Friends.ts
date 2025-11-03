import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import type { User } from './User';

export class Friends extends Model<InferAttributes<Friends>, InferCreationAttributes<Friends>> {
	declare id: CreationOptional<number>;
	declare user1Id: ForeignKey<User['id']>;
	declare user2Id: ForeignKey<User['id']>;
	declare createdAt: CreationOptional<Date>;
}

Friends.init(
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		user1Id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'user1_id',
			references: {
				model: 'user',
				key: 'id',
			},
			onDelete: 'CASCADE',
		},
		user2Id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'user2_id',
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
		tableName: 'friends',
		timestamps: false,
		indexes: [
			{
				unique: true,
				fields: ['user1_id', 'user2_id'],
			},
		],
		validate: {
			checkUserOrder(this: Friends) {
				if (this.user1Id >= this.user2Id) {
					throw new Error('user1_id must be less than user2_id');
				}
			},
		},
	}
);

export default Friends;
