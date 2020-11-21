import CEOModel from './models/ceo.model';
import DepartmentModel from './models/department.model';
import MemberModel from './models/member.model';
import TeamMemberModel from './models/team.member.model';
import TeamModel from './models/team.model';
import UserRoleModel from './models/user.role.model';
import UserModel from './models/user.model';

class MYSQLService {
  public ceo = CEOModel;
  public department = DepartmentModel;
  public member = MemberModel;
  public team = TeamModel;
  public teamMember = TeamMemberModel;

  public user = UserModel;
  public userRole = UserRoleModel;
}

const MYSQL = new MYSQLService();

export default MYSQL;
