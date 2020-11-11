import { Restful } from '../../../../configs/interfaces';
import { AnyModel } from '../../../../configs/sequelize';
import DepartmentModel from './department.model';

export default class DepartmentService implements Restful {
  model: AnyModel;

  constructor() {
    this.model = DepartmentModel;
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
  public createOne(data: object, condition?: object | null) {
    return this.model.create({ ...data }, { ...condition });
  }
  public createMany(data: object[], condition?: object | null) {
    return this.model.bulkCreate([...data], { ...condition });
  }

  /** get or post */
  public async findOrCreate(condition?: object | null) {
    return this.model.findOrCreate({ ...condition });
  }
}
