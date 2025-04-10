import 'core-js';
import { UAInfo } from '@/index';
const QUnit = (<any>window).QUnit;

const uaList = [
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/4.0; WOW64; Trident/5.0; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 2.0.50727; Media Center PC 6.0; Maxthon 2.0)',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36',
  'Mozilla/5.0 (Linux;U;Android 5.1.1;zh-CN;OPPO A33 Build/LMY47V) AppleWebKit/537.36(KHTML,like Gecko) Version/4.0 Chrome/40.0.2214.89 UCBrowser/11.7.0.953 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; U; Android 4.1.2; en-us; HUAWEI G730-C00 Build/HuaweiG730-C00) AppleWebKit/533.1 (KHTML, like Gecko)Version/4.0 MQQBrowser/4.2 Mobile Safari/533.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36 Edg/89.0.774.68',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17763',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4651.0 Safari/537.36',
  'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; OpenBSD amd64; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
  'Mozilla/5.0 (X11; Linux i386) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x6309098f) XWEB/9105',
  'Mozilla/5.0 (Linux; Android 12; A9000 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/122.0.6261.120 Safari/537.36 XWEB/1220099 MMWEBSDK/20230303 MMWEBID/8049 MicroMessenger/8.0.34.2340(0x2800225D) WeChat/arm64 Weixin Android Tablet NetType/WIFI Language/zh_CN ABI/arm64',
  'Mozilla/5.0 (Linux; Android 12; HarmonyOS; DCO-AL00; HMSCore 6.14.0.302) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.196 HuaweiBrowser/15.0.6.301 Mobile Safari/537.36',
  'Mozilla/5.0 (Phone; OpenHarmony 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36  ArkWeb/4.1.6.1 Mobile',
  'Mozilla/5.0 (Linux; Android 13; V2278A Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.6478.188 Mobile Safari/537.36 XWEB/1260117 MMWEBSDK/20240801 MMWEBID/1703 MicroMessenger/8.0.51.2720(0x28003339) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64',
  'Mozilla/5.0 (Tablet; OpenHarmony 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36  ArkWeb/4.1.6.1  ytkyapp/5.0.0'
];
const uaInfoList = uaList.map(function(ua) {
  return new UAInfo(ua);
});

QUnit.start();

QUnit.test('main', function(assert: any) {
  assert.ok(uaInfoList[0].os.isWindows);
  assert.ok(uaInfoList[0].os.version.eq('6.1'));
  assert.ok(uaInfoList[0].browser.isIE);
  assert.ok(uaInfoList[0].browser.version.gte('9.0'));
  assert.ok(uaInfoList[0].client.isMaxthon);
  assert.ok(uaInfoList[0].client.version.lt('3.0'));
  assert.ok(!uaInfoList[0].isPortable);

  assert.ok(uaInfoList[1].os.isIOS);
  assert.ok(uaInfoList[1].os.version.gt('12.0'));
  assert.ok(uaInfoList[1].brand.isApple);
  assert.ok(uaInfoList[1].browser.isSafari);
  assert.ok(uaInfoList[1].browser.version.eq('12.1'));
  assert.ok(uaInfoList[1].client.isSafari);
  assert.ok(uaInfoList[1].client.version.lte('12.2'));
  assert.ok(uaInfoList[1].isPortable);

  assert.ok(uaInfoList[2].os.isMacOS);
  assert.ok(uaInfoList[2].os.version.lte('12.0'));
  assert.ok(uaInfoList[2].brand.isApple);
  assert.ok(uaInfoList[2].browser.isChrome);
  assert.strictEqual(uaInfoList[2].browser.version.toString(), '49.0.2623.112');
  assert.ok(uaInfoList[2].browser.version.gt('49.0'));
  assert.ok(uaInfoList[2].client.isChrome);
  assert.ok(uaInfoList[2].client.version.lt('49.8'));
  assert.ok(!uaInfoList[2].isPortable);

  assert.ok(uaInfoList[3].os.isAndroid);
  assert.ok(uaInfoList[3].os.version.eq('5.1.1'));
  assert.ok(!uaInfoList[3].isTablet);
  assert.ok(uaInfoList[3].brand.isOppo);
  assert.ok(uaInfoList[3].browser.isChrome);
  assert.strictEqual(uaInfoList[3].browser.version.toString(), '40.0.2214.89');
  assert.ok(uaInfoList[3].browser.version.gte('40.0'));
  assert.ok(uaInfoList[3].client.isUCBrowser);
  assert.ok(uaInfoList[3].client.version.lte('12.0'));
  assert.ok(uaInfoList[3].isPortable);

  assert.ok(uaInfoList[15].brand.isVivo);

  assert.ok(uaInfoList[4].os.isAndroid);
  assert.ok(uaInfoList[4].os.version.gte('4.1.2'));
  assert.ok(uaInfoList[4].brand.isHuawei);
  assert.ok(uaInfoList[4].browser.isSafari);
  assert.ok(uaInfoList[4].browser.version.eq('4.0'));
  assert.ok(uaInfoList[4].client.isQQBrowser);
  assert.ok(uaInfoList[4].isPortable);

  assert.ok(!uaInfoList[8].isPortable, 'Chrome OS');
  assert.ok(!uaInfoList[9].isPortable, 'OpenBSD');
  assert.ok(!uaInfoList[10].isPortable, 'Linux');

  assert.ok(uaInfoList[11].client.isWx, 'Weixin');
  assert.ok(uaInfoList[11].client.isWxMiniProgram, 'Weixin MiniProgram WebView');

  assert.ok(uaInfoList[12].isTablet, 'Tablet');
  assert.ok(uaInfoList[12].isPortable, 'Tablet & Portable');
});

