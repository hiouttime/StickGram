<template>
  <div v-if="project" class="project-editor-page">
    <header class="project-header">
      <n-button text @click="router.push('/')">
        <template #icon>
          <n-icon><ArrowBackOutline /></n-icon>
        </template>
        {{ t('common.back') }}
      </n-button>
      <div class="project-heading">
        <h1>{{ project.name }}</h1>
        <div class="project-meta">
          <span>{{ t(`artwork.${project.type}.name`) }}</span>
          <FormatBadge :format="project.format" />
          <span>{{ t('editor.savedLocally') }}</span>
        </div>
      </div>
    </header>
    <component :is="editors[project.type]" :key="project.id" :project="project" />
  </div>
</template>
<script setup lang="ts">
import { computed, watch, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { NButton, NIcon } from 'naive-ui'
import { ArrowBackOutline } from '@vicons/ionicons5'
import { useProjectsStore } from '@/application/projects'
import FormatBadge from '@/application/components/FormatBadge.vue'
import { artworkTypes, getArtworkModule } from '@/application/catalog'

const editors = Object.fromEntries(
  artworkTypes.map((type) => [type, defineAsyncComponent(getArtworkModule(type).editor)]),
)
const route = useRoute(),
  router = useRouter(),
  store = useProjectsStore()
const { t } = useI18n()
const project = computed(() => store.projects[String(route.params.id)])
watch(
  project,
  (value) => {
    if (!value) router.replace('/')
  },
  { immediate: true },
)
</script>
<style scoped>
.project-editor-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
}
.project-header {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 28px;
}
.project-heading {
  min-width: 0;
}
h1 {
  font-size: 24px;
  margin: 0 0 8px;
  overflow-wrap: anywhere;
}
.project-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: var(--n-text-color-3, #888);
  flex-wrap: wrap;
}
@media (max-width: 600px) {
  .project-editor-page {
    padding: 24px 18px;
  }
  h1 {
    font-size: 20px;
  }
}
</style>
