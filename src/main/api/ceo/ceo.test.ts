import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import STATUS_CODE from 'http-status';
import { HTTP } from '../../../app/server';
import MYSQL from '../../database/mysql/mysqlService';
import authController from '../auth/auth.controllers';

const TEST_VAR = 'mocha test';
const TEST_VAR_2 = 'mocha test 2';

let TOKEN: string;

chai.use(chaiHttp);

// beforeEach(async () => {
//   const loginUser = {
//     username: 'admin',
//     password: 'admin',
//   };
//   chai
//     .request(HTTP)
//     .post('/auth/login')
//     .send(loginUser)
//     .end(async (err, res) => {
//       console.log('aaaa');

//       assert.equal(res.body.code, STATUS_CODE.OK);
//       assert.equal(typeof res.body.data, 'object');
//       assert.equal(typeof res.body.data.token, 'string');
//       TOKEN = await res.body.data.token;
//     });
// });

before(async () => {
  TOKEN = await (await authController.login('admin', 'admin')).data.token;
});

describe('ceo APIs', () => {
  describe('/ceo/createCEO', () => {
    describe('happy cases', () => {
      it('create successfully', async () => {
        const data = {
          ceoName: TEST_VAR,
        };
        chai
          .request(HTTP)
          .post('/ceo/createCEO')
          .set('token', TOKEN)
          .send(data)
          .end(async (err, res) => {
            assert.equal(res.body.code, STATUS_CODE.OK);
            assert.equal(res.body.message, 'create successfully');
          });
      });
    });

    describe('unhappy cases : missing input', () => {
      it('ceoName = empty string', async () => {
        const data = {
          ceoName: '',
        };
        chai
          .request(HTTP)
          .post('/ceo/createCEO')
          .set('token', TOKEN)
          .send(data)
          .end(async (err, res) => {
            assert.equal(res.body.code, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.body.message, 'please input ceo name');
          });
      });
      it('ceoName = null', async () => {
        const data = {
          ceoName: null,
        };
        chai
          .request(HTTP)
          .post('/ceo/createCEO')
          .set('token', TOKEN)
          .send(data)
          .end(async (err, res) => {
            assert.equal(res.body.code, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.body.message, 'please input ceo name');
          });
      });
      it('ceoName = undefined', async () => {
        const data = {
          ceoName: undefined,
        };
        chai
          .request(HTTP)
          .post('/ceo/createCEO')
          .set('token', TOKEN)
          .send(data)
          .end(async (err, res) => {
            assert.equal(res.body.code, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.body.message, 'please input ceo name');
          });
      });
    });
  });

  describe('/ceo/getCEO', () => {
    let testId: number | null | undefined;

    before(async () => {
      const ceo = await MYSQL.ceo.findOne({ where: { name: TEST_VAR } });
      if (ceo) testId = ceo.id;
    });

    describe('happy cases', () => {
      it('get successfully', async () => {
        chai
          .request(HTTP)
          .get('/ceo/getCEO?ceoId=' + testId)
          .set('token', TOKEN)
          .end((err, res) => {
            assert.equal(res.body.code, STATUS_CODE.OK);
            assert.equal(res.body.message, 'get successfully');
          });
      });
    });

    describe('unhappy cases : missing input', () => {
      it('ceoId = null', async () => {
        chai
          .request(HTTP)
          .get('/ceo/getCEO?ceoId=')
          .set('token', TOKEN)
          .end((err, res) => {
            assert.equal(res.body.code, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.body.message, 'please input ceo id');
          });
      });
      it('ceoId = undefined', async () => {
        chai
          .request(HTTP)
          .get('/ceo/getCEO')
          .set('token', TOKEN)
          .end((err, res) => {
            assert.equal(res.body.code, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.body.message, 'please input ceo id');
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
      it('edit successfully', async () => {
        const data = {
          ceoName: TEST_VAR_2,
        };
        chai
          .request(HTTP)
          .put('/ceo/editCEO?ceoId=' + testId)
          .set('token', TOKEN)
          .send(data)
          .end(async (err, res) => {
            assert.equal(res.body.code, STATUS_CODE.OK);
            assert.equal(res.body.message, 'edit successfully');
          });
      });
    });

    describe('unhappy cases : missing input', () => {
      it('ceoId = null', async () => {
        const data = {
          ceoName: TEST_VAR_2,
        };
        chai
          .request(HTTP)
          .put('/ceo/editCEO?ceoId=')
          .set('token', TOKEN)
          .send(data)
          .end(async (err, res) => {
            assert.equal(res.body.code, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.body.message, 'please input ceo id');
          });
      });
      it('ceoId = undefined', async () => {
        const data = {
          ceoName: TEST_VAR_2,
        };
        chai
          .request(HTTP)
          .put('/ceo/editCEO')
          .set('token', TOKEN)
          .send(data)
          .end(async (err, res) => {
            assert.equal(res.body.code, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.body.message, 'please input ceo id');
          });
      });

      it('ceoName = empty string', async () => {
        const data = {
          ceoName: '',
        };
        chai
          .request(HTTP)
          .put('/ceo/editCEO?ceoId=' + testId)
          .set('token', TOKEN)
          .send(data)
          .end(async (err, res) => {
            assert.equal(res.body.code, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.body.message, 'please input ceo name');
          });
      });
      it('ceoName = null', async () => {
        const data = {
          ceoName: null,
        };
        chai
          .request(HTTP)
          .put('/ceo/editCEO?ceoId=' + testId)
          .set('token', TOKEN)
          .send(data)
          .end(async (err, res) => {
            assert.equal(res.body.code, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.body.message, 'please input ceo name');
          });
      });
      it('ceoName = undefined', async () => {
        const data = {
          ceoName: undefined,
        };
        chai
          .request(HTTP)
          .put('/ceo/editCEO?ceoId=' + testId)
          .set('token', TOKEN)
          .send(data)
          .end(async (err, res) => {
            assert.equal(res.body.code, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.body.message, 'please input ceo name');
          });
      });
    });

    describe('unhappy cases : failed', () => {
      it('ceoName = undefined', async () => {
        const data = {
          ceoName: TEST_VAR_2,
        };
        chai
          .request(HTTP)
          .put('/ceo/editCEO?ceoId=12323536546')
          .set('token', TOKEN)
          .send(data)
          .end(async (err, res) => {
            assert.equal(res.body.code, STATUS_CODE.EXPECTATION_FAILED);
            assert.equal(res.body.message, 'update failed');
          });
      });
    });
  });

  describe('/ceo/deleteCEO', () => {
    let testId: number | null | undefined;

    before(async () => {
      const ceo = await MYSQL.ceo.findOne({ where: { name: TEST_VAR_2 } });
      if (ceo) testId = ceo.id;
    });

    describe('happy cases', () => {
      it('delete successfully', async () => {
        chai
          .request(HTTP)
          .delete('/ceo/deleteCEO?ceoId=' + testId)
          .set('token', TOKEN)
          .end(async (err, res) => {
            console.log(testId);

            assert.equal(res.body.code, STATUS_CODE.OK);
            assert.equal(res.body.message, 'delete successfully');
          });
      });
    });

    describe('unhappy cases : missing input', () => {
      it('ceoId = null', async () => {
        chai
          .request(HTTP)
          .delete('/ceo/deleteCEO?ceoId=')
          .set('token', TOKEN)
          .end(async (err, res) => {
            assert.equal(res.body.code, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.body.message, 'please input ceo id');
          });
      });
      it('ceoId = undefined', async () => {
        chai
          .request(HTTP)
          .delete('/ceo/deleteCEO')
          .set('token', TOKEN)
          .end(async (err, res) => {
            assert.equal(res.body.code, STATUS_CODE.PRECONDITION_FAILED);
            assert.equal(res.body.message, 'please input ceo id');
          });
      });
    });

    describe('unhappy cases : failed', () => {
      it('invalid ceoId', async () => {
        chai
          .request(HTTP)
          .delete('/ceo/deleteCEO?ceoId=1000')
          .set('token', TOKEN)
          .end(async (err, res) => {
            assert.equal(res.body.code, STATUS_CODE.EXPECTATION_FAILED);
            assert.equal(res.body.message, 'delete failed');
          });
      });
    });
  });
});