QUnit.test('edge', function(assert: any) {
  assert.ok(uaInfoList[5].os.isWindows);
  assert.ok(uaInfoList[5].os.version.eq('10.0'));
  assert.ok(uaInfoList[5].browser.isChrome);
  assert.ok(uaInfoList[5].browser.version.gt('89'));
  assert.ok(uaInfoList[5].client.isEdge);
  assert.ok(uaInfoList[5].client.version.gt('89'));

  assert.ok(uaInfoList[6].browser.isEdge);
  assert.ok(uaInfoList[6].browser.version.gt('18'));
  assert.ok(uaInfoList[6].client.isEdge);
  assert.ok(uaInfoList[6].client.version.gt('18'));
});

QUnit.test('harmony', function(assert: any) {
  assert.ok(uaInfoList[13].os.isAndroid);
  assert.ok(uaInfoList[13].os.isHarmonyOS);
  assert.ok(uaInfoList[14].os.isOpenHarmony);
  assert.ok(!uaInfoList[14].os.isHarmonyOS);
  assert.ok(uaInfoList[14].isPortable);
  assert.ok(uaInfoList[14].os.version.eq('5'));
  assert.ok(uaInfoList[16].isTablet, 'Tablet');
  assert.ok(uaInfoList[16].isPortable, 'Tablet & Portable');
});

QUnit.test('brand', function(assert: any) {
  assert.ok(uaInfoList[3].brand.isOppo);
  assert.ok(uaInfoList[13].brand.isHuawei);
});

QUnit.test('three-digit-version', function(assert: any) {
  assert.ok(uaInfoList[7].browser.isChrome);
  assert.ok(!uaInfoList[7].browser.version.lte('100'));
  assert.ok(uaInfoList[7].browser.version.eq('100.0.4651.0'));
  assert.ok(uaInfoList[7].browser.version.gt('100'));
});

QUnit.test('maxTouchPoint', function(assert: any) {
  const uaInfo = new UAInfo(uaList[2], {
    maxTouchPoints: 5
  });
  assert.ok(uaInfo.os.isIOS);
  assert.ok(uaInfo.brand.isIPad);
  assert.ok(uaInfo.isTablet);
  assert.ok(!uaInfo.brand.isMac);
  assert.ok(uaInfo.isPortable);
});

QUnit.test('platform', function(assert: any) {
  const uaInfo = new UAInfo(uaList[7], {
    platform: 'Android'
  });
  assert.ok(uaInfo.os.isAndroid);
  assert.ok(!uaInfo.os.isWindows);
  assert.ok(uaInfo.isPortable);
});

QUnit.test('maxTouchPoint & platform', function(assert: any) {
  const uaInfo = new UAInfo(uaList[2], {
    maxTouchPoints: 5,
    platform: 'MacIntel'
  });
  assert.ok(uaInfo.os.isIOS);
  assert.ok(uaInfo.brand.isIPad);
  assert.ok(!uaInfo.brand.isMac);
  assert.ok(uaInfo.isPortable);
});
