import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { json } from 'express';
import helmet from 'helmet';
import path, { join } from 'path';
import { getFilesizeInBytes } from '../configs/utils';
import authRouter, { verifyToken } from '../main/api/auth/auth.routes';
import commonRouter from '../main/api/common/common.routes';
import genaralRouter from '../main/api/general/general.routes';
import fs from 'fs';
import { ACCESS_LOG_FILE_MAX_SIZE, NODE_ENV } from '../configs/env';
import { default as logger, default as morgan } from 'morgan';
import os from 'os';

let num = 0;

const app = express();

loadConfigs();
loadRoutes();
loadViews();

export default app;

/** ================================================================================== */
/**
functions
*/

function loadRoutes() {
  app.use('/auth', authRouter);
  app.use('/general', verifyToken(false), genaralRouter);
  app.use('/common', verifyToken(false), commonRouter);
}

function loadViews() {
  app.use(express.static(join(__dirname, '../../build')));
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../../build', 'index.html'));
  });
}

function loadConfigs() {
  /* check file size */
  let fileSize = getFilesizeInBytes(join(__dirname, `/access${num}.log`));
  while (fileSize > ACCESS_LOG_FILE_MAX_SIZE) {
    num++;
    fileSize = getFilesizeInBytes(join(__dirname, `/access${num}.log`));
  }

  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, `/access${num}.log`),
    { flags: 'a' },
  );

  app.use(
    logger(
      '==========================================================================================' +
        os.EOL +
        'remote-addr: :remote-addr' +
        os.EOL +
        'remote-user: :remote-user' +
        os.EOL +
        'date: [:date[clf]]' +
        os.EOL +
        'method: ":method :url HTTP/:http-version"' +
        os.EOL +
        'status: :status :res[content-length]' +
        os.EOL +
        'referrer: ":referrer"' +
        os.EOL +
        'user-agent: ":user-agent"' +
        os.EOL +
        'req[query]: :req[query]' +
        os.EOL +
        'req[body]: :req[body]',
      {
        stream: accessLogStream,
      },
    ),
  );

  app.use(
    morgan(NODE_ENV === 'production' ? 'common' : 'dev', {
      stream: accessLogStream,
    }),
  );

  app.use(compression());
  app.use(json());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(helmet());
}
