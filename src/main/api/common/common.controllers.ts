import faker from 'faker';
import STATUS_CODE from 'http-status';
import times from 'lodash.times';
import { CREATE_NUM } from '../../../configs/env';
import { HTTPdata } from '../../../configs/interfaces';
import { CEO } from '../../database/mysql/ceo/ceo.model';
import ceoService from '../../database/mysql/ceo/ceo.services';
import { Department } from '../../database/mysql/department/department.model';
import departmentService from '../../database/mysql/department/department.services';
import { Member } from '../../database/mysql/member/member.model';
import memberService from '../../database/mysql/member/member.services';
import teamMemberService from '../../database/mysql/team.member/team.member.services';
import { Team } from '../../database/mysql/team/team.model';
import teamService from '../../database/mysql/team/team.services';

class CommonController {
  /** ================================================================================== */
  createCEO = async (
    numberOfDepartment: number | null | undefined,
    numberOfTeamPerDepartment: number | null | undefined,
    numberOfMember: number | null | undefined,
  ) => {
    const results = {
      code: 0,
      message: '',
      data: null,
    } as HTTPdata;

    try {
      /** check input */
      if (!numberOfDepartment) {
        results.code = STATUS_CODE.PRECONDITION_FAILED;
        results.message = 'please input numberOfDepartment';
        return results;
      }
      if (!numberOfTeamPerDepartment) {
        results.code = STATUS_CODE.PRECONDITION_FAILED;
        results.message = 'please input numberOfTeamPerDepartment';
        return results;
      }
      if (!numberOfMember) {
        results.code = STATUS_CODE.PRECONDITION_FAILED;
        results.message = 'please input numberOfTeamPerDepartment';
        return results;
      }

      const promises: any[] = [];

      /** ceo */
      const ceo = (await ceoService.createOne(
        {
          name: faker.name.firstName(),
        },
        null,
      )) as CEO;

      /** department */
      for (let i = 0; i < numberOfDepartment; i++) {
        const department = (await departmentService.createOne(
          {
            ceoId: ceo.id,
            manager: faker.name.firstName(),
          },
          null,
        )) as Department;

        /** team */
        for (let i = 0; i < numberOfTeamPerDepartment; i++) {
          promises.push(
            teamService.createOne(
              {
                departmentId: department.id,
                project: faker.commerce.productName(),
              },
              null,
            ),
          );
        }
      }

      await Promise.all(promises);

      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      results.data = ceo;
      return results;
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.data = err;
      return results;
    }
  };

  /** ================================================================================== */
  createMembers = async (numberOfMember: number) => {
    const results = {
      code: 0,
      message: '',
      data: null,
    } as HTTPdata;

    try {
      const member = await memberService.createMany(
        times(numberOfMember, () => ({
          name: faker.name.firstName(),
        })),
        null,
      );

      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      results.data = member;
      return results;
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.data = err;
      return results;
    }
  };

  /** ================================================================================== */
  createTeamMembers = async () => {
    const results = {
      code: 0,
      message: '',
      data: null,
    } as HTTPdata;

    try {
      const teams = (await teamService.findMany({
        attributes: ['id'],
      })) as Team[];

      const members = (await memberService.findMany({
        attributes: ['id'],
      })) as Member[];

      const dataList: any[] = [];
      for (const team of teams) {
        for (const member of members) {
          const data = {
            teamId: team.id,
            memberId: member.id,
          };
          dataList.push(data);
        }
      }

      teamMemberService.createMany(dataList, null);

      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      return results;
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.data = err;
      return results;
    }
  };
}

const commonController = new CommonController();

export default commonController;
