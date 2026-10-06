<template>
  <div class="sticker-editor">
    <n-card :title="t('editor.preview')">
      <div class="sticker-stage checkerboard">
        <ArtworkPreview :artwork="artwork" :playing="playing" :size="360" @ready="setThumbnail" />
      </div>
      <ExportControls
        :format="project.format"
        :loading="exporting"
        :url="downloadUrl"
        :name="downloadName"
        :error="error"
        @export="exportArtwork"
      />
    </n-card>
    <n-card :title="t('sticker.design')">
      <n-form label-placement="top">
        <n-form-item :label="t('sticker.image')">
          <div>
            <n-button @click="fileInput?.click()">{{ t('sticker.upload') }}</n-button>
            <input
              ref="fileInput"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              hidden
              @change="upload"
            />
            <p class="hint">{{ t('sticker.uploadHint') }}</p>
          </div>
        </n-form-item>
        <n-form-item :label="t('sticker.scale')">
          <n-slider v-model:value="config.scale" :min="0.4" :max="0.95" :step="0.01" />
        </n-form-item>
        <n-form-item v-if="playing" :label="t('sticker.motion')">
          <n-select v-model:value="config.motion" :options="motionOptions" />
        </n-form-item>
        <n-form-item
          v-if="playing"
          :label="t('editor.duration', { seconds: (config.duration / 1000).toFixed(1) })"
        >
          <n-slider v-model:value="config.duration" :min="800" :max="3000" :step="100" />
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NCard, NForm, NFormItem, NButton, NSlider, NSelect } from 'naive-ui'
import type { ProjectOf } from '@/core/project'
import { useProjectEditor } from '@/application/useProjectEditor'
import { createRenderer } from '@/application/rendering'
import { renderCanvas } from '@/shared/canvas/canvas'
import ArtworkPreview from '@/application/components/ArtworkPreview.vue'
import ExportControls from '@/application/components/ExportControls.vue'

const props = defineProps<{ project: ProjectOf<'sticker'> }>()
const { t } = useI18n()
const {
  config,
  artwork,
  playing,
  setThumbnail,
  exporting,
  error,
  downloadUrl,
  downloadName,
  exportArtwork,
} = useProjectEditor(props.project)
const fileInput = ref<HTMLInputElement>()
const motionOptions = computed(() =>
  ['bounce', 'pulse', 'none'].map((value) => ({ value, label: t(`sticker.${value}`) })),
)
async function upload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  try {
    const renderer = await createRenderer({
      type: 'sticker',
      config: { ...config, image: url, scale: 1 },
    })
    config.image = renderCanvas(renderer).toDataURL('image/webp', 0.9)
  } catch (cause) {
    error.value = (cause as Error).message
  } finally {
    URL.revokeObjectURL(url)
    fileInput.value!.value = ''
  }
}
</script>
<style scoped>
.sticker-editor {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}
.sticker-stage {
  padding: 20px;
  background-color: #e7e7e7;
  border-radius: 12px;
  display: flex;
  justify-content: center;
}
.sticker-stage :deep(.canvas-preview) {
  max-width: 100%;
}
.hint {
  font-size: 12px;
  color: var(--n-text-color-3, #888);
  line-height: 1.8;
}
@media (max-width: 900px) {
  .sticker-editor {
    grid-template-columns: 1fr;
  }
}
</style>
