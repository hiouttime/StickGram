<template>
  <div class="te-editor">
    <div class="editor-body">
      <div class="left-col">
        <div class="canvas-wrap">
          <div class="checkerboard canvas-bg">
            <ArtworkPreview
              :artwork="artwork"
              :size="240"
              :playing="playing"
              @ready="setThumbnail"
            />
          </div>
          <div class="size-hint">100 × 100 px · Telegram emoji</div>
        </div>
        <div class="ctx-row">
          <div class="ctx-block">
            <div class="ctx-label">💬 消息</div>
            <div class="tg-chat-bg tg-scene">
              <div class="tg-bubble">
                <div class="tg-sender">
                  Superman
                  <span class="inline-emoji">
                    <ArtworkPreview :artwork="artwork" :size="22" :playing="playing" />
                  </span>
                </div>
                <div class="tg-body">哈哈，好笑</div>
                <div class="tg-time">15:12</div>
              </div>
            </div>
          </div>
          <div class="ctx-block">
            <div class="ctx-label">👤 个人资料</div>
            <div class="tg-profile-scene tg-scene" :style="{ background: profileBg }">
              <div class="tg-avatar" :style="{ background: avatarGrad }" />
              <div class="tg-name">
                Superman
                <span class="inline-emoji">
                  <ArtworkPreview :artwork="artwork" :size="22" :playing="playing" />
                </span>
              </div>
              <div class="tg-status">🟢 在线</div>
            </div>
          </div>
        </div>

        <ExportControls
          :format="project.format"
          :loading="exporting"
          :url="downloadUrl"
          :name="downloadName"
          :error="error"
          @export="exportArtwork"
        />
      </div>
      <div class="right-col">
        <n-card>
          <n-form label-placement="top">
            <n-form-item v-if="!isStatic" label="模式">
              <n-radio-group v-model:value="config.mode">
                <n-radio-button value="single">单字</n-radio-button>
                <n-radio-button value="dual">双字切换</n-radio-button>
              </n-radio-group>
            </n-form-item>
            <n-form-item
              :label="
                isStatic || config.mode === 'single' ? t('textEmoji.text') : t('textEmoji.textA')
              "
            >
              <n-input
                v-model:value="config.textA"
                :maxlength="textLimit(config.textA)"
                :placeholder="
                  t(
                    textLimit(config.textA) === 4
                      ? 'textEmoji.placeholder'
                      : 'textEmoji.phrasePlaceholder',
                  )
                "
                show-count
                clearable
              />
            </n-form-item>
            <n-form-item v-if="!isStatic && config.mode === 'dual'" :label="t('textEmoji.textB')">
              <n-input
                v-model:value="config.textB"
                :maxlength="textLimit(config.textB)"
                :placeholder="
                  t(
                    textLimit(config.textB) === 4
                      ? 'textEmoji.placeholder'
                      : 'textEmoji.phrasePlaceholder',
                  )
                "
                show-count
                clearable
              />
            </n-form-item>

            <TextStyleControls
              :font-family="config.fontFamily"
              v-model:font-weight="config.fontWeight"
              v-model:font-slant="config.fontSlant"
            />
            <n-form-item v-if="!isStatic && config.mode === 'dual'" label="过渡方式（悬停可预览）">
              <div class="transition-picker">
                <button
                  v-for="opt in transitionOptions"
                  type="button"
                  :aria-pressed="config.transition === opt"
                  :key="opt"
                  class="trans-opt"
                  :class="{ active: config.transition === opt }"
                  @mouseenter="hoverTransition = opt"
                  @mouseleave="hoverTransition = null"
                  @focus="hoverTransition = opt"
                  @blur="hoverTransition = null"
                  @click="config.transition = opt"
                >
                  <div class="trans-canvas-wrap">
                    <ArtworkPreview
                      :artwork="{ type: 'emoji', config: { ...config, transition: opt } }"
                      :size="64"
                      :playing="hoverTransition === opt"
                    />
                  </div>
                  <div class="trans-label">{{ t(`textEmoji.transitions.${opt}`) }}</div>
                </button>
              </div>
            </n-form-item>
            <n-form-item label="渐变颜色">
              <div class="color-section">
                <div class="preset-row">
                  <div
                    v-for="(p, i) in gradientPresets"
                    :key="i"
                    class="swatch"
                    :style="{ background: `linear-gradient(135deg, ${p.colors.join(',')})` }"
                    :title="p.name"
                    @click="config.gradientColors = [...p.colors]"
                  />
                </div>
                <div class="color-stops">
                  <div v-for="(_, i) in config.gradientColors" :key="i" class="stop-row">
                    <span class="stop-label">色 {{ i + 1 }}</span>
                    <n-color-picker
                      :value="config.gradientColors[i]"
                      :modes="['hex']"
                      size="small"
                      style="width: 120px"
                      @update:value="(v: string) => setColor(i, v)"
                    />
                    <n-button
                      v-if="config.gradientColors.length > 2"
                      quaternary
                      circle
                      size="tiny"
                      @click="removeColor(i)"
                    >
                      <template #icon>
                        <n-icon><CloseOutline /></n-icon>
                      </template>
                    </n-button>
                  </div>
                  <n-button
                    v-if="config.gradientColors.length < 4"
                    dashed
                    size="small"
                    @click="addColor"
                  >
                    + 添加颜色
                  </n-button>
                </div>
              </div>
            </n-form-item>
            <n-form-item
              v-if="!isStatic"
              :label="`时长 ${(config.duration / 1000).toFixed(1)}s（max 3s）`"
            >
              <n-slider v-model:value="config.duration" :min="800" :max="3000" :step="100" />
            </n-form-item>
            <n-form-item
              v-if="!isStatic && config.mode === 'dual'"
              :label="`停留比例 ${Math.round(config.holdRatio * 100)}%`"
            >
              <n-slider v-model:value="config.holdRatio" :min="0.1" :max="0.45" :step="0.05" />
            </n-form-item>
            <n-form-item :label="t('textStyle.font')">
              <FontPicker
                v-model="config.fontFamily"
                :font-weight="config.fontWeight"
                :font-slant="config.fontSlant"
                :text-a="config.textA"
                :text-b="!isStatic && config.mode === 'dual' ? config.textB : undefined"
              />
            </n-form-item>
            <n-form-item label="背景">
              <n-space align="center">
                <n-switch v-model:value="bgTransparent" />
                <span>透明</span>
                <n-color-picker
                  v-if="!bgTransparent"
                  v-model:value="config.backgroundColor"
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
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NForm,
  NFormItem,
  NInput,
  NSlider,
  NColorPicker,
  NButton,
  NSpace,
  NIcon,
  NCard,
  NSwitch,
  NRadioGroup,
  NRadioButton,
} from 'naive-ui'
import { CloseOutline } from '@vicons/ionicons5'
import type { ProjectOf } from '@/core/project'
import { transitionTypes } from './transitions'
import type { TransitionType } from '@/core/models/textEmoji'
import { useProjectEditor } from '@/application/useProjectEditor'
import ArtworkPreview from '@/application/components/ArtworkPreview.vue'
import ExportControls from '@/application/components/ExportControls.vue'
import FontPicker from '@/shared/typography/FontPicker.vue'
import TextStyleControls from '@/shared/typography/TextStyleControls.vue'

