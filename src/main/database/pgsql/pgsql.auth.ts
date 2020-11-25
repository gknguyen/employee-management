import { Sequelize } from 'sequelize';
import ENV from '../../../configs/constants/env';
import debug from 'debug';

const logger = debug('employee-management:server');

const pgsql = new Sequelize(ENV.PGSQL_CONNECTION, {
  logging: false,
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
});

pgsql
  .authenticate()
  .then(() => logger(`Connected to database: ${ENV.PGSQL_CONNECTION}`))
  .catch((err: Error) => logger(`Unable to connect to the database: ${err.toString()}`));

export default pgsql;
