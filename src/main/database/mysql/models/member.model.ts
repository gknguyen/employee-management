import { DataTypes, Model } from 'sequelize';
import mysql from '../mysql.auth';

export interface Member extends Model {
  readonly id: number;
  name: string;
}

const MemberModel = mysql.define<Member>(
  'member',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

export default MemberModel;
