import type { Model as SequelizeModel, ModelStatic } from 'sequelize';

export { Model as SequelizeModel } from 'sequelize';

export type ModelClass<T extends SequelizeModel> = ModelStatic<T>;
