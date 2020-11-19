import { assert } from 'chai';
import generalController from './genaral.controllers';

describe('general APIs', () => {
  describe('get members in tree model', () => {
    describe('happy cases', () => {
      it('get data successfully', async () => {
        const result = await generalController.getMembersInTreeModel();
        assert.equal(result.message, 'successfully');
      });
    });
  });
  describe('get limit 1500 members', () => {
    describe('happy cases', () => {
      it('get data successfully', async () => {
        const result = await generalController.getLimit1500Members();
        assert.equal(result.message, 'successfully');
      });
      it('get data successfully with limit 1500 members', async () => {
        const result = await generalController.getLimit1500Members();
        assert.equal(result.data.memberNumber, 1500);
      });
    });
  });
});
