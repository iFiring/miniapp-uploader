export const mergeDeep = (target: any, source: any) => {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object) Object.assign(source[key], mergeDeep(target[key], source[key]))
  }
  Object.assign(target || {}, source)
  return target
}

export const whenHasType = (anws: any, type: string): boolean => {
  return anws.type.includes(type)
}

export const validateInput = (input: string): true | string =>  {
  const trimInput = input.trim()
  if (trimInput) return true
  return '请输入有效值'
}

