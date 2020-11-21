import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import STATUS_CODE from 'http-status';
import { HTTP } from '../app/server';
import CONSTANTS from '../configs/constants/constants';

let TOKEN: string;

chai.use(chaiHttp);

describe('general APIs', () => {
  before((done) => {
    const loginUser = {
      username: 'admin',
      password: 'admin',
    };
    chai
      .request(HTTP)
      .post('/api/auth/login')
      .send(loginUser)
      .end(async (err, res) => {
        if (err) console.log(err);
        assert.equal(res.status, STATUS_CODE.OK);
        assert.equal(typeof res.body, 'object');
        assert.equal(typeof res.body.token, 'string');
        TOKEN = await res.body.token;
        done();
      });
  });

  before((done) => {
    const data = {
      numberOfDepartment: 2,
      numberOfTeamPerDepartment: 2,
      numberOfMember: 5,
    };
    chai
      .request(HTTP)
      .post('/api/common/createDumpData')
      .set('token', TOKEN)
      .send(data)
      .end((err, res) => {
        if (err) console.log(err);
        assert.equal(res.status, STATUS_CODE.OK);
        assert.equal(res.text, CONSTANTS.CURRENT_TIME);
        done();
      });
  });

  describe('/api/general/getMembersInTreeModel', () => {
    describe('happy cases', () => {
      it('ok', (done) => {
        chai
          .request(HTTP)
          .get('/api/general/getMembersInTreeModel')
          .set('token', TOKEN)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.OK);
            assert.equal(typeof res.body, 'object');
            done();
          });
      });
    });
  });

  describe('/api/general/getLimit1500Members', () => {
    describe('happy cases', () => {
      it('ok', (done) => {
        chai
          .request(HTTP)
          .get('/api/general/getLimit1500Members')
          .set('token', TOKEN)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.OK);
            assert.equal(typeof res.body, 'object');
            done();
          });
      });
    });
  });
});
