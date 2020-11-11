import debug from 'debug';
import http from 'http';
import { APP_DB_URL, CRYPTO_SECRET, PORT } from '../configs/env';
import sequelize from '../configs/sequelize';
import MYSQL from '../main/database/mysqlService';
import app from './express';

const server = http.createServer(app);
const logger = debug('employee-management:server');
const Crypto = require('cryptojs').Crypto;

/**
connect to Database
*/
sequelize
  .authenticate()
  .then(() => logger('Connected to database: ' + APP_DB_URL))
  .catch((err: Error) =>
    console.error('Unable to connect to the database:', err.toString()),
  );

sequelize
  .sync({ alter: false, force: false })
  .then(() => {
    console.log(`initialize table: ${MYSQL.ceoService.generateTable()}`);
    console.log(`initialize table: ${MYSQL.departmentService.generateTable()}`);
    console.log(`initialize table: ${MYSQL.teamService.generateTable()}`);
    console.log(`initialize table: ${MYSQL.memberService.generateTable()}`);
    console.log(`initialize table: ${MYSQL.teamMemberService.generateTable()}`);
    console.log(`initialize table: ${MYSQL.userService.generateTable()}`);
  })
  .then(async () => {
    MYSQL.userService.init('admin', Crypto.AES.encrypt('admin', CRYPTO_SECRET));
  });

/**
start server
*/
app.set('port', PORT);
server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);

/** ================================================================================== */
/**
functions
*/

function onError(error: { syscall: string; code: any }) {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  /** handle specific listen errors with friendly messages */
  switch (error.code) {
    case 'EACCES':
      throw new Error(bind + ' requires elevated privileges');
    case 'EADDRINUSE':
      throw new Error(bind + ' is already in use');
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = addr
    ? typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port
    : '';
  logger('Listening on ' + bind);
}
