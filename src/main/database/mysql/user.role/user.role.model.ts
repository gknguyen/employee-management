import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../../../../configs/sequelize';

export interface UserRole extends Model {
  readonly id: number;
  role: string;
}

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserRole;
};

const UserRoleModel = sequelize.define(
  'userRole',
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
) as ModelStatic;

export default UserRoleModel;
