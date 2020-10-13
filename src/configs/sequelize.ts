import { Sequelize } from 'sequelize';
import { APP_DB_URL } from './env';

const sequelize = new Sequelize(APP_DB_URL, {
  logging: false,
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
});

export default sequelize;
