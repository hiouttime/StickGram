<template>
  <div class="font-section">
    <div class="font-picker">
      <button
        v-for="font in fontOptions"
        :key="font.value"
        type="button"
        class="font-option"
        :class="{ active: modelValue === font.value }"
        :aria-pressed="modelValue === font.value"
        @click="emit('update:modelValue', font.value)"
      >
        <div
          class="font-sample"
          :style="{
            fontFamily: font.value,
            fontWeight: resolveFontWeight(font.value, fontWeight),
            transform: `skewX(${-(fontSlant ?? 0)}deg)`,
          }"
        >
          <span>{{ textA }}</span>
          <span v-if="textB !== undefined">{{ textB }}</span>
        </div>
        <span class="font-name">{{ font.label }}</span>
        <span class="font-description">{{ font.description }}</span>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { fontOptions, resolveFontWeight } from './fonts'
defineProps<{
  modelValue: string
  textA: string
  textB?: string
  fontWeight?: number
  fontSlant?: number
}>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>
<style scoped>
.font-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.font-picker {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}
.font-option {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 12px;
  border: 1px solid var(--n-border-color, #ddd);
  border-radius: 10px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  min-width: 0;
}
.font-option:hover {
  background: rgba(42, 171, 238, 0.06);
}
.font-option.active {
  border-color: #2aabee;
  background: rgba(42, 171, 238, 0.08);
}
.font-option:focus-visible {
  outline: 2px solid #2aabee;
  outline-offset: 2px;
}
.font-sample {
  display: flex;
  flex-direction: column;
  font-size: 24px;
  line-height: 1.5;
  width: 100%;
  margin-bottom: 4px;
}
.font-sample span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.font-name {
  font-size: 12px;
  font-weight: 600;
}
.font-description {
  font-size: 11px;
  color: var(--n-text-color-3, #888);
}
@media (max-width: 480px) {
  .font-picker {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
