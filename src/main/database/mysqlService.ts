import CEOService from './mysql/ceo/ceo.services';
import DepartmentService from './mysql/department/department.services';
import MemberService from './mysql/member/member.services';
import TeamMemberService from './mysql/team.member/team.member.services';
import TeamService from './mysql/team/team.services';
import UserService from './mysql/user/user.services';

class MYSQLService {
  public ceoService = new CEOService();
  public departmentService = new DepartmentService();
  public memberService = new MemberService();
  public teamService = new TeamService();
  public teamMemberService = new TeamMemberService();
  public userService = new UserService();
}

const MYSQL = new MYSQLService();

export default MYSQL;
