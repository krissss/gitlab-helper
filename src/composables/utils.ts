export const useLoadingDebounce = (ms = 250, defaultV = false) => {
  const loading = ref(defaultV)
  const debounced = refDebounced(loading, ms)
  return {
    loading,
    debounced,
  }
}
