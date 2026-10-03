<template>
  <div class="property-panel">
    <div class="panel-header">
      <h3>{{ t('editor.properties') }}</h3>
    </div>
    
    <div class="panel-content">
      <div v-if="!layer" class="empty-state">
        <p>{{ t('editor.noLayers') }}</p>
      </div>
      
      <n-form v-else size="small" label-placement="left" label-width="70" class="compact-form">
        <!-- Name -->
        <n-form-item :label="t('editor.layerName')">
          <n-input :value="layer.name" @update:value="val => update('name', val)" />
        </n-form-item>
        
        <n-divider />
        
        <!-- Position -->
        <div class="section-title">{{ t('editor.position') }}</div>
        <n-space :wrap="false">
          <n-form-item label="X">
            <n-input-number :value="layer.x" @update:value="val => update('x', val || 0)" :show-button="false" />
          </n-form-item>
          <n-form-item label="Y">
            <n-input-number :value="layer.y" @update:value="val => update('y', val || 0)" :show-button="false" />
          </n-form-item>
        </n-space>
        
        <!-- Size -->
        <div class="section-title">{{ t('editor.size') }}</div>
        <n-space :wrap="false">
          <n-form-item label="W">
            <n-input-number :value="layer.width" @update:value="val => update('width', val || 0)" :show-button="false" :min="1" />
          </n-form-item>
          <n-form-item label="H">
            <n-input-number :value="layer.height" @update:value="val => update('height', val || 0)" :show-button="false" :min="1" />
          </n-form-item>
        </n-space>
        
        <n-divider />
        
        <!-- Transform & Appearance -->
        <n-form-item :label="t('editor.rotation')">
          <n-slider :value="layer.rotation" @update:value="val => update('rotation', val)" :min="0" :max="360" />
        </n-form-item>
        
        <n-form-item :label="t('editor.opacity')">
          <n-slider :value="layer.opacity * 100" @update:value="val => update('opacity', val / 100)" :min="0" :max="100" />
        </n-form-item>
        
        <n-divider />
        
        <!-- Actions -->
        <div class="actions-grid">
          <n-button size="small" @click="emit('update', { scaleX: -layer.scaleX })">
            {{ t('editor.flipH') }}
          </n-button>
          <n-button size="small" @click="emit('update', { scaleY: -layer.scaleY })">
            {{ t('editor.flipV') }}
          </n-button>
          <n-button size="small">
            {{ t('editor.bringForward') }}
          </n-button>
          <n-button size="small">
            {{ t('editor.sendBackward') }}
          </n-button>
        </div>
        
        <n-button type="error" dashed block class="delete-btn" @click="emit('update', { deleted: true })">
          {{ t('editor.deleteLayer') }}
        </n-button>
      </n-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { 
  NForm, NFormItem, NInput, NInputNumber, NSlider, 
  NDivider, NSpace, NButton
} from 'naive-ui'
import type { Layer } from '@/types/project'

const props = defineProps<{
  layer: Layer | null
}>()

const emit = defineEmits<{
  (e: 'update', updates: Partial<Layer> & { deleted?: boolean }): void
}>()

const { t } = useI18n()

function update(key: keyof Layer, value: any) {
  emit('update', { [key]: value })
}
</script>

<style scoped>
.property-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid var(--n-border-color);
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.empty-state {
  text-align: center;
  color: var(--n-text-color-3);
  margin-top: 40px;
}

.compact-form :deep(.n-form-item-blank) {
  width: 100%;
}

.section-title {
  font-size: 12px;
  color: var(--n-text-color-3);
  margin-bottom: 8px;
}

.actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 24px;
}

.delete-btn {
  margin-top: auto;
}
</style>
