import CEOModel from './model/ceo.model';
import DepartmentModel from './model/department.model';
import MemberModel from './model/member.model';
import TeamMemberModel from './model/team.member.model';
import TeamModel from './model/team.model';
import UserRoleModel from './model/user.role.model';
import UserModel from './model/user.model';

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
