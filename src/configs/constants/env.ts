import dotenv from 'dotenv';
import { convertStringToNumber } from '../utils';

dotenv.config();

const ENV = {
  /** main */
  NODE_ENV: process.env.NODE_ENV || 'development',
  HTTP_PORT: convertStringToNumber(
    process.env.NODE_ENV === 'test'
      ? process.env.HTTP_PORT_TEST || '3200'
      : process.env.HTTP_PORT || '3000',
  ),
  HTTPS_PORT: convertStringToNumber(
    process.env.NODE_ENV === 'test'
      ? process.env.HTTPS_PORT_TEST || '4200'
      : process.env.HTTPS_PORT || '4000',
  ),

  /** JWT */
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '12h',

  /** Crypto */
  CRYPTO_SECRET: process.env.CRYPTO_SECRET || 'secret',

  /** Moment.js */
  MOMENT_TIMEZONE: process.env.MOMENT_TIMEZONE || 'Asia/Ho_Chi_Minh',
  MOMENT_LOCALE: process.env.MOMENT_LOCALE || 'vi',

  /** max file size in MB */
  ACCESS_LOG_FILE_MAX_SIZE: convertStringToNumber(process.env.ACCESS_LOG_FILE_MAX_SIZE || '20'),
  ERROR_LOG_FILE_MAX_SIZE: convertStringToNumber(process.env.ERROR_LOG_FILE_MAX_SIZE || '10'),

  /** Databases */
  MYSQL_CONNECTION:
    process.env.MYSQL_CONNECTION || 'mysql://root:@127.0.0.1:3306/employee_management',
  PGSQL_CONNECTION:
    process.env.PGSQL_CONNECTION || 'postgres://root:@127.0.0.1:5432/employee_management',
};

export default ENV;
