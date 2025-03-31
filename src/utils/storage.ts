interface StorageData {
  value: any;
  expired?: number; // 可选属性，标记过期时间戳
}
export function storage(key: string, value: any = undefined, expired: number | undefined = undefined) {
  const timestamp = new Date().getTime();
  const storageKey = key + '_hc'
  let callData = ''
  // 有值，修改本地缓存
  if (!!value) {
    const storageData: StorageData = {
      value: value,
    }
    // 有效时间拼接时间戳
    if (undefined != expired) {
      storageData.expired = Number(expired) + timestamp;
    }
    localStorage.setItem(storageKey, JSON.stringify(storageData))
  } else {
    try {
      const storedItem = localStorage.getItem(storageKey)
      if (storedItem) {
        let storageData: StorageData = JSON.parse(storedItem)
        if (storageData.expired) {
          if (storageData.expired > timestamp) {
            callData = storageData.value
          }
        } else {
          callData = storageData.value
        }
      }
    } catch (error) {

    }
  }
  return callData
}