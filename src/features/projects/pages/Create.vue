<template>
  <div class="create-page">
    <header class="header">
      <div class="eyebrow">{{ t('create.eyebrow') }}</div>
      <h1>{{ t('create.title') }}</h1>
      <p class="subtitle">{{ t('create.subtitle') }}</p>
      <n-steps :current="currentStep" size="small" class="steps">
        <n-step :title="t('create.selectType')" />
        <n-step :title="t('create.selectFormat')" />
        <n-step :title="t('create.projectName')" />
      </n-steps>
    </header>

    <section v-if="currentStep === 1" class="options-grid" aria-label="项目类型">
      <button
        v-for="type in types"
        :key="type"
        type="button"
        class="option-card"
        :class="{ selected: selectedType === type }"
        :aria-pressed="selectedType === type"
        @click="selectedType = type"
      >
        <ProjectDemo :type="type" :options="creationOptions" />
        <div class="card-title">
          <h2>{{ t(`artwork.${type}.title`) }}</h2>
          <n-icon v-if="selectedType === type" color="#2AABEE" :size="22">
            <CheckmarkCircle />
          </n-icon>
        </div>
        <p>{{ t(`artwork.${type}.description`) }}</p>
        <span class="card-spec">{{ t(`artwork.${type}.spec`) }}</span>
      </button>
    </section>

    <section v-else-if="currentStep === 2" class="format-section">
      <div class="selection-summary">
        {{ t('create.creating') }}
        <strong>{{ selectedTypeLabel }}</strong>
      </div>
      <div class="options-grid format-grid">
        <button
          v-for="format in formats"
          :key="format.value"
          type="button"
          class="option-card"
          :class="{ selected: selectedFormat === format.value }"
          :aria-pressed="selectedFormat === format.value"
          @click="selectedFormat = format.value"
        >
          <ProjectDemo
            :type="selectedType!"
            :playing="getExportFormat(format.value).animated"
            :options="creationOptions"
          />
          <div class="card-title">
            <h2>{{ t(format.label) }}</h2>
            <n-icon v-if="selectedFormat === format.value" color="#2AABEE" :size="22">
              <CheckmarkCircle />
            </n-icon>
          </div>
          <p>{{ t(format.description) }}</p>
          <span class="card-spec">
            {{ getExportFormat(format.value).description }}
          </span>
        </button>
      </div>
    </section>

    <section v-else class="details-grid">
      <n-card class="details-form">
        <n-form label-placement="top">
          <n-form-item :label="t('create.projectName')">
            <n-input
              v-model:value="projectName"
              :maxlength="60"
              :placeholder="t('create.projectNamePlaceholder')"
              @keyup.enter="canCreate && handleCreate()"
            />
          </n-form-item>
          <component v-if="creationFields" :is="creationFields" v-model="creationOptions" />
        </n-form>
      </n-card>
      <div class="project-summary">
        <ProjectDemo
          :type="selectedType!"
          :playing="getExportFormat(selectedFormat).animated"
          :options="creationOptions"
        />
        <h2>{{ projectName.trim() || t('create.projectNamePlaceholder') }}</h2>
        <p>
          {{ selectedTypeLabel }} ·
          {{ t(`exportFormat.${selectedFormat}.name`) }}
        </p>
      </div>
    </section>

    <footer class="actions">
      <span class="step-hint">{{ t('create.step', { current: currentStep, total: 3 }) }}</span>
      <n-button v-if="currentStep > 1" @click="currentStep--">{{ t('create.previous') }}</n-button>
      <n-button
        v-if="currentStep < 3"
        type="primary"
        :disabled="!canProceed"
        @click="currentStep++"
      >
        {{ t('create.next') }}
      </n-button>
      <n-button v-else type="primary" :disabled="!canCreate" @click="handleCreate">
        {{ t('create.createProject') }}
      </n-button>
    </footer>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, defineAsyncComponent, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { NSteps, NStep, NCard, NButton, NForm, NFormItem, NInput, NIcon } from 'naive-ui'
import { CheckmarkCircle } from '@vicons/ionicons5'
import ProjectDemo from '../components/ProjectDemo.vue'
import { useProjectsStore } from '@/application/projects'
import type { ArtworkType } from '@/core/artwork'
import type { ExportFormat } from '@/core/export'
import { useSettingsStore } from '@/application/settings'
import { artworkTypes, getArtworkModule, createArtwork } from '@/application/catalog'
import { exportFormatIds, getExportFormat } from '@/application/formats'
import type { CreationOptions } from '@/features/types'
import type { Locale } from '@/core/settings'

