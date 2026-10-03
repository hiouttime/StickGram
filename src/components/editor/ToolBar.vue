<template>
  <div class="toolbar">
    <n-space align="center" justify="space-between" class="toolbar-content">
      <n-space align="center">
        <n-button circle @click="emit('back')">
          <template #icon>
            <n-icon><ArrowBackOutline /></n-icon>
          </template>
        </n-button>
        
        <div class="project-name" @click="isEditingName = true">
          <n-input
            v-if="isEditingName"
            v-model:value="localProjectName"
            @blur="saveName"
            @keyup.enter="saveName"
            size="small"
            ref="nameInput"
          />
          <span v-else>{{ projectName }}</span>
        </div>
      </n-space>
      
      <n-space align="center" class="tools">
        <n-divider vertical />
        
        <n-button-group>
          <n-button @click="emit('tool-change', 'select')">
            <template #icon><n-icon><NavigateOutline /></n-icon></template>
          </n-button>
          <n-button @click="emit('tool-change', 'text')">
            <template #icon><n-icon><TextOutline /></n-icon></template>
          </n-button>
          <n-button @click="emit('tool-change', 'shape')">
            <template #icon><n-icon><SquareOutline /></n-icon></template>
          </n-button>
        </n-button-group>
        
        <n-divider vertical />
        
        <n-button-group>
          <n-button @click="emit('undo')">
            <template #icon><n-icon><ArrowUndoOutline /></n-icon></template>
          </n-button>
          <n-button @click="emit('redo')">
            <template #icon><n-icon><ArrowRedoOutline /></n-icon></template>
          </n-button>
        </n-button-group>

        <n-divider vertical />
        
        <n-space align="center" :wrap="false" class="zoom-controls">
          <n-button quaternary circle size="small" @click="emit('update:zoom', zoom - 10)">
            <template #icon><n-icon><RemoveOutline /></n-icon></template>
          </n-button>
          <span class="zoom-text">{{ zoom }}%</span>
          <n-button quaternary circle size="small" @click="emit('update:zoom', zoom + 10)">
            <template #icon><n-icon><AddOutline /></n-icon></template>
          </n-button>
          <n-button quaternary size="small" @click="emit('update:zoom', 100)">
            {{ t('editor.zoomFit') }}
          </n-button>
        </n-space>
      </n-space>
      
      <n-button type="primary" @click="emit('export')">
        {{ t('editor.exportSticker') }}
      </n-button>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  NSpace, NButton, NIcon, NInput, NDivider, NButtonGroup 
} from 'naive-ui'
import { 
  ArrowBackOutline, NavigateOutline, TextOutline, SquareOutline,
  ArrowUndoOutline, ArrowRedoOutline, AddOutline, RemoveOutline
} from '@vicons/ionicons5'

const props = defineProps<{
  projectName: string
  zoom: number
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'update:projectName', name: string): void
  (e: 'update:zoom', zoom: number): void
  (e: 'export'): void
  (e: 'undo'): void
  (e: 'redo'): void
  (e: 'tool-change', tool: string): void
}>()

const { t } = useI18n()

const isEditingName = ref(false)
const localProjectName = ref(props.projectName)
const nameInput = ref<HTMLElement | null>(null)

watch(() => props.projectName, (newVal) => {
  localProjectName.value = newVal
})

watch(isEditingName, async (val) => {
  if (val) {
    await nextTick()
    // Focus logic would go here
  }
})

function saveName() {
  isEditingName.value = false
  if (localProjectName.value !== props.projectName) {
    emit('update:projectName', localProjectName.value)
  }
}
</script>

<style scoped>
.toolbar {
  height: 56px;
  border-bottom: 1px solid var(--n-border-color);
  background-color: var(--n-color);
  padding: 0 16px;
  display: flex;
  align-items: center;
}

.toolbar-content {
  width: 100%;
}

.project-name {
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  min-width: 100px;
}

.zoom-text {
  font-size: 12px;
  min-width: 40px;
  text-align: center;
}

@media (max-width: 768px) {
  .tools {
    display: none;
  }
}
</style>
