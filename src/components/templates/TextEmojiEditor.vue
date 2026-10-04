<template>
  <div class="te-editor">
    <div class="editor-body">

      <!-- ══ LEFT: Canvas + context previews ══ -->
      <div class="left-col">

        <!-- Raw canvas preview (checkerboard = transparent) -->
        <div class="canvas-preview">
          <div class="checkerboard canvas-frame">
            <TextEmojiPreview
              ref="previewRef"
              :mode="mode"
              :textA="textA"
              :textB="textB"
              :gradientColors="currentGradient"
              :size="240"
              :duration="duration"
              :holdRatio="holdRatio"
              :playing="playing"
              :backgroundColor="bgTransparent ? 'transparent' : bgColor"
              :fontFamily="fontFamily"
              :transition="transition"
            />
          </div>
          <div class="canvas-label">100 × 100 · actual size ↗</div>
        </div>

        <!-- Telegram context previews (drawn with CSS/HTML) -->
        <div class="context-previews">

          <!-- Message bubble preview -->
          <div class="ctx-block">
            <div class="ctx-label">💬 消息气泡</div>
            <div class="tg-bg tg-chat-bg">
              <div class="tg-bubble">
                <div class="tg-bubble-sender">Superman 🏅</div>
                <div class="tg-bubble-body">
                  <span class="tg-text">哈哈哈</span>
                  <span class="tg-emoji-slot">
                    <TextEmojiPreview
                      :mode="mode"
                      :textA="textA"
                      :textB="textB"
                      :gradientColors="currentGradient"
                      :size="22"
                      :duration="duration"
                      :holdRatio="holdRatio"
                      :playing="playing"
                      :backgroundColor="bgTransparent ? 'transparent' : bgColor"
                      :fontFamily="fontFamily"
                      :transition="transition"
                    />
                  </span>
                  <span class="tg-text">真的好笑</span>
                </div>
                <div class="tg-bubble-time">15:12</div>
              </div>
            </div>
          </div>

          <!-- Profile page preview -->
          <div class="ctx-block">
            <div class="ctx-label">👤 个人资料</div>
            <div class="tg-bg tg-profile-bg">
              <div class="tg-avatar" />
              <div class="tg-profile-name">
                Superman
                <span class="tg-emoji-slot tg-emoji-name">
                  <TextEmojiPreview
                    :mode="mode"
                    :textA="textA"
                    :textB="textB"
                    :gradientColors="currentGradient"
                    :size="22"
                    :duration="duration"
                    :holdRatio="holdRatio"
                    :playing="playing"
                    :backgroundColor="bgTransparent ? 'transparent' : bgColor"
                    :fontFamily="fontFamily"
                    :transition="transition"
                  />
                </span>
              </div>
              <div class="tg-profile-status">🟢 在线</div>
            </div>
          </div>

        </div>

        <!-- Play/Export controls -->
        <div class="canvas-actions">
          <n-button-group>
            <n-button @click="playing = !playing">
              <template #icon>
                <n-icon><PlayOutline v-if="!playing" /><PauseOutline v-else /></n-icon>
              </template>
              {{ playing ? t('textEmoji.pause') : t('textEmoji.play') }}
            </n-button>
            <n-button type="primary" :loading="exporting" @click="exportWebM">
              <template #icon><n-icon><DownloadOutline /></n-icon></template>
              {{ exporting ? t('textEmoji.exporting') : t('common.export') + ' WebM' }}
            </n-button>
          </n-button-group>

          <n-tag size="small" type="info">
            ⏱ {{ (duration / 1000).toFixed(1) }}s · 30fps · ≤256 KB
          </n-tag>
        </div>
      </div>

      <!-- ══ RIGHT: Controls ══ -->
      <div class="right-col">
        <n-card>
          <n-form label-placement="top" :label-width="80">

            <!-- Mode -->
            <n-form-item label="模式 / Mode">
              <n-radio-group v-model:value="mode">
                <n-radio-button value="single">单字 / Single</n-radio-button>
                <n-radio-button value="dual">双字切换 / Dual</n-radio-button>
              </n-radio-group>
            </n-form-item>

            <!-- Text A (always shown) -->
            <n-form-item :label="mode === 'single' ? `文字` : `文字 A`">
              <n-input
                v-model:value="textA"
                :maxlength="4"
                :placeholder="t('textEmoji.placeholder')"
                show-count
                clearable
              />
            </n-form-item>

            <!-- Text B (dual only) -->
            <n-form-item v-if="mode === 'dual'" :label="`文字 B`">
              <n-input
                v-model:value="textB"
                :maxlength="4"
                :placeholder="t('textEmoji.placeholder')"
                show-count
                clearable
              />
            </n-form-item>

            <!-- Transition type (dual only) -->
            <n-form-item v-if="mode === 'dual'" label="过渡方式 / Transition">
              <n-select v-model:value="transition" :options="transitionOptions" />
            </n-form-item>

            <!-- Gradient -->
            <n-form-item :label="t('textEmoji.gradient')">
              <div class="gradient-row">
                <div
                  v-for="(p, i) in gradientPresets"
                  :key="i"
                  class="swatch"
                  :class="{ active: selectedGradientIndex === i }"
                  :style="{ background: `linear-gradient(135deg, ${p.colors.join(',')})` }"
                  :title="p.name"
                  @click="selectedGradientIndex = i"
                />
              </div>
            </n-form-item>

            <!-- Duration -->
            <n-form-item :label="`时长 ${(duration/1000).toFixed(1)}s（最长3秒）`">
              <n-slider
                v-model:value="duration"
                :min="800"
                :max="3000"
                :step="100"
                :marks="{ 800: '0.8s', 3000: '3s' }"
              />
            </n-form-item>

            <!-- Hold ratio (dual only) -->
            <n-form-item v-if="mode === 'dual'" :label="`停留比例 ${Math.round(holdRatio*100)}%（每段静止时间占比）`">
              <n-slider v-model:value="holdRatio" :min="0.1" :max="0.45" :step="0.05" />
            </n-form-item>

            <!-- Font -->
            <n-form-item label="字体 / Font">
              <n-select v-model:value="fontFamily" :options="fontOptions" />
            </n-form-item>

            <!-- Background -->
            <n-form-item :label="t('textEmoji.bgColor')">
              <n-space align="center">
                <n-switch v-model:value="bgTransparent" />
                <span>{{ t('textEmoji.transparent') }}</span>
                <n-color-picker
                  v-if="!bgTransparent"
                  v-model:value="bgColor"
                  :modes="['hex']"
                  size="small"
                  style="width: 120px"
                />
              </n-space>
            </n-form-item>

          </n-form>
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
  NButton, NButtonGroup, NSpace, NIcon, NCard,
  NSwitch, NTag, NRadioGroup, NRadioButton, NSelect,
} from 'naive-ui'
import { PlayOutline, PauseOutline, DownloadOutline } from '@vicons/ionicons5'
import TextEmojiPreview from './TextEmojiPreview.vue'
import type { TransitionType } from './TextEmojiPreview.vue'

