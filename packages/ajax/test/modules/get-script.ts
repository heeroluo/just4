import { getScript } from '@/get-script';
import { AJAXError } from '@/ajax-error';
const QUnit = (<any>window).QUnit;


document.title = 'AJAX: get-script';

QUnit.start();

QUnit.test('加载正常', function(assert: any) {
  assert.expect(2);
  const done = assert.async();

  Promise.all([
    getScript('/api/script', { data: { 'var': 'globalNum1', num: 100 } }),
    getScript('/api/script', { data: { 'var': 'globalNum2', num: 200 } })
  ]).then(() => {
    assert.strictEqual((<any>window).globalNum1, 100);
    assert.strictEqual((<any>window).globalNum2, 200);
    done();
  });
});

QUnit.test('加载异常', function(assert: any) {
  assert.expect(2);
  const done = assert.async(2);

  getScript('/api/script/error').then(function() {
    assert.ok(false);
    done();
  }, function() {
    assert.ok(true);
    done();
  });

  getScript('/api/script/timeout', {
    data: { 'var': 'globalNum3', num: 300 },
    timeout: 2000
  }).then(function() {
    assert.ok(false);
    done();
  }, function(e: AJAXError) {
    assert.ok(e.isTimeout);
    done();
  });
});