const props = defineProps<{ project: ProjectOf<'emoji'> }>()
const { t, locale } = useI18n()
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
const isStatic = !playing
const hoverTransition = ref<TransitionType | null>(null)
const bgTransparent = computed({
  get: () => config.backgroundColor === 'transparent',
  set: (value) => {
    config.backgroundColor = value ? 'transparent' : '#000000'
  },
})
function textLimit(text: string) {
  return locale.value === 'en' || /[A-Za-z]/.test(text) ? 20 : 4
}

const gradientPresets = [
  { name: '粉紫蓝', colors: ['#FF69FF', '#6B5BFF', '#00BFFF'] },
  { name: '红橙黄', colors: ['#FF4444', '#FF8C00', '#FFD700'] },
  { name: '绿青蓝', colors: ['#00FF88', '#00CED1', '#4169E1'] },
  { name: '金橙红', colors: ['#FFD700', '#FF6347', '#DC143C'] },
  { name: '紫粉红', colors: ['#8B5CF6', '#EC4899', '#EF4444'] },
  { name: '青蓝靛', colors: ['#06B6D4', '#3B82F6', '#6366F1'] },
  { name: '纯白', colors: ['#FFFFFF', '#DDDDDD'] },
  { name: '纯金', colors: ['#FFD700', '#FFA500'] },
]

