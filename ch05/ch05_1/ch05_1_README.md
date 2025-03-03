# 05-1 리덕스 기본 개념 이해하기
리덕스를 이용해서 시계 애플리케이션을 만들어 보면서 기본 개념을 알아본다. 또한 리덕스의 간단 버전인 useReducer 훅도 살펴본다.c

## 🎈리덕스와 리덕스 관련 필수 패키지
메타가 리액트를 처음 발표할 때 플럭스(flux)라고 부르는 앱 설계 규격을 함께 발표했따. 플럭스는 앱 수준 상태, 즉 여러 컴포넌트가 공유하는 상태를
리액트 방식으로 구현하는 방법이다. 이후로 플럭스 설계 규격을 준수하는 오픈소스 라이브러리가 등장했는데, 리덕스(redux)는 그중에서 가장 많이 사용되는 패키지이다.  
리덕스를 사용하려면 redux와 @reduxjs/toolkit(줄여서 RTK) 패키지, 그리고 리액트 프레임워크에서 사용할 react-redux 패키지를 설치해야 한다.
redux와 RTK는 프레임워크와 무관하므로 리액트는 물론 앵귤러 뷰에서도 사용할 수 있다. 반면에 react-redux는 리액트와 함께 동작하므로
다른 프레임워크에서는 사용할 수 없다. 이 패키지들은 모두 타입스크립트로 제작되었으므로 타입 라이브러리를 별도로 설치할 필요는 없다.

## 🎈앱 수준 상태 알아보기
useState 훅은 컴포넌트가 유지해야 할 상태를 관리하는 용도로 사용된다. 그런데 여러 컴포넌트가 상태들을 함께 공유하는 형태로 만들 때가 많은데,
이처럼 앱을 구성하는 모든 컴포넌트가 함께 공유할 수 있는 상태를 앱 수준 상태(app level states) 줄여서 '앱 상태' 라고 한다.

### 🕸️Provider 컴포넌트와 store 속성
리덕스는 리액트 컨텍스트에 기반을 둔 라이브러리이다. 즉, 리덕스 기능을 사용하려면 리액트 컨텍스트의 Provider 컼포넌트가 최상위로 동작해야 한다.
따라서 react-redux 패키지는 다음처럼 Provider 컴포넌트를 제공한다

```typescript jsx
import {Provider} from "react-redux";
```
그런데 Provider란 이름은 너무 일반적이므로 다음처럼 ReduxProvider란 별칭으로 사용한다.
```typescript jsx
import {Provider as ReduxProvider} from 'react-redux'
```
그런데 ReduxProvider를 App.tsx에 적용해보면 store 속성값이 설정돼지 않았다는 오류가 발생한다. 이 오류가 발생하는 이유를 알아보겠다.

### 🕸️리덕스 저장소와 리듀서, 액션 알아보기
타입스크립트 언어로 리덕스 기능을 사용할 때는 먼저 다음처럼 앱 수준 상태를 표현하는 AppState와 같은 타입을 선언해야 한다.
```typescript jsx
export type AppState= {}
```
만일 시계 앱을 만든다면 AppState는 다음처럼 작성할 수 있다.
```typescript jsx
export type AppState = {
  today:Date
}
```
리덕스 저장소(redux store)는 AppState 타입 데이터를 저장하는 공간이다. 그런데 리덕스 저장소를 생성하려면 리듀서라는 함수를 알아야 한다.
리덕스에서 리듀서(reducer)는 현재 상태와 액션이라는 2가지 매개변수로 새로운 상태를 만들어서 반환합니다.
```typescript jsx
export type Reducer<S =any, A extends Action = AnyAction> = (
  state: S | undefined,
  action: A
) => S
```
리듀서 선언문에 나오는 액션은 플럭스에서 온 용어로서 type이란 이름의 속성이 있는 평범한 자바스크립트 객체를 의미한다. redux 패키지는 다음처럼
액션 객체의 타입을 선언하고 있다. 이 액션 선언문은 type 속성이 반드시 있어야 한다는 의미이다.
```typescript jsx
export interface Action<T=any> {
  type: T
}
```

### 🕸️스토어 객체 관리 함수
RTK 패키지는 리듀서에서 반환한 새로운 상태를 스토어라는 객체로 정리해 관리하는 configureStore 함수를 제공한다.

```typescript jsx
import {configureStore} from "@reduxjs/toolkit";
```
다음은 단순하게 표현한 configureStore 함수의 선언문으로, 이 선언문에 따르면 configureStore는
ConfigureStoreOptions 제네릭 타입  매개변수를 1개 입력받는 함수이다.
```typescript jsx

```
다음은 ConfigureStoreOptions 타입을 단순하게 표현한 예이다. 이 타입은 필수 속성인 reducer와 더불어 middleware 들 선택 속성 4개로 구성된다.
```typescript jsx

```
먼저 기본 앱 파일에 지금까지의 내용을 추가한 것으로 더 이상 컴파일 오류는 발생하지 않는다. 다만 코드가 복잡하기 때문에 전형적인
리덕스 앱의 소스 구조로 바꿔보겠다.














































