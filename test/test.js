const assert = require('assert');
const axios = require('axios');
const PORT = 3030;

function expectReq(method, status, data, id) {
  let url = 'http://localhost:' + PORT + '/shopping' + (id ? '/' + id : '');
  return axios({
    method,
    url,
    data,
    validateStatus: statusCode => {
      if (process.env.STRICT) {
        return status === statusCode;
      } else {
        return true;
      }
    }
  });
}

function cleanUp() {
  return axios({
    method: 'DELETE',
    url: 'http://localhost:3030/shopping'
  });
}

describe('/shopping', function() {
  afterEach(function() {
    return cleanUp();
  });

  it('Handles DELETE /', function() {
    return expectReq('DELETE', 204);
  });

  it('Handles POST / and GET /:name', function() {
    let o = {name: 'Apple', amount: 1};
    return expectReq('POST', 201, o)
      .then(() => expectReq('GET', 200, undefined, o.name))
      .then(res => {
        assert.deepEqual(res.data, o);
      });
  });

  it('Handles GET / when list is empty', function() {
    return expectReq('GET', 200)
    .then(res => {
      assert.deepStrictEqual(res.data, {shoppingList: []});
    });
  });

  it('Handles GET / when list is populated', function() {
    let data = [
      {name: 'Apple', amount: 1},
      {name: 'Pear', amount: 1},
      {name: 'Lemon', amount: 1},
    ];

    return Promise.all(data.map(x => expectReq('POST', 201, x)))
      .then(() => expectReq('GET', 200))
      .then(res => {
        let list = res.data.shoppingList;
        let ok = data.every(x => list.find(y => y.name === x.name && y.amount === x.amount));
        assert.ok(ok);
      });
  });

  it('Handles pagination for GET /', function() {
    let data = [
      {name: 'Apple', amount: 1},
      {name: 'Pear', amount: 1},
      {name: 'Lemon', amount: 1},
      {name: 'Onion', amount: 3},
      {name: 'Advocado', amount: 8},
      {name: 'Coffee', amount: 1},
      {name: 'Lime', amount: 3},
      {name: 'Sugar', amount: 1},
      {name: 'Pasta', amount: 1},
      {name: 'Rice', amount: 2},
      {name: 'Oregano', amount: 1},
      {name: 'Bread', amount: 2},
      {name: 'Papaya', amount: 1},
      {name: 'Mushrooms', amount: 8},
      {name: 'Potatoes', amount: 20},
      {name: 'Soap', amount: 1},
      {name: 'Toothpaste', amount: 1},
      {name: 'Water', amount: 3},
      {name: 'Juice', amount: 1},
      {name: 'Pears', amount: 3},
      {name: 'Cucumber', amount: 2},
      {name: 'Tomatoes', amount: 12}
    ];

    return Promise.all(data.map(x => expectReq('POST', 201, x)))
      .then(() => expectReq('GET', 200))
      .then(res => {
        let list = res.data.shoppingList;
        assert.equal(list.length, 10);
        let ok = list.every(x => x.name && x.amount);
        assert.ok(ok);
        return axios.get('http://localhost:' + PORT + '/shopping?page=2')
        .then(res2 => {
          let list2 = res2.data.shoppingList;
          assert.equal(list2.length, 10);
          assert.notEqual(list[0].name, list2[0].name);
          return axios.get('http://localhost:' + PORT + '/shopping?page=3')
        })
      })
      .then(res3 => {
        let list3 = res3.data.shoppingList;
        assert.equal(list3.length, 2);
        return axios.get('http://localhost:' + PORT + '/shopping?page=1&size=100');
      })
      .then(res4 => {
        let list4 = res4.data.shoppingList;
        assert.equal(list4.length, 22);
      });

  });


  it('Handles upsert POST /', function() {
    let o = {name: 'Apple', amount: 1};
    return expectReq('POST', 201, o)
      .then(() => expectReq('POST', 201, o))
      .then(() => expectReq('GET', 200, undefined, o.name))
      .then(res => {
        o.amount = 2;
        assert.deepEqual(res.data, o);
      });
  });

  it('Handles PUT /:name', function() {
    let o = {name: 'Apple', amount: 3};
    return expectReq('POST', 201, o)
      .then(() => expectReq('GET', 200, undefined, o.name))
      .then(res => {
        assert.strictEqual(res.data.amount, 3);
        o.amount = 1;
        return expectReq('PUT', 200, o, o.name);
      })
      .then(() => expectReq('GET', 200, undefined, o.name))
      .then(res => {
        assert.deepEqual(res.data.amount, 1);
      });
  });

  it('Handles DELETE /:name', function() {
    let o = {name: 'Apple', amount: 1};
    let o2 = {name: 'Pear', amount: 2};
    return Promise.all([
      expectReq('POST', 201, o),
      expectReq('POST', 201, o2)
    ])
      .then(() => expectReq('DELETE', 204, undefined, o.name))
      .then(() => expectReq('GET', 200, undefined, o2.name))
      .then(res => {
        assert.deepEqual(res.data, o2);
      });
  });

  it('Returns 400 for invalid data', function() {
    let o = {title: 'Apple', amount: 3};
    let o2 = {name: 'Apple', amount: 0};
    let o3 = {name: '', amount: 3};
    return Promise.all([
      expectReq('POST', 400, o),
      expectReq('POST', 400, o2),
      expectReq('POST', 400, o3),
    ])
      .then(() => expectReq('GET', 200))
      .then(res => {
        assert.deepEqual(res.data, {shoppingList: []});
      });
  });

  it('Returns 404 for non existing resource', function() {
    return expectReq('GET', 404, undefined, 'Banana');
  });
});
