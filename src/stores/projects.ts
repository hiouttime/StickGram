import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { nanoid } from 'nanoid';
import { Project, ProjectType, StickerFormat, Frame } from '../types/project';
import { getCanvasSize } from '../utils/telegram';
import { loadFromStorage, saveToStorage, removeFromStorage } from '../utils/storage';

const PROJECTS_KEY = 'stickgram-projects';
const PROJECT_PREFIX = 'stickgram-project-';

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Record<string, Project>>({});
  const currentProjectId = ref<string | null>(null);

  const loadedList = loadFromStorage<Record<string, Project>>(PROJECTS_KEY, {});
  projects.value = loadedList;
  Object.keys(loadedList).forEach(id => {
    const detail = loadFromStorage<Project | null>(`${PROJECT_PREFIX}${id}`, null);
    if (detail) {
      projects.value[id] = detail;
    }
  });

  const projectList = computed(() => {
    return Object.values(projects.value).sort((a, b) => b.updatedAt - a.updatedAt);
  });

  const currentProject = computed(() => {
    return currentProjectId.value ? projects.value[currentProjectId.value] : undefined;
  });

  const projectCount = computed(() => projectList.value.length);

  function saveProjectsList() {
    saveToStorage(PROJECTS_KEY, projects.value);
  }

  function createProject(opts: { name: string; type: ProjectType; format: StickerFormat; emojiCount?: number }) {
    const id = nanoid();
    const size = getCanvasSize(opts.type);
    
    const frames: Frame[] = [];
    const frameCount = opts.type === 'sequential-emoji' ? (opts.emojiCount || 5) : 1;
    
    for (let i = 0; i < frameCount; i++) {
      frames.push({
        id: nanoid(),
        layers: [],
        duration: 100,
        order: i,
      });
    }

    const project: Project = {
      id,
      name: opts.name,
      type: opts.type,
      format: opts.format,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      frames,
      width: size.width,
      height: size.height,
      fps: 30,
      duration: 3,
    };

    projects.value[id] = project;
    saveProjectData(id, project);
    saveProjectsList();
    
    return id;
  }

  function deleteProject(id: string) {
    delete projects.value[id];
    removeFromStorage(`${PROJECT_PREFIX}${id}`);
    saveProjectsList();
    if (currentProjectId.value === id) {
      currentProjectId.value = null;
    }
  }

  function updateProject(id: string, partial: Partial<Project>) {
    if (projects.value[id]) {
      projects.value[id] = { ...projects.value[id], ...partial, updatedAt: Date.now() };
      saveProjectData(id, projects.value[id]);
      saveProjectsList();
    }
  }

  function duplicateProject(id: string) {
    const project = projects.value[id];
    if (!project) return null;

    const newId = nanoid();
    const duplicated: Project = JSON.parse(JSON.stringify(project));
    duplicated.id = newId;
    duplicated.name = `${duplicated.name} (Copy)`;
    duplicated.createdAt = Date.now();
    duplicated.updatedAt = Date.now();
    
    duplicated.frames.forEach(frame => {
      frame.id = nanoid();
      frame.layers.forEach(layer => {
        layer.id = nanoid();
      });
    });

    projects.value[newId] = duplicated;
    saveProjectData(newId, duplicated);
    saveProjectsList();
    return newId;
  }

  function getProject(id: string) {
    return projects.value[id];
  }

  function saveProjectData(id: string, data: Project) {
    saveToStorage(`${PROJECT_PREFIX}${id}`, data);
  }

  function setCurrentProject(id: string | null) {
    currentProjectId.value = id;
  }

  return {
    projects,
    currentProjectId,
    projectList,
    currentProject,
    projectCount,
    createProject,
    deleteProject,
    updateProject,
    duplicateProject,
    getProject,
    saveProjectData,
    setCurrentProject
  };
});
