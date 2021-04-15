import {expect, test} from '@oclif/test'
import {mergeDeep, whenHasType, validateInput, textInterpolations} from '../../src/utils'
describe('utils', () => {
  test
  .it('test mergeDeep', () => {
    const object = {
      a: 1,
      b: {
        x: 1,
        y: {
          i: 1,
          n: 1,
        },
        z: 1,
      },
    }
    const other = {
      a: 2,
      b: {
        x: 2,
        y: {
          i: 2,
        },
        s: 2,
      },
      c: 2,
    }
    expect(JSON.stringify(mergeDeep(object, other))).to.be.equal('{"a":2,"b":{"x":2,"y":{"i":2,"n":1},"s":2,"z":1},"c":2}')
  })

  test
  .it('test whenHasType', () => {
    const anws = {
      type: ['wechat', 'alipay'],
    }
    expect(whenHasType(anws, 'wechat')).to.be.true
    expect(whenHasType(anws, 'alipay')).to.be.true
  })

  test
  .it('test validateInput', () => {
    expect(validateInput('  value ')).to.be.true
    expect(validateInput('  ')).to.be.equal('请输入有效值')
  })

  test
  .it('test textInterpolations', () => {
    expect(textInterpolations('{"支付宝小程序体验版":"{{qrCodeUrl}}"}', 'qrCodeUrl', 'https://example.com')).to.be.equal('{"支付宝小程序体验版":"https://example.com"}')
  })
})
