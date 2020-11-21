import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import jsonwebtoken from 'jsonwebtoken';
import CONSTANTS from '../../configs/constants/constants';
import { UserInfo } from '../../configs/constants/interfaces';
import errorHandler from '../../configs/errorHandler/errorHandler';
import { comparePassword, getToken } from '../../configs/utils';
import UserRoleModel from '../database/mysql/models/user.role.model';
import MYSQL from '../database/mysql/mysqlService';

const authRouter = Router();

/** POST APIs */
authRouter.post('/login', login());

export default authRouter;

/** ================================================================================== */
/**
 * functions
 * */

function login(endHere = true) {
  const result = { ...CONSTANTS.RESULT };
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      /** get data in request body */
      const username = req.body.username as string;
      const password = req.body.password as string;

      /** chec input */
      if (username && password) {
        /** get user infomation */
        const user = await MYSQL.user.findOne({
          attributes: ['id', 'username', 'password', 'authToken'],
          where: { username: username },
          include: [
            {
              model: UserRoleModel,
              as: 'userRole',
              attributes: ['id', 'role'],
            },
          ],
        });

        if (user) {
          /** check password */
          const isCorrect = comparePassword(password, user.password);

          if (isCorrect) {
            /** update some information */
            const token = getToken(user);
            user['authToken'] = token;
            await user.save();

            /** send response to client-side (FE)
             * or continues the execution */
            if (endHere) res.status(STATUS_CODE.OK).send({ token });
            else next();
          } else {
            result.code = STATUS_CODE.UNAUTHORIZED;
            result.message = 'password incorrect';
            throw result;
          }
        } else {
          result.code = STATUS_CODE.UNAUTHORIZED;
          result.message = 'user not found';
          throw result;
        }
      } else {
        result.code = STATUS_CODE.UNAUTHORIZED;
        result.message = 'username or password is missing';
        throw result;
      }
    },
  );
}

export function verifyToken(endHere = false) {
  const result = { ...CONSTANTS.RESULT };
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      /** get data in request header */
      const token = req.headers.token as string;

      /** check token existed or not */
      if (token) {
        /** decode token to get user data */
        const decodedToken: any = jsonwebtoken.decode(token, { complete: true });
        const userInfo: UserInfo | null | undefined = decodedToken?.payload;

        if (userInfo) {
          /* check token TTL */
          const TTL = Math.round(new Date().getTime() / 1000);
          if (parseInt(decodedToken.payload.exp) > TTL) {
            /* get user data */
            const userData = await MYSQL.user.findOne({
              attributes: ['username', 'authToken'],
              where: { username: userInfo.username },
            });

            if (userData) {
              /* verify token */
              if (userData.authToken === token) {
                /** send response to client-side (FE)
                 * or continues the execution */
                if (endHere) res.status(STATUS_CODE.OK).send({ token });
                else next();
              } else {
                result.code = STATUS_CODE.UNAUTHORIZED;
                result.message = 'invalid token';
                throw result;
              }
            } else {
              result.code = STATUS_CODE.UNAUTHORIZED;
              result.message = 'userData in DB not found';
              throw result;
            }
          } else {
            result.code = STATUS_CODE.UNAUTHORIZED;
            result.message = 'token expired';
            throw result;
          }
        } else {
          result.code = STATUS_CODE.UNAUTHORIZED;
          result.message = 'invalid token';
          throw result;
        }
      } else {
        result.code = STATUS_CODE.UNAUTHORIZED;
        result.message = 'token is missing';
        throw result;
      }
    },
  );
}

export function authorizedUserRole(authorizedRole: string, endHere = false) {
  const result = { ...CONSTANTS.RESULT };
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      /** get data in request header */
      const token = req.headers.token as string;
      const userInfo = jsonwebtoken.decode(token) as UserInfo;
      const role = userInfo.role;

      /** check inputs */
      if (role) {
        /** call query to get record */
        const userRole = await MYSQL.userRole.findOne({
          where: { role: role },
        });

        if (userRole) {
          /** check if role in token is authorized or not */
          if (userRole.role === authorizedRole) {
            /** send response to client-side (FE)
             * or continues the execution */
            if (endHere) res.status(STATUS_CODE.OK).send(CONSTANTS.CURRENT_TIME);
            else next();
          } else {
            result.code = STATUS_CODE.UNAUTHORIZED;
            result.message = 'unauthorized role';
            throw result;
          }
        } else {
          result.code = STATUS_CODE.UNAUTHORIZED;
          result.message = 'invalid role in token';
          throw result;
        }
      } else {
        result.code = STATUS_CODE.UNAUTHORIZED;
        result.message = 'missing role in token';
        throw result;
      }
    },
  );
}
