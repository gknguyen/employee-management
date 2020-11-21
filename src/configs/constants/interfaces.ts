import { Transaction } from 'sequelize';

export interface HTTPdata {
  code: number;
  message: string;
  data: any;
  transaction?: Transaction;
}

export interface UserInfo {
  id: number;
  username: string;
  role: string;
}
