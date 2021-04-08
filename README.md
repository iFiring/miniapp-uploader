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
* [`miniuper hello [FILE]`](#miniuper-hello-file)
* [`miniuper help [COMMAND]`](#miniuper-help-command)
* [`miniuper init`](#miniuper-init)
* [`miniuper upload [TYPE]`](#miniuper-upload-type)

## `miniuper hello [FILE]`

describe the command here

```
USAGE
  $ miniuper hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ miniuper hello
  hello world from ./src/commands/hello.t
```

_See code: [src/commands/hello.ts](https://github.com/iFiring/miniapp-uploader/blob/v0.0.1/src/commands/hello.ts)_

## `miniuper help [COMMAND]`

display help for miniuper

```
USAGE
  $ miniuper help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `miniuper init`

初始化配置命令

```
USAGE
  $ miniuper init

OPTIONS
  -h, --help  展示 CLI 帮助
```

_See code: [src/commands/init.ts](https://github.com/iFiring/miniapp-uploader/blob/v0.0.1/src/commands/init.ts)_

## `miniuper upload [TYPE]`

小程序上传命令

```
USAGE
  $ miniuper upload [TYPE]

ARGUMENTS
  TYPE  小程序类型 wechat|alipay (非必填)

OPTIONS
  -d, --description=description  (required) 版本描述
  -h, --help                     展示 CLI 帮助
  -r, --robot=robot              [default: 1] CI机器人序号 1 - 30
  -v, --version=version          (required) 上传版本号
```

_See code: [src/commands/upload.ts](https://github.com/iFiring/miniapp-uploader/blob/v0.0.1/src/commands/upload.ts)_
<!-- commandsstop -->
