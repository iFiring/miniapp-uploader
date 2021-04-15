import {expect, test} from '@oclif/test'
import {mergeDeep} from '../../src/utils'
const fs = require('fs')

const updateMiniuperJson = (value: any) => {
  const workDir = './test/test-project'
  try {
    const projectConfig = JSON.parse(fs.readFileSync(`${workDir}/miniuper.json`, 'utf8'))
    fs.writeFileSync(`${workDir}/miniuper.json`, JSON.stringify(mergeDeep(projectConfig, value), null, 2))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    throw error
  }
}

describe('upload', () => {
  const workDir = './test/test-project'
  test
  .timeout(600000)
  .do(() => updateMiniuperJson({
    alipay: {
      experience: {
        url: 'https://oapi.dingtalk.com/robot/send?access_token=a7251671751e04e7bed6cb1248bb88860c415a8c38d83a2829feb757e31626b8',
        method: 'POST',
        contentType: 'application/json',
        body: '{"msgtype":"markdown","markdown":{"title":"体验版","text":"#### 支付宝体验版：\n![支付宝体验版]({{qrCodeUrl}})\n##### 版本号: {{version}}\n##### 版本描述: {{description}}"},"at":{"isAtAll":true}}',
      },
    },
  }))
  .stdout()
  .command(['upload', '-v', 'undefined', '-p', workDir])
  .it('运行完整上传命令', ctx => {
    expect(ctx.stdout).to.contain('微信小程序上传成功!')
    expect(ctx.stdout).to.contain('支付宝小程序上传成功!')
    expect(ctx.stdout).to.contain('支付宝体验版二维码推送成功!')
  })

  test
  .timeout(600000)
  .do(() => updateMiniuperJson({alipay: {experience: {method: 'METHOD'}}}))
  .stdout()
  .command(['upload', 'alipay', '-v', 'undefined', '-p', workDir])
  .it('用错误的method推送二维码', ctx => {
    expect(ctx.stdout).to.contain('支付宝体验版二维码推送失败')
  })

  test
  .stdout()
  .command(['upload', '-v', 'undefined', '-p', `${workDir}/empty/`])
  .it('在空文件夹运行上传命令', ctx => {
    expect(ctx.stdout).to.contain('当前目录下 miniuper.json 配置文件读取失败')
  })

  test
  .do(() => updateMiniuperJson({wechat: {appid: ''}}))
  .do(() => updateMiniuperJson({wechat: {privateKeyPath: ''}}))
  .stdout()
  .command(['upload', 'wechat', '-v', 'undefined', '-p', workDir])
  .it('运行无效的微信appid和私钥路径的上传命令', ctx => {
    expect(ctx.stdout).to.contain('微信初始化失败')
  })

  test
  .do(() => updateMiniuperJson({alipay: {appid: ''}}))
  .stdout()
  .command(['upload', 'alipay', '-v', 'undefined', '-p', workDir])
  .it('运行无效的支付宝appid的上传命令', ctx => {
    expect(ctx.stdout).to.contain('支付宝上传失败')
  })

  test
  .do(() => updateMiniuperJson({alipay: {toolId: ''}}))
  .stdout()
  .command(['upload', 'alipay', '-v', 'undefined', '-p', workDir])
  .it('运行无效的支付宝toolId的上传命令', ctx => {
    expect(ctx.stdout).to.contain('支付宝上传失败')
  })

  test
  .do(() => updateMiniuperJson({alipay: {privateKeyPath: ''}}))
  .stdout()
  .command(['upload', 'alipay', '-v', 'undefined', '-p', workDir])
  .it('运行无效的支付宝私钥路径的上传命令', ctx => {
    expect(ctx.stdout).to.contain('支付宝上传私钥文件')
    expect(ctx.stdout).to.contain('读取失败，检查该文件')
  })
})
