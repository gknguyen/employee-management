import STATUS_CODE from 'http-status';
import { HTTPdata } from '../../../configs/constants/interfaces';
import DepartmentModel from '../../database/mysql/model/department.model';
import MemberModel from '../../database/mysql/model/member.model';
import TeamMemberModel, { TeamMember } from '../../database/mysql/model/team.member.model';
import TeamModel, { Team } from '../../database/mysql/model/team.model';
import MYSQL from '../../database/mysql/mysqlService';

class GeneralController {
  /** ================================================================================== */
  public getMembersInTreeModel = async () => {
    const result = {
      code: 0,
      message: '',
      data: null,
    } as HTTPdata;

    try {
      /** get data */
      const data = await MYSQL.ceo.findAndCountAll({
        attributes: ['name'],
        include: [
          {
            model: DepartmentModel,
            as: 'departments',
            required: true,
            attributes: ['manager'],
            include: [
              {
                model: TeamModel,
                as: 'teams',
                required: true,
                attributes: ['project'],
                include: [
                  {
                    model: TeamMemberModel,
                    as: 'teamMembers',
                    required: true,
                    attributes: ['id'],
                    include: [
                      {
                        model: MemberModel,
                        as: 'member',
                        attributes: ['name'],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      /** return result */
      if (data.rows && data.rows.length > 0) {
        result.code = STATUS_CODE.OK;
        result.message = 'successfully';
        result.data = {
          number: data.count,
          ceos: data.rows,
        };
        return result;
      } else {
        result.code = STATUS_CODE.EXPECTATION_FAILED;
        result.message = 'no result';
        result.data = [];
        return result;
      }
    } catch (err) {
      result.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      result.message = err.toString();
      result.data = err;
      return result;
    }
  };

  /** ================================================================================== */
  public getLimit1500Members = async () => {
    const result = {
      code: 0,
      message: '',
      data: null,
    } as HTTPdata;

    try {
      let memberNumber = 0;

      /** get ceo */
      const ceo = await MYSQL.ceo.findOne({
        attributes: ['id', 'name'],
      });

      if (!ceo) {
        result.code = STATUS_CODE.PRECONDITION_FAILED;
        result.message = 'ceo not found';
        return result;
      }

      /** get the list of department manager */
      const departmentList = await MYSQL.department.findAll({
        attributes: ['id', 'manager'],
        where: { ceoId: ceo.id },
      });

      /** get the list of team for each department manager */
      let teamList: Team[] = [];
      for (const department of departmentList) {
        const teams = await MYSQL.team.findAll({
          attributes: ['id', 'project'],
          where: { departmentId: department.id },
        });
        teamList = teamList.concat(teams);
      }

      /** get the list of team member for each team */
      let teamMemberList: TeamMember[] = [];
      for (const team of teamList) {
        const teamMembers = await MYSQL.teamMember.findAll({
          attributes: ['id'],
          where: { teamId: team.id },
          include: [
            {
              model: MemberModel,
              as: 'member',
              attributes: ['id', 'name'],
            },
          ],
        });
        teamMemberList = teamMemberList.concat(teamMembers);
      }

      /** calculate total number of members */
      memberNumber += 1;
      memberNumber += departmentList.length;
      memberNumber += teamMemberList.length;

      /** limit to 1500 members */
      if (memberNumber > 1500) {
        teamMemberList.splice(1500 - departmentList.length - 1);
        memberNumber = 0;
        memberNumber += 1;
        memberNumber += departmentList.length;
        memberNumber += teamMemberList.length;
      }

      /** return result */
      result.code = STATUS_CODE.OK;
      result.message = 'successfully';
      result.data = { memberNumber, ceo, departmentList, teamList, teamMemberList };
      return result;
    } catch (err) {
      result.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      result.message = err.toString();
      result.data = err;
      return result;
    }
  };
}

const generalController = new GeneralController();

export default generalController;
