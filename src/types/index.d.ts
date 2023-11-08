export namespace Config {
  // 体验二维码自动推送
  interface Experience {
    url: string;
    method: string;
    contentType: string;
    body: string;
  }

  // 编译设置
  interface WechatConfigSetting {
    es6: boolean; // 对应小程序开发者工具的 "es6 转 es5"
    es7: boolean; // 对应小程序开发者工具的 "增强编译"
    minify: boolean; // 压缩所有代码，对应小程序开发者工具的 "压缩代码"
    codeProtect: boolean; // 对应小程序开发者工具的 "代码保护"
    minifyJS: boolean; // 压缩 JS 代码
    minifyWXML: boolean; // 压缩 WXML 代码
    minifyWXSS: boolean; // 压缩 WXSS 代码
    autoPrefixWXSS: boolean; // 对应小程序开发者工具的 "样式自动补全"
  }
  // 微信小程序配置
  interface WechatConfig {
    appid: string; // 小程序/小游戏项目的 appid
    type?: string; // 项目的类型，有效值 miniProgram/miniProgramPlugin/miniGame/miniGamePlugin
    robot?: number; // 指定使用哪一个 ci 机器人，可选值：1 ~ 30
    projectPath: string; // 项目的路径，即 project.config.json 所在的目录
    privateKeyPath: string; // 密钥的路径，在获取项目属性和上传时用于鉴权使用，在 微信公众平台 上登录后下载
    setting?: WechatConfigSetting; // 编译设置
    experience?: Experience; // 上传成功后，自动设置为体验版本, 该功能只针对小程序主账号生效(体验二维码自动推送机器人)
  }

  // 支付宝小程序配置
  interface AlipayConfig {
    appid: string; // 小程序的appid
    toolId: string; // 工具id
    projectPath: string; // 项目的路径
    privateKeyPath: string; // 私钥的路径
    experience?: Experience; // 上传成功后，自动设置为体验版本, 该功能只针对小程序主账号生效(体验二维码自动推送机器人)
  }
  interface Configs {
    wechat?: WechatConfig;
    alipay?: AlipayConfig;
  }
}
