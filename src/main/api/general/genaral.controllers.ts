import STATUS_CODE from 'http-status';
import { HTTPdata } from '../../../configs/interfaces';
import ceoService from '../../database/mysql/ceo/ceo.services';
import DepartmentModel from '../../database/mysql/department/department.model';
import MemberModel from '../../database/mysql/member/member.model';
import TeamMemberModel from '../../database/mysql/team.member/team.member.model';
import TeamModel from '../../database/mysql/team/team.model';

class GeneralController {
  /* ============================================================================================================================ */
  getList = async () => {
    const results = {
      code: 0,
      message: '',
      data: null,
    } as HTTPdata;

    try {
      const data = await ceoService.findManyAndCount({
        attributes: ['name'],
        limit: 1500,
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
                attributes: ['departmentId', 'project'],
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
                        required: true,
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

      if (data.rows && data.rows.length > 0) {
        results.code = STATUS_CODE.OK;
        results.message = 'successfully';
        results.data = {
          number: data.count,
          ceos: data.rows,
        };
        return results;
      } else {
        results.code = STATUS_CODE.OK;
        results.message = 'no result';
        results.data = [];
        return results;
      }
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.data = err;
      return results;
    }
  };
}

const generalController = new GeneralController();

export default generalController;
