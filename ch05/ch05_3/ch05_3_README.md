# 05-3 리덕스 미들웨어 이해하기
이 절에서는 리덕스의 미들웨어 기능을 알아본다. 리덕스 미들웨어는 리듀서가 반드시 순수 함수여야 한다는 조건을 보완해주는 방법이다.

## 🎈 리덕스 미들웨어란?
앞 절에서 알아본 것 처럼 리듀서 함수 몸통에서는 부작용을 일으키는(불순 함수) 코드를 사용할 수 없다. 그런데 이 점은 리덕스 기능을 사용하는
컴포넌트를 복잡하게 만든다.  
다음 그림에서 보듯 리덕스 미들웨어는 리듀서 앞 단에서 부작용이 있는 코드들을 실행하여 얻은 결과를 리듀서 쪽으로 넘겨주는 역할을 한다.

<img src="../../images/05-03.png" width="600">

리덕스 미들웨어는 다음 형태의 2차 고차 함수이다.
```typescript jsx
import {Action, Dispatch} from 'redux'

export function someMiddleware<S=any>({dispatch: Dispatch, getState}: {getState: () => S}) {
  return (next: Dispatch) =>(action: Action) => {
    const returnValue = next(action)
    return returnValue
  }
}
```
여기서 Dispatch는 다음처럼 선언된 타입으로 useDispatch 훅으로 얻을 수 있는 dispatch() 함수의 타입과 같다.
```typescript jsx
export interface Dispatch<A extends Action = AnyAction> {
  <T extends A>(action: T): T
}
```
그리고 리덕스 미들웨어는 항상 action 을 매개변수로 받는 함수를 반환해야 한다. 그리고 미들웨어는 몸통에서 next 함수를 호출해 다음 미들웨어나
리듀서에 액션을 전달해야 한다. next 함수의 반환값은 각각의 미들웨어를 거쳐 최종 리듀서까지 전달된 후에 처리되어 돌아온 액션이다. 따라서 현재
미들웨어에서 이 액션을 반환하면 이전 미들웨어에서는 next 함수의 반환값으로 받게 된다.  
즉, 미들웨어가 next 함수를 호출해서 반환된 액션은 각각의 미들웨어를 거쳐 최종 리듀서까지 전달되고, 다시 역으로 미들웨어들을 거쳐서 돌아온다.
리덕스 미들웨어는 이런 구조로 동작하므로 리듀서에서 액션을 처리하기 전이나 후에 추가로 로직을 넣을 수 있다.  
결국, 미들웨어를 사용하는 기본 형태는 다음과 같다.
```typescript jsx
(next: Dispatch) => (action: Action) => {
  return next(action)
}
```

## 🎈로거 미들웨어 만들기
이제 logger라는 이름의 미들웨어를 만들어 보면서 미들웨어의 동작 원리를 좀 더 알아보겠다. 먼저 src/store/logger.ts 파일을 생성하고 코드를 작성한다.
코드는 리덕스 미들웨어에 유입되는 액션과 리듀서 호출 전후의 앱 수준 상태를 콘솔 창에 출력하는 기능을 구현한다.  
우선 getState() 함수는 현재 리덕스 저장소에 담긴 모든 상탯값을 가져온다. 그다음 코드는 next() 함수를 호출하기 전과 후로 구분된다.
next() 함수를 호출하기 전에 현재 저장소의 상태와 유입된 액션을 콘솔 창에 출력하고, next 함수 호출로 변경된 저장소의 상태를 출력한다.
미들웨어는 반드시 next() 함수 호출로 얻은 반환값(코드에서 returnedAction)을 다시 반환해야 한다.  
returnedAction을 반환하면 이전 미들웨어 몸통에 있는 next(action)의 반환값이 된다. 만약 반환하지 않으면 이전 미들웨어
몸통에 있는 next(action)의 반환값이 undefined가 되므로 후처리 코드가 있을 때에는 처리할 수 없게 된다.
따라서 후처리가 없더라도 next() 함수 호출로 얻은 값을 반환해 주는 것이 좋다.

### 🕸️미들웨어 설정하기
이제 이렇게 만든 로거 미들웨어를 리덕스 저장소에 적용하는 방법을 알아보겠따. 05-1 절에서는 src/store 디렉터리의 useStore.ts
파일에 configureStore() 함수를 호출하는 코드를 작성했다. configureStore() 함수의 매개변수는 middleware란 이름의
선택속성을 가지고 있다. 따라서 getDefaultMiddleware() 함수로 기본 미들웨어를 설정한 middleware 속성에 다음처럼
logger 미들웨어를 추가하면 될 것 같다. 그런데 이 코드는 logger 미들웨어가 개발할때만 필요하다는 것을 간과하고 있다.
만일 이런 형태로 구현한 소스를 실제로 서비스한다면 해킹 위험뿐 아니라 성능이 떨어지는 문제도 발생한다.

```typescript jsx
import logger from './logger'
import {rootReducer} from "./rootReducer";
import {buildGetDefaultMiddleware} from "@reduxjs/toolkit/src/getDefaultMiddleware";

const initializeStore = () => {
  const middleware: any[] = [logger]
  const store = configureStore({
    reducer: rootReducer,
    middleware: buildGetDefaultMiddleware => getDefaultMiddleware()
  })
  return store
}
```
따라서 개발 모드일 때에만 기록하도록 해야 하는데, Node.js 환경에서 개발 모드인지는 process.env.NODE_ENV 속성이
'production'으로 설정되었는지로 판단한다. 이처럼 개발 모드일 때에만 기록하도록 하면 잠재적인 해킹이나 성능 문제를
해결할 수 있다.  
src/store/useStore.ts 에 코드를 작성한다. 

### 🕸️미들웨어 테스트하기


















































