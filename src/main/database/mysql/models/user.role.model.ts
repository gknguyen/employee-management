import { DataTypes, Model } from 'sequelize';
import mysql from '../mysql.auth';
import { User } from './user.model';

export interface UserRole extends Model {
  readonly id: number;
  role: string;
  userList: User[];
}

const UserRoleModel = mysql.define<UserRole>(
  'user_role',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
  },
);

export default UserRoleModel;
