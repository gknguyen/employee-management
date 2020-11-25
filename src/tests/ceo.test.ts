import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import STATUS_CODE from 'http-status';
import { HTTP } from '../app/server';
import CONSTANTS from '../configs/constants/constants';
import MYSQL from '../main/database/mysql/mysql.service';

const TEST_VAR = 'mocha test';
const TEST_VAR_2 = 'mocha test 2';

let TOKEN: string;

chai.use(chaiHttp);

describe('ceo APIs', () => {
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

  describe('/api/ceo/createCEO', () => {
    describe('happy cases', () => {
      it('create successfully', (done) => {
        const data = {
          ceoName: TEST_VAR,
        };
        chai
          .request(HTTP)
          .post('/api/ceo/createCEO')
          .set('token', TOKEN)
          .send(data)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.OK);
            assert.equal(typeof res.body, 'object');
            done();
          });
      });
    });

    describe('unhappy cases : missing input', () => {
      it('ceoName = empty string', (done) => {
        const data = {
          ceoName: '',
        };
        chai
          .request(HTTP)
          .post('/api/ceo/createCEO')
          .set('token', TOKEN)
          .send(data)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.text, 'input required');
            done();
          });
      });
      it('ceoName = null', (done) => {
        const data = {
          ceoName: null,
        };
        chai
          .request(HTTP)
          .post('/api/ceo/createCEO')
          .set('token', TOKEN)
          .send(data)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.text, 'input required');
            done();
          });
      });
      it('ceoName = undefined', (done) => {
        const data = {
          ceoName: undefined,
        };
        chai
          .request(HTTP)
          .post('/api/ceo/createCEO')
          .set('token', TOKEN)
          .send(data)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.text, 'input required');
            done();
          });
      });
    });
  });

  describe('/api/ceo/getCEO', () => {
    let testId: number | null | undefined;

    before(async () => {
      const ceo = await MYSQL.ceo.findOne({ where: { name: TEST_VAR } });
      if (ceo) testId = ceo.id;
    });

    describe('happy cases', () => {
      it('get successfully', (done) => {
        chai
          .request(HTTP)
          .get('/api/ceo/getCEO?ceoId=' + testId)
          .set('token', TOKEN)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.OK);
            assert.equal(typeof res.body, 'object');
            done();
          });
      });
    });

    describe('unhappy cases : missing input', () => {
      it('ceoId = null', (done) => {
        chai
          .request(HTTP)
          .get('/api/ceo/getCEO?ceoId=')
          .set('token', TOKEN)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.text, 'input required');
            done();
          });
      });
      it('ceoId = undefined', (done) => {
        chai
          .request(HTTP)
          .get('/api/ceo/getCEO')
          .set('token', TOKEN)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.text, 'input required');
            done();
          });
      });
    });
  });

  describe('edit 1 ceo', () => {
    let testId: number | null | undefined;

    before(async () => {
      const ceo = await MYSQL.ceo.findOne({ where: { name: TEST_VAR } });
      if (ceo) testId = ceo.id;
    });

    describe('happy cases', () => {
      it('edit successfully', (done) => {
        const data = {
          ceoName: TEST_VAR_2,
        };
        chai
          .request(HTTP)
          .put('/api/ceo/editCEO?ceoId=' + testId)
          .set('token', TOKEN)
          .send(data)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.OK);
            assert.equal(res.text, CONSTANTS.CURRENT_TIME);
            done();
          });
      });
    });

    describe('unhappy cases : missing input', () => {
      it('ceoId = null', (done) => {
        const data = {
          ceoName: TEST_VAR_2,
        };
        chai
          .request(HTTP)
          .put('/api/ceo/editCEO?ceoId=')
          .set('token', TOKEN)
          .send(data)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.text, 'input required');
            done();
          });
      });
      it('ceoId = undefined', (done) => {
        const data = {
          ceoName: TEST_VAR_2,
        };
        chai
          .request(HTTP)
          .put('/api/ceo/editCEO')
          .set('token', TOKEN)
          .send(data)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.text, 'input required');
            done();
          });
      });

      it('ceoName = empty string', (done) => {
        const data = {
          ceoName: '',
        };
        chai
          .request(HTTP)
          .put('/api/ceo/editCEO?ceoId=' + testId)
          .set('token', TOKEN)
          .send(data)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.text, 'input required');
            done();
          });
      });
      it('ceoName = null', (done) => {
        const data = {
          ceoName: null,
        };
        chai
          .request(HTTP)
          .put('/api/ceo/editCEO?ceoId=' + testId)
          .set('token', TOKEN)
          .send(data)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.text, 'input required');
            done();
          });
      });
      it('ceoName = undefined', (done) => {
        const data = {
          ceoName: undefined,
        };
        chai
          .request(HTTP)
          .put('/api/ceo/editCEO?ceoId=' + testId)
          .set('token', TOKEN)
          .send(data)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.text, 'input required');
            done();
          });
      });
    });

    describe('unhappy cases : failed', () => {
      it('ceoName = undefined', (done) => {
        const data = {
          ceoName: TEST_VAR_2,
        };
        chai
          .request(HTTP)
          .put('/api/ceo/editCEO?ceoId=12323536546')
          .set('token', TOKEN)
          .send(data)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.EXPECTATION_FAILED);
            assert.equal(res.text, 'edit failed');
            done();
          });
      });
    });
  });

  describe('/api/ceo/deleteCEO', () => {
    let testId: number | null | undefined;

    before(async () => {
      const ceo = await MYSQL.ceo.findOne({ where: { name: TEST_VAR_2 } });
      if (ceo) testId = ceo.id;
    });

    describe('happy cases', () => {
      it('delete successfully', (done) => {
        chai
          .request(HTTP)
          .delete('/api/ceo/deleteCEO?ceoId=' + testId)
          .set('token', TOKEN)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.OK);
            assert.equal(res.text, CONSTANTS.CURRENT_TIME);
            done();
          });
      });
    });

    describe('unhappy cases : missing input', () => {
      it('ceoId = null', (done) => {
        chai
          .request(HTTP)
          .delete('/api/ceo/deleteCEO?ceoId=')
          .set('token', TOKEN)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.text, 'input required');
            done();
          });
      });
      it('ceoId = undefined', (done) => {
        chai
          .request(HTTP)
          .delete('/api/ceo/deleteCEO')
          .set('token', TOKEN)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.text, 'input required');
            done();
          });
      });
    });

    describe('unhappy cases : failed', () => {
      it('invalid ceoId', (done) => {
        chai
          .request(HTTP)
          .delete('/api/ceo/deleteCEO?ceoId=1000')
          .set('token', TOKEN)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.EXPECTATION_FAILED);
            assert.equal(res.text, 'delete failed');
            done();
          });
      });
    });
  });
});
