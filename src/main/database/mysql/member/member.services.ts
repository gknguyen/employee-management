import RestService, { Restful } from '../../../../configs/restful';
import MemberModel from './member.model';

class MemberService implements Restful {
  private restService: RestService;

  constructor() {
    this.restService = new RestService(MemberModel);
  }

  /** table name */
  generateTable() {
    return this.restService.generateTable();
  }

  /** get */
  findOne(condition: any) {
    return this.restService.findOne(condition);
  }
  findMany(condition: any) {
    return this.restService.findMany(condition);
  }

  /** post */
  createOne(data: any, condition: any) {
    return this.restService.createOne(data, condition);
  }
  createMany(data: any[], condition: any) {
    return this.restService.createMany(data, condition);
  }
}

const memberService = new MemberService();

export default memberService;
