import fs from 'fs';
import { User } from '../main/database/mysql/models/user.model';
import { UserInfo } from './constants/interfaces';
import jsonwebtoken from 'jsonwebtoken';
import ENV from './constants/env';

export function convertStringToNumber(string?: string) {
  if (string) return parseFloat(string);
  else return 0;
}

export function getFilesizeInBytes(filename: string) {
  try {
    const stats = fs.statSync(filename);
    const fileSizeInBytes = stats['size'];
    return fileSizeInBytes / 1000000;
  } catch (err) {
    return 0;
  }
}

/** ================================================================================== */
export function getToken(user: User) {
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
export function comparePassword(loginPass: string, userEncodedPass: string) {
  const Crypto = require('cryptojs').Crypto;
  const dencodedPass = Crypto.AES.decrypt(userEncodedPass, ENV.CRYPTO_SECRET);
  if (dencodedPass === loginPass) return true;
  else return false;
}
