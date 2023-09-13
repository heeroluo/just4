import 'core-js';
import { send, cancel } from '@/ajax';

const QUnit = (<any>window).QUnit;

QUnit.start();

QUnit.test('返回文本', function(assert: any) {
  assert.expect(2);
  const done = assert.async();

  Promise.all([
    send('/api/ajax/text', { method: 'get', responseType: 'text', params: { num: 100 } }),
    send('/api/ajax/text', { method: 'post', responseType: 'text', data: { num: 200 } })
  ]).then(([res1, res2]) => {
    assert.strictEqual(res1.data, '100');
    assert.strictEqual(res2.data, '200');
    done();
  });
});

QUnit.test('返回 JSON', function(assert: any) {
  assert.expect(2);
  const done = assert.async();

  Promise.all([
    send('/api/ajax/json', { method: 'get', params: { num: 100 } }),
    send('/api/ajax/json', { method: 'post', data: { num: 200 } })
  ]).then(([res1, res2]) => {
    assert.deepEqual(res1.data, { num: '100' });
    assert.deepEqual(res2.data, { num: '200' });
    done();
  });
});

QUnit.test('超时', function(assert: any) {
  assert.expect(1);
  const done = assert.async();

  send('/api/ajax/timeout', { timeout: 2000 }).then(
    null,
    function(error) {
      assert.ok(error.isTimeout);
      done();
    }
  );
});

QUnit.test('取消', function(assert: any) {
  assert.expect(1);
  const done = assert.async();

  let ajaxId = 0;

  send('/api/ajax/timeout', {
    receiveCancelId: function(id) { ajaxId = id; }
  }).then(
    null,
    function(error) {
      assert.ok(error.isCancel);
      done();
    }
  );

  setTimeout(function() {
    cancel(ajaxId);
  }, 2000);
});

QUnit.test('请求错误', function(assert: any) {
  assert.expect(2);
  const done = assert.async();

  send('/api/ajax/error', {
    params: { num: 100 }
  }).then(
    null,
    function(error) {
      assert.strictEqual(error.code, 500);
      assert.deepEqual(error.data, { num: '100' });
      done();
    }
  );
});

QUnit.test('请求图片（不支持 IE）', function(assert: any) {
  assert.expect(1);
  const done = assert.async();

  send('//live.polyv.net/kaptcha', {
    params: {
      timestamp: Date.now()
    },
    responseType: 'blob'
  }).then(function(res) {
    const img = new Image();
    img.src = URL.createObjectURL(<Blob>res.data);
    assert.ok(true);
    done();
  });
});
