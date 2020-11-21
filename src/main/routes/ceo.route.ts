import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import CONSTANTS from '../../configs/constants/constants';
import errorHandler from '../../configs/errorHandler/errorHandler';
import { convertStringToNumber } from '../../configs/utils';
import MYSQL from '../database/mysql/mysqlService';

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
  const result = { ...CONSTANTS.RESULT };
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      /** get data in request body */
      const ceoName = req.body.ceoName as string;

      /** check inputs */
      if (ceoName) {
        /** call query to create record */
        const ceo = await MYSQL.ceo.create({ name: ceoName });

        /** send response to client-side (FE)
         * or continues the execution */
        if (endHere) res.status(STATUS_CODE.OK).send(ceo);
        else next();
      } else {
        result.code = STATUS_CODE.PRECONDITION_FAILED;
        result.message = 'input required';
        throw result;
      }
    },
  );
}

function getCEO(endHere = true) {
  const result = { ...CONSTANTS.RESULT };
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      /** get data in request query */
      const ceoId = convertStringToNumber(req.query.ceoId as string);

      /** check inputs */
      if (ceoId) {
        /** call query to get record */
        const ceo = await MYSQL.ceo.findOne({ where: { id: ceoId } });

        if (ceo) {
          /** send response to client-side (FE)
           * or continues the execution */
          if (endHere) res.status(STATUS_CODE.OK).send(ceo);
          else next();
        } else {
          result.code = STATUS_CODE.EXPECTATION_FAILED;
          result.message = 'no result';
          throw result;
        }
      } else {
        result.code = STATUS_CODE.PRECONDITION_FAILED;
        result.message = 'input required';
        throw result;
      }
    },
  );
}

function editCEO(endHere = true) {
  const result = { ...CONSTANTS.RESULT };
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      /** get data in request query */
      const ceoId = convertStringToNumber(req.query.ceoId as string);

      /** get data in request body */
      const ceoName = req.body.ceoName as string;

      /** check inputs */
      if (ceoId && ceoName) {
        /** call query to edit record */
        const ceo = await MYSQL.ceo.update({ name: ceoName }, { where: { id: ceoId } });

        if (ceo[0]) {
          /** send response to client-side (FE)
           * or continues the execution */
          if (endHere) res.status(STATUS_CODE.OK).send(CONSTANTS.CURRENT_TIME);
          else next();
        } else {
          result.code = STATUS_CODE.EXPECTATION_FAILED;
          result.message = 'edit failed';
          throw result;
        }
      } else {
        result.code = STATUS_CODE.PRECONDITION_FAILED;
        result.message = 'input required';
        throw result;
      }
    },
  );
}

function deleteCEO(endHere = true) {
  const result = { ...CONSTANTS.RESULT };
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      /** get data in request query */
      const ceoId = convertStringToNumber(req.query.ceoId as string);

      /** check inputs */
      if (ceoId) {
        /** call query to delete record */
        const ceo = await MYSQL.ceo.destroy({ where: { id: ceoId } });

        /** return result */
        if (ceo) {
          /** send response to client-side (FE)
           * or continues the execution */
          if (endHere) res.status(STATUS_CODE.OK).send(CONSTANTS.CURRENT_TIME);
          else next();
        } else {
          result.code = STATUS_CODE.EXPECTATION_FAILED;
          result.message = 'delete failed';
          throw result;
        }
      } else {
        result.code = STATUS_CODE.PRECONDITION_FAILED;
        result.message = 'input required';
        throw result;
      }
    },
  );
}
