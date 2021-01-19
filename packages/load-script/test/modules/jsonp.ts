import { jsonp } from '@/jsonp';

const QUnit = (<any>window).QUnit;

QUnit.start();

QUnit.test('加载正常', function(assert: any) {
  assert.expect(2);
  const done = assert.async();

  Promise.all([
    jsonp('/api/jsonp', { data: { 'value': '100' } }),
    jsonp('/api/jsonp', { data: { 'value': '200' } })
  ]).then(([value1, value2]) => {
    assert.strictEqual(value1, '100');
    assert.strictEqual(value2, '200');
    done();
  });
});

QUnit.test('加载异常', function(assert: any) {
  assert.expect(2);
  const done = assert.async(2);

  jsonp('/api/script/error', { data: { 'value': '100' } }).then(function() {
    assert.ok(false);
    done();
  }, function() {
    assert.ok(true);
    done();
  });

  jsonp('/api/jsonp/timeout', {
    data: { 'value': '100' },
    timeout: 2000
  }).then(function() {
    assert.ok(false);
    done();
  }, function(e: Error) {
    assert.ok(e.message.indexOf('timeout') !== -1);
    done();
  });
});
