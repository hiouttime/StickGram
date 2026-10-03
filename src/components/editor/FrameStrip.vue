<template>
  <div class="frame-strip-container">
    <n-scrollbar x-scrollable>
      <div class="frame-list">
        <div 
          v-for="(frame, index) in frames" 
          :key="frame.id || index"
          class="frame-item"
          :class="{ active: index === selectedIndex }"
          @click="emit('select', index)"
        >
          <div class="frame-preview">
            <span class="frame-number">{{ index + 1 }}</span>
          </div>
          
          <div v-if="index === selectedIndex" class="frame-actions">
            <n-button circle size="tiny" type="error" @click.stop="emit('delete', index)">
              <template #icon>
                <n-icon><TrashOutline /></n-icon>
              </template>
            </n-button>
          </div>
        </div>
        
        <div class="add-frame" @click="emit('add')">
          <n-icon size="24"><AddOutline /></n-icon>
        </div>
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { NScrollbar, NButton, NIcon } from 'naive-ui'
import { AddOutline, TrashOutline } from '@vicons/ionicons5'
import type { Frame } from '@/types/project'

const props = defineProps<{
  frames: Frame[]
  selectedIndex: number
  canvasSize: { width: number; height: number }
}>()

const emit = defineEmits<{
  (e: 'select', index: number): void
  (e: 'add'): void
  (e: 'delete', index: number): void
  (e: 'reorder', from: number, to: number): void
}>()
</script>

<style scoped>
.frame-strip-container {
  height: 100px;
  border-top: 1px solid var(--n-border-color);
  background-color: var(--n-color);
  display: flex;
  align-items: center;
}

.frame-list {
  display: flex;
  padding: 16px;
  gap: 16px;
  height: 100%;
  align-items: center;
}

.frame-item {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 4px;
  border: 2px solid transparent;
  cursor: pointer;
  background-color: var(--n-color-embedded);
  flex-shrink: 0;
  transition: all 0.2s;
}

.frame-item.active {
  border-color: var(--n-primary-color);
}

.frame-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: var(--n-text-color-3);
}

.frame-actions {
  position: absolute;
  top: -10px;
  right: -10px;
  display: none;
}

.frame-item.active .frame-actions {
  display: block;
}

.add-frame {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  border: 2px dashed var(--n-border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--n-text-color-3);
  flex-shrink: 0;
  transition: all 0.2s;
}

.add-frame:hover {
  border-color: var(--n-primary-color);
  color: var(--n-primary-color);
}
</style>
