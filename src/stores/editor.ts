import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

type Tool = 'select' | 'move' | 'text' | 'shape';

export const useEditorStore = defineStore('editor', () => {
  const selectedLayerId = ref<string | null>(null);
  const selectedFrameIndex = ref(0);
  const zoom = ref(1);
  const tool = ref<Tool>('select');
  const showGrid = ref(false);
  const snapToGrid = ref(true);
  const gridSize = ref(10);
  const panOffset = ref({ x: 0, y: 0 });

  const undoStack = ref<string[]>([]);
  const redoStack = ref<string[]>([]);

  function pushHistory(state: any) {
    const serialized = JSON.stringify(state);
    if (undoStack.value.length > 0 && undoStack.value[undoStack.value.length - 1] === serialized) return;
    undoStack.value.push(serialized);
    if (undoStack.value.length > 50) {
      undoStack.value.shift();
    }
    redoStack.value = [];
  }

  function undo(): any {
    if (undoStack.value.length === 0) return null;
    const currentState = undoStack.value.pop()!;
    redoStack.value.push(currentState);
    return undoStack.value.length > 0 ? JSON.parse(undoStack.value[undoStack.value.length - 1]) : null;
  }

  function redo(): any {
    if (redoStack.value.length === 0) return null;
    const state = redoStack.value.pop()!;
    undoStack.value.push(state);
    return JSON.parse(state);
  }

  const canUndo = computed(() => undoStack.value.length > 1);
  const canRedo = computed(() => redoStack.value.length > 0);

  function selectLayer(id: string | null) {
    selectedLayerId.value = id;
  }

  function selectFrame(index: number) {
    selectedFrameIndex.value = index;
  }

  function setZoom(val: number) {
    zoom.value = val;
  }

  function zoomIn() {
    zoom.value *= 1.2;
  }

  function zoomOut() {
    zoom.value /= 1.2;
  }

  function resetZoom() {
    zoom.value = 1;
    panOffset.value = { x: 0, y: 0 };
  }

  function setTool(t: Tool) {
    tool.value = t;
  }

  function resetEditor() {
    selectedLayerId.value = null;
    selectedFrameIndex.value = 0;
    zoom.value = 1;
    tool.value = 'select';
    showGrid.value = false;
    snapToGrid.value = true;
    gridSize.value = 10;
    panOffset.value = { x: 0, y: 0 };
    undoStack.value = [];
    redoStack.value = [];
  }

  return {
    selectedLayerId,
    selectedFrameIndex,
    zoom,
    tool,
    showGrid,
    snapToGrid,
    gridSize,
    panOffset,
    undoStack,
    redoStack,
    canUndo,
    canRedo,
    pushHistory,
    undo,
    redo,
    selectLayer,
    selectFrame,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    setTool,
    resetEditor,
  };
});
