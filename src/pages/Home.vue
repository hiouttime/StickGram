<template>
  <div class="home-page">
    <div class="header">
      <div>
        <h1 class="title">{{ t('home.title') }}</h1>
        <p class="subtitle">{{ t('home.subtitle') }}</p>
      </div>
      <n-button type="primary" size="large" @click="router.push('/create')">
        {{ t('home.newProject') }}
      </n-button>
    </div>

    <div class="search-bar">
      <n-input v-model:value="searchQuery" :placeholder="t('common.search')" clearable>
        <template #prefix>
          <n-icon><SearchOutline /></n-icon>
        </template>
      </n-input>
    </div>

    <n-empty v-if="filteredProjects.length === 0" :description="t('home.emptyDesc')">
      <template #extra>
        <n-button type="primary" @click="router.push('/create')">{{ t('common.create') }}</n-button>
      </template>
    </n-empty>

    <n-grid v-else cols="1 s:2 m:3 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <n-grid-item v-for="project in filteredProjects" :key="project.id">
        <ProjectCard
          :project="project"
          @open="openProject"
          @delete="deleteProject"
          @duplicate="duplicateProject"
        />
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { NButton, NInput, NIcon, NEmpty, NGrid, NGridItem } from 'naive-ui'
import { SearchOutline } from '@vicons/ionicons5'
import { useProjectsStore } from '@/stores/projects'
import ProjectCard from '@/components/common/ProjectCard.vue'
import type { ProjectMeta } from '@/types/project'

const router = useRouter()
const { t } = useI18n()
const projectsStore = useProjectsStore()

const searchQuery = ref('')

const allProjects = computed(() => {
  return Object.values(projectsStore.projects).map((p) => ({
    id: p.id,
    name: p.name,
    type: p.type,
    format: p.format,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    thumbnail: p.thumbnail
  } as ProjectMeta)).sort((a, b) => b.updatedAt - a.updatedAt)
})

const filteredProjects = computed(() => {
  if (!searchQuery.value) return allProjects.value
  return allProjects.value.filter(p => p.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

function openProject(id: string) {
  router.push(`/editor/${id}`)
}

function deleteProject(id: string) {
  projectsStore.deleteProject(id)
}

function duplicateProject(id: string) {
  projectsStore.duplicateProject(id)
}
</script>

<style scoped>
.home-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
}

.subtitle {
  margin: 4px 0 0 0;
  color: var(--n-text-color-3);
}

.search-bar {
  margin-bottom: 24px;
  max-width: 400px;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
