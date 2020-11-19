import { assert } from 'chai';
import MYSQL from '../../database/mysql/mysqlService';
import ceoController from './ceo.controllers';

const TEST_VAR = 'mocha test';
const TEST_VAR_2 = 'mocha test 2';

describe('ceo APIs', () => {
  describe('create 1 ceo', () => {
    describe('happy cases', () => {
      it('create successfully', async () => {
        const ceoName = TEST_VAR;
        const result = await ceoController.createCEO(ceoName);
        assert.equal(result.message, 'create successfully');
      });
    });

    describe('unhappy cases : missing input', () => {
      it('ceoName = empty string', async () => {
        const ceoName = '';
        const result = await ceoController.createCEO(ceoName);
        assert.equal(result.message, 'please input ceo name');
      });
      it('ceoName = null', async () => {
        const ceoName = null;
        const result = await ceoController.createCEO(ceoName);
        assert.equal(result.message, 'please input ceo name');
      });
      it('ceoName = undefined', async () => {
        const ceoName = undefined;
        const result = await ceoController.createCEO(ceoName);
        assert.equal(result.message, 'please input ceo name');
      });
    });
  });

  describe('get 1 ceo', () => {
    describe('happy cases', () => {
      it('get successfully', async () => {
        const ceoName = TEST_VAR;
        const result = await ceoController.getCEO(ceoName);
        assert.equal(result.message, 'get successfully');
      });
    });

    describe('unhappy cases : missing input', () => {
      it('ceoName = empty string', async () => {
        const ceoName = '';
        const result = await ceoController.getCEO(ceoName);
        assert.equal(result.message, 'please input ceo name');
      });
      it('ceoName = null', async () => {
        const ceoName = null;
        const result = await ceoController.getCEO(ceoName);
        assert.equal(result.message, 'please input ceo name');
      });
      it('ceoName = undefined', async () => {
        const ceoName = undefined;
        const result = await ceoController.getCEO(ceoName);
        assert.equal(result.message, 'please input ceo name');
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
        const ceoName = TEST_VAR_2;
        const result = await ceoController.editCEO(testId, ceoName);
        assert.equal(result.message, 'edit successfully');
      });
    });

    describe('unhappy cases : missing input', () => {
      it('ceoName = 0', async () => {
        const ceoId = 0;
        const ceoName = TEST_VAR;
        const result = await ceoController.editCEO(ceoId, ceoName);
        assert.equal(result.message, 'please input ceo id');
      });
      it('ceoName = null', async () => {
        const ceoId = null;
        const ceoName = TEST_VAR;
        const result = await ceoController.editCEO(ceoId, ceoName);
        assert.equal(result.message, 'please input ceo id');
      });
      it('ceoName = undefined', async () => {
        const ceoId = undefined;
        const ceoName = TEST_VAR;
        const result = await ceoController.editCEO(ceoId, ceoName);
        assert.equal(result.message, 'please input ceo id');
      });

      it('ceoName = empty string', async () => {
        const ceoId = testId;
        const ceoName = '';
        const result = await ceoController.editCEO(ceoId, ceoName);
        assert.equal(result.message, 'please input ceo name');
      });
      it('ceoName = null', async () => {
        const ceoId = testId;
        const ceoName = null;
        const result = await ceoController.editCEO(ceoId, ceoName);
        assert.equal(result.message, 'please input ceo name');
      });
      it('ceoName = undefined', async () => {
        const ceoId = testId;
        const ceoName = undefined;
        const result = await ceoController.editCEO(ceoId, ceoName);
        assert.equal(result.message, 'please input ceo name');
      });
    });
  });

  describe('delete 1 ceo', () => {
    let testId: number | null | undefined;

    before(async () => {
      const ceo = await MYSQL.ceo.findOne({ where: { name: TEST_VAR_2 } });
      if (ceo) testId = ceo.id;
    });

    describe('happy cases', () => {
      it('delete successfully', async () => {
        const result = await ceoController.deleteCEO(testId);
        assert.equal(result.message, 'delete successfully');
      });
    });

    describe('unhappy cases : missing input', () => {
      it('ceoName = 0', async () => {
        const ceoId = 0;
        const result = await ceoController.deleteCEO(ceoId);
        assert.equal(result.message, 'please input ceo id');
      });
      it('ceoName = null', async () => {
        const ceoId = null;
        const result = await ceoController.deleteCEO(ceoId);
        assert.equal(result.message, 'please input ceo id');
      });
      it('ceoName = undefined', async () => {
        const ceoId = undefined;
        const result = await ceoController.deleteCEO(ceoId);
        assert.equal(result.message, 'please input ceo id');
      });
    });
  });
});
