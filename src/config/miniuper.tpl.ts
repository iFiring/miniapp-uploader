export default {
  wechat: {
    appid: 'appid',
    projectPath: 'projectPath',
    privateKeyPath: 'private.XXX.key',
    type: 'miniProgram',
    robot: 1,
    setting: {
      es6: false,
      es7: false,
      minify: true,
      codeProtect: true,
      minifyJS: false,
      minifyWXML: false,
      minifyWXSS: false,
      autoPrefixWXSS: false,
    },
    experience: {
      url: '',
      method: '',
      contentType: 'application/json',
      body:
        '{"微信小程序体验版":"{{qrCodeUrl}}","版本号":"{{version}}","版本描述":"{{description}}"}',
    },
  },
  alipay: {
    appid: 'appid',
    toolId: 'toolId',
    projectPath: 'projectPath',
    privateKeyPath: 'pkcs8-private-pem',
    experience: {
      url: '',
      method: '',
      contentType: 'application/json',
      body:
        '{"支付宝小程序体验版":"{{qrCodeUrl}}","版本号":"{{version}}","版本描述":"{{description}}"}',
    },
  },
};
