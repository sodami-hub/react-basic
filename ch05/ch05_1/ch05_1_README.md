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

### 🕸️기본 앱 파일 분리하기
src/store 디렉터리를 만들고 index.ts 등 4개의 파일을 만든다. 참고로 리액트 커뮤니티에서는 리덕스 관련 파일을 store 라는 이름의 디렉터리에 저장하는 관행이 있다.

그리고 App.tsx 의 코드들을 나눠서 각각의 파일에 구현한다. 특히 configureStore 관련 코드는 useMemo 훅을 사용한 useStore 란 이름의
커스텀 훅 형태로 메모리 효율을 생각해서 구현했다. 각각의 파일을 구현하고 index.ts에 반영한다.

App.tsx 파일에 리덕스 관련 코드들을 분리해서 간결하게 구현한다.

## 🎈useSelector 훅 사용하기
이제 리덕스 저장소에 어떤 내용이 저장되었는지 알고자 스토어의 상탯값을 반환해 주는 useSelector 훅을 살펴보겠다. useSelector훅은 react-redux 패키지가 제공한다.

```typescript jsx
import {useSelector} from "react-redux";

// useSelector 선언문
export function useSelector<TState, TSelected> (
  selector: (state:TState) => TSelected
): TSelected;
```
다음 코드는 useSelector 훅으로 AppState 타입의 today 속성값을 얻는 예이다.
```typescript jsx
const today = useSelector<AppState, Date>(state=>state.today)
```

ReduxClock.tsx 파일의 코드를 작성한다. 04-1절의 Clock.tsx의 내용을 useSelector 훅을 적용한 코드이다.
코드에서 useSelector 훅으로 today 변숫값을 얻으므로 더 이상 today를 컴포넌트 속성으로 구현하지 않아도된다.

### 🕸️리덕스 액션 알아보기
앞서 구현한 ReduxClock 컴포넌트가 시계로서 동작하려면 리덕스 저장소의 today값을 현재 시각으로 변경해 줘야 한다.
이와 동시에 ReduxClock 컴포넌트를 다시 렌더링하여 바뀐 today 값을 화면에 반영해야 한다.  
현재 코드의 리덕스 저장소에 today란 이름의 속성밖에 없지만, 좀 더 일반적인 경우에는 today 외에 다른 멤버 속성들이 있을 수 있다.
그리고 시계를 만드는 코드는 리덕스 저장소의 다른 메머 속성들의 값은 건드리지 않고, 오직 today 속성값만 변경해야 된다.
리덕스에서 액션은 저장소의 특정 속성값만 변경하고 싶을 때 사용하는 방법이다.  
src/store/actions.ts 파일을 만든다. 리덕스 액션은 반드시 type 이란 이름의 속성이 있어야 하므로 redux 패키지는 Action 타입을 제공한다.
타입스크립트의 교집합 타입구문으로 SetTodayAction 타입에 type 이란 속성을 추가해 준다. 액션의 type 속성은 리듀서에 switch~case 문 같은
분기문을 써서 type 속성에 따라 적절하게 분기하도록 한다. 액션의 type 속성이 리듀서에 분기문을 구현할 수 있게 해주는 것이므로,
type 속성의 타입을 'setToday'로 정할 수 있다.

### 🕸️리덕스 리듀서 알아보기
앞서 작성한 rootReducer.ts 파일에서 변수 이름만 바꿔보겠다. 그러면 "첫 번째 매개변수에 담긴 과거 상탯값(prevState)을 바탕으로 새로운 상탯값(newState)을 반환한다"
는 리듀서 함수의 목적이 분명해진다. 그리고 SetTodayAction 을 반영해서 액션과 리듀서의 관계를 좀 더 명확하게 표현한다.
그리고 리덕스에서 리듀서를 구현할 때는 prevState, newState 대신 그냥 state를 주로 사용한다.  
rootReducer.ts 는 액션이 SetTodayAction 타입이 아니면 state 값을 변경하지 않고 그대로 반환한다는 의미를 보여준다.
마지막 return 문에 '필수'라는 주석을 단 이유는 IDE는 필요없다는 표시를 생성하지만, 꼭 있어야 하는 코드이다. 왜 그런지 알아보겠다.

