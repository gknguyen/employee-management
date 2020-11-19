import ENV from '../configs/constants/env';
import MYSQL from '../main/database/mysql/mysqlService';

const Crypto = require('cryptojs').Crypto;

export const generateTable = () => {
  console.log(`initialize table: ${MYSQL.ceo.getTableName()}`);
  console.log(`initialize table: ${MYSQL.department.getTableName()}`);
  console.log(`initialize table: ${MYSQL.team.getTableName()}`);
  console.log(`initialize table: ${MYSQL.member.getTableName()}`);
  console.log(`initialize table: ${MYSQL.teamMember.getTableName()}`);
  console.log(`initialize table: ${MYSQL.user.getTableName()}`);
  console.log(`initialize table: ${MYSQL.userRole.getTableName()}`);
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
