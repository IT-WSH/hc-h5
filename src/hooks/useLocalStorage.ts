// hooks/useLocalStorage.ts
import { ref, watchEffect } from 'vue'
import { storage } from '@/utils/storage'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const data = ref<T>(defaultValue)

  // 读取本地存储
  const storedValue = storage(key)
  if (storedValue) {
    try {
      data.value = storedValue
    } catch {
      data.value = defaultValue
    }
  }

  // 监听变化写入存储
  watchEffect(() => {
    storage(key, data.value)
  })

  return data
}

// 使用示例
// const darkMode = useLocalStorage<boolean>('isLogin', false)
// darkMode.value = true; // 直接修改