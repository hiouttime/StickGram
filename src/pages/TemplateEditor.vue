<template>
  <div class="template-editor-page">
    <div class="page-header">
      <n-button text @click="router.back()">
        <template #icon>
          <n-icon><ArrowBackOutline /></n-icon>
        </template>
        {{ t('common.back') }}
      </n-button>
      <h1 class="page-title">{{ t('textEmoji.title') }}</h1>
    </div>

    <TextEmojiEditor />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { NButton, NIcon } from 'naive-ui'
import { ArrowBackOutline } from '@vicons/ionicons5'
import TextEmojiEditor from '@/components/templates/TextEmojiEditor.vue'

const router = useRouter()
const { t } = useI18n()
</script>

<style scoped>
.template-editor-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}
</style>
