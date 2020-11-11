import RestService, { Restful } from '../../../../configs/restful';
import CEOModel from './ceo.model';

export default class CEOService implements Restful {
  private restService: RestService;

  constructor() {
    this.restService = new RestService(CEOModel);
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
  public findManyAndCount(condition: any) {
    return this.restService.findManyAndCount(condition);
  }

  /** post */
  public createOne(data: any, condition: any) {
    return this.restService.createOne(data, condition);
  }
  public createMany(data: any[], condition: any) {
    return this.restService.createMany(data, condition);
  }
}
