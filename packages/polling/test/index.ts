import 'core-js';
import { Polling } from '@/index';
import { breakBy } from '@/index';

const QUnit = (<any>window).QUnit;

QUnit.start();

QUnit.test('polling', (assert: any) => {
  const done = assert.async();

  let i = 1;
  const polling = new Polling(() => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        i += 1;
        resolve();
      }, 0);
    });
  }, {
    interval: () => 2000
  });

  polling.start(false);

  setTimeout(() => {
    polling.stop();

    assert.strictEqual(i === 5, true);

    setTimeout(() => {
      assert.strictEqual(i === 5, true, '已停止');

      polling.execImmediately();
      setTimeout(() => {
        assert.strictEqual(i === 6, true, '立刻执行');
        done();
      }, 100);
    }, 3000);
  }, 9.8 * 1000);
});

QUnit.test('shouldContinue', (assert: any) => {
  let i = 0;
  const polling = new Polling(() => {
    return new Promise<void>((resolve) => {
      i++;
      setTimeout(() => {
        resolve();
      }, 0);
    });
  }, {
    interval: 2000,
    shouldContinue: breakBy.maxTimes(3)
  });
  polling.start();

  const done = assert.async();
  setTimeout(() => {
    assert.ok(i === 3);
    done();
  }, 7000);
});

QUnit.test('events', (assert: any) => {
  assert.expect(2);
  const done = assert.async();

  const polling = new Polling(() => {
    console.log(Date.now());
  });
  polling.on('start', () => { assert.ok(true); });
  polling.on('stop', () => { assert.ok(true); });

  polling.start();
  polling.stop();

  done();
});
