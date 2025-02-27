/*
src/date 디렉터리의  index.ts 파일은 src/data 디렉터리에 구현한 기능을 호출하는 쪽에서 간편하게 쓸 수 있게 하는 것을 목적으로 한다.
지금까지 구현한 내용을 export * 구문으로 다시 내보내 주어, 호출하는 쪽에서 util의 것인지 image 의 것인지 일일이 알지 못해도 호출 할 수 있다.
 */

export * from './util'
export * from './image'
export * from './chance'
export * from './date'
export * from './User'
export * from './Card'