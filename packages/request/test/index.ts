import 'core-js';
import { Request, RequestErrorType } from '@/index';
import { xhrAdapter } from '@/adapter/xhr';

const request = new Request(xhrAdapter, {
  baseURL: '/api/'
});

const QUnit = (<any>window).QUnit;
QUnit.start();

QUnit.test('返回文本', function(assert: any) {
  assert.expect(3);
  const done = assert.async();
  const extra = { a: 1, b: 2 };

  Promise.all([
    request.send('text', {
      method: 'GET',
      responseType: 'text',
      params: { num: 100 },
      beforeSend(opts) { assert.strictEqual(opts?.extra, extra); },
      extra
    }),
    request.send('text', { method: 'POST', responseType: 'text', data: { num: 200 } })
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
    request.send('json', { method: 'GET', params: { num: 100 } }),
    request.send('json', { method: 'POST', data: { num: 200 } })
  ]).then(([res1, res2]) => {
    assert.deepEqual(res1.data, { num: '100' });
    assert.deepEqual(res2.data, { num: '200' });
    done();
  });
});

QUnit.test('超时', function(assert: any) {
  assert.expect(1);
  const done = assert.async();

  request.send('timeout', { timeout: 2000 }).then(
    null,
    function(error) {
      assert.deepEqual(error.type, RequestErrorType.TIMEOUT);
      done();
    }
  );
});

QUnit.test('取消', function(assert: any) {
  assert.expect(1);
  const done = assert.async();

  let ajaxId = 0;

  request.send('timeout', {
    receiveTaskId: function(id) { ajaxId = id; }
  }).then(
    null,
    function(error) {
      assert.deepEqual(error.type, RequestErrorType.ABORTED);
      done();
    }
  );

  setTimeout(function() {
    request.abort(ajaxId);
  }, 2000);
});

QUnit.test('请求错误', function(assert: any) {
  assert.expect(2);
  const done = assert.async();

  request.send('error', {
    params: { num: 100 }
  }).then(
    null,
    function(error) {
      assert.strictEqual(error.code, 500);
      assert.deepEqual(error.result.data, { num: '100' });
      done();
    }
  );
});

QUnit.test('请求图片（不支持 IE）', function(assert: any) {
  assert.expect(1);
  const done = assert.async();

  request.send('//live.polyv.net/kaptcha', {
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
