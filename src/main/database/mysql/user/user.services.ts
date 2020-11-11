import RestService, { Restful } from '../../../../configs/restful';
import UserModel, { User } from './user.model';

export default class UserService implements Restful {
  private restService: RestService;

  constructor() {
    this.restService = new RestService(UserModel);
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

  /** init */
  public async init(username: string, password: string) {
    let user = (await this.restService.findOne({
      where: { username: username },
    })) as User;

    if (!user) {
      user = (await this.restService.createOne(
        {
          username: username,
          password: password,
        },
        null,
      )) as User;
    }

    return user;
  }
}
