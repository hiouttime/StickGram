import { ref, computed, onMounted, onUnmounted } from 'vue';

export function useIsMobile() {
  const isMobile = ref(false);

  const check = () => {
    isMobile.value = window.innerWidth < 768;
  };

  onMounted(() => {
    check();
    window.addEventListener('resize', check);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', check);
  });

  return isMobile;
}

export function useIsTablet() {
  const isTablet = ref(false);

  const check = () => {
    isTablet.value = window.innerWidth >= 768 && window.innerWidth < 1024;
  };

  onMounted(() => {
    check();
    window.addEventListener('resize', check);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', check);
  });

  return isTablet;
}

export function useBreakpoint() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  return computed<'mobile' | 'tablet' | 'desktop'>(() => {
    if (isMobile.value) return 'mobile';
    if (isTablet.value) return 'tablet';
    return 'desktop';
  });
}
