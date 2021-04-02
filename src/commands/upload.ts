import {Command, flags} from '@oclif/command'
import * as chalk from 'chalk'
import * as fs from 'fs'
import {Project as WechatInit, upload as wechatUpload} from 'miniprogram-ci'
import {setConfig as alipayInit, miniUpload as alipayUpload} from 'miniu'

import {Config} from '../types'

// eslint-disable-next-line no-console
const log = console.log

export default class Upload extends Command {
  static description = '小程序上传命令'

  static flags = {
    help: flags.help({char: 'h', description: '展示 CLI 帮助'}),
    // flag with no value (-v, --version)
    version: flags.build({char: 'v', description: '上传版本号', required: true})(),
    // flag with no value (-d, --description)
    description: flags.build({char: 'd', description: '版本描述', required: true})(),
    // flag with no value (-r, --robot)
    robot: flags.build({char: 'r', description: 'CI机器人序号 0 - 30', parse: (robot: string): any => Number(robot)})(),
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
      const project = new WechatInit({
        appid: projectConfig.wechat.appid,
        type: 'miniProgram',
        projectPath: `${_PWD_}${projectConfig.wechat.projectPath}`,
        privateKeyPath: `${_PWD_}${projectConfig.wechat.privateKeyPath}`,
        ignores: ['node_modules/**/*'],
      })

      try {
        const wechatUploadResult = await wechatUpload({
          project: project,
          version: flags.version || '0.0.0',
          desc: flags.description || `CI机器人${flags.robot}的一段描述`,
          robot: flags.robot || 0,
          setting: projectConfig.wechat.setting,
          onProgressUpdate: (progress: any) => {
            const {
              message, status,
            } = progress
            if (status === 'doing') {
              log(`${message}上传中...`)
            } else if (status === 'done') {
              log(chalk.blue(`${message}上传成功!`))
            } else {
              log(chalk.red(`上传失败:${message}`))
            }
          },
        })
        log(chalk.green('\n微信小程序上传成功!'))
        log(wechatUploadResult)
      } catch (error) {
        log(chalk.red(`微信上传失败:${error} \n`))
        log(error)
      }
    }

    if (!type || type === 'alipay') {
      // 支付宝小程序上传
      log(chalk.yellow('支付宝小程序开始上传\n'))
      alipayInit({
        toolId: projectConfig.alipay.toolId,
        privateKey: projectConfig.alipay.privateKey,
      })
      try {
        const alipayUploadResult = await alipayUpload({
          project: `${_PWD_}${projectConfig.alipay.projectPath}`,
          appId: projectConfig.alipay.appid,
          packageVersion: flags.version || undefined, // 为空则线上包版本自增0.0.1
          clientType: 'alipay',
          experience: true,
          onProgressUpdate: log,
        })
        log(chalk.green('\n支付宝小程序上传成功!'))
        log(alipayUploadResult)
      } catch (error) {
        log(chalk.red(`支付宝上传失败:${error} \n`))
        log(error)
      }
    }
  }
}
