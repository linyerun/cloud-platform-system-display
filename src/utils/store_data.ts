export function saveData(key: string, value: string) {
  sessionStorage.setItem(key, value)
}

export function getData(key: string): string|null {
  return sessionStorage.getItem(key)
}

export function clearLocalData() {
  sessionStorage.clear()
  localStorage.clear()
}
