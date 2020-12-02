import { Sequelize } from 'sequelize';
import ENV from '../../../configs/constants/env';

const pgsql = new Sequelize(ENV.PGSQL_CONNECTION, {
  logging: false,
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
});

export default pgsql;
