<!-- components/Dialog/Dialog.vue -->
<template>
  <transition name="dialog-fade">
    <div
      v-if="modelValue"
      class="dialog-overlay"
      @click.self="handleOverlayClick"
    >
      <div class="dialog-container">
        <div class="dialog-header">
          <h3 class="dialog-title">{{ title }}</h3>
        </div>

        <div class="dialog-content">
          <slot>{{ content }}</slot>
        </div>

        <div class="dialog-footer">
          <button
            v-if="showCancel"
            class="dialog-btn dialog-cancel"
            @click="handleCancel"
          >
            {{ cancelText }}
          </button>
          <button
            v-if="showConfirm"
            class="dialog-btn dialog-confirm"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    content?: string;
    showCancel?: boolean;
    showConfirm?: boolean;
    cancelText?: string;
    confirmText?: string;
    closeOnClickOverlay?: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>(),
  {
    modelValue: false,
    showCancel: true,
    showConfirm: true,
    cancelText: "取消",
    confirmText: "确定",
    closeOnClickOverlay: true,
  }
);
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();
const showDialog = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const handleConfirm = () => {
  showDialog.value = false;
  props.onConfirm?.();
  emit("confirm");
};

const handleCancel = () => {
  showDialog.value = false;
  props.onCancel?.();
  emit("cancel");
};

const handleOverlayClick = () => {
  if (props.closeOnClickOverlay) {
    showDialog.value = false;
  }
};
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-container {
  background: white;
  border-radius: 8px;
  min-width: 400px;
  max-width: 80%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.dialog-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.dialog-title {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.dialog-content {
  padding: 20px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.dialog-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.dialog-btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  outline: none;
  transition: all 0.3s;
}

.dialog-cancel {
  background: #f0f0f0;
  color: #666;
}

.dialog-cancel:hover {
  background: #e0e0e0;
}

.dialog-confirm {
  background: #409eff;
  color: white;
}

.dialog-confirm:hover {
  background: #79bbff;
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-active .dialog-container,
.dialog-fade-leave-active .dialog-container {
  transition: transform 0.3s;
}

.dialog-fade-enter-from .dialog-container,
.dialog-fade-leave-to .dialog-container {
  transform: scale(0.9);
}
</style>
