import debug from 'debug';
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import ENV from '../configs/constants/env';
import mysql from '../main/database/mysql/mysql.auth';
import pgsql from '../main/database/pgsql/pgsql.auth';
import app from './express';
import { generateDumpData, generateTable } from './initialize.data';

const logger = debug('employee-management:server');

const ssl = {
  key: fs.readFileSync(path.resolve('SSL/test-ssl.local.key')),
  cert: fs.readFileSync(path.resolve('SSL/test-ssl.local.crt')),
};

export const HTTP = http.createServer(app);
export const HTTPS = https.createServer(ssl, app);

/**
 * connect to Databases
 * */
mysql.sync({ alter: false, force: false }).catch((err: Error) => err.toString());
mysql
  .authenticate()
  .then(() => logger(`Connected to database: ${ENV.MYSQL_CONNECTION}`))
  .then(() => generateTable())
  .then(() => generateDumpData())
  .catch((err: Error) => logger(`Unable to connect to the database: ${err.toString()}`));

pgsql.sync({ alter: false, force: false }).catch((err: Error) => err.toString());
pgsql
  .authenticate()
  .then(() => logger(`Connected to database: ${ENV.PGSQL_CONNECTION}`))
  .then(() => {}) /** do something */
  .catch((err: Error) => logger(`Unable to connect to the database: ${err.toString()}`));

/**
 * enable server to listen to HTTP requests
 * */
HTTP.listen(ENV.HTTP_PORT, () => logger(`HTTP : Listening on ${ENV.HTTP_PORT}`));

/**
 * enable server to listen to HTTPS requests
 * */
HTTPS.listen(ENV.HTTPS_PORT, () => logger(`HTTPS : Listening on ${ENV.HTTPS_PORT}`));
