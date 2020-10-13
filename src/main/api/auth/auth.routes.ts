import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import errorHandler from '../../../configs/errorHandler/errorHandler';
import authController from './auth.controllers';

const authRouter = Router();

authRouter.post('/login', login());
authRouter.post('/getVerify', verifyToken());

/** ================================================================================== */
/**
functions
*/

function login(endHere = true) {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const username = req.body.username as string;
      const password = req.body.password as string;

      const results = await authController.login(username, password);

      if (endHere) {
        res.status(results.code).send(results);
        if (results.code !== STATUS_CODE.OK) throw results.message;
      } else {
        if (results.code === STATUS_CODE.OK) {
          next();
        } else {
          res.status(results.code).send(results);
          throw results.message;
        }
      }
    },
  );
}

export function verifyToken(endHere = true) {
  return errorHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const token = req.headers.token as string;

      const results = await authController.getVerify(token);

      if (endHere) {
        res.status(results.code).send(results);
        if (results.code !== STATUS_CODE.OK) throw results.message;
      } else {
        if (results.code === STATUS_CODE.OK) {
          next();
        } else {
          res.status(results.code).send(results);
          throw results.message;
        }
      }
    },
  );
}

export default authRouter;
