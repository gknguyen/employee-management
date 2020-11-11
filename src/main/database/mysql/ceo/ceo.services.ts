import { Restful } from '../../../../configs/restful';
import { AnyModel } from '../../../../configs/sequelize';
import CEOModel from './ceo.model';

class CEOService implements Restful {
  model: AnyModel;

  constructor() {
    this.model = CEOModel;
  }

  /** table name */
  public generateTable() {
    return this.model.getTableName();
  }

  /** get */
  public findOne(condition: object) {
    return this.model.findOne({ ...condition });
  }
  public findMany(condition: object) {
    return this.model.findAll({ ...condition });
  }

  /** post */
  public createOne(data: object, condition: object) {
    return this.model.create({ ...data }, { ...condition });
  }
  public createMany(data: object[], condition: object) {
    return this.model.bulkCreate([...data], { ...condition });
  }

  /** get or post */
  public async findOrCreate(condition: object) {
    return this.model.findOrCreate({ ...condition });
  }
}

const ceoService = new CEOService();

export default ceoService;
