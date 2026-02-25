<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocalStorage, useSessionStorage } from '@ldesign/storage-vue'

const username = useLocalStorage('demo-username', '')
const theme = useLocalStorage('demo-theme', 'light')
const sessionCount = useSessionStorage('demo-count', 0)

function increment() { sessionCount.value++ }
function toggleTheme() { theme.value = theme.value === 'light' ? 'dark' : 'light' }
function clearAll() { username.value = ''; theme.value = 'light'; sessionCount.value = 0 }
</script>

<template>
  <div style="max-width: 480px; margin: 40px auto; font-family: sans-serif;">
    <h1>@ldesign/storage Playground</h1>

    <section style="margin-bottom: 24px;">
      <h2>LocalStorage (持久)</h2>
      <div style="margin-bottom: 12px;">
        <label>用户名: </label>
        <input v-model="username" placeholder="输入用户名" style="padding:8px;" />
        <span style="margin-left:8px;color:#888;">刷新页面后仍保留</span>
      </div>
      <div>
        <label>主题: {{ theme }} </label>
        <button @click="toggleTheme" style="padding:4px 12px;margin-left:8px;">切换</button>
      </div>
    </section>

    <section style="margin-bottom: 24px;">
      <h2>SessionStorage (会话)</h2>
      <p>访问次数: <strong>{{ sessionCount }}</strong></p>
      <button @click="increment" style="padding:8px 16px;">+1</button>
      <span style="margin-left:8px;color:#888;">关闭标签页后重置</span>
    </section>

    <button @click="clearAll" style="padding:8px 16px;">清除全部</button>
  </div>
</template>
