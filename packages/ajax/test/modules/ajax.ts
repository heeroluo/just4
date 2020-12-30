import { send } from '@/ajax';
import { AJAXError } from '@/ajax-error';
const QUnit = (<any>window).QUnit;


document.title = 'AJAX: ajax';

QUnit.start();

QUnit.test('同域调用正常', function(assert: any) {
  const ASSERT_COUNT = 3;
  assert.expect(ASSERT_COUNT);
  const done = assert.async(ASSERT_COUNT);

  send('/api/xhr/get', {
    params: { id: 1 },
    preventCaching: true
  }).then(function(value: any) {
    assert.strictEqual(value.id, '1', 'Get');
    done();
  });

  send('/api/xhr/post', {
    data: { id: 2 },
    method: 'post'
  }).then(function(value: any) {
    assert.strictEqual(value.id, '2', 'Post(form)');
    done();
  });

  send('/api/xhr/post', {
    data: { id: 3 },
    method: 'post',
    requestType: 'json'
  }).then(function(value: any) {
    assert.strictEqual(value.id, 3, 'Post(json)');
    done();
  });
});

QUnit.test('同域调用异常', function(assert: any) {
  const ASSERT_COUNT = 2;
  assert.expect(ASSERT_COUNT);
  const done = assert.async(ASSERT_COUNT);

  send('/api/xhr/get/timeout', {
    timeout: 2000
  }).then(() => {
    assert.ok(false, '未超时');
    done();
  }, (e: AJAXError) => {
    assert.ok(e.isTimeout, '超时');
    done();
  });

  send('/api/xhr/get/error').then(() => {
    assert.ok(false, '请求正常');
    done();
  }, (e: AJAXError) => {
    assert.strictEqual((<any>e.data).msg, 'error', '请求异常');
    done();
  });
});

const anotherOrigin = location.protocol + '//' + location.host.replace(/:\d+$/, ':8606');
// const anotherOrigin = 'http://abc.com:8606';

QUnit.test('跨域调用', async function(assert: any) {
  const ASSERT_COUNT = 3;
  assert.expect(ASSERT_COUNT);
  const done = assert.async(ASSERT_COUNT);

  send(anotherOrigin + '/api/xhr/get', {
    params: { id: 10 },
    preventCaching: true
  }).then((value: any) => {
    assert.strictEqual(value.id, '10', '跨域 get');
    done();
  });

  send(anotherOrigin + '/api/xhr/get/error').then(() => {
    assert.ok(false, '请求正常');
    done();
  }, (e: AJAXError) => {
    assert.strictEqual((<any>e.data).msg, 'error', '请求异常');
    done();
  });

  await send(anotherOrigin + '/api/xhr/set-cookie', {
    withCredentials: true
  });
  const value = await send(anotherOrigin + '/api/xhr/get-cookie', {
    withCredentials: true,
    responseType: 'text'
  });
  assert.strictEqual(value, '1', 'Cookie 读写');
  done();
});

if (typeof FormData !== 'undefined') {
  QUnit.test('FormData', function(assert: any) {
    const ASSERT_COUNT = 1;
    assert.expect(ASSERT_COUNT);
    const done = assert.async(ASSERT_COUNT);

    const data = new FormData();
    data.append('id', '1');
    send('/api/xhr/post', {
      data: { id: 3 },
      method: 'post'
    }).then((value: any) => {
      assert.strictEqual(value.id, '3');
      done();
    });
  });
}
