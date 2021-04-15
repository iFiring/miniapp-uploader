import {Command, flags} from '@oclif/command'
import {Config} from '../types'
import {mergeDeep, whenHasType, validateInput} from '../utils'
import configTpl from '../config/miniuper.tpl'

const fs = require('fs')
const chalk = require('chalk')
const inquirer = require('inquirer')
// eslint-disable-next-line no-console
const {log} = console

export default class Init extends Command {
  static description = '初始化配置命令'

  static flags = {
    help: flags.help({char: 'h', description: '展示 CLI 帮助'}),
    // flag with no value (-p, --path)
    path: flags.build({char: 'p', description: '工作路径', default: process.cwd()})(),
  }

  async run() {
    const {flags} = this.parse(Init)
    const _PWD_ = flags.path ? flags.path : process.cwd()
    const answers: any = {}
    try {
      Object.assign(answers, await inquirer.prompt({
        type: 'checkbox',
        name: 'type',
        message: '请选择您的小程序类型（多选）',
        choices: [{name: 'wechat', checked: true}, {name: 'alipay'}],
      }))
      Object.assign(answers, await inquirer.prompt({
        type: 'input', name: 'wechatAppId', message: `${chalk.green('微信')}小程序的AppId`,
        when: () => whenHasType(answers, 'wechat'),
        validate: validateInput,
      }))
      Object.assign(answers, await inquirer.prompt({
        type: 'input',
        name: 'wechatProjectPath',
        message: `${chalk.green('微信')}小程序的上传目录（相对路径）`,
        when: () => whenHasType(answers, 'wechat'),
        validate: validateInput,
      }))
      Object.assign(answers, await inquirer.prompt({
        type: 'input',
        name: 'wechatPrivateKeyPath',
        message: `${chalk.green('微信')}小程序代码上传的密钥（相对）路径`,
        when: () => whenHasType(answers, 'wechat'),
        validate: validateInput,
        default: function () {
          return 'private.XXX.key'
        },
      }))
      Object.assign(answers, await inquirer.prompt({
        type: 'input',
        name: 'alipayAppId',
        message: `${chalk.cyan('支付宝')}小程序的AppId`,
        when: () => whenHasType(answers, 'alipay'),
        validate: validateInput,
      }))
      Object.assign(answers, await inquirer.prompt({
        type: 'input',
        name: 'alipayToolId',
        message: `${chalk.cyan('支付宝')}小程序的工具ID`,
        when: () => whenHasType(answers, 'alipay'),
        validate: validateInput,
      }))
      Object.assign(answers, await inquirer.prompt({
        type: 'input',
        name: 'alipayProjectPath',
        message: `${chalk.cyan('支付宝')}小程序的上传目录（相对路径）`,
        when: () => whenHasType(answers, 'alipay'),
        validate: validateInput,
      }))
      Object.assign(answers, await inquirer.prompt({
        type: 'input',
        name: 'alipayPrivateKeyPath',
        message: `${chalk.cyan('支付宝')}小程序代码上传的私钥（相对）路径`,
        when: () => whenHasType(answers, 'alipay'),
        default: function () {
          return 'pkcs8-private-pem'
        },
      }))
    } catch (error) {
      log(error)
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
      privateKeyPath: answers.alipayPrivateKeyPath,
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
      fs.writeFileSync(`${_PWD_}/miniuper.json`, JSON.stringify(initConfig, null, 2))
    } catch (error) {
      log(error)
    }
    log(chalk.green('\n Init Done!'))
  }
}
