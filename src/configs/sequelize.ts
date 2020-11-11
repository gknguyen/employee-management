import { BuildOptions, Model, Sequelize } from 'sequelize';
import ENV from './env';

export type AnyModel = typeof Model & {
  new (values?: object, options?: BuildOptions): any;
};

const sequelize = new Sequelize(ENV.APP_DB_URL, {
  logging: false,
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
});

export default sequelize;
