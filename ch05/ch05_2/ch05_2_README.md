# 05-2 리듀서 활용하기
이 절에서는 시계와 카운터, 사용자 정보 변경, 사용자 카드 등을 만들어 보면서 각 기능을 하나의 멤버 상태로 구성하여
독립적으로 동작하도록 해보겠다. 그런데 이처럼 앱 수준 상태를 구성하는 멤버 속성이 많아지면 리듀서를 구현하는 코드가 점점 복잡해진다.
리덕스는 이런 리듀서의 복잡함을 덜 수 있게 여러 리듀서를 하나로 합쳐 주는 combineReducers() 함수를 제공한다.

## 🎈리듀서 합치기
combineReducers() 함수는 여러 리듀서를 통합하여 새로운 리듀서를 만들어 준다. redux 패키지는 다음의 combineReducrers() 함수를 제공한다.
```typescript jsx
import {combineReducers} from 'redux'
```
combineReducers() 함수는 다음처럼 ReducersMapObject 타입 객체를 입력 매개변수로 받는 함수이다. 여기서 타입 변수 S는 상태를 의미하며
이 절에서의 AppState가 이에 해당한다.
```typescript jsx
export function combineReducers<S>(reducers: ReducersMapObject<S,any>):
Reducer<CombineState<S>>
```
매개변수 reducers는 ReducersMapObject 타입 객체이다. 이 객체의 선언문을 보면 상태 타입의 키에 설정되는 값은 `Reducer<State[Key], Action>`
타입의 함수여야 한다는 것을 알 수 있다.
```typescript jsx
export type ReducersMapObject<State = any, A extends Action = Action> = {
  [Key in keyof State] : Reducer<State[Key], A>
}
```

## 🎈앱 상태를 구성하는 멤버 상태 구현하기
combineReducer() 함수를 실습해 보겠다. src/store 에 cards,clock,counter,remoteUser 디렉터리를 생성하고 기본 파일을 만든다.
그리고 src/store/AppState.ts 파일에 방금 만든 4개 디렉터리의 내용을 추가한다. 이 코드는 앱 수준 상태 AppState를
다시 clock, counter, remoteUser,cards 라는 이름의 독립적으로 동작하는 멤버 상태로 구성한 것이다.  
코드에서 AppState는 4개의 멤버 상태로 구성했으므로 이를 각각 처리하는 4개의 리듀서가 필요하다. 그리고 앞서 만든
clock, counter와 같은 디렉터리 안에는 컴파일 오류만 없는 최소한으로 구현한 리듀서가 이미 있다.  
이제 src/store/rootReducer.ts 파일을 구현한다. 코드는 combineReducers() 함수로 '상태_이름:해당_리듀서' 형태의 조합을
모두 결함하여 새로운 루트 리듀서를 만든다. 앞서 combineReducers()의 매개변수 reducers는 ReducersMapObject 타입이라고 했다.
이 타입 선언문에서 `[Key in keyof State]: Reducer<State[Key],A>` 부분을 고려해 보면, clock, counter 등의 멤버 상태는 모두
AppState의 키이므로, [Key in keyof State] 조건을 만족한다. 또한 각 키 설정값의 타입은 Reducer<State[Key],A>, 즉
리듀서 함수여야 하므로 Clock.reducer를 설정해야 한다.  
src/store/rootReducer.ts 를 작성한다. combineReducers() 함수는 리덕스 관련 코드를 어떤 기계적인 패턴으로
구현할 수 있게 해준다. 이제 clock부터 차례로 AppState의 멤버 상태에 대응하는 리덕스 기능을 구현해 가면서
이 기계적인 패턴의 코드를 어떻게 작성하는지 알아보겠다.  
src/pages 디렉터리에 실습할 컴포넌트의 기본 형태를 만들고, App.tsx에 컴포넌트를 추가한다.

## 🎈시계 만들기
먼저 AppState 의 clock 멤버 상태에 대한 타입을 선언한다. src/store/clock/types.ts 에 코드를 작성한다. 코드는 AppState.clock의
타입을 any가 아닌 string으로 변경한다. 그리고 `Action<'@clock/setClock'>` 타입과 payload라는 속성이 있는 '이름 없는 타입'의 교집합으로
액션을 선언한다. 그런데 @clock/이나 payload라는 이름이 좀 생소하다. 이 이름은 리덕스 커뮤니티에서 관행으로 사용하는 타입과 변수 이름이다.
왜 이런 이름을 사용하지는 잠시 후에 알아보겠다.  
이제 SetClockAction 타입의 객체를 생성하는 setClock 이란 '액션 생성기'를 만들어 보겠다. src/store/clock/action.ts 에 코드를 작성한다.
참고로 코드에서 setClock 은 매개변수 payload의 타입을 설정할 수 있께 해주므로 {type: '@clock/setClock', payload} 형태의 코드에서
발생할 수 있는 타입 오류를 미연에 방지해주는 효과가 있다.  
이어서 reducers.ts 파일을 작성한다. 앞서 types.ts 파일의 State 타입은 string 이므로 직렬화를 위해 Date를 ISO 문자열로 바꿔서 설정한다.  
지금까지 만든 clock 디렉터리의 리덕스 기능을 테스트하기 위해서 src/pages/ClockTest.tsx 파일을 작성한다. 이 코드는 AppState의 clock
속성값을 화면에 출력하므로 useSelector의 타입 변수들을 <AppState, C.State>로 설정한다. 그리하여 state 의 clock 등 4개의
멤버 상태 가운데 clock만 useSelector로 꺼낸다.

