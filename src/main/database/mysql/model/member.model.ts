import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../../../../configs/sequelize';

export interface Member extends Model {
  readonly id: number;
  name: string;
}

const MemberModel = sequelize.define<Member>(
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
