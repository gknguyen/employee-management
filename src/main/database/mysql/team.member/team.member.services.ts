import RestService, { Restful } from '../../../../configs/restful';
import TeamMemberModel from './team.member.model';

class TeamMemberService implements Restful {
  private restService: RestService;

  constructor() {
    this.restService = new RestService(TeamMemberModel);
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

const teamMemberService = new TeamMemberService();

export default teamMemberService;
