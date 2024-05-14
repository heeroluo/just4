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

QUnit.test('备用地址', function(assert: any) {
  assert.expect(3);
  const done = assert.async(3);

  loadScript('/api/script/error', {
    backupURL: '/api/script',
    data: { 'var': 'globalNum4', num: 400 }
  }).then(function() {
    assert.strictEqual((<any>window).globalNum4, 400);
    done();
  }, function() {
    assert.ok(false);
    done();
  });

  loadScript('/api/script/error', {
    backupURL: '/api/script/error',
    data: { error: 1 }
  }).then(function() {
    assert.ok(false);
    done();
  }, function() {
    assert.ok(true);
    done();
  });

  loadScript('/api/script/timeout', {
    backupURL: '/api/script',
    data: { 'var': 'globalNum5', num: 500 },
    timeout: 2000
  }).then(function() {
    assert.strictEqual((<any>window).globalNum5, 500);
    done();
  }, function() {
    assert.ok(false);
    done();
  });
});
