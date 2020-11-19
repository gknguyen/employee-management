import debug from 'debug';
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import ENV from '../configs/constants/env';
import sequelize from '../configs/sequelize';
import app from './express';
import { generateDumpData, generateTable } from './initialize.data';

const logger = debug('employee-management:server');

const ssl = {
  key: fs.readFileSync(path.resolve('SSL/test-ssl.local.key')),
  cert: fs.readFileSync(path.resolve('SSL/test-ssl.local.crt')),
};

const HTTP = http.createServer(app);
const HTTPS = https.createServer(ssl, app);

/**
 * connect to Databases
 * */
sequelize
  .authenticate()
  .then(() => logger(`Connected to database: ${ENV.APP_DB_URL}`))
  .catch((err: Error) => console.error(`Unable to connect to the database: ${err.toString()}`));

sequelize
  .sync({ alter: false, force: false })
  .then(() => generateTable())
  .then(async () => generateDumpData())
  .catch((err: Error) => console.error(`Unable to sync with the database: ${err.toString()}`));

/**
 * enable server to listen to HTTP requests
 * */
HTTP.listen(ENV.HTTP_PORT, () => logger(`HTTP : Listening on ${ENV.HTTP_PORT}`));

/**
 * enable server to listen to HTTPS requests
 * */
HTTPS.listen(ENV.HTTPS_PORT, () => logger(`HTTPS : Listening on ${ENV.HTTPS_PORT}`));
