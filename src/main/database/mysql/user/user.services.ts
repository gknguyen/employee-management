import RestService, { Restful } from '../../../../configs/restful';
import UserModel, { User } from './user.model';

class UserService implements Restful {
  private restService: RestService;

  constructor() {
    this.restService = new RestService(UserModel);
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

  /** init */
  async init(username: string, password: string) {
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

const userService = new UserService();

export default userService;
