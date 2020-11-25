import { DataTypes, Model } from 'sequelize';
import mysql from '../mysql.auth';
import UserRoleModel, { UserRole } from './user.role.model';

export interface User extends Model {
  readonly id: number;
  username: string;
  password: string;
  authToken: string;
  userRole: UserRole;
}

const UserModel = mysql.define<User>(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userRoleId: {
      type: DataTypes.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      references: {
        model: UserRoleModel,
        key: 'id',
      },
    },
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    authToken: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
  },
);

/** association with user role table */
UserRoleModel.hasMany(UserModel, {
  sourceKey: 'id',
  foreignKey: 'userRoleId',
  as: 'userList',
});
UserModel.belongsTo(UserRoleModel, {
  targetKey: 'id',
  foreignKey: 'userRoleId',
  as: 'userRole',
});

export default UserModel;
