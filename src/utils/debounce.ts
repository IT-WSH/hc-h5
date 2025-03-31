import { customRef } from "vue";

interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  cancel(): void;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  immediate?: boolean // 新增立即执行选项
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let shouldCallImmediately = immediate; // 控制首次立即执行

  const debounced = function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    // 立即执行逻辑
    if (shouldCallImmediately) {
      func.apply(this, args);
      shouldCallImmediately = false; // 关闭立即执行
      timeoutId = setTimeout(() => {
        shouldCallImmediately = immediate; // 延迟结束后重置状态
      }, delay);
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        shouldCallImmediately = immediate; // 执行后恢复初始状态
      }, delay);
    }
  } as DebouncedFunction<T>;

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
      shouldCallImmediately = immediate; // 取消后恢复立即执行能力
    }
  };

  return debounced;
}



/* 使用示例
// 原函数
function saveData(content: string) {
  console.log(`Saving: ${content}`);
}

// 防抖处理（立即执行模式）
const debouncedSave = debounce(saveData, 1000, true);

// 第一次调用立即执行
debouncedSave("draft1"); // 立刻输出 "Saving: draft1"

// 1秒内的后续调用被忽略
debouncedSave("draft2"); // 无输出
debouncedSave("draft3"); // 无输出

// 1秒后再次调用
setTimeout(() => {
  debouncedSave("final"); // 立刻输出 "Saving: final"
}, 1000);

// 调用取消，恢复立即执行能力
debouncedSave.cancel()
debouncedSave("draft2"); // 立刻输出 "Saving: draft2"

*/
/**
 * 自定义防抖Ref
 * */
export function debounceRef(value: any, delay = 1000) {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  return customRef((track, trigger) => ({
    get() {
      // 收集依赖
      track()
      return value
    },
    set(newValue) {
      timerId && clearTimeout(timerId)
      timerId = setTimeout(() => {
        value = newValue
        // 派发更新
        trigger()
      }, delay)
    }
  }))
}