const { t } = useI18n()

const previewRef = ref<InstanceType<typeof TextEmojiPreview> | null>(null)

// ── State ──────────────────────────────────────────────────────────────────
const mode = ref<'single' | 'dual'>('dual')
const textA = ref('满山猴群')
const textB = ref('我腚最红')
const duration = ref(2000)
const holdRatio = ref(0.35)
const playing = ref(true)
const bgTransparent = ref(true)
const bgColor = ref('#000000')
const exporting = ref(false)
const transition = ref<TransitionType>('wipe-diagonal')
const fontFamily = ref('sans-serif')

// ── Options ────────────────────────────────────────────────────────────────
const transitionOptions = [
  { label: '对角线擦除 Diagonal wipe', value: 'wipe-diagonal' },
  { label: '横向擦除 Horizontal wipe', value: 'wipe-left' },
  { label: '纵向擦除 Vertical wipe', value: 'wipe-up' },
  { label: '淡入淡出 Fade', value: 'fade' },
  { label: '缩放 Zoom', value: 'zoom-in' },
  { label: '无过渡 Cut', value: 'none' },
]

const fontOptions = [
  { label: '系统默认 (sans-serif)', value: 'sans-serif' },
  { label: '衬线 (serif)', value: 'serif' },
  { label: '等宽 (monospace)', value: 'monospace' },
]

const gradientPresets = [
  { name: 'Pink → Purple → Blue', colors: ['#FF69FF', '#6B5BFF', '#00BFFF'] },
  { name: 'Red → Orange → Yellow', colors: ['#FF4444', '#FF8C00', '#FFD700'] },
  { name: 'Green → Cyan → Blue', colors: ['#00FF88', '#00CED1', '#4169E1'] },
  { name: 'Gold → Tomato → Crimson', colors: ['#FFD700', '#FF6347', '#DC143C'] },
  { name: 'Purple → Pink → Red', colors: ['#8B5CF6', '#EC4899', '#EF4444'] },
  { name: 'Cyan → Blue → Indigo', colors: ['#06B6D4', '#3B82F6', '#6366F1'] },
  { name: 'White Solid', colors: ['#FFFFFF', '#EEEEEE'] },
]