const { t, locale } = useI18n()
const router = useRouter()
const projectsStore = useProjectsStore()
const currentStep = ref(1)
const selectedType = ref<ArtworkType | null>(null)
const selectedFormat = ref<ExportFormat>(useSettingsStore().defaultFormat)
const projectName = ref('')
const creationOptions = ref<CreationOptions>({})
watch(selectedType, (type) => {
  creationOptions.value = getArtworkModule(type!).creationDefaults?.() ?? {}
})
const types = artworkTypes
const formats = exportFormatIds.map((value) => ({
  value,
  label: `exportFormat.${value}.name`,
  description: `exportFormat.${value}.description`,
}))
const selectedTypeLabel = computed(() =>
  selectedType.value ? t(`artwork.${selectedType.value}.title`) : t('create.selectType'),
)
const creationFields = computed(() => {
  const loader = selectedType.value && getArtworkModule(selectedType.value).creationFields
  return loader ? defineAsyncComponent(loader) : undefined
})
const canProceed = computed(() => currentStep.value !== 1 || selectedType.value !== null)
const canCreate = computed(
  () =>
    !!projectName.value.trim() &&
    (getArtworkModule(selectedType.value!).canCreate?.(creationOptions.value) ?? true),
)

function handleCreate() {
  const id = projectsStore.createProject({
    name: projectName.value.trim(),
    artwork: createArtwork(selectedType.value!, {
      ...creationOptions.value,
      locale: locale.value as Locale,
    }),
    format: selectedFormat.value,
  })
  router.push(`/editor/${id}`)
}
</script>
<style scoped>
.create-page {
  padding: 32px 24px;
  max-width: 1080px;
  margin: 0 auto;
}
.header {
  margin-bottom: 32px;
}
.eyebrow {
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--n-primary-color, #2aabee);
}
h1 {
  font-size: 30px;
  margin: 8px 0 10px;
}
.subtitle {
  margin: 0 0 28px;
  color: var(--n-text-color-3, #888);
}
.options-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
.option-card {
  width: 100%;
  padding: 12px;
  text-align: left;
  cursor: pointer;
  border: 1px solid var(--n-border-color, #ddd);
  border-radius: 16px;
  background: transparent;
  color: inherit;
  font: inherit;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
  min-width: 0;
}
.option-card:hover {
  border-color: #2aabee;
}
.option-card:focus-visible {
  outline: 2px solid #2aabee;
  outline-offset: 3px;
}
.option-card.selected {
  border-color: #2aabee;
  box-shadow: 0 0 0 2px rgba(42, 171, 238, 0.12);
}
.card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
  margin-top: 18px;
}
h2 {
  font-size: 18px;
  margin: 0;
}
.option-card p {
  padding: 0 6px;
  font-size: 13px;
  line-height: 1.7;
  min-height: 44px;
  color: var(--n-text-color-3, #888);
  margin: 8px 0 14px;
}
.card-spec {
  display: inline-block;
  margin: 0 6px 8px;
  font-size: 11px;
  color: var(--n-text-color-2, #777);
}
.format-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.selection-summary {
  margin-bottom: 16px;
  color: var(--n-text-color-3, #888);
}
.selection-summary strong {
  color: var(--n-text-color, #333);
  margin-left: 8px;
}
.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}
.project-summary {
  padding: 12px;
  border: 1px solid var(--n-border-color, #ddd);
  border-radius: 16px;
  min-width: 0;
}
.project-summary h2 {
  margin: 16px 8px 4px;
  overflow-wrap: anywhere;
}
.project-summary p {
  color: var(--n-text-color-3, #888);
  margin: 8px;
}
.actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid var(--n-border-color, #eee);
  margin-top: 28px;
  padding-top: 24px;
}
.step-hint {
  margin-right: auto;
  font-size: 12px;
  color: var(--n-text-color-3, #888);
}
@media (max-width: 760px) {
  .create-page {
    padding: 24px 18px;
  }
  .options-grid,
  .details-grid {
    grid-template-columns: 1fr;
  }
  h1 {
    font-size: 26px;
  }
}
</style>
