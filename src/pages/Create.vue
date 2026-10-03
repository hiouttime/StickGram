<template>
  <div class="create-page">
    <div class="header">
      <h1 class="title">{{ t('create.title') }}</h1>
      <n-steps :current="currentStep" class="steps">
        <n-step :title="t('create.selectType')" />
        <n-step :title="t('create.selectFormat')" />
        <n-step :title="t('create.projectName')" />
      </n-steps>
    </div>

    <div class="step-content">
      <!-- Step 1: Type -->
      <div v-show="currentStep === 1" class="options-grid">
        <n-card hoverable class="option-card" :class="{ selected: selectedType === 'emoji' }" @click="selectedType = 'emoji'">
          <div class="icon">🎭</div>
          <h3>{{ t('create.emoji') }}</h3>
          <p>{{ t('create.emojiDesc') }}</p>
        </n-card>
        <n-card hoverable class="option-card" :class="{ selected: selectedType === 'sticker' }" @click="selectedType = 'sticker'">
          <div class="icon">🖼️</div>
          <h3>{{ t('create.sticker') }}</h3>
          <p>{{ t('create.stickerDesc') }}</p>
        </n-card>
        <n-card hoverable class="option-card" :class="{ selected: selectedType === 'sequential-emoji' }" @click="selectedType = 'sequential-emoji'">
          <div class="icon">📜</div>
          <h3>{{ t('create.sequentialEmoji') }}</h3>
          <p>{{ t('create.sequentialEmojiDesc') }}</p>
        </n-card>
      </div>

      <!-- Step 2: Format -->
      <div v-show="currentStep === 2" class="options-grid">
        <n-card hoverable class="option-card" :class="{ selected: selectedFormat === 'static' }" @click="selectedFormat = 'static'">
          <div class="icon">🖼️</div>
          <h3>{{ t('create.static') }}</h3>
          <p>{{ t('create.staticDesc') }}</p>
        </n-card>
        <n-card hoverable class="option-card" :class="{ selected: selectedFormat === 'animated' }" @click="selectedFormat = 'animated'">
          <div class="icon">✨</div>
          <h3>{{ t('create.animated') }}</h3>
          <p>{{ t('create.animatedDesc') }}</p>
        </n-card>
        <n-card hoverable class="option-card" :class="{ selected: selectedFormat === 'video' }" @click="selectedFormat = 'video'">
          <div class="icon">🎬</div>
          <h3>{{ t('create.video') }}</h3>
          <p>{{ t('create.videoDesc') }}</p>
        </n-card>
      </div>

      <!-- Step 3: Details -->
      <div v-show="currentStep === 3" class="details-form">
        <n-card>
          <n-form>
            <n-form-item :label="t('create.projectName')">
              <n-input v-model:value="projectName" :placeholder="t('create.projectNamePlaceholder')" />
            </n-form-item>
            <n-form-item v-if="selectedType === 'sequential-emoji'" :label="t('create.emojiCount')">
              <n-input-number v-model:value="emojiCount" :min="2" :max="10" />
            </n-form-item>
          </n-form>
        </n-card>
      </div>
    </div>

    <div class="actions">
      <n-button v-if="currentStep > 1" @click="currentStep--">{{ t('create.previous') }}</n-button>
      <n-button v-if="currentStep < 3" type="primary" @click="currentStep++" :disabled="!canProceed">{{ t('create.next') }}</n-button>
      <n-button v-if="currentStep === 3" type="primary" @click="handleCreate" :disabled="!projectName">{{ t('create.createProject') }}</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { NSteps, NStep, NCard, NButton, NForm, NFormItem, NInput, NInputNumber } from 'naive-ui'
import { useProjectsStore } from '@/stores/projects'
import type { ProjectType, StickerFormat } from '@/types/project'

const { t } = useI18n()
const router = useRouter()
const projectsStore = useProjectsStore()

const currentStep = ref(1)
const selectedType = ref<ProjectType | null>(null)
const selectedFormat = ref<StickerFormat | null>(null)
const projectName = ref('')
const emojiCount = ref(2)

const canProceed = computed(() => {
  if (currentStep.value === 1) return selectedType.value !== null
  if (currentStep.value === 2) return selectedFormat.value !== null
  return true
})

function handleCreate() {
  if (!selectedType.value || !selectedFormat.value || !projectName.value) return

  const id = projectsStore.createProject({
    name: projectName.value,
    type: selectedType.value,
    format: selectedFormat.value,
    emojiCount: selectedType.value === 'sequential-emoji' ? emojiCount.value : undefined,
  })
  
  router.push(`/editor/${id}`)
}
</script>

<style scoped>
.create-page {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  margin-bottom: 40px;
}

.title {
  margin-bottom: 24px;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.option-card {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.option-card.selected {
  border-color: var(--n-primary-color);
  background-color: var(--n-primary-color-hover);
}

.icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .options-grid {
    grid-template-columns: 1fr;
  }
}
</style>
