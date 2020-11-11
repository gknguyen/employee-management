import ENV from '../configs/env';
import MYSQL from '../main/database/mysqlService';

const Crypto = require('cryptojs').Crypto;

export const createDumpData = async () => {
  MYSQL.userService.findOrCreate({
    where: {
      username: 'admin',
    },
    defaults: {
      userRoleId: adminRole[0].id,
      username: 'admin',
      password: Crypto.AES.encrypt('admin', ENV.CRYPTO_SECRET),
    },
  });
};
