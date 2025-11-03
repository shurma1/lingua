import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import type { User } from './User';

export class Duel extends Model<InferAttributes<Duel>, InferCreationAttributes<Duel>> {
	declare id: CreationOptional<number>;
	declare winnerId: ForeignKey<User['id']>;
	declare loserId: ForeignKey<User['id']>;
	declare stars: CreationOptional<number>;
	declare createdAt: CreationOptional<Date>;
}

Duel.init(
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		winnerId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'winner_id',
			references: {
				model: 'user',
				key: 'id',
			},
		},
		loserId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'loser_id',
			references: {
				model: 'user',
				key: 'id',
			},
		},
		stars: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
			validate: {
				min: 0,
			},
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
		tableName: 'duel',
		timestamps: false,
		indexes: [
			{
				fields: ['winner_id'],
			},
			{
				fields: ['loser_id'],
			},
		],
		validate: {
			checkDifferentUsers() {
				if (this.winnerId === this.loserId) {
					throw new Error('Winner and loser must be different users');
				}
			},
		},
	}
);

export default Duel;
