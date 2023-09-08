import 'core-js';
import { getCookie, setCookie, removeCookie } from '@/index';
const QUnit = (<any>window).QUnit;


QUnit.start();

QUnit.test('get', function(assert: any) {
  document.cookie = 'case1-key=case1-value';
  assert.strictEqual(getCookie('case1-key'), 'case1-value');
});

QUnit.test('set', function(assert: any) {
  const done = assert.async();

  setCookie('case2-key', 'case2-value');
  assert.strictEqual(getCookie('case2-key'), 'case2-value');

  setCookie('case3-key', 'case3-value', { expires: '5 secs' });
  assert.strictEqual(getCookie('case3-key'), 'case3-value', '未过期');
  setTimeout(function() {
    assert.equal(getCookie('case3-key'), '', '已过期');
    done();
  }, 6000);
});

QUnit.test('remove', function(assert: any) {
  setCookie('case4-key', 'case4-value');
  removeCookie('case4-key');
  assert.strictEqual(getCookie('case4-key'), '');
});
