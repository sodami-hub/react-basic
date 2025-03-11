# 05-4 트렐로 따라 만들기

## 🎈칸반 보드란?

### 🕸️ react-dnd 패키지 설치하기
```shell
yarn add react-dnd react-dnd-html5-backend
yarn add -D @types/react-dnd
```
react-dnd 는 리액트 컨텍스트에 기반하여 설계 되었으므로 react-dnd가 제공하는 컴포넌트를 사용하려면,
App.tsx 파일은 DndProvider 컴포넌트가 최상위 컴포넌트로 동작해야 한다.

### 🕸️ react-beautiful-dnd 패키지 설치하기
```shell
yarn add react-beautiful-dnd
yarn add -D @types/react-beautiful-dnd
```

### 🕸️ 앱 상태를 구성하는 멤버 상태 만들기
src/store 디렉터리의 copy 디렉터리를 복사해서 앱 상태를 구성하는 4개의 디렉터리와 관련 파일을 생성하고 루트 디렉터리(src/store)의
파일들에 코드를 작성한다.

### 🕸️ src/pages 에 테스트용 컴포넌트를 만들기
src/copy 의 CopyMe 디렉터리를 복사해서 pages 디렉터리에 3개의 디렉터리를 만들고, App.tsx 파일에 코드를 작성한다.
프로젝트를 실행해서 기본적인 세팅에 이상이 없는지 확인한다.

## 🎈 CreateListForm 컴포넌트 구현하기
src/pages/Board/CreateListForm.tsx 파일을 생성하고 코드를 작성한다. 이어서 src/pages/Board/index.tsx 파일에 코드를 작성한다.
이 코드는 CreateListForm 컴포넌트를 화면에 보여준다.  
소스를 저장하고 실행하면 입력 상자와 더하기 버튼이 있는 보드가 보인다. 입력 상자에 랜덤으로 생성된
목록 이름이 표시되고 더하기 버튼을 누르면 onCreateList 콜백 함수가 호출되면서 콘솔 창에 목록의 uuid와
title 속성값이 출력된다.

### 🕸️ 배열 대신 ids와 entities로 상태 구현하기
여기서 만들 앱은 N개의 목록(list)이 있고, 각 목록은 여러 개의 카드(card)를 가질 수 있다. 그리고 각 목록은 드래그 앤 드롭으로 위치를 옮길 수 있다.
그런데 목록을 배열에 담으면 이러한 기능을 구현하기가 어렵다.  
앵귤러(Angular) 프레임워크에서는 리덕스 기능을 구현하면서 @ngrx/entity 라는 패키지를 사용할 때가 있다. 이 패키지는 배열에 들어갈 아이템은
모두 서로를 구분할 수 있는 고유 ID 값을 가진다고 가정한다. 그리고 entities 란 객체를 하나 만들어, `id_값: 아이템` 형태로 여러 개의 아이템을 저장한다.
다음은 redux-toolkit.js.org 에서 인용한 ids 와 entities 의 역할을 보인 것이다.
```typescript jsx
{
  ids: [] // 각 항목의 고유 ID. 문자열 또는 숫자
  entities: {} // 엔티티 ID를 해당 엔티티 객체에 매핑하는 조회(lookup) 테이블
}
```
이런 구조를 가지는 타입을 단순히 엔티티라고 부르겠다. 그런데 타입스크립트로 엔티티를 구현할 때는 타입스크립트가 기본으로 제공하는
Record 제네릭 타입을 이해해야 한다.

### 🕸️ 타입스크립트의 Record 타입
자바스크립트는 다음코드에서 보듯이 색인 연산자를 사용하여 객체의 속성값을 얻을 수 있다.
```javascript
const card = makeRandomCard()
const uuid = card['uuid']
```
그런데 card['id'] 처럼 속성 이름을 잘못 입력하는 실수를 할 수 있다. 이런 오류는 코드가 실행되고 나서야 알게 된다.
이때문에 타입스크립트는 객체의 속성값을 색인 연산자로 얻을 수 없게 한다. 대신 Record 란 이름의 특별한 타입을 제공한다.  
다음은 Record 타입의 선언문으로 코드에 사용된 keyof 는 타입스크립트 키워드이고, [P in K] 부분은 색인 연산자로 객체의 특정 속성에
접근할 수 있게 하는 타입스크립트의 색인 타입 구문이다.
Record 타입을 사용하려면 `Record<키_타입, 값_타입>` 형태로 2개의 타입 변수를 지정해야 한다. Record 타입은 색인 연산자를 사용하여 객체의
특정 속성값을 설정하거나 얻어올 수 있게 한다.  
이제 src/store 디렉터리에 listidOrder 와 listEntities 멤버 상태를 다음과 같은 엔티티 방식으로 구현해보겠다.
```typescript
type Record<K extends keyof any, T> = {
  [P in K]: T;
}
```

