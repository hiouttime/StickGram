<template>
  <section class="project-list" :aria-label="t('nav.projects')">
    <header v-if="heading" class="list-header">
      <h2>{{ t('nav.projects') }}</h2>
      <span class="project-count">{{ store.projectCount }}</span>
    </header>
    <div class="search">
      <n-input
        v-model:value="search"
        size="small"
        clearable
        :placeholder="t('nav.searchProjects')"
        :input-props="{ 'aria-label': t('nav.searchProjects') }"
      >
        <template #prefix>
          <n-icon><SearchOutline /></n-icon>
        </template>
      </n-input>
    </div>
    <nav v-if="projects.length" class="project-items" :aria-label="t('nav.projects')">
      <RouterLink
        v-for="project in projects"
        :key="project.id"
        :to="`/editor/${encodeURIComponent(project.id)}`"
        class="project-item"
        :class="{ active: activeId === project.id }"
        :aria-current="activeId === project.id ? 'page' : undefined"
        :title="project.name"
        @click="emit('select')"
      >
        <span class="thumbnail">
          <img v-if="project.thumbnail" :src="project.thumbnail" alt="" />
          <n-icon v-else :size="22" :component="ImageOutline" />
        </span>
        <span class="project-info">
          <span class="project-name">{{ project.name }}</span>
          <span class="project-meta">
            {{ t(`artwork.${project.type}.name`) }} · {{ t(`exportFormat.${project.format}.name`) }}
          </span>
        </span>
      </RouterLink>
    </nav>
    <div v-else class="empty-list">
      <p>{{ store.projectCount ? t('nav.noMatchingProjects') : t('home.emptyDesc') }}</p>
      <n-button v-if="!store.projectCount" size="small" @click="createProject">
        {{ t('home.newProject') }}
      </n-button>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { NInput, NIcon, NButton } from 'naive-ui'
import { SearchOutline, ImageOutline } from '@vicons/ionicons5'
import { searchProjects } from '@/core/project'
import { useProjectsStore } from '@/application/projects'
withDefaults(defineProps<{ heading?: boolean }>(), { heading: true })
const emit = defineEmits<{ (e: 'select'): void }>()
const { t } = useI18n(),
  route = useRoute(),
  router = useRouter(),
  store = useProjectsStore()
const search = ref('')
const activeId = computed(() => (route.name === 'Editor' ? String(route.params.id) : ''))
const projects = computed(() => searchProjects(store.projectList, search.value))

function createProject() {
  router.push('/create')
  emit('select')
}
</script>
<style scoped>
.project-list {
  padding: 20px 12px;
}
.list-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 4px;
  margin-bottom: 16px;
}
h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}
.project-count {
  color: var(--n-text-color-3, #888);
  background: var(--n-color-embedded, #f3f5f7);
  font-size: 11px;
  line-height: 20px;
  min-width: 20px;
  border-radius: 6px;
  text-align: center;
}
.search {
  margin: 0 4px 16px;
}
.project-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.project-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  min-width: 0;
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  border: 1px solid transparent;
}
.project-item:hover {
  background: rgba(42, 171, 238, 0.06);
}
.project-item.active {
  background: rgba(42, 171, 238, 0.1);
  border-color: rgba(42, 171, 238, 0.2);
}
.project-item:focus-visible {
  outline: 2px solid #2aabee;
  outline-offset: 1px;
}
.thumbnail {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 6px;
  background: var(--n-color-embedded, #f3f5f7);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #2aabee;
}
.thumbnail img {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.project-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}
.project-name {
  font-size: 13px;
  line-height: 1.5;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.project-item.active .project-name {
  color: #2aabee;
}
.project-meta {
  font-size: 11px;
  color: var(--n-text-color-3, #888);
  white-space: nowrap;
}
.empty-list {
  padding: 16px 10px;
  text-align: center;
  font-size: 12px;
  line-height: 1.8;
  color: var(--n-text-color-3, #888);
}
</style>
