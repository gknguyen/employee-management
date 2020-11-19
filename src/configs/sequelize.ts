import { Sequelize } from 'sequelize';
import ENV from './constants/env';

const sequelize = new Sequelize(ENV.APP_DB_URL, {
  logging: false,
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
});

export default sequelize;
