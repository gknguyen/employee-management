import moment, { utc } from 'moment-timezone';
import { HTTPdata } from './interfaces';

const CONSTANTS = {
  CURRENT_TIME: moment(utc()).format('YYYY-MM-DD hh:mm:ss'),
  RESULT: {
    code: 0,
    message: '',
    data: null,
    transaction: undefined,
  } as HTTPdata,
};

export default CONSTANTS;
