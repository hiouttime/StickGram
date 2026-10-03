<template>
  <div class="templates-page">
    <div class="header">
      <h1 class="title">{{ t('templates.title') }}</h1>
      <p class="subtitle">{{ t('templates.subtitle') }}</p>
    </div>

    <n-tabs type="line" animated>
      <n-tab-pane name="popular" :tab="t('templates.popular')">
        <div class="template-grid">
          <n-card hoverable class="template-card" @click="router.push('/template/text-emoji')">
            <template #cover>
              <div class="template-preview text-emoji-preview">
                <span class="preview-char">满山</span>
                <span class="preview-char">猴群</span>
              </div>
            </template>
            <div class="template-info">
              <h3>{{ t('textEmoji.title') }}</h3>
              <p class="template-desc">{{ t('templates.categories.text') }} · 100×100 · WebM</p>
            </div>
            <template #action>
              <n-button type="primary" block>{{ t('templates.useTemplate') }}</n-button>
            </template>
          </n-card>
        </div>
      </n-tab-pane>
      <n-tab-pane name="recent" :tab="t('templates.recent')">
        <n-empty :description="t('templates.emptyDesc')" class="empty-state" />
      </n-tab-pane>
      <n-tab-pane name="all" :tab="t('templates.all')">
        <n-empty :description="t('templates.emptyDesc')" class="empty-state" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { NTabs, NTabPane, NEmpty, NCard, NButton } from 'naive-ui'

const { t } = useI18n()
const router = useRouter()
</script>

<style scoped>
.templates-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  margin-bottom: 32px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 8px 0;
}

.subtitle {
  color: var(--n-text-color-3);
  margin: 0;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

.template-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.template-card:hover {
  transform: translateY(-2px);
}

.template-preview {
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.text-emoji-preview {
  background: linear-gradient(135deg, #FF69FF, #6B5BFF, #00BFFF);
  border-radius: 8px 8px 0 0;
}

.preview-char {
  font-size: 36px;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  letter-spacing: 4px;
}

.template-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
}

.template-desc {
  margin: 0;
  font-size: 13px;
  color: var(--n-text-color-3);
}

.empty-state {
  margin-top: 64px;
}

@media (max-width: 768px) {
  .template-grid {
    grid-template-columns: 1fr;
  }
}
</style>
