<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>{{ title }}</h1>
      </div>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="phone">手机号</label>
          <input
            id="phone"
            type="text"
            v-model="form.phone"
            placeholder="请输入手机号"
            :class="{ 'input-error': errors.phone }"
          />
          <span class="error-message" v-if="errors.phone">
            {{ errors.phone }}
          </span>
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            type="password"
            v-model="form.password"
            placeholder="请输入密码"
            :class="{ 'input-error': errors.password }"
          />
          <span class="error-message" v-if="errors.password">
            {{ errors.password }}
          </span>
        </div>

        <button type="submit" class="login-button" :disabled="loading">
          {{ loading ? "登录中..." : "登录" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const title = ref("用户登录");
const loading = ref(false);
const form = reactive({
  phone: "",
  password: "",
});

const errors = reactive({
  phone: "",
  password: "",
});

const opts = reactive({
  goodsList: [],
  userInfo: {},
});

const validateForm = (): boolean => {
  let isValid = true;

  errors.phone = "";
  errors.password = "";

  if (!form.phone.trim()) {
    errors.phone = "请输入用户名";
    isValid = false;
  } else if (form.phone.length < 3 || form.phone.length > 12) {
    errors.phone = "用户名长度在3-12个字符之间";
    isValid = false;
  }

  if (!form.password) {
    errors.password = "请输入密码";
    isValid = false;
  } else if (form.password.length < 6 || form.password.length > 18) {
    errors.password = "密码长度在6-18个字符之间";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = () => {
  if (!validateForm()) return;

  loading.value = true;

  setTimeout(() => {
    loading.value = false;
    alert("登录成功");
    router.push("/");
  }, 1000);
};
</script>
<style lang="scss" scoped>
$primary-color: #409eff;
$error-color: #f56c6c;
$text-color: #333;
$light-gray: #f5f7fa;
$border-color: #ddd;

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: $light-gray;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;

  .login-container {
    width: 100%;
    max-width: 400px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 2rem;

    .login-header {
      text-align: center;
      margin-bottom: 2rem;

      h1 {
        color: $text-color;
        font-size: 1.5rem;
        margin: 0;
      }
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        label {
          font-size: 0.875rem;
          color: $text-color;
        }

        input {
          padding: 0.75rem 1rem;
          border: 1px solid $border-color;
          border-radius: 4px;
          font-size: 0.875rem;
          transition: border-color 0.3s;

          &:focus {
            outline: none;
            border-color: $primary-color;
          }

          &.input-error {
            border-color: $error-color;
          }
        }

        .error-message {
          color: $error-color;
          font-size: 0.75rem;
          min-height: 1rem;
        }
      }

      .login-button {
        background-color: $primary-color;
        color: white;
        border: none;
        padding: 0.75rem;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
      }
    }
  }
}
</style>
