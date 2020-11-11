import RestService, { Restful } from '../../../../configs/restful';
import TeamModel from './team.model';

export default class TeamService implements Restful {
  private restService: RestService;

  constructor() {
    this.restService = new RestService(TeamModel);
  }

  /** table name */
  public generateTable() {
    return this.restService.generateTable();
  }

  /** get */
  public findOne(condition: any) {
    return this.restService.findOne(condition);
  }
  public findMany(condition: any) {
    return this.restService.findMany(condition);
  }

  /** post */
  public createOne(data: any, condition: any) {
    return this.restService.createOne(data, condition);
  }
  public createMany(data: any[], condition: any) {
    return this.restService.createMany(data, condition);
  }
}
