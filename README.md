miniapp-uploader
================

小程序自动化代码上传工具

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/miniapp-uploader.svg)](https://npmjs.org/package/miniapp-uploader)
[![Codecov](https://codecov.io/gh/null/null/branch/master/graph/badge.svg)](https://codecov.io/gh/null/null)
[![Downloads/week](https://img.shields.io/npm/dw/miniapp-uploader.svg)](https://npmjs.org/package/miniapp-uploader)
[![License](https://img.shields.io/npm/l/miniapp-uploader.svg)](https://github.com/null/null/blob/master/package.json)

<!-- toc -->

<!-- tocstop -->
  
  # 用法
  
  <!-- usage -->
```sh-session
$ npm install -g miniapp-uploader
$ miniuper COMMAND
running command...
$ miniuper (-v|--version|version)
miniapp-uploader/0.0.1 darwin-x64 node-v12.13.0
$ miniuper --help [COMMAND]
USAGE
  $ miniuper COMMAND
...
```
<!-- usagestop -->
  
  # 命令列表

  <!-- commands -->
* [`miniuper help [COMMAND]`](#miniuper-help-command)
* [`miniuper upload [TYPE]`](#miniuper-upload-type)

## `miniuper help [COMMAND]`

帮助命令

```
USAGE
  $ miniuper help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_详见代码: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `miniuper upload [TYPE]`

上传命令

```
USAGE
  $ miniuper upload [TYPE]

ARGUMENTS
  TYPE  小程序类型 wechat|alipay (非必填)

OPTIONS
  -d, --description=description  (required) 版本描述
  -h, --help                     展示 CLI 帮助
  -r, --robot=robot              CI机器人序号 0 - 30
  -v, --version=version          (required) 上传版本号
```

_详见代码: [src/commands/upload.ts](https://github.com/iFiring/miniapp-uploader/blob/v0.0.1/src/commands/upload.ts)_
<!-- commandsstop -->