## 🎈공통으로 사용하는 타입 구현하기
이 절에서 멤버 상태들이 공통으로 사용하는 타입이 있으므로 먼저 src/store 디렉터리에 commonTypes.ts란 파일을 만들고, 코드를 작성한다.

## 🎈listidOrders 멤버 상태 구현하기
listidOrders 멤버 상태는 생성한 목록의 uuid 값을 배열에 담아 웹 페이지에 어떤 순서로 표시할 것인지를 결정하는 역할이다.  
src/store/listidOrders 디렉터리의 types.ts 파일에 코들르 작성한다. 코드는 목록의 uuid값을 담은 배열을 상태로 설정하고 있다.
또한 목록은 아무 때나 생성할 수 있고, 드래그 앤 드롭으로 순서를 변경할 수 있고, 삭제할 수 있으므로 이런 상황에 대응하는
3가지 액션을 정의한다.  
이어서 action.ts 와 reducers.ts 에 코드를 작성한다.

## 🎈 listEntities 멤버 상태 구현하기
listEntities 멤버 상태는 앞서 commonTypes.ts 에 선언했던 list 타입 객체들을 엔티티 방식으로 저장하는 역할을 수행한다.
List 타입은 string 타입의 uuid 속성과 사용자가 특정 카드 목록의 용도를 쉽게 구분할 수 있도록 string 타입의 title이라는 속성을 가지고 있다.
```typescript
export type List = {
  uuid: UUID
  title: string  // 특정 카드 목록의 용도를 구분하기 위한 제목
}
```
src/store/listEntities 디렉터리의 파일들을 열고 코드를 작성한다. 그런데 리듀서를 구현할 때는 조금 생각이 필요하다.
다음처럼 작성된 리듀서 코드에서 각 액션의 return state 부분을 수정하여 새로운 목록을 state 에 저장하거나 state 에서 특정
uuid를 가진 목록을 제거해야 한다.
```typescript
export const reducer = (state:T.State=initialState, action:T.Actions) => {
  switch(action.type) {
    case '@listEntities/add':
      return state  // 이 코드를 수정해야 된다.
    case '@listEntities/remove':
      return state // 이 코드를 수정해야 된다.
  }
  return state
}
```
먼저 목록을 생성하는 @listEntities/add 액션을 구현해 보겠다. 현재 새로운 목록은 다음처럼 action.payload에 담겨 있다.
```typescript
const list = action.payload  // List 타입의 객체를 list에 저장
const {uuid} = list         // list.uuid 의 값을 가져온다.
```
그런데 state 는 `Record<UUID,List>` 타입의 엔티티이므로 다음처럼 `state[uuid] = list` 형태로 구현할 수 있다.
하지만 이 구현 방법은 리듀서의 입력 매개변숫값을 수정하는 것이므로 리듀서를 불순 함수로 만든다. 따라서 리듀서가 순수 함수가 되려면
{...state, [uuid]:card} 형태로 매개변수로 받은 state 객체를 깊은 복사한 뒤, uuid의 값을 바꾸는 방식으로 진행한다.  
이번에는 목록을 제거하는 액션을 구현해 보겠다. 현재 제거할 목록의 uuid 값은 다음처럼 action.payload 에 담겨있다.
```typescript
const {uuid} = action.payload
```
타입스크립트에서 객체의 특정 속성을 삭제할 때는 다음처럼 특정 속성을 대상을 delete 연산자를 사용한다. 그런데 이 방식은 리듀서를
불순 함수로 만들므로 잘못된 구현이다.
```typescript
delete state[uuid]
return state // 매개변수의 값을 직접 변경하므로 잘못된 reducer 코드
```
다음과 같이 전개 연산자를 사용해서 복사 후 값을 삭제한 다음에 수정된 값을 리턴한다.
```typescript
const val = {...state}
delete val[uuid]
return val
```
지금까지의 내용을 바탕으로 listEntities 디렉터리의 reducer.ts 에 코드를 작성한다.
그리고 listidOrders 와 listEntities 멤버 상태를 Board 컴포넌트에 적용한다. src/pages/Board/index.tsx 파일이다.
실행하고 보드의 더하기 아이콘을 2번 눌러 2개의 목록을 생성하면 콘솔 창에서 listOrders 와 listEntities 목록을 확인할 수 있다.

## 🎈BoardList 컴포넌트 구현하기
지금까지 목록을 생성하는 기능을 만들었다. 이번에는 이 목록을 화면에 표시하고 빼기 아이콘을 눌렀을 때 해당 목록을 제거하는
BoardList 컴포넌트를 만들겠다.
️
### 🕸️
### 🕸️
### 🕸️
### 🕸️
### 🕸️
### 🕸️
### 🕸️
### 🕸️
### 🕸️
### 🕸️
### 🕸️
### 🕸️
### 🕸️
### 🕸️
### 🕸️
### 🕸️
### 🕸️



































