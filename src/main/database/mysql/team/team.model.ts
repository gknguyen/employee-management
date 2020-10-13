import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../../../../configs/sequelize';
import DepartmentModel from '../department/department.model';

export interface Team extends Model {
  readonly id: number;
  departmentId: number;
  project: string;
}

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Team;
};

const TeamModel = sequelize.define(
  'team',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      references: {
        model: DepartmentModel,
        key: 'id',
      },
    },
    project: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
) as ModelStatic;

/*
association with Department table
*/
DepartmentModel.hasMany(TeamModel, {
  sourceKey: 'id',
  foreignKey: 'departmentId',
  as: 'teams',
});

TeamModel.belongsTo(DepartmentModel, {
  targetKey: 'id',
  foreignKey: 'departmentId',
  as: 'department',
  onDelete: 'CASCADE',
});

export default TeamModel;
