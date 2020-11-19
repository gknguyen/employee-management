import STATUS_CODE from 'http-status';
import { RESULT } from '../../../configs/constants/variables';
import MYSQL from '../../database/mysql/mysqlService';

class CEOController {
  /** ================================================================================== */
  public createCEO = async (ceoName?: string | null) => {
    const result = { ...RESULT };

    /** check inputs */
    if (!ceoName) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      result.message = 'please input ceo name';
      return result;
    }

    try {
      /** call query to create record */
      const ceo = await MYSQL.ceo.create({ name: ceoName });

      /** return result */
      result.code = STATUS_CODE.OK;
      result.message = 'create successfully';
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
  public getCEO = async (ceoName?: string | null) => {
    const result = { ...RESULT };

    /** check inputs */
    if (!ceoName) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      result.message = 'please input ceo name';
      return result;
    }

    try {
      /** call query to get record */
      const ceo = await MYSQL.ceo.findOne({ where: { name: ceoName } });

      /** return result */
      if (ceo) {
        result.code = STATUS_CODE.OK;
        result.message = 'get successfully';
        result.data = ceo;
        return result;
      } else {
        result.code = STATUS_CODE.EXPECTATION_FAILED;
        result.message = 'no result';
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
  public editCEO = async (ceoId?: number | null, ceoName?: string | null) => {
    const result = { ...RESULT };

    /** check inputs */
    if (!ceoId) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      result.message = 'please input ceo id';
      return result;
    }
    if (!ceoName) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      result.message = 'please input ceo name';
      return result;
    }

    try {
      /** call query to edit record */
      const ceo = await MYSQL.ceo.update({ name: ceoName }, { where: { id: ceoId } });

      /** return result */
      if (ceo[0]) {
        result.code = STATUS_CODE.OK;
        result.message = 'edit successfully';
        return result;
      } else {
        result.code = STATUS_CODE.EXPECTATION_FAILED;
        result.message = 'edit failed';
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
  public deleteCEO = async (ceoId?: number | null) => {
    const result = { ...RESULT };

    /** check inputs */
    if (!ceoId) {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      result.message = 'please input ceo id';
      return result;
    }

    try {
      /** call query to delete record */
      const ceo = await MYSQL.ceo.destroy({ where: { id: ceoId } });

      /** return result */
      if (ceo) {
        result.code = STATUS_CODE.OK;
        result.message = 'delete successfully';
        return result;
      } else {
        result.code = STATUS_CODE.EXPECTATION_FAILED;
        result.message = 'delete failed';
        return result;
      }
    } catch (err) {
      result.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      result.message = err.toString();
      result.data = err;
      return result;
    }
  };
}

const ceoController = new CEOController();

export default ceoController;
