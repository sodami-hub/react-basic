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
여기서 Dispatch 는 다음처럼 선언된 타입으로 useDispatch 훅으로 얻을 수 있는 dispatch() 함수의 타입과 같다.
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
이제 logger 라는 이름의 미들웨어를 만들어 보면서 미들웨어의 동작 원리를 좀 더 알아보겠다. 먼저 src/store/logger.ts 파일을 생성하고 코드를 작성한다.
코드는 리덕스 미들웨어에 유입되는 액션과 리듀서 호출 전후의 앱 수준 상태를 콘솔 창에 출력하는 기능을 구현한다.  
우선 getState() 함수는 현재 리덕스 저장소에 담긴 모든 상탯값을 가져온다. 그다음 코드는 next() 함수를 호출하기 전과 후로 구분된다.
next() 함수를 호출하기 전에 현재 저장소의 상태와 유입된 액션을 콘솔 창에 출력하고, next 함수 호출로 변경된 저장소의 상태를 출력한다.
미들웨어는 반드시 next() 함수 호출로 얻은 반환값(코드에서 returnedAction)을 다시 반환해야 한다.  
returnedAction 을 반환하면 이전 미들웨어 몸통에 있는 next(action)의 반환값이 된다. 만약 반환하지 않으면 이전 미들웨어
몸통에 있는 next(action)의 반환값이 undefined 가 되므로 후처리 코드가 있을 때에는 처리할 수 없게 된다.
따라서 후처리가 없더라도 next() 함수 호출로 얻은 값을 반환해 주는 것이 좋다.

### 🕸️미들웨어 설정하기
이제 이렇게 만든 로거 미들웨어를 리덕스 저장소에 적용하는 방법을 알아보겠따. 05-1 절에서는 src/store 디렉터리의 useStore.ts
파일에 configureStore() 함수를 호출하는 코드를 작성했다. configureStore() 함수의 매개변수는 middleware 란 이름의
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
'production' 으로 설정되었는지로 판단한다. 이처럼 개발 모드일 때에만 기록하도록 하면 잠재적인 해킹이나 성능 문제를
해결할 수 있다.  
src/store/useStore.ts 에 코드를 작성한다. 

### 🕸️미들웨어 테스트하기
src/pages/LoggerTest.tsx 에 코드를 작성한다. 앞서 구현한 로거는 액션이 실제로 리덕스 저장소에 유입돼야 비로소 console.log()
함수가 호출되도록 구현되었으므로 테스트용 액션을 만들어 dispatch 를 호출해 주어야 로거가 동작한다.  
소스를 저장하고 콘솔 창을 확인해 보면 로거 미들웨어의 출력 내용을 확인할 수 있다.
그런데 사실 이렇게 동작하는 redux-logger라는 패키지가 이미 존재한다. 이 패키지를 설치하고 사용해보겠다.

### 🕸️리덕스 로거 패키지 사용하기
```
> yarn add redux-logger
> yarn add -D @types/redux-logger
```
src/store/useStore.ts 파일을 열어 logger 임포트 구문을 redux-logger 패키지로 수정한다.
그리고 브라우저를 새로고침해보면 리덕스 로거가 출력한 내용을 확인할 수 있다. 앞에서 만들었던 logger.ts와 같은 내용을 출력한다.

## 🎈썽크 미들웨어 알아보기
redux-thunk 패키지는 가장 많이 사용되는 리덕스 미들웨어이다. 이 패키지를 먼저 설치한다.
```
> yarn add redux-thunk
> yarn add -D @types/redux-thunk
```
앞서 리덕스 미들웨어가 2차 고차 함수라고 설명했다. 썽크는 action 의 타입이 함수면 action을 함수로서
호출해 주는 기능을 추가한 미들웨어이다. 이에 따라 썽크 미들웨어를 장착하면 다음처럼 dispatch 함수를
매개변수로 수신하는 함수 형태로 액션 생성기를 만들 수 있다.
```typescript jsx
const functionAction = (dispatch:Dispatch) => {
  dispatch(someAction)
}
```
리듀서는 순수 함수여야 하지만 리덕스 미들웨어는 순수 함수일 필요가 없다. 사실상 미들웨어는 부작용이 있는
코드를 마치 리듀서에서 동작하는 것처럼 만들어 주는 역할을 한다. loading 멤버 상태를 구현하면서 이 의미에 대해서
알아보겠다.  
먼저 useStore.ts 파일의 middleware 배열에 thunk를 삽입해 준다. 이로써 썽크 미들웨어는 로거 미들웨어와
함께 동작한다.

### 🕸️로딩 UI 구현하기
웹 앱이 데이터를 원격지 서버에서 가져올 때는 현재 작업이 진행 중이라는 것을 사용자에게 알려 주는 로딩 UI가 필요하다.
그런데 로딩이 필요한 모든 웹 페이지에 반복해서 구현하는 것은 조금 번거롭다. loading 이라는 멤버 속성을 구현해보겠다.
/src/store/loading/types.ts 파일에 코드를 작성한다. 현재 로딩 중인지만 판별하면 되므로 로딩 상태는
boolean 이면 충분하다. loading 디렉터리에 리덕스 관련 파일들에 코드를 작성한다.  
LoadingTest 컴포넌트는 흔히 볼 수 있는 UI지만 버튼을 누르면 로딩 화면이 3초동안 나타나다가 사라진다.
이 기능을 구현하려면 다음과 같은 코드를 LoadingTest 컴포넌트에 구현해야 하며, 만약 다른 컴포넌트에도
이 기능을 추가하고 싶다면 이 코드를 계속 반복해서 작성해야 한다. 또한 duration을 임의로 설정하려고 하면
컴포넌트마다 일일이 코드를 수정해야 한다.

