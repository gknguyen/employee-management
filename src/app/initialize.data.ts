import ENV from '../configs/constants/env';
import MYSQL from '../main/database/mysql/mysql.service';

const Crypto = require('cryptojs').Crypto;

export const generateTable = () => {
  MYSQL.ceo.getTableName();
  MYSQL.department.getTableName();
  MYSQL.team.getTableName();
  MYSQL.member.getTableName();
  MYSQL.teamMember.getTableName();
  MYSQL.user.getTableName();
  MYSQL.userRole.getTableName();
};

export const generateDumpData = async () => {
  const adminRole = await MYSQL.userRole.findOrCreate({
    where: {
      role: 'admin',
    },
    defaults: {
      role: 'admin',
    },
  });

  const userRole = await MYSQL.userRole.findOrCreate({
    where: {
      role: 'user',
    },
    defaults: {
      role: 'user',
    },
  });

  MYSQL.user.findOrCreate({
    where: {
      username: 'admin',
    },
    defaults: {
      userRoleId: adminRole[0].id,
      username: 'admin',
      password: Crypto.AES.encrypt('admin', ENV.CRYPTO_SECRET),
    },
  });

  MYSQL.user.findOrCreate({
    where: {
      username: 'user',
    },
    defaults: {
      userRoleId: userRole[0].id,
      username: 'user',
      password: Crypto.AES.encrypt('user', ENV.CRYPTO_SECRET),
    },
  });
};
