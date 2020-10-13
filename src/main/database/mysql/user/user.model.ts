import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../../../../configs/sequelize';

export interface User extends Model {
  readonly id: number;
  username: string;
  password: string;
  authToken: string;
}

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): User;
};

const UserModel = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
) as ModelStatic;

export default UserModel;
