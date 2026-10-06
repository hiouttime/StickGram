import { ref, onUnmounted } from 'vue'

/** Keep a retryable link alive until settings change or the editor is closed. */
export function useFileDownload() {
  const downloadUrl = ref(''),
    downloadName = ref('')
  function clearDownload() {
    if (downloadUrl.value) URL.revokeObjectURL(downloadUrl.value)
    downloadUrl.value = ''
    downloadName.value = ''
  }
  function downloadFile(blob: Blob, filename: string) {
    clearDownload()
    downloadUrl.value = URL.createObjectURL(blob)
    downloadName.value = filename
    const link = document.createElement('a')
    link.href = downloadUrl.value
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
  }
  onUnmounted(clearDownload)
  return { downloadUrl, downloadName, downloadFile, clearDownload }
}
