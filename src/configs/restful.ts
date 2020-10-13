import { Model, BuildOptions, Op } from 'sequelize';

export interface Restful {
  generateTable(): any;

  findOne(condition: any): any;
  findMany(condition: any): any;

  createOne(data: any, condition: any): any;
  createMany(data: any, condition: any): any;
}

type AnyModel = typeof Model & {
  new (values?: object, options?: BuildOptions): any;
};

class RestService implements Restful {
  model: AnyModel;

  constructor(model: AnyModel) {
    this.model = model;
  }

  /** ================================================================================== */
  /**
  init table
  */
  generateTable() {
    return this.model.getTableName();
  }

  /** ================================================================================== */
  /**
  get API
  */
  findOne(condition: any) {
    return this.model.findOne({ ...condition });
  }
  findMany(condition: any) {
    return this.model.findAll({ ...condition });
  }
  findManyAndCount(condition: any) {
    return this.model.findAndCountAll({ ...condition });
  }

  /** ================================================================================== */
  /**
  post API
  */
  createOne(data: any, condition: any) {
    return this.model.create({ ...data }, { ...condition });
  }
  createMany(data: any[], condition: any) {
    return this.model.bulkCreate([...data], { ...condition });
  }
}

export default RestService;
