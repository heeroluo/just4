import { loadScript } from '@/index';

const QUnit = (<any>window).QUnit;

QUnit.start();

QUnit.test('加载正常', function(assert: any) {
  assert.expect(2);
  const done = assert.async();

  Promise.all([
    loadScript('/api/script', { data: { 'var': 'globalNum1', num: 100 } }),
    loadScript('/api/script', { data: { 'var': 'globalNum2', num: 200 } })
  ]).then(() => {
    assert.strictEqual((<any>window).globalNum1, 100);
    assert.strictEqual((<any>window).globalNum2, 200);
    done();
  });
});

QUnit.test('加载异常', function(assert: any) {
  assert.expect(2);
  const done = assert.async(2);

  loadScript('/api/script/error').then(function() {
    assert.ok(false);
    done();
  }, function() {
    assert.ok(true);
    done();
  });

  loadScript('/api/script/timeout', {
    data: { 'var': 'globalNum3', num: 300 },
    timeout: 2000
  }).then(function() {
    assert.ok(false);
    done();
  }, function(e: Error) {
    assert.ok(e.message.indexOf('timeout') !== -1);
    done();
  });
});
