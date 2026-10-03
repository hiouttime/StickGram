<template>
  <div class="text-emoji-editor">
    <div class="editor-layout">
      <!-- Preview Section -->
      <div class="preview-section">
        <div class="preview-wrapper checkerboard">
          <TextEmojiPreview
            ref="previewRef"
            :textA="textA"
            :textB="textB"
            :gradientColors="currentGradient"
            :size="previewSize"
            :duration="duration"
            :playing="playing"
            :backgroundColor="bgTransparent ? 'transparent' : bgColor"
          />
        </div>
        <div class="preview-actions">
          <n-button-group>
            <n-button @click="playing = !playing">
              <template #icon>
                <n-icon><PlayOutline v-if="!playing" /><PauseOutline v-else /></n-icon>
              </template>
              {{ playing ? t('textEmoji.pause') : t('textEmoji.play') }}
            </n-button>
            <n-button type="primary" :loading="exporting" @click="exportWebM">
              <template #icon>
                <n-icon><DownloadOutline /></n-icon>
              </template>
              {{ exporting ? t('textEmoji.exporting') : t('common.export') }}
            </n-button>
          </n-button-group>
        </div>
      </div>

      <!-- Controls Section -->
      <div class="controls-section">
        <n-card :title="t('textEmoji.controls')">
          <n-form label-placement="top">
            <n-form-item :label="t('textEmoji.textA')">
              <n-input
                v-model:value="textA"
                :maxlength="4"
                :placeholder="t('textEmoji.placeholder')"
                show-count
              />
            </n-form-item>

            <n-form-item :label="t('textEmoji.textB')">
              <n-input
                v-model:value="textB"
                :maxlength="4"
                :placeholder="t('textEmoji.placeholder')"
                show-count
              />
            </n-form-item>

            <n-form-item :label="t('textEmoji.gradient')">
              <div class="gradient-presets">
                <div
                  v-for="(preset, index) in gradientPresets"
                  :key="index"
                  class="gradient-swatch"
                  :class="{ active: selectedGradientIndex === index }"
                  :style="{ background: `linear-gradient(135deg, ${preset.colors.join(', ')})` }"
                  :title="preset.name"
                  @click="selectedGradientIndex = index"
                />
              </div>
            </n-form-item>

            <n-form-item :label="`${t('textEmoji.speed')} (${duration}ms)`">
              <div class="speed-control">
                <span class="speed-label">{{ t('textEmoji.speedFast') }}</span>
                <n-slider v-model:value="duration" :min="800" :max="4000" :step="100" />
                <span class="speed-label">{{ t('textEmoji.speedSlow') }}</span>
              </div>
            </n-form-item>

            <n-form-item :label="t('textEmoji.bgColor')">
              <n-space align="center">
                <n-switch v-model:value="bgTransparent" />
                <span>{{ t('textEmoji.transparent') }}</span>
                <n-color-picker
                  v-if="!bgTransparent"
                  v-model:value="bgColor"
                  :modes="['hex']"
                  size="small"
                  style="width: 100px"
                />
              </n-space>
            </n-form-item>
          </n-form>
        </n-card>

        <n-card style="margin-top: 16px">
          <n-space vertical>
            <n-text depth="3" style="font-size: 12px">
              📐 100×100px · VP9 WebM · 30fps · ≤256KB
            </n-text>
            <n-text depth="3" style="font-size: 12px">
              ⏱️ {{ t('textEmoji.speed') }}: {{ (duration / 1000).toFixed(1) }}s
            </n-text>
          </n-space>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NForm, NFormItem, NInput, NSlider, NColorPicker,
  NButton, NButtonGroup, NSpace, NIcon, NCard, NSwitch, NText,
} from 'naive-ui'
import { PlayOutline, PauseOutline, DownloadOutline } from '@vicons/ionicons5'
import TextEmojiPreview from './TextEmojiPreview.vue'

const { t } = useI18n()

const previewRef = ref<InstanceType<typeof TextEmojiPreview> | null>(null)

const textA = ref('满山猴群')
const textB = ref('我腚最红')
const previewSize = ref(240)
const duration = ref(2000)
const playing = ref(true)
const bgTransparent = ref(true)
const bgColor = ref('#000000')
const exporting = ref(false)

const gradientPresets = [
  { name: 'Pink → Purple → Blue', colors: ['#FF69FF', '#6B5BFF', '#00BFFF'] },
  { name: 'Red → Orange → Yellow', colors: ['#FF4444', '#FF8C00', '#FFD700'] },
  { name: 'Green → Cyan → Blue', colors: ['#00FF88', '#00CED1', '#4169E1'] },
  { name: 'Gold → Tomato → Crimson', colors: ['#FFD700', '#FF6347', '#DC143C'] },
  { name: 'Purple → Pink → Red', colors: ['#8B5CF6', '#EC4899', '#EF4444'] },
  { name: 'Cyan → Blue → Indigo', colors: ['#06B6D4', '#3B82F6', '#6366F1'] },
]

const selectedGradientIndex = ref(0)
const currentGradient = computed(() => gradientPresets[selectedGradientIndex.value].colors)

async function exportWebM() {
  if (exporting.value) return
  const canvas = previewRef.value?.getCanvas()
  if (!canvas) return

  try {
    exporting.value = true
    const wasPlaying = playing.value
    playing.value = true

    // Wait a tick for animation to start
    await new Promise(r => setTimeout(r, 50))

    const stream = (canvas as any).captureStream(30)

    // Check if VP9 is supported, fall back to VP8
    let mimeType = 'video/webm;codecs=vp9'
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm;codecs=vp8'
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm'
    }

    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 300000,
    })

    const chunks: Blob[] = []
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data)
    }

    const done = new Promise<void>((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `emoji_${textA.value}_${textB.value}.webm`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        resolve()
      }
    })

    recorder.start()
    // Record one full cycle
    await new Promise(r => setTimeout(r, duration.value + 100))
    recorder.stop()
    await done

    playing.value = wasPlaying
  } catch (error) {
    console.error('Export failed:', error)
    window.alert(t('textEmoji.exportFail'))
  } finally {
    exporting.value = false
  }
}
</script>

<style scoped>
.text-emoji-editor {
  width: 100%;
}

.editor-layout {
  display: flex;
  gap: 24px;
}

@media (max-width: 768px) {
  .editor-layout {
    flex-direction: column;
  }
}

.preview-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.preview-wrapper {
  padding: 24px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.checkerboard {
  background-color: #f5f5f5;
  background-image: linear-gradient(45deg, #e0e0e0 25%, transparent 25%),
    linear-gradient(-45deg, #e0e0e0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #e0e0e0 75%),
    linear-gradient(-45deg, transparent 75%, #e0e0e0 75%);
  background-size: 16px 16px;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
}

.controls-section {
  flex: 1;
  min-width: 0;
}

.gradient-presets {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.gradient-swatch {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  border: 3px solid transparent;
  transition: transform 0.15s, border-color 0.15s;
}

.gradient-swatch:hover {
  transform: scale(1.1);
}

.gradient-swatch.active {
  border-color: var(--n-primary-color, #2AABEE);
  box-shadow: 0 0 0 2px rgba(42, 171, 238, 0.3);
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.speed-label {
  font-size: 12px;
  color: var(--n-text-color-3);
  white-space: nowrap;
}
</style>
