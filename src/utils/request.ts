/**
 * 发出请求，返回Promise
 * @param {string} url 请求url
 * @param {number} maxCount 最大请求次数
*/
function request(url: string, maxCount: number = 1): Promise<any> {
  return fetch(url as string).catch(() => maxCount <= 0 ? Promise.reject('请求失败') : request(url, maxCount))
}

/**
 * 并发请求 (大文件分片上传)
 * @param {string[url]} urls 待请求urls数组
 * @param {number} maxNum 最大并发数
*/
function concurRequest(urls: string[], maxNum: number = 1) {
  if (urls.length <= 0) return Promise.resolve([])
  return new Promise((resolve) => {
    let nextIndex = 0; // 下一次请求的下标
    let finishCount = 0; // 完成的请求数量
    const result: any[] = [];
    async function _request() {
      if (nextIndex >= urls.length) return
      const i = nextIndex;
      const url = urls[i]
      const resp = await fetch(url) // 请求接口，
      result[i] = resp
      finishCount++
      if (finishCount >= urls.length) {
        resolve(result)
      }
    }
    for (let i = 0; i < Math.min(maxNum, urls.length, 10); i++) {
      _request()
    }
  })
}