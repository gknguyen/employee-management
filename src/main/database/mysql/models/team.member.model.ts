import { DataTypes, Model } from 'sequelize';
import mysql from '../mysql.auth';
import MemberModel from './member.model';
import TeamModel from './team.model';

export interface TeamMember extends Model {
  readonly id: number;
  teamId: number;
  memberId: number;
}

const TeamMemberModel = mysql.define<TeamMember>(
  'team_member',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    teamId: {
      type: DataTypes.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: TeamModel,
        key: 'id',
      },
    },
    memberId: {
      type: DataTypes.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: MemberModel,
        key: 'id',
      },
    },
  },
  {
    timestamps: false,
  },
);

/*
association with Team table
*/
TeamModel.hasMany(TeamMemberModel, {
  sourceKey: 'id',
  foreignKey: 'teamId',
  as: 'teamMembers',
});

TeamMemberModel.belongsTo(TeamModel, {
  targetKey: 'id',
  foreignKey: 'teamId',
  as: 'team',
});

/*
association with Member table
*/
MemberModel.hasMany(TeamMemberModel, {
  sourceKey: 'id',
  foreignKey: 'memberId',
  as: 'teamMembers',
});

TeamMemberModel.belongsTo(MemberModel, {
  targetKey: 'id',
  foreignKey: 'memberId',
  as: 'member',
});

export default TeamMemberModel;
