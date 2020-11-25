import { DataTypes, Model } from 'sequelize';
import mysql from '../mysql.auth';
import DepartmentModel from './department.model';

export interface Team extends Model {
  readonly id: number;
  departmentId: number;
  project: string;
}

const TeamModel = mysql.define<Team>(
  'team',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
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
);

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
});

export default TeamModel;
