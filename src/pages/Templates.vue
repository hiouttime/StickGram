<template>
  <div class="templates-page">
    <div class="header">
      <h1 class="title">{{ t('templates.title') }}</h1>
      <p class="subtitle">{{ t('templates.subtitle') }}</p>
    </div>

    <n-tabs type="line" animated>
      <n-tab-pane name="popular" :tab="t('templates.popular')">
        <n-empty :description="t('templates.emptyDesc')" class="empty-state">
          <template #extra>
            <span class="coming-soon">🚀</span>
          </template>
        </n-empty>
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
import { NTabs, NTabPane, NEmpty } from 'naive-ui'

const { t } = useI18n()
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

.empty-state {
  margin-top: 64px;
}

.coming-soon {
  font-size: 32px;
}
</style>
