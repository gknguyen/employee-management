import STATUS_CODE from 'http-status';
import jsonwebtoken from 'jsonwebtoken';
import ENV from '../../../configs/constants/env';
import { HTTPdata, UserInfo } from '../../../configs/constants/interfaces';
import { User } from '../../database/mysql/model/user.model';
import UserRoleModel from '../../database/mysql/model/user.role.model';
import MYSQL from '../../database/mysql/mysqlService';

const Crypto = require('cryptojs').Crypto;

class AuthController {
  /** ================================================================================== */
  private getToken(user: User) {
    const payload = {
      id: user.id,
      username: user?.username,
      role: user?.userRole?.role,
    } as UserInfo;
    const secret = ENV.JWT_SECRET;
    const options = { expiresIn: ENV.JWT_EXPIRES_IN } as jsonwebtoken.SignOptions;
    const token = jsonwebtoken.sign(payload, secret, options);
    return token;
  }

  /** ================================================================================== */
  private comparePassword(loginPass: string, userEncodedPass: string) {
    const dencodedPass = Crypto.AES.decrypt(userEncodedPass, ENV.CRYPTO_SECRET);
    if (dencodedPass === loginPass) return true;
    else return false;
  }

  /** ================================================================================== */
  public login = async (username?: string | null, password?: string | null) => {
    const result = {
      code: 0,
      message: '',
      data: null,
    } as HTTPdata;

    /** chec input */
    if (!username) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      result.message = 'username is missing';
      return result;
    }
    if (!password) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      result.message = 'password is missing';
      return result;
    }

    try {
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

      if (!user) {
        result.code = STATUS_CODE.UNAUTHORIZED;
        result.message = 'user not found';
        return result;
      }

      /** check password */
      const isCorrect = this.comparePassword(password, user.password);

      if (isCorrect) {
        /** update some information */
        const token = this.getToken(user);
        user['authToken'] = token;
        await user.save();

        /** return responses */
        result.code = STATUS_CODE.OK;
        result.message = 'login successfully';
        result.data = { token };
        return result;
      } else {
        result.code = STATUS_CODE.UNAUTHORIZED;
        result.message = 'password incorrect';
        return result;
      }
    } catch (err) {
      result.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      result.message = err.toString();
      result.data = err;
      return result;
    }
  };

  /** ================================================================================== */
  public getVerify = async (token?: string | null) => {
    const result = {
      code: 0,
      message: '',
      data: null,
    } as HTTPdata;

    try {
      /** check token existed or not */
      if (!token) {
        result.code = STATUS_CODE.UNAUTHORIZED;
        result.message = 'token is missing';
        return result;
      }

      /** decode token to get user data */
      const decodedToken: any = jsonwebtoken.decode(token, { complete: true });
      const userInfo: UserInfo | null | undefined = decodedToken?.payload;

      if (!userInfo) {
        result.code = STATUS_CODE.UNAUTHORIZED;
        result.message = 'invalid token';
        return result;
      }

      /* check token TTL */
      const TTL = Math.round(new Date().getTime() / 1000);
      if (parseInt(decodedToken.payload.exp) < TTL) {
        result.code = STATUS_CODE.UNAUTHORIZED;
        result.message = 'token expired';
        return result;
      }

      /* get user data */
      const userData = await MYSQL.user.findOne({
        attributes: ['username', 'authToken'],
        where: { username: userInfo.username },
      });

      if (!userData) {
        result.code = STATUS_CODE.UNAUTHORIZED;
        result.message = 'userData in DB not found';
        return result;
      }

      /* verify token */
      if (userData.authToken === token) {
        result.code = STATUS_CODE.OK;
        result.message = 'valid token';
        result.data = userInfo;
        return result;
      } else {
        result.code = STATUS_CODE.UNAUTHORIZED;
        result.message = 'invalid token';
        return result;
      }
    } catch (err) {
      result.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      result.message = err.toString();
      result.data = err;
      return result;
    }
  };

  /** ================================================================================== */
  public authorizedUserRole = async (authorizedRole: string, role?: string | null) => {
    const result = {
      code: 0,
      message: '',
      data: null,
    } as HTTPdata;

    /** check inputs */
    if (!role) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      result.message = 'missing role in token';
      return result;
    }

    try {
      /** call query to get record */
      const userRole = await MYSQL.userRole.findOne({
        where: { role: role },
      });

      if (!userRole) {
        result.code = STATUS_CODE.PRECONDITION_FAILED;
        result.message = 'invalid role in token';
        return result;
      }

      /** check if role in token is authorized or not */
      if (userRole.role === authorizedRole) {
        result.code = STATUS_CODE.OK;
        result.message = 'authorized role';
        return result;
      } else {
        result.code = STATUS_CODE.EXPECTATION_FAILED;
        result.message = 'unauthorized role';
        return result;
      }
    } catch (err) {
      result.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      result.message = err.toString();
      result.data = err;
      return result;
    }
  };
}

const authController = new AuthController();

export default authController;
