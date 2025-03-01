# 04-6 useContext 훅 이해하기
컨텍스트는 리액트가 제공하는 가장 막강한 기능으로 리액트 라우터, 리덕스 등 많은 라이브러리 설계의 근간이 되었다.
이 장에서는 컴텍스트와 함께 커스텀 훅이라고 부르는 사용자 정의 리액트 훅을 제작하는 방법을 알아본다.

## 🎈컨텍스트란?
컴포넌트의 속성은 부모 컴포넌트가 자식 컴포넌트로 어떤 정보를 전달하려고 할 때 사용하는 메커니즘이다.
그런데 부모 컴포넌트가 지계 자식이 아닌, 손자나 증손자 컴포넌트에 정보를 전달하려고 하면 다음 그림처럼
번거로운 속성 전달을 해야 한다.

<img src="../../images/04-07.png" width="600">

리액트는 이런 속성 전달의 번거로움을 해소하고자 컨텍스트라는 메커니즘을 구현해 놓았다. 리액트나 리액트 네이티브에서
createContext 와 useContext 훅으로 이루어지며, 이 둘의 관계는 다음 그림처럼 표현할 수 있다.

<img src="../../images/04-08.png" width="600">

컨텍스트 기능을 사용하는 리액트와 리액트 네이티브 코드는 항상 이름에 'Provider'가 있는 컴포넌트와 'use컨텍스트_이름()'
형태의 커스텀 훅을 사용한다. 컨텍스트 기능을 구현한 react-native-paper와 같은 패키지 또한 항상 Provider란 이름이 있는
컴포넌트와 Provider가 제공하는 정보를 사용할 수 있게 하는 useTheme과 같은 커스텀 훅을 제공한다.

## 🎈createContext 함수 탐구
컨텍스트 기능을 구현하려고 할 때 제일 먼저 해야 하는 일은 createContext 함수를 임포트하는 것이다. 그리고
타입스크립트에서 createContext 함수 호출은 다음과 같은 코드 패턴으로 작성해야 한다.
```typescript jsx
type ContextType = {
  // 공유할 데이터 속성
}
const defaultContextValue: ContextType = {
  // 공유할 데이터 속성 초깃값
}
const SomeContext = createContext<ContextType>(defaultContextValue)
```

## 🎈테일윈드CSS의 중단점 접두사 이해하기
이제 createContext 함수를 사용하는 코드를 보겠다. 그전에 잠시 테일윈드CSS의 중단점 접두사를 알아보겠다.
테일윈드CSS뿐 아니라 부트스트랩 등 대다수 CSS 프레임워크는 sm,md,lg,xl 등을 사용해 웹 화면의 크기를 표현한다.
즉, 다음 표에서 보는 키워드들은 CSS 프레임워크가 제공하는 반응형 디자인 기능을 사용할 때 사용한다.

<img src="../../images/04-09.png" width="650">

예를들어 다음 className에 설정된 클래스의 의미를 살펴보면 보통은 폭 4rem(w-16)이지만 웹 브라우저의 폭이 768px 보다 클 때는
폭 8rem(md:w-32), 1024px 보다 클 때는 12rem(lg:w-48)으로 웹 브라우저의 넓이에 따라 이미지의 크기를 달리하도록 설정한다.
여기서 콜론(:)앞의 md 등을 중단점이라고 하고, 중단점에 콜론 기호를 붙인 md:을 중단점 접두사라고 한다.

```typescript jsx
<img className={"w-16 md:w-32 lg:w-48"}
```

## 🎈반응형 컨텍스트 만들기
이제 04-4 에서 반든 useWindowResize 커스텀 훅으로 웹 페이지의 폭을 중단점을 사용해 화면에 표시하는 컨텍스트를 만들어 보겠다.
먼저 src/contexts 디렉터리를 만들고 index.ts, ResponsiveContext.tsx 파일을 만들고 코드를 작성한다.

