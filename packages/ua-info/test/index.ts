import 'core-js';
import { UAInfo } from '@/index';
const QUnit = (<any>window).QUnit;

const uaList = [
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/4.0; WOW64; Trident/5.0; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 2.0.50727; Media Center PC 6.0; Maxthon 2.0)',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36',
  'Mozilla/5.0 (Linux;U;Android 5.1.1;zh-CN;OPPO A33 Build/LMY47V) AppleWebKit/537.36(KHTML,like Gecko) Version/4.0 Chrome/40.0.2214.89 UCBrowser/11.7.0.953 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; U; Android 4.1.2; en-us; HUAWEI G730-C00 Build/HuaweiG730-C00) AppleWebKit/533.1 (KHTML, like Gecko)Version/4.0 MQQBrowser/4.2 Mobile Safari/533.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36 Edg/89.0.774.68'
];
const uaInfoList = uaList.map(function(ua) {
  return new UAInfo(ua);
});

QUnit.start();

QUnit.test('os', function(assert: any) {
  assert.ok(uaInfoList[0].os.isWindows);
  assert.ok(uaInfoList[0].os.version.eq('6.1'));
  assert.ok(uaInfoList[0].browser.isIE);
  assert.ok(uaInfoList[0].browser.version.gte('9.0'));
  assert.ok(uaInfoList[0].client.isMaxthon);
  assert.ok(uaInfoList[0].client.version.lt('3.0'));

  assert.ok(uaInfoList[1].os.isIOS);
  assert.ok(uaInfoList[1].brand.isApple);
  assert.ok(uaInfoList[1].browser.isSafari);
  assert.ok(uaInfoList[1].client.isSafari);

  assert.ok(uaInfoList[2].os.isMacOS);
  assert.ok(uaInfoList[2].brand.isApple);
  assert.ok(uaInfoList[2].browser.isChrome);
  assert.ok(uaInfoList[2].client.isChrome);

  assert.ok(uaInfoList[3].os.isAndroid);
  assert.ok(uaInfoList[3].brand.isOppo);
  assert.ok(uaInfoList[3].browser.isChrome);
  assert.ok(uaInfoList[3].client.isUCBrowser);

  assert.ok(uaInfoList[4].os.isAndroid);
  assert.ok(uaInfoList[4].brand.isHuawei);
  assert.ok(uaInfoList[4].browser.isSafari);
  assert.ok(uaInfoList[4].client.isQQBrowser);

  assert.ok(uaInfoList[5].os.isWindows);
  assert.ok(uaInfoList[5].browser.isChrome);
  assert.ok(uaInfoList[5].client.isEdge);
});
