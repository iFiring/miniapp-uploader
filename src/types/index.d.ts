interface WechatConfigSetting {
  es6: boolean;
  es7: boolean;
  minify: boolean;
  codeProtect: boolean;
  minifyJS: boolean;
  minifyWXML: boolean;
  minifyWXSS: boolean;
  autoPrefixWXSS: boolean;
}
interface WechatConfig {
  appid: string;
  type: string;
  robot: number;
  projectPath: string;
  privateKeyPath: string;
  setting?: WechatConfigSetting;
}
interface AlipayConfig {
  appid: string;
  toolId: string;
  projectPath: string;
  privateKey: string;
}
export interface Config {
  wechat: WechatConfig;
  alipay: AlipayConfig;
}
