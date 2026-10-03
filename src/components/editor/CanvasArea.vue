<template>
  <div class="canvas-container">
    <div 
      class="canvas-wrapper" 
      :style="{
        width: `${width}px`,
        height: `${height}px`,
        transform: `scale(${zoom / 100})`
      }"
    >
      <!-- Placeholder for actual Konva stage -->
      <div class="canvas-placeholder">
        <p>{{ width }} × {{ height }}</p>
        <p class="hint">Canvas area - editor coming soon</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  width: number
  height: number
  zoom: number
}>()
</script>

<style scoped>
.canvas-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: var(--n-color-embedded);
}

.canvas-wrapper {
  background-color: transparent;
  background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.1s ease-out;
  border: 1px dashed var(--n-border-color);
  position: relative;
}

.canvas-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.5);
  font-weight: bold;
  color: #333;
}

.hint {
  font-weight: normal;
  font-size: 14px;
  color: #666;
  margin-top: 8px;
}
</style>
