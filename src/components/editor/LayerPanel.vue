<template>
  <div class="layer-panel">
    <div class="panel-header">
      <h3>{{ t('editor.layers') }}</h3>
      <n-dropdown :options="addOptions" @select="handleAdd">
        <n-button size="small" type="primary" quaternary>
          <template #icon><n-icon><AddOutline /></n-icon></template>
        </n-button>
      </n-dropdown>
    </div>
    
    <div class="layer-list">
      <n-empty v-if="layers.length === 0" :description="t('editor.noLayers')" class="empty-state">
        <template #extra>
          <span class="hint">{{ t('editor.addLayerHint') }}</span>
        </template>
      </n-empty>
      
      <div 
        v-for="layer in layers" 
        :key="layer.id"
        class="layer-item"
        :class="{ active: layer.id === selectedLayerId }"
        @click="emit('select', layer.id)"
      >
        <n-icon class="drag-handle"><MenuOutline /></n-icon>
        <n-icon class="layer-icon">
          <ImageOutline v-if="layer.type === 'image'" />
          <TextOutline v-else-if="layer.type === 'text'" />
          <SquareOutline v-else-if="layer.type === 'shape'" />
        </n-icon>
        
        <span class="layer-name">{{ layer.name }}</span>
        
        <div class="layer-actions">
          <n-button quaternary circle size="tiny" @click.stop="emit('toggle-visibility', layer.id)">
            <template #icon>
              <n-icon>
                <EyeOutline v-if="layer.visible" />
                <EyeOffOutline v-else />
              </n-icon>
            </template>
          </n-button>
          <n-button quaternary circle size="tiny" @click.stop="emit('toggle-lock', layer.id)">
            <template #icon>
              <n-icon>
                <LockClosedOutline v-if="layer.locked" />
                <LockOpenOutline v-else />
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NDropdown, NButton, NIcon, NEmpty } from 'naive-ui'
import { 
  AddOutline, MenuOutline, ImageOutline, TextOutline, SquareOutline,
  EyeOutline, EyeOffOutline, LockClosedOutline, LockOpenOutline
} from '@vicons/ionicons5'
import type { Layer } from '@/types/project'

const props = defineProps<{
  layers: Layer[]
  selectedLayerId: string | null
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'toggle-visibility', id: string): void
  (e: 'toggle-lock', id: string): void
  (e: 'delete', id: string): void
  (e: 'reorder', from: number, to: number): void
  (e: 'add', type: string): void
}>()

const { t } = useI18n()

const addOptions = computed(() => [
  { label: t('editor.addImage'), key: 'image' },
  { label: t('editor.addText'), key: 'text' },
  { label: t('editor.addShape'), key: 'shape' }
])

function handleAdd(key: string) {
  emit('add', key)
}
</script>

<style scoped>
.layer-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--n-border-color);
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
}

.layer-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.empty-state {
  margin-top: 40px;
}

.hint {
  font-size: 12px;
  color: var(--n-text-color-3);
}

.layer-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 4px;
}

.layer-item:hover {
  background-color: var(--n-color-hover);
}

.layer-item.active {
  background-color: var(--n-primary-color-hover);
  color: var(--n-base-color);
}

.drag-handle {
  cursor: grab;
  color: var(--n-text-color-3);
  margin-right: 8px;
}

.layer-icon {
  margin-right: 8px;
}

.layer-name {
  flex: 1;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.layer-actions {
  display: flex;
  opacity: 0;
  transition: opacity 0.2s;
}

.layer-item:hover .layer-actions,
.layer-item.active .layer-actions {
  opacity: 1;
}

.layer-item.active .layer-actions .n-button {
  color: var(--n-base-color);
}
</style>