## 🎈useDispatch 훅 사용하기
이번에는 useDispatch 훅을 알아보겠다. react-redux 패키지는 useDispatch 훅을 제공한다. useDispatch 훅을 호출하면 dispatch() 함수를 얻는다.
```typescript jsx
const dispatch = useDispatch()
```
dispatch() 함수를 사용하여 다음 코드 형태로 리덕스 저장소에 저장된 AppState 객체의 멤버 전부나 일부를 변경할 수 있다.
다음은 type 속성값이 'setToday'인 액션을 dispatch() 함수를 통해 리덕스 저장소로 보내는 코드이다.
```typescript jsx
dispatch({type: 'setToday', today: new Date()})
```

### 🕸️dispatch 함수와 리듀서 간의 관계 이해하기
지금까지 리덕스 저장소와 리듀서 그리고 액션과 dispatch() 함수를 알아봤다. 이들의 관계를 그림으로 표현하면 다음과 같다.

<img src="../../images/05-01.png" width="600">

이 그림은 리덕스 저장소에 저장된 앱 수준 상태의 일부 속성값을 변경하려면 일단 액션을 만들어야 한다는 것을 의미한다. 그리고 액션은 반드시
dispatch() 함수로 리덕스 저장소에 전달해야 한다. 그리고 액션이 리덕스 저장소에 전달될 때 리듀서가 관여한다.  
또한 다음 그림은 리듀서에 전달되는 두 매개변수 state와 action이 어떻게 만들어지는지를 보여준다. 리덕스 저장소는 앱 수준 상태를 저장하는
것이 목적이므로 첫 번째 매개변숫값을 만들 수 있다. 또한 액션은 반드시 dispatch() 함수로 전달되므로 dispatch(액션) 코드가 실행되면 두 번째
매개변수 action이 리듀서로 전달된다.

<img src="../../images/05-02.png" width="450">

### 🕸️시계 완성하기
이제 useDispatch 훅을 호출하여 dispatch()함수를 얻고, dispatch(액션)를 1초에 한 번씩 호출하여 시계를 완성해 보겠다.  
ReduxClock.tsx 파일에 코드를 작성한다. 04-1 에서 구현한 useInterval 커스텀 훅을 사용해서 현재 시각을 rootReducer에 보내는
방식으로 시계를 구현한다. 이 코드를 저장하고 실행해보면 시계가 동작하는 것을 알 수 있다.

## 🎈useReducer 훅 사용하기
useReducer 훅을 알아보겠다. useReducer 훅은 이름에서 알 수 있듯이 리덕스의 리듀서와 사실상 똑같은 기능을 수행한다.
useReducer 훅은 04장에서 본 다른 훅 함수들처럼 RedusProvider와 같은 컨텍스트 없이 사용한다. 이 때문에 리덕스의 상태는
앱의 모든 컴포넌트에서 접근할 수 있찌만(즉, 전역 상태), useReducer 훅의 상태는 다른 훅 함수들처럼 useReducer 훅을 호출한
컴포넌트 안에서만 유효하다는(지역 상태) 차이가 있다.  
useReducer 훅을 사용하면 여러 번의 useState와 useCallback 훅 호출을 간결하게 구현할 수 있다.
```typescript jsx
const [상태, dispatch] = useReducer(리듀서, 상태_초깃값)
```
그런데 리덕스의 리듀서와 useReducer 훅은 초기 상탯값을 설정하는 부분에 차이가 있다. 리덕스의 리듀서는 rootReducer.ts 에서와 같이
리듀서의 첫 번째 매개변수에 기본값을 설정한다. 반면에 useReducer 훅은 두 번째 매개변수에 초깃값을 설정한다.
```typescript jsx
useReducer((state: AppState, action:AppAction)=>{},{today:new Date()})
```
useReducer 훅을 실습해보겠다. UseReducerClock.tsx 에 코드를 작성한다.

### 🕸️src/copy 디렉터리에 리덕스 관련 파일 생성하기
src/copy/store 및 src/copy/store/copy 디렉터리를 생성하고 각각의 파일들에 코드를 작성한다.









































