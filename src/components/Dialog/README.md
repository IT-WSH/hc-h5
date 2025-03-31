# Dialog 弹窗组件文档

## 组件概述
一个支持双模式调用的优雅弹窗组件，提供完整的 TypeScript 支持，适用于 Vue3 项目。支持两种使用方式：
- **组件式调用**：通过模板直接使用
- **命令式调用**：通过 JavaScript API 调用

## 安装与注册
```typescript
// main.ts
import Dialog from '@/components/Dialog'

const app = createApp(App)
app.config.globalProperties.$dialog = Dialog
```
## 组件特性
- 支持 v-model 双向绑定
- 完整的 TypeScript 类型支持
- 灵活的内容配置
- 可定制的操作按钮
- 优雅的动画过渡
- 多实例堆叠管理
- 遮罩层点击控制

## 快速开始
### 组件式调用
``` vue
<template>
  <Dialog 
    v-model="showDialog"
    title="系统提示"
    content="文件保存成功！"
    :show-cancel="false"
    @confirm="handleConfirm"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Dialog from '@/components/Dialog/Dialog.vue'

const showDialog = ref(false)
const handleConfirm = () => console.log('Confirmed!')
</script>
```

### 命令式调用
``` typescript
import { Dialog } from '@/components/Dialog'

// 简单提示
Dialog.show({
  title: '操作成功',
  content: '数据已更新',
  showCancel: false
})

// 确认对话框
const confirmDelete = async () => {
  const result = await Dialog.show({
    title: '危险操作',
    content: '确定要删除这个项目吗？',
    cancelText: '放弃',
    confirmText: '永久删除'
  })
  
  if (result === 'confirm') {
    // 执行删除操作
  }
}
```

## API 文档

### Props
|        参数         |       说明       |  类型   | 默认值 |
| :-----------------: | :--------------: | :-----: | :----: |
|     modelValue      | 控制弹窗显示状态 | Boolean | false  |
|        title        |     弹窗标题     | String  |   -    |
|       content       |     弹窗内容     | String  |   -    |
|     showCancel      |   显示取消按钮   | Boolean |  true  |
|     showConfirm     |   显示确认按钮   | Boolean |  true  |
|     cancelText      |   取消按钮文本   | String  |  取消  |
|     confirmText     |   确认按钮文本   | String  |  确定  |
| closeOnClickOverlay |  点击遮罩层关闭  | Boolean |  true  |
### Events

| 事件名  |       说明       | 参数  |
| :-----: | :--------------: | :---: |
| confirm | 确认按钮点击事件 |   -   |
| cancel  | 取消按钮点击事件 |   -   |

### 命令式 API
``` typescript
interface DialogOptions {
  title?: string
  content: string
  showCancel?: boolean
  showConfirm?: boolean
  cancelText?: string
  confirmText?: string
  closeOnClickOverlay?: boolean
  confirm?: () => void // 监听点击确定
  cancel?: () => void // 监听取消
}

type DialogAction = 'confirm' | 'cancel'

Dialog.show(options: DialogOptions): Promise<DialogAction>
Dialog.closeAll(): void
```

## 样式定制
### CSS 变量

``` css
/* 在全局样式中覆盖 */
:root {
  --dialog-z-index: 2000;
  --dialog-radius: 8px;
  --dialog-primary-color: #409eff;
  --dialog-title-size: 18px;
}
```
### 自定义类名
``` vue
<Dialog class="custom-dialog" />
```
``` css
.custom-dialog {
  .dialog-container {
    background: #f5f7fa;
  }
  
  .dialog-confirm {
    background: #ff4757;
  }
}
```

## 扩展功能示例
### 添加图标支持
``` vue
<template>
  <div class="dialog-header">
    <Icon :name="iconType" class="dialog-icon" />
    <h3 class="dialog-title">{{ title }}</h3>
  </div>
</template>

<script setup lang="ts">
defineProps({
  iconType: {
    type: String,
    default: 'info'
  }
})
</script>
```
### 全局配置扩展
``` typescript
// dialog.config.ts
type DialogConfig = {
  zIndex?: number
  duration?: number
  locale?: 'zh' | 'en'
}

let globalConfig: DialogConfig = {}

export const configDialog = (config: DialogConfig) => {
  globalConfig = { ...globalConfig, ...config }
}
</script>
```

## 最佳实践
### 统一错误处理

``` typescript
// utils/dialog.ts
export const errorDialog = (message: string) => {
  return Dialog.show({
    title: '错误提示',
    content: message,
    showCancel: false,
    confirmText: '我知道了',
    closeOnClickOverlay: false
  })
}

// 使用示例
try {
  await fetchData()
} catch (err) {
  errorDialog(err.message)
}
```


### 表单弹窗封装
``` vue
<!-- components/FormDialog.vue -->
<template>
  <Dialog v-model="showDialog">
    <template #default>
      <form @submit.prevent="handleSubmit">
        <input v-model="formData.name">
        <button type="submit">提交</button>
      </form>
    </template>
  </Dialog>
</template>
```

## 注意事项
1. 在 Nuxt.js 中使用时需要 SSR 兼容处理

2. 多个弹窗同时显示时会有堆叠顺序控制

3. 推荐在 onBeforeUnmount 生命周期中调用 closeAll

4. 内容过长时需要自行处理滚动逻辑