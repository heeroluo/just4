import 'core-js';
import { local, session } from '@/index';

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
