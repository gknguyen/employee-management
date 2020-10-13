import RestService, { Restful } from '../../../../configs/restful';
import CEOModel from './ceo.model';

class CEOService implements Restful {
  private restService: RestService;

  constructor() {
    this.restService = new RestService(CEOModel);
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
  findManyAndCount(condition: any) {
    return this.restService.findManyAndCount(condition);
  }

  /** post */
  createOne(data: any, condition: any) {
    return this.restService.createOne(data, condition);
  }
  createMany(data: any[], condition: any) {
    return this.restService.createMany(data, condition);
  }
}

const ceoService = new CEOService();

export default ceoService;
