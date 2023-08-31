import 'core-js';
import {
  local,
  session,
  StorageWrap,
  ExpiresPlugin
} from '@/index';
const QUnit = (<any>window).QUnit;

QUnit.start();

const user = { name: 'Tom', pet: 'cat' };

QUnit.test('session', function(assert: any) {
  session.setAsJSON('user', user);
  assert.ok(typeof session.get('user') === 'string');
  assert.deepEqual(session.getAsJSON('user'), user);
  session.remove('user');
  assert.ok(session.get('user') === null);
});

QUnit.test('local', function(assert: any) {
  local.setAsJSON('user', user);
  assert.ok(typeof local.get('user') === 'string');
  assert.deepEqual(local.getAsJSON('user'), user);
  local.remove('user');
  assert.ok(local.get('user') === null);
});

QUnit.test('local-enhancement-expires', function(assert: any) {
  const enhancedLocal = new StorageWrap('local', {
    plugins: [
      new ExpiresPlugin('local')
    ]
  });

  assert.expect(4);
  const done = assert.async();

  enhancedLocal.set('expired', '1', { expires: '-1 sec' });
  assert.deepEqual(enhancedLocal.get('expired'), null);

  enhancedLocal.set('test-01', '1', { expires: '5 secs' });

  setTimeout(() => {
    assert.deepEqual(enhancedLocal.get('test-01'), '1');
  }, 2000);
  setTimeout(() => {
    assert.deepEqual(enhancedLocal.get('test-01'), null);
  }, 6000);

  enhancedLocal.set('test-02', '1');
  setTimeout(() => {
    assert.deepEqual(enhancedLocal.get('test-02'), '1');
    done();
  }, 8000);
});
