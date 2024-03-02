export function saveData(key: string, value: string) {
  localStorage.setItem(key, value)
}

export function getData(key: string): string|null {
  return localStorage.getItem(key)
}
