<template>
  <div class="banner-editor">
    <section class="preview-column">
      <n-card :title="t('banner.joinedPreview')">
        <div class="banner-stage checkerboard">
          <BannerPreview
            :config="config"
            :playing="playing"
            :guides="guides"
            @ready="setThumbnail"
          />
        </div>
        <div class="preview-controls">
          <n-switch v-model:value="guides" />
          <span>{{ t('banner.showCuts') }}</span>
        </div>
        <p class="hint">{{ t('banner.previewHint') }}</p>
      </n-card>
      <n-card :title="t('banner.inMessage')">
        <div class="banner-chat">
          <div class="message-bubble">
            <div class="sender">StickGram</div>
            <BannerPreview :config="config" :playing="playing" :max-width="config.count * 28" />
            <div class="message-time">15:12</div>
          </div>
        </div>
      </n-card>
      <n-card :title="t('banner.slices')">
        <div class="slice-strip">
          <div v-for="n in config.count" :key="n" class="slice-cell">
            <div
              class="slice-window"
              :style="{
                backgroundImage: `url(${thumbnail})`,
                backgroundSize: `${config.count * 64}px 64px`,
                backgroundPosition: `-${(n - 1) * 64}px 0`,
              }"
            />
            <span>{{ String(n).padStart(2, '0') }}</span>
          </div>
        </div>
        <p class="hint">{{ t('banner.exportHint', { count: config.count }) }}</p>
        <ExportControls
          :format="project.format"
          bundle
          :loading="exporting"
          :url="downloadUrl"
          :name="downloadName"
          :error="error"
          @export="exportArtwork"
        />
      </n-card>
    </section>
    <n-card :title="t('banner.design')" class="settings-column">
      <n-form label-placement="top">
        <n-form-item :label="t('banner.text')">
          <n-input v-model:value="config.text" :maxlength="30" show-count />
        </n-form-item>
        <TextStyleControls
          :font-family="config.fontFamily"
          v-model:font-weight="config.fontWeight"
          v-model:font-slant="config.fontSlant"
        />
        <n-form-item :label="t('banner.count')">
          <n-input-number
            :value="config.count"
            :min="2"
            :max="10"
            :precision="0"
            @update:value="
              (value) => {
                if (value) config.count = value
              }
            "
          />
        </n-form-item>
        <n-form-item :label="t('banner.templates')">
          <BannerTemplatePicker
            :model-value="matchingBannerTemplate(config)"
            :text="config.text"
            :count="config.count"
            @select="applyTemplate"
          />
        </n-form-item>
        <n-form-item :label="t('banner.colors')">
          <n-space>
            <n-color-picker
              v-for="(_, i) in config.colors"
              :key="i"
              :value="config.colors[i]"
              :modes="['hex']"
              style="width: 110px"
              @update:value="(value) => (config.colors[i] = value)"
            />
          </n-space>
        </n-form-item>
        <n-form-item :label="t('banner.textColor')">
          <n-color-picker v-model:value="config.textColor" :modes="['hex']" style="width: 140px" />
        </n-form-item>
        <n-form-item :label="t('banner.details')">
          <n-space vertical>
            <n-checkbox v-model:checked="config.rounded">{{ t('banner.rounded') }}</n-checkbox>
            <n-checkbox v-model:checked="config.shadow">{{ t('banner.shadow') }}</n-checkbox>
            <n-checkbox v-model:checked="config.sparkles">{{ t('banner.sparkles') }}</n-checkbox>
            <n-checkbox v-model:checked="config.outline">{{ t('banner.outline') }}</n-checkbox>
            <n-checkbox v-model:checked="config.glow">{{ t('banner.glow') }}</n-checkbox>
          </n-space>
        </n-form-item>
        <n-form-item :label="t('banner.pattern')">
          <n-select v-model:value="config.pattern" :options="patternOptions" />
        </n-form-item>
        <n-form-item :label="t('banner.border')">
          <n-select v-model:value="config.border" :options="borderOptions" />
        </n-form-item>
        <n-form-item
          v-if="playing"
          :label="t('editor.duration', { seconds: (config.duration / 1000).toFixed(1) })"
        >
          <n-slider v-model:value="config.duration" :min="800" :max="3000" :step="100" />
        </n-form-item>
        <n-form-item :label="t('textStyle.font')">
          <FontPicker
            v-model="config.fontFamily"
            :font-weight="config.fontWeight"
            :font-slant="config.fontSlant"
            :text-a="config.text"
          />
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSwitch,
  NSpace,
  NColorPicker,
  NCheckbox,
  NSlider,
  NSelect,
} from 'naive-ui'
import { bannerPatterns, bannerBorders } from '@/core/models/banner'
import type { ProjectOf } from '@/core/project'
import { useProjectEditor } from '@/application/useProjectEditor'
import ExportControls from '@/application/components/ExportControls.vue'
import FontPicker from '@/shared/typography/FontPicker.vue'
import TextStyleControls from '@/shared/typography/TextStyleControls.vue'
import BannerPreview from './Preview.vue'
import BannerTemplatePicker from './PresetPicker.vue'
import { getBannerTemplate, matchingBannerTemplate } from './presets'

const props = defineProps<{ project: ProjectOf<'sequential-emoji'> }>()
const { t } = useI18n()
const {
  config,
  playing,
  thumbnail,
  setThumbnail,
  exporting,
  error,
  downloadUrl,
  downloadName,
  exportArtwork,
} = useProjectEditor(props.project)
const guides = ref(false)
const patternOptions = computed(() =>
  bannerPatterns.map((value) => ({
    value,
    label: t(`banner.patterns.${value}`),
  })),
)
const borderOptions = computed(() =>
  bannerBorders.map((value) => ({
    value,
    label: t(`banner.borders.${value}`),
  })),
)
function applyTemplate(id: string) {
  const { config: preset } = getBannerTemplate(id)
  Object.assign(config, structuredClone(preset), {
    text: config.text,
    count: config.count,
    duration: config.duration,
    fontWeight: config.fontWeight,
    fontSlant: config.fontSlant,
  })
}
</script>
<style scoped>
.banner-editor {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}
.preview-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}
.settings-column {
  min-width: 0;
}
.banner-stage {
  border-radius: 12px;
  padding: 28px 14px;
  background-color: #e7e7e7;
}
.preview-controls {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 18px;
  flex-wrap: wrap;
  font-size: 12px;
}
.hint {
  font-size: 12px;
  color: var(--n-text-color-3, #888);
  line-height: 1.8;
}
.banner-chat {
  padding: 20px;
  background: #c4dab5;
  border-radius: 12px;
}
.message-bubble {
  background: white;
  border-radius: 10px 10px 10px 2px;
  padding: 10px 12px;
  display: inline-block;
  max-width: 100%;
}
.sender {
  font-weight: 600;
  color: #2aabee;
  font-size: 12px;
  margin-bottom: 8px;
}
.message-time {
  font-size: 10px;
  color: #999;
  text-align: right;
  margin-top: 8px;
}
.slice-strip {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.slice-cell {
  text-align: center;
  font-size: 11px;
  color: var(--n-text-color-3, #888);
}
.slice-window {
  width: 64px;
  height: 64px;
  margin-bottom: 6px;
}
@media (max-width: 1000px) {
  .banner-editor {
    grid-template-columns: 1fr;
  }
}
</style>
