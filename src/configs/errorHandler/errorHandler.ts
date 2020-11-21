import * as express from 'express';
import fs from 'fs';
import jsonwebtoken from 'jsonwebtoken';
import moment from 'moment-timezone';
import os from 'os';
import { join } from 'path';
import ENV from '../constants/env';
import { HTTPdata, UserInfo } from '../constants/interfaces';
import { getFilesizeInBytes } from '../utils';
import STATUS_CODE from 'http-status';

let num = 0;

const errorHandler = (fn: any) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  Promise.resolve()
    .then(() => fn(req, res, next))
    .catch((error: HTTPdata) => {
      const token = req.headers.token as string;
      const userInfo = jsonwebtoken.decode(token) as UserInfo;

      // console.error('errorHandler: ', error.message.toString());

      /** get current using moment.js */
      const jaMoment = moment().tz(ENV.MOMENT_TIMEZONE).locale(ENV.MOMENT_LOCALE);
      // console.log('jaMoment: ', jaMoment.format('YYYY-MM-DD, h:mm:ss a'));

      /** check file size */
      let fileSize = getFilesizeInBytes(join(__dirname, `/errorLog${num}.txt`));
      while (fileSize > ENV.ERROR_LOG_FILE_MAX_SIZE) {
        num++;
        fileSize = getFilesizeInBytes(join(__dirname, `/errorLog${num}.txt`));
      }

      /** add error to file errorLog.txt */
      fs.appendFile(
        join(__dirname, `/errorLog${num}.txt`),
        '========================================================' +
          os.EOL +
          `date: ${JSON.stringify(jaMoment.format('YYYY-MM-DD, h:mm:ss a'))}` +
          os.EOL +
          `API: ${JSON.stringify(req.baseUrl + req.path)}` +
          os.EOL +
          `error: ${JSON.stringify(error.message.toString())}` +
          os.EOL +
          `username: ${JSON.stringify(userInfo?.username)}` +
          os.EOL,
        (err) => {
          if (err) throw err;
        },
      );

      /** if error, rollback the transaction */
      if (error.transaction) error.transaction.rollback();

      /** send response to client-side (FE) */
      res.status(error.code || STATUS_CODE.INTERNAL_SERVER_ERROR).send(error.message.toString());
    });
};

export default errorHandler;
