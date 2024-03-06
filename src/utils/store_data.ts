export function saveData(key: string, value: string) {
  localStorage.setItem(key, value)
}

export function getData(key: string): string|null {
  return localStorage.getItem(key)
}

export function clearLocalData() {
  sessionStorage.clear()
  localStorage.clear()
}
