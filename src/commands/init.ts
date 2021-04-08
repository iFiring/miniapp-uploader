import {Command, flags} from '@oclif/command'
import {Config} from '../types'
import {mergeDeep, whenHasType, validateInput} from '../utils'

const fs = require('fs')
const chalk = require('chalk')
const inquirer = require('inquirer')
const configTpl = require('../config/miniuper.tpl.json')
// eslint-disable-next-line no-console
const {log} = console

export default class Init extends Command {
  static description = '初始化配置命令'

  static flags = {
    help: flags.help({char: 'h', description: '展示 CLI 帮助'}),
  }

  async run() {
    this.parse(Init)
    let answers
    try {
      answers = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'type',
          message: '请选择您的小程序类型（多选）',
          choices: [
            {
              name: 'wechat',
              checked: true,
            },
            {
              name: 'alipay',
            },
          ],
        },
        {
          type: 'input',
          name: 'wechatAppId',
          message: `${chalk.green('微信')}小程序的AppId`,
          when: (anws: any) => whenHasType(anws, 'wechat'),
          validate: validateInput,
        },
        {
          type: 'input',
          name: 'wechatProjectPath',
          message: `${chalk.green('微信')}小程序的上传目录（相对路径）`,
          when: (anws: any) => whenHasType(anws, 'wechat'),
          validate: validateInput,
        },
        {
          type: 'input',
          name: 'wechatPrivateKeyPath',
          message: `${chalk.green('微信')}小程序的代码上传密钥`,
          when: (anws: any) => whenHasType(anws, 'wechat'),
          validate: validateInput,
          default: function () {
            return 'private.XXX.key'
          },
        },
        {
          type: 'input',
          name: 'alipayAppId',
          message: `${chalk.cyan('支付宝')}小程序的AppId`,
          when: (anws: any) => whenHasType(anws, 'alipay'),
          validate: validateInput,
        },
        {
          type: 'input',
          name: 'alipayProjectPath',
          message: `${chalk.cyan('支付宝')}小程序的上传目录（相对路径）`,
          when: (anws: any) => whenHasType(anws, 'alipay'),
          validate: validateInput,
        },
        {
          type: 'input',
          name: 'alipayToolId',
          message: `${chalk.cyan('支付宝')}小程序的工具ID`,
          when: (anws: any) => whenHasType(anws, 'alipay'),
          validate: validateInput,
        },
        {
          type: 'input',
          name: 'alipayPrivateKey',
          message: `${chalk.cyan('支付宝')}小程序的工具私钥`,
          when: (anws: any) => whenHasType(anws, 'alipay'),
        },
      ])
    } catch (error) {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
        log(error)
      }
    }

    const wechatConfig: Config.WechatConfig = {
      appid: answers.wechatAppId,
      projectPath: answers.wechatProjectPath,
      privateKeyPath: answers.wechatPrivateKeyPath,
    }
    const alipayConfig: Config.AlipayConfig = {
      appid: answers.alipayAppId,
      projectPath: answers.alipayProjectPath,
      toolId: answers.alipayToolId,
      privateKey: answers.alipayPrivateKey,
    }
    const initConfig: Config.Configs = {}
    if (whenHasType(answers, 'wechat')) {
      initConfig.wechat = mergeDeep(configTpl.wechat, wechatConfig)
    }
    if (whenHasType(answers, 'alipay')) {
      initConfig.alipay = mergeDeep(configTpl.alipay, alipayConfig)
    }
    try {
      log(initConfig)
      fs.writeFileSync(`${process.cwd()}/miniuper.json`, JSON.stringify(initConfig, null, 2))
    } catch (error) {
      log(error)
    }
    log(chalk.green('\n Init Done!'))
    this.exit(0)
  }
}
