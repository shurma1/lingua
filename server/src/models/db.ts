import { Sequelize } from 'sequelize';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
const DB_NAME = process.env.DB_NAME || 'foreignlang';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
	host: DB_HOST,
	port: DB_PORT,
	dialect: 'postgres',
	logging: false,
	pool: {
		max: 10,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
	define: {
		timestamps: true,
		underscored: true,
		freezeTableName: true,
	},
});

export default sequelize;