function setColor(i: number, v: string) {
  config.gradientColors[i] = v
}
function addColor() {
  config.gradientColors.push('#FFFFFF')
}
function removeColor(i: number) {
  config.gradientColors.splice(i, 1)
}

const transitionOptions = transitionTypes

const profileBg = computed(() => {
  const inverse = config.gradientColors[0]
    .slice(1, 7)
    .match(/../g)!
    .map((hex) => 255 - parseInt(hex, 16))
  return `color-mix(in srgb, rgb(${inverse.join(' ')}) 70%, black)`
})
const avatarGrad = computed(
  () => `linear-gradient(135deg, ${config.gradientColors[0]}, ${config.gradientColors.at(-1)})`,
)
</script>

<style scoped>
.te-editor {
  width: 100%;
}
.editor-body {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}
@media (max-width: 900px) {
  .editor-body {
    flex-direction: column;
  }
}

/* Left column */
.right-col {
  flex: 1;
  min-width: 0;
}
.left-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
  width: 290px;
}
@media (max-width: 900px) {
  .left-col {
    width: 100%;
  }
}

.canvas-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.canvas-bg {
  padding: 20px;
  border-radius: 12px;
}
.size-hint {
  font-size: 11px;
  color: var(--n-text-color-3, #aaa);
}

/* Context scenes */
.ctx-row {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.ctx-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.ctx-label {
  font-size: 12px;
  color: var(--n-text-color-3, #888);
}
.tg-scene {
  border-radius: 12px;
  overflow: hidden;
  padding: 16px;
}
.tg-chat-bg {
  background: #c4dab5;
}

/* Bubble */
.tg-bubble {
  background: #fff;
  border-radius: 10px 10px 10px 2px;
  padding: 10px 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  display: inline-block;
  max-width: 100%;
}
.tg-sender {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #2aabee;
  margin-bottom: 6px;
}
.tg-body {
  font-size: 13px;
  line-height: 20px;
  display: flex;
  align-items: center;
  gap: 2px;
  flex-wrap: wrap;
}
.tg-time {
  font-size: 9px;
  color: #999;
  text-align: right;
  margin-top: 2px;
}

/* Profile */
.tg-profile-scene {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px;
  gap: 10px;
}
.tg-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}
.tg-name {
  color: white;
  font-weight: 600;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 3px;
}
.tg-status {
  color: white;
  opacity: 0.7;
  font-size: 12px;
}

.inline-emoji {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}

.transition-picker {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(76px, 1fr));
  gap: 8px;
  width: 100%;
}
.trans-opt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 6px;
  border: 1px solid var(--n-border-color, #ddd);
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font: inherit;
}

.trans-opt:focus-visible {
  outline: 2px solid var(--n-primary-color, #2aabee);
  outline-offset: 2px;
}
.trans-opt:hover {
  background: rgba(42, 171, 238, 0.08);
}
.trans-opt.active {
  border-color: var(--n-primary-color, #2aabee);
}
.trans-canvas-wrap {
  width: 64px;
  height: 64px;
  border-radius: 6px;
  overflow: hidden;
  background-color: #111; /* dark bg so text shows clearly */
}
.trans-label {
  font-size: 11px;
  color: var(--n-text-color-2, #666);
  white-space: nowrap;
}

/* Gradient color section */
.color-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
.preset-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.swatch {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: transform 0.12s;
  flex-shrink: 0;
}
.swatch:hover {
  transform: scale(1.12);
  border-color: var(--n-primary-color, #2aabee);
}

.color-stops {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.stop-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.stop-label {
  font-size: 12px;
  color: var(--n-text-color-3, #888);
  width: 28px;
}
</style>