### 🕸️컨텍스트 객체가 제공하는 Provider 컴포넌트
createContext 함수 호출로 생성된 컨텍스트 객체는 Provider와 Consumer 라는 컴포넌트를 제공한다. 여기서 Provider는
컨텍스트의 기능을 제공할 컴포넌트이고, Consumer는 Provider가 제공한 기능을 사용하고 싶은 클래스 컴포넌트이다.
그런데 대부분 컴포넌트를 함수 형태로 구현하는 경우 Consumer는 무시해도 된다. 함수 컴포넌트는 클래스 컴포넌트와 달리
Consumer 보다 훨씬 사용법이 단순한 useContext 훅을 사용하면 되기 때문이다.  
Provider 컴포넌트는 다음처럼 value와 children 속성이 있는 ProviderProps 속성을 제공한다. 여기서 타입 변수 T는
`createContext<T>` 와 같아야 하고, children은 02-4 절에서 알아본 컴포넌트의 children 속성과 같다.
그리고 value 속성에 설정하는 값이 Provider 컨텍스트가 제공하는 기능이 된다. 그리고 Provider 컴포넌트는 반드시
value 속성에 값을 설정해 줘야 한다.
```typescript jsx
interface ProviderProps<T> {
  value: T;
  children?: ReactNode;
}
// 사용 예 : <ResponsiveContext.Provider value={value} children={children> />
```

### 🕸️ResponsiveProvider 컴포넌트 만들기
ResponsiveContext.Provider를 감싸는 ResponsiveProvider 컴포넌트의 초기 구현을 작성한다.
ResponsiveContext.Provider는 value와 children 속성을 제공한다는 것에 착안해 코드를 작성한다.
```typescript jsx
import type {FC, PropsWithChildren} from "react";
import {createContext} from 'react'

type ContextType = {
  breakpoint: string // 공유할 데이터 속성
}

const defaultContextValue: ContextType = {
  breakpoint: '' // 공유할 데이터 속성의 초깃값
}

export const ResponsiveContext = createContext<ContextType>(defaultContextValue)

type ResponsiveProviderProps ={}

export const ResponsiveProvider: FC<PropsWithChildren<ResponsiveProviderProps>> = ({
    children, ...props
})=> {
  const breakpoint = 'sm'
  const value ={
    breakpoint // breakpoint: breakpoint 를 간결하게 표현
  }
  return <ResponsiveContext.Provider value={value} children={children}/>
}

```
이렇게 만든 ResponsiveProvider 컴포넌트를 다음처럼 App.tsx 파일에 적용한다. 모든 컴텍스트 제공자는 가장 최상위
컴포넌트로 동작해야 한다는 원칙에 따라 ResponsiveProvider를 `<main>`의 부모 컴포넌트로 만들었다.

## 🎈useContext 훅 알아보기
이제 ResponsiveContextTest 컴포넌트를 구현할 차례이다. 그전에 useContext 훅을 알아보겠다.
useContext 훅은 컨택스트 객체가 제공하는 Provider 컴포넌트의 value 속성값을 얻을 수 있게하는 목적으로 사용되는 훅이다.  
다음 코드는 useContext 훅을 사용하는 useResponsive 커스텀 훅을 구현한 예이다. useContext는 항상 컨텍스트 제공자의 value
속성값을 반환하므로 앞서 본 컨텍스트 제공자의 value 속성에 설정해 놓았던 breakpoint 멤버 속성값을 반환하고 있다.
```typescript jsx
export const useResponsive =() => {
  const value = useContext(ResponsiveContext)
  return value.breakpoint
}
```
지금까지 내용을 모두 종합해서 ResponsiveContext.tsx 코드를 최종적으로 작성한다. 코드는 04-4 절에서 제작한
useWindowResize 훅으로 현재 웹 페이지의 넓이를 구한 뒤, 앞에서 알아본 테일윈드CSS의 중단점 접두사가 의미하는
픽셀 크기에 따라 breakpoint 변숫값을 계산한다. 또한 객체에 적용하는 비구조화 할당 구문으로 좀 더 간결하게 구현했다.

이제 앞에서 제작한 useResponsive 커스텀 훅을 src/pages/ResponsiveContextTest.tsx 파일에 적용한다.
useResponsive 커스텀 훅은 항상 breakpoint 값을 반환하므로 다음처럼 구현할 수 있다.















































