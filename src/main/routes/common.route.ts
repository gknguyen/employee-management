import express, { Router } from 'express';
import faker from 'faker';
import STATUS_CODE from 'http-status';
import times from 'lodash.times';
import { Transaction } from 'sequelize';
import CONSTANTS from '../../configs/constants/constants';
import errorHandler from '../../configs/errorHandler/errorHandler';
import mysql from '../database/mysql/mysql.auth';
import MYSQL from '../database/mysql/mysql.service';

const commonRouter = Router();

/** POST APIs */
commonRouter.post('/createDumpData', createCEO(false), createMembers(false), createTeamMembers());

export default commonRouter;

/** ================================================================================== */
/**
 * functions
 * */

function createCEO(endHere = true) {
  const result = { ...CONSTANTS.RESULT };
  const promises: any[] = [];
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      /** get data in request body */
      const numberOfDepartment = req.body.numberOfDepartment as number;
      const numberOfTeamPerDepartment = req.body.numberOfTeamPerDepartment as number;
      const numberOfMember = req.body.numberOfMember as number;

      /** transaction for handling error when modify multiple tables in 1 go */
      const transaction = (req.body.transaction as Transaction) || (await mysql.transaction());
      if (!req.body.transaction) req.body.transaction = transaction;
      result.transaction = transaction;

      /** check input */
      if (numberOfDepartment && numberOfTeamPerDepartment && numberOfMember) {
        /** ceo */
        const ceo = await MYSQL.ceo.create(
          {
            name: faker.name.firstName(),
          },
          { transaction: transaction },
        );

        /** department */
        for (let i = 0; i < numberOfDepartment; i++) {
          const department = await MYSQL.department.create(
            {
              ceoId: ceo.id,
              manager: faker.name.firstName(),
            },
            { transaction: transaction },
          );

          /** team */
          for (let i = 0; i < numberOfTeamPerDepartment; i++) {
            promises.push(
              MYSQL.team.create(
                {
                  departmentId: department.id,
                  project: faker.commerce.productName(),
                },
                { transaction: transaction },
              ),
            );
          }
        }

        /** send response to client-side (FE)
         * or continues the execution */
        await Promise.all(promises);
        if (endHere) {
          /** end of execution, no errors were thrown => commit the transaction */
          await transaction.commit();
          res.status(STATUS_CODE.OK).send(ceo);
        } else next();
      } else {
        result.code = STATUS_CODE.PRECONDITION_FAILED;
        result.message = 'input required';
        throw result;
      }
    },
  );
}

function createMembers(endHere = true) {
  const result = { ...CONSTANTS.RESULT };
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      /** get data in request body */
      const numberOfMember = req.body.numberOfMember as number;

      /** transaction for handling error when modify multiple tables in 1 go */
      const transaction = (req.body.transaction as Transaction) || (await mysql.transaction());
      if (!req.body.transaction) req.body.transaction = transaction;
      result.transaction = transaction;

      /** create member list */
      const member = await MYSQL.member.bulkCreate(
        times(numberOfMember, () => ({
          name: faker.name.firstName(),
        })),
        { transaction: transaction },
      );

      /** send response to client-side (FE)
       * or continues the execution */
      if (endHere) {
        /** end of execution, no errors were thrown => commit the transaction */
        await transaction.commit();
        res.status(STATUS_CODE.OK).send(member);
      } else next();
    },
  );
}

function createTeamMembers(endHere = true) {
  const result = { ...CONSTANTS.RESULT };
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      /** transaction for handling error when modify multiple tables in 1 go */
      const transaction = (req.body.transaction as Transaction) || (await mysql.transaction());
      if (!req.body.transaction) req.body.transaction = transaction;
      result.transaction = transaction;

      /** get team list */
      const teams = await MYSQL.team.findAll({
        attributes: ['id'],
        transaction: transaction,
      });

      /** get member list */
      const members = await MYSQL.member.findAll({
        attributes: ['id'],
        transaction: transaction,
      });

      /** create team memner list */
      const dataList: any[] = [];
      for (const team of teams) {
        for (const member of members) {
          const data = {
            teamId: team.id,
            memberId: member.id,
          };
          dataList.push(data);
        }
      }

      await MYSQL.teamMember.bulkCreate(dataList, { transaction: transaction });

      /** send response to client-side (FE)
       * or continues the execution */
      if (endHere) {
        /** end of execution, no errors were thrown => commit the transaction */
        await transaction.commit();
        res.status(STATUS_CODE.OK).send(CONSTANTS.CURRENT_TIME);
      } else next();
    },
  );
}
