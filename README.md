miniapp-uploader
================

小程序自动化代码上传工具

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/miniapp-uploader.svg)](https://npmjs.org/package/miniapp-uploader)
[![Coverage](https://coveralls.io/repos/github/iFiring/miniapp-uploader/badge.svg?branch=release/optimize-coveralls)](https://coveralls.io/github/iFiring/miniapp-uploader?branch=release/optimize-coveralls)
[![Downloads/week](https://img.shields.io/npm/dw/miniapp-uploader.svg)](https://npmjs.org/package/miniapp-uploader)
[![License](https://img.shields.io/npm/l/miniapp-uploader.svg)](https://github.com/iFiring/miniapp-uploader/blob/main/package.json)

微信/支付宝小程序上传工具，包含初始化和上传命令，上传命令支持传入版本，描述和机器人序号等参数，包括自动推送支付宝二维码功能。

# 准备

### 微信小程序

1. 打开微信[小程序管理后台](https://mp.weixin.qq.com/)，前往[开发管理] -> [开发设置] -> [小程序代码上传]。
2. 点击[小程序代码上传密钥]的生成按钮，该操作需要管理员账号扫码验证，验证后可下载 **私钥**，复制到项目目录。
3. IP白名单默认开启，只有白名单内的IP才能成功调用代码上传接口，视自身情况决定是否开关。

### 支付宝小程序

1. 全局安装工具 miniu。
   
   ```sh-session
   npm install miniu -g
   ```

2. 运行 miniu 的 create 命令生成密钥（pkcs8 rsa2 格式），会生成公钥 pkcs8-public-pem 和私钥 pkcs8-private-pem 两个文件，再将 **私钥** 复制到项目目录。
   
   ```sh-session
   miniu key create -w
   ```

3. 前往 [工具密钥设置](https://openhome.alipay.com/dev/workspace/key-manage/tool) 页面进行工具公钥和 IP 白名单（可选）设置。将第二步生成的 **公钥 pkcs8-public-pe** 在此页面配置，设置完成后系统会分配一个**工具ID（toolId）**；

# 用法

1. 全局安装**miniapp-uploader**。
   
   ```sh-session
   $ npm install -g miniapp-uploader
   或
   $ yarn global add miniapp-uploader
   ```

2. 前期准备工作做好后，执行初始化命令，填入必备参数，生成 **miniuper.json** 文件。
   
   ```sh-session
   $ miniuper init
   ```

3. 执行上传命令，可传入版本号，版本描述。
   
   ```sh-session
   $ miniuper upload -v 1.0.0 -d 新的版本描述
   ```

# 配置

### 微信端

| 名称             | 类型     | 必填    | 默认值         | 描述                                                                           |
| -------------- | ------ | ----- | ----------- | ---------------------------------------------------------------------------- |
| appid          | String | **是** | -           | 小程序/小游戏的 appid                                                               |
| type           | String | 否     | miniProgram | 项目类型                                                                         |
| robot          | Number | 否     | 1           | 指定使用哪一个 ci 机器人，可选值：1 ~ 30                                                    |
| projectPath    | String | **是** | -           | 项目的路径，即 project.config.json 所在的目录                                            |
| privateKeyPath | String | **是** | -           | **密钥** 的路径，在微信公众平台的 **开发设置** 里下载                                             |
| setting        | Object | 否     | -           | 见[编译设置文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html) |

### 支付宝端

| 名称             | 类型             | 必填    | 默认值               | 描述                                |
| -------------- | -------------- | ----- | ----------------- | --------------------------------- |
| appid          | String         | **是** | -                 | 小程序的 appid                        |
| toolId         | String         | **是** | -                 | 支付宝小程序填入私钥后分配                     |
| projectPath    | String         | **是** | -                 | 项目的路径                             |
| privateKeyPath | String         | **是** | pkcs8-private-pem | **私钥** 的路径，即生成的 pkcs8-private-pem |
| experience     | Boolean/Object | 否     | true              | 上传成功后，自动设置为体验版本，推送配置见下表           |

##### experience：支付宝体验版自动推送机器人配置

| 名称          | 类型     | 必填  | 默认值                                                                     | 描述   |
| ----------- | ------ | --- | ----------------------------------------------------------------------- | ---- |
| url         | String | 是   | -                                                                       | 推送地址 |
| method      | String | 是   | -                                                                       | 方法   |
| contentType | String | 否   | application/json                                                        | 内容类型 |
| body        | JSON   | 否   | {"支付宝体验版":"{{qrCodeUrl}}","版本号":"{{version}}","版本描述":"{{description}}"} | 请求体  |

# 命令列表

* [`miniuper init`](#miniuper-init)
* [`miniuper upload [TYPE]`](#miniuper-upload-type)
* [`miniuper help [COMMAND]`](#miniuper-help-command)

## `miniuper init`

初始化配置命令

```
USAGE
  $ miniuper init

OPTIONS
  -h, --help  展示 CLI 帮助
```

_代码路径: [src/commands/init.ts](https://github.com/iFiring/miniapp-uploader/blob/main/src/commands/init.ts)_

## `miniuper upload [TYPE]`

小程序上传命令

```
USAGE
  $ miniuper upload [TYPE]

ARGUMENTS
  TYPE  小程序类型 wechat|alipay (非必填)

OPTIONS
  -d, --description=description  版本描述
  -h, --help                     展示 CLI 帮助
  -r, --robot=robot              [default: 1] CI机器人序号 1 - 30
  -v, --version=version          上传版本号
```

_代码路径: [src/commands/upload.ts](https://github.com/iFiring/miniapp-uploader/blob/main/src/commands/upload.ts)_

## `miniuper help [COMMAND]`

帮助命令

```
VERSION
  miniapp-uploader/1.0.0

USAGE
  $ miniuper [COMMAND]

COMMANDS
  init    初始化配置命令
  upload  小程序上传命令
```

_代码路径: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
