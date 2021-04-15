import {expect, test} from '@oclif/test'

const fs = require('fs')
const inquirer = require('inquirer')

const anwsers = [
  {type: ['wechat', 'alipay']},
  {wechatAppId: 'wx71c7975f28994501'},
  {wechatProjectPath: 'dist/wechat'},
  {wechatPrivateKeyPath: 'private.wx71c7975f28994501.key'},
  {alipayAppId: '2021002135673228'},
  {alipayToolId: '99332a6673414877ac4785e6397b5411'},
  {alipayProjectPath: 'dist/alipay'},
  {alipayPrivateKeyPath: 'pkcs8-private-pem'},
]

describe('init', () => {
  let count = 0
  const workDir = './test/test-project'

  test
  .stub(inquirer, 'prompt', () => anwsers[count++])
  .command(['init', '-p', workDir])
  .it('运行初始化命令', () => {
    const projectConfig = JSON.stringify(JSON.parse(fs.readFileSync(`${workDir}/miniuper.json`, 'utf8')))
    expect(projectConfig).to.contain('"wechat":{"appid":"wx71c7975f28994501","projectPath":"dist/wechat","privateKeyPath":"private.wx71c7975f28994501.key","type":"miniProgram","robot":1')
    expect(projectConfig).to.contain('"alipay":{"appid":"2021002135673228","toolId":"99332a6673414877ac4785e6397b5411","projectPath":"dist/alipay","privateKeyPath":"pkcs8-private-pem"')
  })
})
