export const parseQuery = (query: string) => {
  const params: { [key: string]: { value: string; valueNextIndex: number } } =
    {}
  let isQuote = false
  let wordStack = ''
  let lastlabel = ''
  for (let i = 0; i < query.length; i++) {
    const q = query[i]
    switch (q) {
      case `"`: {
        if (!isQuote) {
          isQuote = true
          break
        }
        if (lastlabel) {
          isQuote = false
          params[lastlabel] = { valueNextIndex: i, value: wordStack }
          lastlabel = ''
          wordStack = ''
        }
        break
      }
      case `:`: {
        if (isQuote) {
          wordStack += q
        } else {
          lastlabel = wordStack
          wordStack = ''
        }
        break
      }
      case ' ': {
        if (isQuote) {
          wordStack += q
        } else {
          if (lastlabel && wordStack) {
            params[lastlabel] = { valueNextIndex: i, value: wordStack }
          }
          lastlabel = ''
          wordStack = ''
        }
        break
      }
      default: {
        wordStack += q
      }
    }
  }
  if (lastlabel && wordStack) {
    params[lastlabel] = { valueNextIndex: query.length, value: wordStack }
  }
  return params
}

export const getRequestParams = (query: string) => {
  const params = parseQuery(query)
  const res: { [key: string]: string } = {}
  for (const [k, v] of Object.entries(params)) {
    res[k] = v.value
  }
  return res
}

export const validateParams = (params: { [key: string]: string }) => {
  for (const [k, v] of Object.entries(params)) {
    let isValidKeyName = false
    for (const allowKey of ALLOW_KEYS) {
      if (allowKey.key === k) {
        isValidKeyName = true
        if (allowKey.type === 'string') {
          break
        }
        if (isNaN(Number(v))) {
          throw `${allowKey.key}は数字を指定してください`
        }
        break
      }
    }
    if (!isValidKeyName) {
      throw `${k}は許可されていません`
    }
  }
  return true
}

export const ALLOW_KEYS = [
  { key: 'name', description: 'ISUの名前(文字列)', type: 'string' },
  { key: 'character', description: 'ISUの性格(文字列)', type: 'string' },
  {
    key: 'catalog_name',
    description: 'ISUのカタログ上での名前(文字列)',
    type: 'string'
  },
  {
    key: 'min_limit_weight',
    description: 'ISUの耐荷重の最小値(数値)',
    type: 'number'
  },
  {
    key: 'max_limit_weight',
    description: 'ISUの耐荷重の最大値(数値)',
    type: 'number'
  },
  {
    key: 'catalog_tags',
    description: 'ISUのカタログ上でのタグ名(文字列)(カンマ区切り)',
    type: 'string'
  }
] as const