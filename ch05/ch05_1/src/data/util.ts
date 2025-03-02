// 가짜 데이터를 만드는 함수 정의
export const makeArray = (length: number) => new Array(length).fill(null)
export const range = (min: number, max: number): number[] =>
  makeArray(max - min).map((notUsed, index) => index + min)
export const random = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min)) + min