```typescript jsx
const duration = 3 * 1000
const dispatch = useDispatch()
const doTimeLoading = useCallback(()=> {
  dispatch(setLoading(true))
  const timerId = setTimeOut(()=> {
    clearTimeout(timerId)
    dispatch(setLoading(false))
  }, duration)
}, [])
```
하지만 다음처럼 doTimedLoading 함수를 썽크 액션을 반환하는 형태로 구현하면 컴포넌트마다
발생하는 코드 중복을 막을 수 있다.
```typescript jsx
export const doTimedLoading = (duration: number = 3 * 1000) => 썽크_액션
```
이제 이렇게 동작하는 doTimedLoading 썽크 액션을 src/store/loading 디렉터리에 구현하겠다. 먼저 이 디렉터리에
doTimedLoading.ts 란 이름의 파일을 생성한다. 그리고 코드를 작성한다. 코드는 setTimeout 함수를 호출하기 전에
매개변수로 setLoading(true) 액션을 수신한 dispatch 함수로 리덕스 저장소에 보낸다.
그리고 duration만큼 시간이 경과되어 setTimeout 호출 때 설정한 콜백 함수가 동작하면,
이번엔 setLoading(false) 액션을 다시 리덕스 저장소에 보내 로딩 상태를 true에서 false 로 변경하는 내용이다. 같은 디렉터리의 index.ts 에 파일을 반영한다.  
그리고 doTimedLoading 함수를 테스트하고자 src/pages/LoadingTest.tsx 파일에 코드를 작성한다. 코드는 전체 구조는 지금까지 구현해 보았던
리덕스 컴포넌트 사용패턴 그대로이지만, 일반 액션이 아니라 썽크 액션을 dispatch 로 리덕스 저장소에 보내는 점이 다르다.
참고로 `dispatch<any>` 는 type 속성이 없는 액션이라는 타입스크립트 오류를 막는 방법이다. 

### 🕸️오류 메세지 구현하기
이번엔 오류 메시지를 출력하는 errorMessage 멤버 상태를 구현해 보겠다. Error 는 자바스크립트 엔진이 기본으로 제공하는 타입이다.
리액트 개발에서 Error 타입 객체는 Promise 타입 객체를 처리하는 코드와 try~catch 구문을 사용하는 코드에서 흔히 만날 수 있다.
보통 리액트 개발에서 Error 객체는 다음처럼 Error | null 타입 상태로 구현한다.
```typescript jsx
const [error, setError] = useState<Error | null>(null)
{error && <p>{error.message}</p>}
```
하지만 리덕스 상태로서 Error 타입은 이처럼 null값일 수 있는 형태로 구현하는 것은 바랍직하지 않다. 사실 UI 관점에서만 보면 Error 타입이
제공하는 모든 정보가 아니라 오직 message 속성에 담긴 오류 메시지만 필요하다. 따라서 다음처럼 오류메시지의 길이가 0보다 큰지 판단하는
코드를 만드는 것이 바람직하다.
```typescript jsx
const errorMessage = useSelector(state => state.errorMessage)
{errorMessage.length && <p>{errorMessage}</p>}
```
  
먼저 scr/store/errorMessage 디렉터리의 파일들에 코드를 작성한다. 추가로 generateErrorMessage.ts 파일을 만들고
썽크 액션을 구현한다. try~catch 문으로 Error 타입 객체를 throw 하는 형태로 Error 객체를 만든다. 참고로 if 문은
타입스크립트 컴파일 오류를 피하기 위해 필요하다.  
마지막으로 ErrorMessageTest.tsx 에 코드를 작성한다. 코드는 무작위 문자열로 오류 메시지를 발생한다. 또한 오류가 없을 때
UI가 보이지 않게 하기 위해 errorMessage 의 길이가 0보다 큰지를 판별한다.

### 🕸️사용자 정보 변경 기능 개선하기
05-2 절에서 RemoteUserTest 컴포넌트를 다음과 같이 구현했다. 이번 절에서 살펴본 리덕스 미들웨어를 사용해 RemoteUserTest 컴포넌트와
똑같이 동작하는 fetchUser 라는 멤버 상태를 구현해 보겠다.
```typescript jsx
cosnt getRemoteUser = useCallback(()=> {
  toggleLoading()
  D.fetchRandomUser()
    .then(user => dispatch(R.setUser(user)))
    .catch(setError)
    .finally(toggleLoading)
},[])
```
src/store/fetchUser 디렉터리에 fetch.ts 파일을 만든다. 05-2 절의 RemoteUserTest.tsx 파일은 getRemoteUser와 changeName 콜백 함수에서
D.fetchRandomUser 함수를 호출하고 있다. 이제 이 콜백 함수의 내용을 fetch.ts 파일에 다음처럼 구현한다. 코드는 리액트 훅을 사용하는
부분을 모두 썽크 액션 형태로 바꾼 다음, useState 훅 호출로 얻은 세터 함수들의 호출 코드를 
loading과 errorMessage 멤버 상태의 액션들을 dispatch 하는 방식으로 바꿨다. 다만 changeName 이란 액션의 이름이 서로 중복되므로 
changeName 대신 changeNameByFetching 이란 이름의 함수를 내보내고 있다.  
이제 테스트 코드를 작성한다. src/pages/FetchTest.tsx 에 코드를 작성한다. 썽크 액션을 통해서 코드가 간결해졌다.
















































