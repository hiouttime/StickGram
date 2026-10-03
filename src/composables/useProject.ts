import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDialog } from 'naive-ui';
import { useProjectsStore } from '../stores/projects';
import { ProjectType, StickerFormat } from '../types/project';

export function useProject() {
  const projectsStore = useProjectsStore();
  const router = useRouter();
  const dialog = useDialog();

  function createAndNavigate(opts: { name: string; type: ProjectType; format: StickerFormat; emojiCount?: number }) {
    const id = projectsStore.createProject(opts);
    openProject(id);
  }

  function openProject(id: string) {
    projectsStore.setCurrentProject(id);
    router.push(`/editor/${id}`);
  }

  function deleteWithConfirm(id: string) {
    dialog.warning({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this project?',
      positiveText: 'Delete',
      negativeText: 'Cancel',
      onPositiveClick: () => {
        projectsStore.deleteProject(id);
      }
    });
  }

  const currentProject = computed(() => projectsStore.currentProject);

  return {
    createAndNavigate,
    openProject,
    deleteWithConfirm,
    currentProject
  };
}
