import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import STATUS_CODE from 'http-status';
import { HTTP } from '../app/server';

chai.use(chaiHttp);

describe('auth APIs', () => {
  describe('/api/auth/login', () => {
    describe('happy cases', () => {
      it('with admin', (done) => {
        const loginUser = {
          username: 'admin',
          password: 'admin',
        };
        chai
          .request(HTTP)
          .post('/api/auth/login')
          .send(loginUser)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.OK);
            assert.equal(typeof res.body, 'object');
            assert.equal(typeof res.body.token, 'string');
            done();
          });
      });

      it('with user', (done) => {
        const loginUser = {
          username: 'user',
          password: 'user',
        };
        chai
          .request(HTTP)
          .post('/api/auth/login')
          .send(loginUser)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.OK);
            assert.equal(typeof res.body, 'object');
            assert.equal(typeof res.body.token, 'string');
            done();
          });
      });
    });

    describe('unhappy cases : missing input', () => {
      it('missing username', (done) => {
        const loginUser = {
          username: null,
          password: 'admin',
        };
        chai
          .request(HTTP)
          .post('/api/auth/login')
          .send(loginUser)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.UNAUTHORIZED);
            assert.equal(res.text, 'username or password is missing');
            done();
          });
      });
      it('missing password', (done) => {
        const loginUser = {
          username: 'admin',
          password: null,
        };
        chai
          .request(HTTP)
          .post('/api/auth/login')
          .send(loginUser)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.UNAUTHORIZED);
            assert.equal(res.text, 'username or password is missing');
            done();
          });
      });
      it('missing both', (done) => {
        const loginUser = {
          username: null,
          password: null,
        };
        chai
          .request(HTTP)
          .post('/api/auth/login')
          .send(loginUser)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.UNAUTHORIZED);
            assert.equal(res.text, 'username or password is missing');
            done();
          });
      });
    });

    describe('unhappy cases : unauthorized', () => {
      it('user not found', (done) => {
        const loginUser = {
          username: 'asdasdsadasd',
          password: 'admin',
        };
        chai
          .request(HTTP)
          .post('/api/auth/login')
          .send(loginUser)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.UNAUTHORIZED);
            assert.equal(res.text, 'user not found');
            done();
          });
      });
      it('password incorrect', (done) => {
        const loginUser = {
          username: 'admin',
          password: 'asdasdsadasd',
        };
        chai
          .request(HTTP)
          .post('/api/auth/login')
          .send(loginUser)
          .end((err, res) => {
            if (err) console.log(err);
            assert.equal(res.status, STATUS_CODE.UNAUTHORIZED);
            assert.equal(res.text, 'password incorrect');
            done();
          });
      });
    });
  });
});
