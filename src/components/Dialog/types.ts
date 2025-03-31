// components/Dialog/types.ts
export interface DialogOptions {
  /** 弹窗标题 */
  title?: string
  /** 弹窗内容 */
  content: string
  /** 是否显示取消按钮 */
  showCancel?: boolean
  /** 是否显示确认按钮 */
  showConfirm?: boolean
  /** 取消按钮文本 */
  cancelText?: string
  /** 确认按钮文本 */
  confirmText?: string
  /** 点击遮罩层是否关闭 */
  closeOnClickOverlay?: boolean
}

export type DialogAction = 'confirm' | 'cancel'