import { Sequelize } from 'sequelize';
import ENV from '../../../configs/constants/env';

const mysql = new Sequelize(ENV.MYSQL_CONNECTION, {
  logging: false,
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
});

export default mysql;
