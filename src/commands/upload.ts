import {Command, flags} from '@oclif/command'
import * as chalk from 'chalk'
import * as fs from 'fs'
import {Project as WechatInit, upload as wechatUpload} from 'miniprogram-ci'
import {setConfig as alipayInit, miniUpload as alipayUpload} from 'miniu'

import {Config} from '../types'

// eslint-disable-next-line no-console
// eslint-disable-next-line node/no-unsupported-features/node-builtins
const {log, table} = console

export default class Upload extends Command {
  static description = '小程序上传命令'

  static flags = {
    help: flags.help({char: 'h', description: '展示 CLI 帮助'}),
    // flag with no value (-v, --version)
    version: flags.build({char: 'v', description: '上传版本号', required: true})(),
    // flag with no value (-d, --description)
    description: flags.build({char: 'd', description: '版本描述', required: true})(),
    // flag with no value (-r, --robot)
    robot: flags.build({char: 'r', description: 'CI机器人序号 1 - 30', parse: (robot: string): any => Number(robot), default: 1})(),
  }

  static args = [{name: 'type', description: '小程序类型 wechat|alipay (非必填)'}]

  async run() {
    const {args, flags} = this.parse(Upload)
    const _PWD_ = process.cwd()
    let projectConfig: Config
    try {
      projectConfig = JSON.parse(fs.readFileSync(`${_PWD_}/miniuper.json`, 'utf8'))
    } catch (error) {
      log(error)
      log('当前目录下 miniuper.json 配置文件读取失败，请使用 miniuper init 命令生成该配置文件')
      return
    }
    log(flags)

    const {type} = args
    if (!type || type === 'wechat') {
      // 微信小程序上传
      log(chalk.yellow('微信小程序开始上传\n'))
      const {wechat: wechatConf} = projectConfig
      table && table({
        appid: wechatConf.appid,
        projectPath: wechatConf.projectPath,
        privateKeyPath: wechatConf.privateKeyPath,
        version: flags.version,
        desc: flags.description,
        robot: flags.robot || wechatConf.robot || 1,
      })
      const project = new WechatInit({
        appid: wechatConf.appid,
        type: 'miniProgram',
        projectPath: `${_PWD_}${wechatConf.projectPath}`,
        privateKeyPath: `${_PWD_}${wechatConf.privateKeyPath}`,
        ignores: ['node_modules/**/*'],
      })

      try {
        const wechatUploadResult = await wechatUpload({
          project: project,
          version: flags.version || '0.0.0',
          desc: flags.description,
          robot: flags.robot || wechatConf.robot || 1,
          setting: wechatConf.setting,
          onProgressUpdate: (progress: string | MiniProgramCI.ITaskStatus): void => {
            if (typeof progress === 'string') {
              log(progress)
            } else {
              const {message, status} = progress
              if (status === 'doing') {
                log(`${message}上传中...`)
              } else if (status === 'done') {
                log(chalk.blue(`${message}上传成功!`))
              } else {
                log(chalk.red(`上传失败:${message}`))
              }
            }
          },
        })
        log(chalk.green('\n微信小程序上传成功!'))
        log(wechatUploadResult)
      } catch (error) {
        log(chalk.red(`微信上传失败:${error} \n`))
        log(error)
        return
      }
    }

    if (!type || type === 'alipay') {
      // 支付宝小程序上传
      log(chalk.yellow('支付宝小程序开始上传\n'))
      const {alipay: alipayConf} = projectConfig
      table && table({
        appId: alipayConf.appid,
        toolId: alipayConf.toolId,
        projectPath: alipayConf.projectPath,
        privateKey: `${alipayConf.privateKey.slice(0, 10)}...`,
        version: flags.version,
      })
      alipayInit({
        toolId: alipayConf.toolId,
        privateKey: alipayConf.privateKey,
      })
      try {
        const alipayUploadResult = await alipayUpload({
          project: `${_PWD_}${alipayConf.projectPath}`,
          appId: alipayConf.appid,
          packageVersion: flags.version, // 为空则线上包版本自增0.0.1
          clientType: 'alipay',
          experience: true,
          onProgressUpdate: log,
        })
        log(chalk.green('\n支付宝小程序上传成功!'))
        log(alipayUploadResult)
      } catch (error) {
        log(chalk.red(`支付宝上传失败:${error} \n`))
        log(error)
        return
      }
    }
    log(chalk.green('\nDone!'))
  }
}
