// components/Dialog/index.ts
import { App, createApp, ComponentPublicInstance, h, reactive } from 'vue'
import DialogComponent from './Dialog.vue'

type DialogOptions = {
  title?: string
  content: string
  showCancel?: boolean
  showConfirm?: boolean
  cancelText?: string
  confirmText?: string
  closeOnClickOverlay?: boolean
  confirm?: () => void
  cancel?: () => void
}
interface CallObj {
  instance: App<Element>
  container: HTMLDivElement;
  close: () => void
}

const dialogInstances: App<Element>[] = []

export const Dialog = {
  show(options: DialogOptions): Promise<CallObj> {
    return new Promise((resolve) => {
      const container = document.createElement('div')

      const instance = createApp({
        render() {
          return h(DialogComponent, {
            ...options,
            modelValue: true,
            'onUpdate:modelValue': (val: boolean) => {
              if (!val) {
                unmountDialog()
              }
            },
            onConfirm: () => {
              options.confirm?.()
            },
            onCancel: () => {
              options.cancel?.()
            }
          })
        }
      })
      let unmountDialog = () => {
        instance.unmount()
        const index = dialogInstances.indexOf(instance)
        if (index > -1) {
          document.body.removeChild(container)
          dialogInstances.splice(index, 1)
        }
      }
      document.body.appendChild(container)
      instance.mount(container)
      dialogInstances.push(instance)
      const callObj: CallObj = {
        instance,
        container,
        close: unmountDialog
      }
      resolve(callObj)
    })
  },
  closeAll() {
    dialogInstances.forEach(instance => {
      instance.unmount()
    })
    dialogInstances.length = 0
  }
}