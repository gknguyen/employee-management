import dotenv from 'dotenv';
import { convertStringToNumber } from './utils';

dotenv.config();

/** main */
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = convertStringToNumber(process.env.PORT || '3000');

/** JWT */
export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '12h';

/** Crypto */
export const CRYPTO_SECRET = process.env.CRYPTO_SECRET || 'secret';

/** Moment.js */
export const MOMENT_TIMEZONE = process.env.MOMENT_TIMEZONE || 'Asia/Ho_Chi_Minh';
export const MOMENT_LOCALE = process.env.MOMENT_LOCALE || 'vi';

/** max file size in MB */
export const ACCESS_LOG_FILE_MAX_SIZE = convertStringToNumber(
  process.env.ACCESS_LOG_FILE_MAX_SIZE || '20',
);
export const ERROR_LOG_FILE_MAX_SIZE = convertStringToNumber(
  process.env.ERROR_LOG_FILE_MAX_SIZE || '10',
);

/** Mysql DB */
export const APP_DB_URL =
  process.env.APP_DB_URL || 'mysql://root:@127.0.0.1:3306/employee_management';
