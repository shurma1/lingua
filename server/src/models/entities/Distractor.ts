import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

export class Distractor extends Model<InferAttributes<Distractor>, InferCreationAttributes<Distractor>> {
	declare id: CreationOptional<number>;
}

Distractor.init(
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
	},
	{
		sequelize,
		tableName: 'distractor',
		timestamps: false,
	}
);

export default Distractor;
