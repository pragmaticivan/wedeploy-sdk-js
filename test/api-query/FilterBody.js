'use strict';

import Embodied from '../../src/api-query/Embodied';
import Filter from '../../src/api-query/Filter';
import FilterBody from '../../src/api-query/FilterBody';

/* eslint-disable max-len,require-jsdoc */
describe('FilterBody', function() {
  it('should return the filter\'s body object', function() {
    const filterBody = new FilterBody('age', '>', 0);
    const body = {
      age: {
        operator: '>',
        value: 0,
      },
    };
    assert.deepEqual(body, filterBody.getObject());
  });

  it('should assume "=" operator if none is given', function() {
    const filterBody = new FilterBody('age', 12);
    const body = {
      age: {
        operator: '=',
        value: 12,
      },
    };
    assert.deepEqual(body, filterBody.getObject());
  });

  it('should not set "value" key if null is given', function() {
    const filterBody = new FilterBody('age', null);
    const body = {
      age: {
        operator: '=',
      },
    };
    assert.deepEqual(body, filterBody.getObject());
  });

  it('should use return value of "body()" function of Embodied value', function() {
    class Test extends Embodied {
      constructor() {
        super();
        this.body_.foo = 'foo';
      }
    }
    const filterBody = new FilterBody('age', new Test());
    const body = {
      age: {
        operator: '=',
        value: {
          foo: 'foo',
        },
      },
    };
    assert.deepEqual(body, filterBody.getObject());
  });

  describe('Composition', function() {
    it('should compose filter with another with the given operator', function() {
      const filterBody = new FilterBody('age', '>', 12);
      filterBody.add('and', Filter.lt('age', 15));
      const body = {
        and: [
          {
            age: {
              operator: '>',
              value: 12,
            },
          },
          {
            age: {
              operator: '<',
              value: 15,
            },
          },
        ],
      };
      assert.deepEqual(body, filterBody.getObject());
    });

    it('should compose a empty filter with empty body to use ', function() {
      const filterBody = new FilterBody();

      const body = {
        and: [],
      };

      assert.deepEqual(body, filterBody.getObject());
    });

    it('should compose a empty Filter Body with a filter', function() {
      const filterBody = new FilterBody();
      filterBody.addMany('and', Filter.lt('age', 15));
      filterBody.addMany('or', Filter.lt('age', 16));

      const body = {
        or: [
          {
            and: [
              {
                age: {
                  operator: '<',
                  value: 15,
                },
              },
            ],
          },
          {
            age: {
              operator: '<',
              value: 16,
            },
          },
        ],
      };
      assert.deepEqual(body, filterBody.getObject());
    });

    it('should compose filter with multiple others with the given operator', function() {
      const filterBody = new FilterBody('age', '>', 12);
      filterBody.addMany(
        'and',
        Filter.lt('age', 15),
        Filter.equal('name', 'foo')
      );
      const body = {
        and: [
          {
            age: {
              operator: '>',
              value: 12,
            },
          },
          {
            age: {
              operator: '<',
              value: 15,
            },
          },
          {
            name: {
              operator: '=',
              value: 'foo',
            },
          },
        ],
      };
      assert.deepEqual(body, filterBody.getObject());
    });

    it('should compose filter with a unary operator', function() {
      const filterBody = new FilterBody('age', '>', 12);
      filterBody.add('not');
      const body = {
        not: {
          age: {
            operator: '>',
            value: 12,
          },
        },
      };
      assert.deepEqual(body, filterBody.getObject());
    });
  });
});