## 🎈카운터 만들기
카운터는 더하기 아이콘을 누르면 숫자가 1씩 증가하고, 빼기 아이콘을 누르면 1씩 감소하는 기능이다. 이 기능을 src/store/counter 디렉터리에 구현하겠다.
이번에는 src/pages/CounterTest.tsx 파일을 먼저 구현하고 리덕스 기능을 차례로 작성하겠다. 이 코드에서 counter는 더하기와 빼기
연산을 하므로 타입은 number여야 한다.

src/store/counter 의 파일들에 코드를 작성한다.

### 🕸️'@이름/' 접두사와 payload라는 변수 이름을 사용하는 이유

### 🕸️리듀서는 순수 함수여야 한다.
리덕스는 리덕스 저장소에 저장된 과거 상태와 리듀서 함수가 반환하는 현재 상태를 if(과거상태 !== 현재상태) 방식으로 비교한다.
이런 방식으로 비교가 가능하려면 현재 상태는 과거 상태를 깊은 복사해야 한며, 이 때문에 리덕스의 리듀서는 반드시 순수 함수여야 한다.
함수형 언어 분야에서 순수 함수는 다음 요건을 만족해야 한다.
1. 함수 몸통에서 입력 매개변수의 값을 변경하지 않는다.
2. 함수는 함수 몸통에서 만들어진 결과를 즉시 반환한다.
3. 함수 내부에 전역 변수나 정적 변수를 사용하지 않는다.
4. 함수가 예외를 발생시키지 않는다.
5. 함수가 콜백 함수 형태로 구현되어 있거나, 함수 몸통에 콜백 함수를 사용하는 코드가 없다.
6. 함수 몸통에 Promise처럼 비동기 방식으로 동작하는 코드가 없다.

리듀서를 구현할 때 가장 흔히 하는 실수는 입력 매개변숫값을 변경하는 것이다. 

## 🎈사용자 정보 변경 기능 만들기
src/pages/RemoteUserTest.tsx 파일에 코드를 작성한다. 이 코드는 04-4 절의 FetchTest.tsx 코드에 사요자 정보를 변경하는 버튼과 각 버튼의
onClick 이벤트 처리기를 추가한 것이다. 코드에서 핵심은 user 데이터를 얻는 부분이다.  
앞서 리듀서는 순수 함수여야 한다고 했는데, 리듀서가 숙수 함수려면 D.fetchRandomUser() 와 같은 Promise 객체로 동작하는
비동기 함수 호출 코드가 없어야 한다. 따라서 D.fetchRandomUser() 호출과 관련 있는 loading 이나 error 와 같은 데이터들은
리덕스 관련 코드에서 제외해야 한다. 결국 remoteUser 멤버 상태와 관련된 데이터는 user만 있게 된다.  
src/store/remoteUser 디렉터리의 파일들의 코드를 작성한다. types.ts 의 코드는 리듀서가 순수 함수여야 하므로 remoteUser 의 타입은 D.IRandomUser가 돼야된다.
그런데 코드에서 NameType이나 PictureType을 선언하고 있는데, 이는 src/data/fetchRandomUser.ts 파일에 없는 타입들의
구체적인 내용이 필요하기 때문이다. 리덕스를 사용하다 보면 이처럼 구현에 필요한 타입들을 추가로 선언해 주어야 할 때가 발생한다.

## 🎈사용자 카드 만들기
이번에는 사용자 정보를 카드 형태로 추가하고 삭제하는 기능을 만들어 보겠다. 먼저 src/pages/CardsTest 디렉터리에 Card.tsx 파일을 만든다.
그리고 Card.tsx 에 코드를 작성한다. Card 컴포넌트는 card와 onRemove 라는 2개의 속성을 가지는데,
card는 화면 UI를 구현하고 onRemove는 이 Card 컴포넌트를 외부에서 삭제할 때 필요하다.













































