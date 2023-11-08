import {readFileSync} from 'fs'
import pc from 'picocolors'
import fetch from 'node-fetch'
import {Command, flags} from '@oclif/command'
import {Project as WechatInit, upload as wechatUpload} from 'miniprogram-ci'
import {setConfig as alipayInit, miniUpload as alipayUpload} from 'miniu'

import {Config} from '../types'
import {textInterpolations} from '../utils'

// eslint-disable-next-line no-console
// eslint-disable-next-line node/no-unsupported-features/node-builtins
const {log, table} = console

const Types = {
  wechat: '微信',
  alipay: '支付宝',
}

export default class Upload extends Command {
  static description = '小程序上传命令'

  static flags = {
    help: flags.help({char: 'h', description: '展示 CLI 帮助'}),
    // flag with no value (-v, --version)
    version: flags.build({char: 'v', description: '上传版本号'})(),
    // flag with no value (-d, --description)
    description: flags.build({char: 'd', description: '版本描述'})(),
    // flag with no value (-r, --robot)
    robot: flags.build({char: 'r', description: 'CI机器人序号 1 - 30', parse: (robot: string): any => Number(robot), default: 1})(),
    // flag with no value (-p, --path)
    path: flags.build({char: 'p', description: '工作路径', default: process.cwd()})(),
  }

  static args = [{name: 'type', description: '小程序类型 wechat|alipay (非必填)'}]

  async run() {
    const {args, flags} = this.parse(Upload)
    const _PWD_ = flags.path ? flags.path : process.cwd()

    let projectConfig: Config.Configs
    try {
      projectConfig = JSON.parse(readFileSync(`${_PWD_}/miniuper.json`, 'utf8'))
    } catch (error) {
      log(error)
      log('当前目录下 miniuper.json 配置文件读取失败，请使用 miniuper init 命令生成该配置文件!')
      return
    }

    const {type} = args
    if ((!type || type === 'wechat') && projectConfig.wechat) {
      // 微信小程序上传
      log(pc.yellow('微信小程序开始上传\n'))
      const wechatConf = projectConfig.wechat
      table && table({
        appid: wechatConf.appid,
        projectPath: wechatConf.projectPath,
        privateKeyPath: wechatConf.privateKeyPath,
        version: flags.version === 'undefined' ? '0.0.0' : flags.version || '0.0.0',
        desc: flags.description || '空的版本描述',
        robot: flags.robot || wechatConf.robot || 1,
      })
      let project
      try {
        project = new WechatInit({
          appid: wechatConf.appid,
          type: 'miniProgram',
          projectPath: `${_PWD_}/${wechatConf.projectPath}`,
          privateKeyPath: `${_PWD_}/${wechatConf.privateKeyPath}`,
          ignores: ['node_modules/**/*'],
        })
      } catch (error) {
        log(pc.red(`微信初始化失败:${error} \n`))
        log(error)
        return
      }

      try {
        const wechatUploadResult = await wechatUpload({
          project: project,
          version: flags.version === 'undefined' ? '0.0.0' : flags.version || '0.0.0',
          desc: flags.description || '空的版本描述',
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
                log(pc.blue(`${message}上传成功!`))
              } else {
                log(pc.red(`上传失败:${message}`))
              }
            }
          },
        })
        log(pc.green('\n微信小程序上传成功!'))
        log(wechatUploadResult)
        if (wechatConf.experience && wechatConf.experience.url && wechatConf.experience.method) {
          await this.pushDingding({
            experience: wechatConf.experience,
            version: flags.version,
            description: flags.description,
          })
        }
      } catch (error) {
        log(pc.red(`微信上传失败:${error} \n`))
        log(error)
        return
      }
    }

    if ((!type || type === 'alipay') && projectConfig.alipay) {
      // 支付宝小程序上传
      log(pc.yellow('支付宝小程序开始上传\n'))
      const alipayConf = projectConfig.alipay
      let privateKey: string
      try {
        privateKey = readFileSync(`${_PWD_}/${alipayConf.privateKeyPath}`, 'utf8')
      } catch (error) {
        log(error)
        log(`当前目录下支付宝上传私钥文件 ${alipayConf.privateKeyPath} 读取失败，检查该文件!`)
        return
      }
      table && table({
        appId: alipayConf.appid,
        toolId: alipayConf.toolId,
        projectPath: alipayConf.projectPath,
        privateKey: alipayConf.privateKeyPath,
        version: flags.version === 'undefined' ? undefined : flags.version,
        desc: flags.description || '空的版本描述',
        experience: Boolean(alipayConf.experience),
      })
      alipayInit({
        toolId: alipayConf.toolId,
        privateKey,
      })
      try {
        const alipayUploadResult = await alipayUpload({
          project: `${_PWD_}/${alipayConf.projectPath}`,
          appId: alipayConf.appid,
          packageVersion: flags.version === 'undefined' ? undefined : flags.version, // 为undefined则线上包版本自增0.0.1
          clientType: 'alipay',
          experience: Boolean(alipayConf.experience),
          onProgressUpdate: log,
        })
        log(pc.green('\n支付宝小程序上传成功!'))
        log(alipayUploadResult)
        if (alipayUploadResult.qrCodeUrl && alipayConf.experience && alipayConf.experience.url && alipayConf.experience.method) {
          const {qrCodeUrl, packageVersion} = alipayUploadResult
          await this.pushDingding({
            experience: alipayConf.experience,
            qrCodeUrl,
            version: packageVersion,
            description: flags.description,
            type: 'alipay',
          })
        }
      } catch (error) {
        log(pc.red(`支付宝上传失败:${error} \n`))
        log(error)
        return
      }
    }
    log(pc.green('\nUpload Done!'))
  }

  async pushDingding({
    experience,
    qrCodeUrl,
    version,
    description,
    type = 'wechat',
  }: {experience: Config.Experience; qrCodeUrl?: string; version?: string; description?: string; type?: 'wechat' | 'alipay'}) {
    try {
      const {url, method, contentType} = experience
      let {body} = experience
      body = qrCodeUrl ? textInterpolations(body, 'qrCodeUrl', qrCodeUrl) : body
      body = textInterpolations(body, 'version', version || '0.0.0')
      body = textInterpolations(body, 'description', description || '空的版本描述')
      const result = await fetch(url, {method, body, headers: {'Content-Type': contentType}}).then((res: any) => res.json())
      if (result.errcode === 0) {
        log(pc.green(`\n${Types[type]}体验版二维码推送成功!`))
      } else {
        log(pc.red(`\n${Types[type]}体验版二维码推送失败!`))
      }
    } catch (error) {
      log(error)
      log(pc.red(`\n${Types[type]}体验版二维码推送失败!`))
    }
  }
}
