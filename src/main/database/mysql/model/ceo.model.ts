import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../../../../configs/sequelize';

export interface CEO extends Model {
  readonly id: number;
  name: string;
}

const CEOModel = sequelize.define<CEO>(
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
