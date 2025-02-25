// Record타입; 객체의 속성을 키, 속성값을 값으로 하는 타입

const cache: Record<string, any> = {}

export const useOrCreate = <T>(key: string, callback: () => {}): T => {
  if (!cache[key]) cache[key] = callback()
  console.log('cache:', cache)
  return cache[key] as T
}
