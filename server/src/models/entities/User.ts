import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import type { Language } from './Language';
import { UserRole } from '../types/UserRole';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: CreationOptional<number>;
	declare maxUserId: number | null;
	declare firstName: string | null;
	declare lastName: string | null;
	declare username: string;
	declare photoUrl: string | null;
	declare languageId: ForeignKey<Language['id']> | null;
	declare stars: CreationOptional<number>;
	declare exp: CreationOptional<number>;
	declare role: CreationOptional<UserRole>;
	declare lastLoginAt: Date | null;
	declare createdAt: CreationOptional<Date>;
}

User.init(
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		maxUserId: {
			type: DataTypes.BIGINT,
			allowNull: true,
			field: 'max_user_id',
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'first_name',
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'last_name',
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		photoUrl: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'photo_url',
		},
		languageId: {
			type: DataTypes.BIGINT,
			allowNull: true,
			field: 'language_id',
			references: {
				model: 'language',
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
		exp: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
			validate: {
				min: 0,
			},
		},
		role: {
			type: DataTypes.ENUM(...Object.values(UserRole)),
			allowNull: false,
			defaultValue: UserRole.USER,
		},
		lastLoginAt: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'last_login_at',
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
		tableName: 'user',
		timestamps: false,
		indexes: [
			{
				fields: ['language_id'],
			},
		],
	}
);

export default User;
