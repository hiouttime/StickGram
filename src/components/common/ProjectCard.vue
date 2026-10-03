<template>
  <n-card hoverable class="project-card" @click="emit('open', project.id)">
    <template #cover>
      <div class="thumbnail">
        <img v-if="project.thumbnail" :src="project.thumbnail" alt="thumbnail" />
        <div v-else class="placeholder">
          <n-icon size="48"><ImageOutline /></n-icon>
        </div>
      </div>
    </template>
    
    <div class="card-body">
      <div class="title-row">
        <span class="project-name">{{ project.name || t('common.untitled') }}</span>
        <div class="actions" @click.stop>
          <n-dropdown :options="actionOptions" @select="handleAction">
            <n-button quaternary circle size="small">
              <template #icon>
                <n-icon><EllipsisHorizontalOutline /></n-icon>
              </template>
            </n-button>
          </n-dropdown>
        </div>
      </div>
      
      <div class="badges">
        <n-tag size="small" type="primary">{{ t(`projectType.${project.type}`) }}</n-tag>
        <FormatBadge :format="project.format" :type="project.type" size="small" />
      </div>
      
      <div class="time">{{ timeAgo }}</div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NCard, NDropdown, NButton, NIcon, NTag } from 'naive-ui'
import { ImageOutline, EllipsisHorizontalOutline } from '@vicons/ionicons5'
import type { ProjectMeta } from '@/types/project'
import FormatBadge from './FormatBadge.vue'

const props = defineProps<{
  project: ProjectMeta
}>()

const emit = defineEmits<{
  (e: 'open', id: string): void
  (e: 'delete', id: string): void
  (e: 'duplicate', id: string): void
}>()

const { t } = useI18n()

const actionOptions = computed(() => [
  { label: t('common.edit'), key: 'edit' },
  { label: t('common.duplicate'), key: 'duplicate' },
  { label: t('common.delete'), key: 'delete' }
])

function handleAction(key: string) {
  if (key === 'edit') {
    emit('open', props.project.id)
  } else if (key === 'duplicate') {
    emit('duplicate', props.project.id)
  } else if (key === 'delete') {
    emit('delete', props.project.id)
  }
}

// simple time ago logic for display
const timeAgo = computed(() => {
  const diff = Date.now() - props.project.updatedAt
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours} hours ago`
  return `${Math.floor(hours / 24)} days ago`
})
</script>

<style scoped>
.project-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.project-card:hover {
  transform: translateY(-2px);
}

.thumbnail {
  height: 200px;
  background-color: var(--n-color-embedded);
  background-image: linear-gradient(45deg, var(--n-border-color) 25%, transparent 25%),
    linear-gradient(-45deg, var(--n-border-color) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--n-border-color) 75%),
    linear-gradient(-45deg, transparent 75%, var(--n-border-color) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.thumbnail img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.placeholder {
  color: var(--n-text-color-3);
}

.card-body {
  padding: 12px 0 0 0;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.project-name {
  font-weight: bold;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badges {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.time {
  font-size: 12px;
  color: var(--n-text-color-3);
}

@media (max-width: 768px) {
  .project-card {
    width: 100%;
  }
}
</style>
