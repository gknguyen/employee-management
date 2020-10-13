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
  /* ============================================================================================================================ */
  createCEO = async () => {
    const results = {
      code: 0,
      message: '',
      data: null,
    } as HTTPdata;

    try {
      const ceo = (await ceoService.createOne(
        {
          name: faker.name.firstName(),
        },
        null,
      )) as CEO;

      /** department */
      for (let i = 0; i < CREATE_NUM; i++) {
        const department = (await departmentService.createOne(
          {
            ceoId: ceo.id,
            manager: faker.name.firstName(),
          },
          null,
        )) as Department;

        /** team */
        for (let i = 0; i < CREATE_NUM; i++) {
          teamService.createOne(
            {
              departmentId: department.id,
              project: faker.commerce.productName(),
            },
            null,
          );
        }
      }

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

  /* ============================================================================================================================ */
  createMembers = async () => {
    const results = {
      code: 0,
      message: '',
      data: null,
    } as HTTPdata;

    try {
      let no = 1;
      const member = await memberService.createMany(
        times(CREATE_NUM, () => ({
          id: no++,
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

  /* ============================================================================================================================ */
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

      for (const team of teams) {
        for (const member of members) {
          teamMemberService.createOne(
            {
              teamId: team.id,
              memberId: member.id,
            },
            null,
          );
        }
      }

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
