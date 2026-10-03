<template>
  <div class="editor-layout">
    <ToolBar 
      :project-name="project?.name || t('common.untitled')"
      :zoom="100"
      @back="goBack"
    />
    
    <div class="editor-workspace">
      <div class="left-panel desktop-only">
        <LayerPanel :layers="[]" :selected-layer-id="null" />
      </div>
      
      <div class="center-area">
        <CanvasArea :width="project?.width || 512" :height="project?.height || 512" :zoom="1" />
        <FrameStrip 
          v-if="project?.type === 'sequential-emoji'" 
          :frames="[]" 
          :selected-index="0" 
          :canvas-size="{ width: project?.width || 100, height: project?.height || 100 }"
        />
      </div>
      
      <div class="right-panel desktop-only">
        <PropertyPanel :layer="null" />
      </div>

      <!-- Mobile Tabs -->
      <div class="mobile-tabs mobile-only">
        <!-- Would use tabs here for layers/properties on mobile -->
        <p>Tabs: Layers / Properties</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ToolBar from '@/components/editor/ToolBar.vue'
import LayerPanel from '@/components/editor/LayerPanel.vue'
import PropertyPanel from '@/components/editor/PropertyPanel.vue'
import CanvasArea from '@/components/editor/CanvasArea.vue'
import FrameStrip from '@/components/editor/FrameStrip.vue'
import { useProjectsStore } from '@/stores/projects'
import type { Project } from '@/types/project'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const projectsStore = useProjectsStore()

const project = ref<Project | null>(null)

onMounted(() => {
  const id = route.params.id as string
  const found = projectsStore.projects[id]
  if (found) {
    project.value = found
  } else {
    router.push('/')
  }
})

function goBack() {
  router.push('/')
}
</script>

<style scoped>
.editor-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-workspace {
  flex: 1;
  display: flex;
  overflow: hidden;
  background-color: var(--n-color-embedded);
}

.left-panel {
  width: 240px;
  border-right: 1px solid var(--n-border-color);
  background-color: var(--n-color);
  display: flex;
  flex-direction: column;
}

.right-panel {
  width: 280px;
  border-left: 1px solid var(--n-border-color);
  background-color: var(--n-color);
  display: flex;
  flex-direction: column;
}

.center-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
  .mobile-only {
    display: flex;
    flex-direction: column;
    height: 40vh;
    border-top: 1px solid var(--n-border-color);
    background-color: var(--n-color);
  }
  .center-area {
    height: 60vh;
    flex: none;
  }
  .editor-workspace {
    flex-direction: column;
  }
}
</style>
