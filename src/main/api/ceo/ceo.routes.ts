import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import errorHandler from '../../../configs/errorHandler/errorHandler';
import { convertStringToNumber } from '../../../configs/utils';
import ceoController from './ceo.controllers';

const ceoRouter = Router();

/** POST APIs */
ceoRouter.post('/createCEO', createCEO());

/** GET APIs */
ceoRouter.get('/getCEO', getCEO());

/** PUT APIs */
ceoRouter.put('/editCEO', editCEO());

/** DELETE APIs */
ceoRouter.delete('/deleteCEO', deleteCEO());

export default ceoRouter;

/** ================================================================================== */
/**
 * functions
 * */

function createCEO(endHere = true) {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      /** get data in request body */
      const ceoName = req.body.ceoName as string;

      /** execute logic and then get result */
      const results = await ceoController.createCEO(ceoName);

      if (endHere) {
        /** send response to client-side (FE) */
        res.status(results.code).send(results);
        if (results.code !== STATUS_CODE.OK) throw results.message;
      } else {
        /** continues to the next functions */
        if (results.code === STATUS_CODE.OK) next();
        else {
          res.status(results.code).send(results);
          throw results.message;
        }
      }
    },
  );
}

function getCEO(endHere = true) {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      /** get data in request query */
      const ceoId = convertStringToNumber(req.query.ceoId as string);

      /** execute logic and then get result */
      const results = await ceoController.getCEO(ceoId);

      if (endHere) {
        /** send response to client-side (FE) */
        res.status(results.code).send(results);
        if (results.code !== STATUS_CODE.OK) throw results.message;
      } else {
        /** continues to the next functions */
        if (results.code === STATUS_CODE.OK) next();
        else {
          res.status(results.code).send(results);
          throw results.message;
        }
      }
    },
  );
}

function editCEO(endHere = true) {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      /** get data in request query */
      const ceoId = convertStringToNumber(req.query.ceoId as string);

      /** get data in request body */
      const ceoName = req.body.ceoName as string;

      /** execute logic and then get result */
      const results = await ceoController.editCEO(ceoId, ceoName);

      if (endHere) {
        /** send response to client-side (FE) */
        res.status(results.code).send(results);
        if (results.code !== STATUS_CODE.OK) throw results.message;
      } else {
        /** continues to the next functions */
        if (results.code === STATUS_CODE.OK) next();
        else {
          res.status(results.code).send(results);
          throw results.message;
        }
      }
    },
  );
}

function deleteCEO(endHere = true) {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      /** get data in request query */
      const ceoId = convertStringToNumber(req.query.ceoId as string);

      /** execute logic and then get result */
      const results = await ceoController.deleteCEO(ceoId);

      if (endHere) {
        /** send response to client-side (FE) */
        res.status(results.code).send(results);
        if (results.code !== STATUS_CODE.OK) throw results.message;
      } else {
        /** continues to the next functions */
        if (results.code === STATUS_CODE.OK) next();
        else {
          res.status(results.code).send(results);
          throw results.message;
        }
      }
    },
  );
}
