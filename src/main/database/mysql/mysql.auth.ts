import { Sequelize } from 'sequelize';
import ENV from '../../../configs/constants/env';
import debug from 'debug';

const logger = debug('employee-management:server');

const mysql = new Sequelize(ENV.MYSQL_CONNECTION, {
  logging: false,
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
});

mysql
  .authenticate()
  .then(() => logger(`Connected to database: ${ENV.MYSQL_CONNECTION}`))
  .catch((err: Error) => logger(`Unable to connect to the database: ${err.toString()}`));

export default mysql;
