import { DataTypes, Model } from 'sequelize';
import mysql from '../mysql.auth';

export interface CEO extends Model {
  readonly id: number;
  name: string;
}

const CEOModel = mysql.define<CEO>(
  'ceo',
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

export default CEOModel;
