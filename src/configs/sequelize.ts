import { BuildOptions, Model, Sequelize } from 'sequelize';
import { APP_DB_URL } from './env';

export type AnyModel = typeof Model & {
  new (values?: object, options?: BuildOptions): any;
};

const sequelize = new Sequelize(APP_DB_URL, {
  logging: false,
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
});

export default sequelize;