const selectedGradientIndex = ref(0)
const currentGradient = computed(() => gradientPresets[selectedGradientIndex.value].colors)

// ── Export ─────────────────────────────────────────────────────────────────
async function exportWebM() {
  if (exporting.value) return
  const canvas = previewRef.value?.getCanvas()
  if (!canvas) return

  try {
    exporting.value = true
    const wasPlaying = playing.value
    playing.value = true
    previewRef.value?.restartLoop()

    // Short warmup
    await new Promise(r => setTimeout(r, 80))

    const stream = (canvas as any).captureStream(30)
    let mimeType = 'video/webm;codecs=vp9'
    if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm;codecs=vp8'
    if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm'

    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 300000 })
    const chunks: Blob[] = []
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data) }

    await new Promise<void>((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        const a = Object.assign(document.createElement('a'), {
          href: url,
          download: `emoji_${textA.value}${mode.value === 'dual' ? '_' + textB.value : ''}.webm`,
        })
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        resolve()
      }
      recorder.start()
      setTimeout(() => recorder.stop(), duration.value + 150)
    })

    playing.value = wasPlaying
  } catch (err) {
    console.error(err)
    window.alert(t('textEmoji.exportFail'))
  } finally {
    exporting.value = false
  }
}
</script>

<style scoped>
.te-editor { width: 100%; }

.editor-body {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

@media (max-width: 900px) {
  .editor-body { flex-direction: column; }
}

/* ── Left col ── */
.left-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
  width: 280px;
}
@media (max-width: 900px) { .left-col { width: 100%; } }

/* Raw canvas area */
.canvas-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.canvas-frame {
  padding: 20px;
  border-radius: 12px;
}
.canvas-label {
  font-size: 11px;
  color: var(--n-text-color-3, #aaa);
}

/* Checkerboard */
.checkerboard {
  background-color: #e8e8e8;
  background-image:
    linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 12px 12px;
  background-position: 0 0, 0 6px, 6px -6px, -6px 0;
}

/* Canvas actions */
.canvas-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

/* ── Context previews ── */
.context-previews {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ctx-block { display: flex; flex-direction: column; gap: 4px; }
.ctx-label { font-size: 12px; color: var(--n-text-color-3, #888); padding-left: 4px; }

/* Telegram chat background */
.tg-bg {
  border-radius: 10px;
  overflow: hidden;
  padding: 10px;
}
.tg-chat-bg {
  background-color: #c4d9bf; /* Telegram classic green bg */
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23b0c9ab' fill-opacity='0.4'%3E%3Ccircle cx='20' cy='20' r='6'/%3E%3C/g%3E%3C/svg%3E");
}
.tg-profile-bg {
  background: linear-gradient(180deg, #2AABEE 0%, #229ED9 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 10px 12px;
  gap: 6px;
}

/* Bubble */
.tg-bubble {
  background: white;
  border-radius: 12px 12px 12px 2px;
  padding: 6px 10px;
  max-width: 220px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}
.tg-bubble-sender {
  font-size: 11px;
  font-weight: 600;
  color: #2AABEE;
  margin-bottom: 2px;
}
.tg-bubble-body {
  font-size: 14px;
  line-height: 22px;
  display: flex;
  align-items: center;
  gap: 2px;
  flex-wrap: wrap;
}
.tg-bubble-time {
  font-size: 10px;
  color: #999;
  text-align: right;
  margin-top: 2px;
}

/* Inline emoji in text */
.tg-emoji-slot {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}

/* Profile */
.tg-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: 2px solid rgba(255,255,255,0.4);
  flex-shrink: 0;
}
.tg-profile-name {
  color: white;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.tg-profile-status {
  font-size: 12px;
  color: rgba(255,255,255,0.75);
}

/* ── Right col ── */
.right-col { flex: 1; min-width: 0; }

/* Gradients */
.gradient-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.swatch {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  border: 3px solid transparent;
  transition: transform 0.12s, border-color 0.12s;
  flex-shrink: 0;
}
.swatch:hover { transform: scale(1.12); }
.swatch.active {
  border-color: var(--n-primary-color, #2AABEE);
  box-shadow: 0 0 0 2px rgba(42,171,238,0.35);
}
</style>
