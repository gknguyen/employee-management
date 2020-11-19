import faker from 'faker';
import STATUS_CODE from 'http-status';
import times from 'lodash.times';
import { HTTPdata } from '../../../configs/constants/interfaces';
import { Department } from '../../database/mysql/model/department.model';
import MYSQL from '../../database/mysql/mysqlService';

class CommonController {
  /** ================================================================================== */
  public createCEO = async (
    numberOfDepartment?: number | null,
    numberOfTeamPerDepartment?: number | null,
    numberOfMember?: number | null,
  ) => {
    const result = {
      code: 0,
      message: '',
      data: null,
    } as HTTPdata;

    /** check input */
    if (!numberOfDepartment) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      result.message = 'please input numberOfDepartment';
      return result;
    }
    if (!numberOfTeamPerDepartment) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      result.message = 'please input numberOfTeamPerDepartment';
      return result;
    }
    if (!numberOfMember) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      result.message = 'please input numberOfTeamPerDepartment';
      return result;
    }

    try {
      const promises: any[] = [];

      /** ceo */
      const ceo = await MYSQL.ceo.create({
        name: faker.name.firstName(),
      });

      /** department */
      for (let i = 0; i < numberOfDepartment; i++) {
        const department = (await MYSQL.department.create({
          ceoId: ceo.id,
          manager: faker.name.firstName(),
        })) as Department;

        /** team */
        for (let i = 0; i < numberOfTeamPerDepartment; i++) {
          promises.push(
            MYSQL.team.create({
              departmentId: department.id,
              project: faker.commerce.productName(),
            }),
          );
        }
      }

      await Promise.all(promises);

      /** return result */
      result.code = STATUS_CODE.OK;
      result.message = 'successfully';
      result.data = ceo;
      return result;
    } catch (err) {
      result.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      result.message = err.toString();
      result.data = err;
      return result;
    }
  };

  /** ================================================================================== */
  public createMembers = async (numberOfMember: number) => {
    const result = {
      code: 0,
      message: '',
      data: null,
    } as HTTPdata;

    try {
      const member = await MYSQL.member.bulkCreate(
        times(numberOfMember, () => ({
          name: faker.name.firstName(),
        })),
      );

      /** return result */
      result.code = STATUS_CODE.OK;
      result.message = 'successfully';
      result.data = member;
      return result;
    } catch (err) {
      result.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      result.message = err.toString();
      result.data = err;
      return result;
    }
  };

  /** ================================================================================== */
  public createTeamMembers = async () => {
    const result = {
      code: 0,
      message: '',
      data: null,
    } as HTTPdata;

    try {
      const teams = await MYSQL.team.findAll({
        attributes: ['id'],
      });

      const members = await MYSQL.member.findAll({
        attributes: ['id'],
      });

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

      MYSQL.teamMember.bulkCreate(dataList);

      /** return result */
      result.code = STATUS_CODE.OK;
      result.message = 'successfully';
      return result;
    } catch (err) {
      result.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      result.message = err.toString();
      result.data = err;
      return result;
    }
  };
}

const commonController = new CommonController();

export default commonController;
