import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import CONSTANTS from '../../configs/constants/constants';
import errorHandler from '../../configs/errorHandler/errorHandler';
import DepartmentModel from '../database/mysql/models/department.model';
import MemberModel from '../database/mysql/models/member.model';
import TeamMemberModel, { TeamMember } from '../database/mysql/models/team.member.model';
import TeamModel, { Team } from '../database/mysql/models/team.model';
import MYSQL from '../database/mysql/mysql.service';

const genaralRouter = Router();

/** GET APIs */
genaralRouter.get('/getMembersInTreeModel', getMembersInTreeModel());
genaralRouter.get('/getLimit1500Members', getLimit1500Members());

export default genaralRouter;

/** ================================================================================== */
/**
 * functions
 * */

function getMembersInTreeModel(endHere = true) {
  const result = { ...CONSTANTS.RESULT };
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      /** call query to get record list */
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

      /** send response to client-side (FE)
       * or continues the execution */
      if (data.rows && data.rows.length > 0) {
        if (endHere) res.status(STATUS_CODE.OK).send(data.rows);
        else next();
      } else {
        result.code = STATUS_CODE.EXPECTATION_FAILED;
        result.message = 'no result';
        throw result;
      }
    },
  );
}

function getLimit1500Members(endHere = true) {
  const result = { ...CONSTANTS.RESULT };
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      let memberNumber = 0;

      /** get ceo */
      const ceo = await MYSQL.ceo.findOne({
        attributes: ['id', 'name'],
      });

      if (ceo) {
        /** get the list of department manager */
        const departmentList = await MYSQL.department.findAll({
          attributes: ['id', 'manager'],
          where: { ceoId: ceo.id },
        });

        if (departmentList && departmentList.length > 0) {
          /** get the list of team for each department manager */
          let teamList: Team[] = [];
          for (const department of departmentList) {
            if (department) {
              const teams = await MYSQL.team.findAll({
                attributes: ['id', 'project'],
                where: { departmentId: department.id },
              });
              teamList = teamList.concat(teams);
            }
          }

          /** get the list of team member for each team */
          let teamMemberList: TeamMember[] = [];
          for (const team of teamList) {
            if (team) {
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

          /** send response to client-side (FE)
           * or continues the execution */
          if (endHere)
            res
              .status(STATUS_CODE.OK)
              .send({ memberNumber, ceo, departmentList, teamList, teamMemberList });
          else next();
        } else {
          result.code = STATUS_CODE.PRECONDITION_FAILED;
          result.message = 'departmentlist of ceo not found';
          throw result;
        }
      } else {
        result.code = STATUS_CODE.PRECONDITION_FAILED;
        result.message = 'ceo not found';
        throw result;
      }
    },
  );
}
