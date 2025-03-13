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
BoardList 컴포넌트를 만들겠다. 먼저 src/pages/BoardList 의 index.tsx에 기본 코드를 작성한다.  
이제 BoardList 컴포넌트를 Board 컴포넌트에 적용할 차례이다. 그 전에 리스트 엔티티를 배열로 바꾸는 방법을 알아보겠다.
listEntities 객체에 담긴 목록을 화면에 보이게 하려면 다음처럼 listEntities의 타입 `Record<uuid,List>`가 아니라,
List[] 타입 배열로 바꿔줘야 한다.
```typescript
const lists = useSelector<AppState, List[]>(({listidOrders})=> ??? )
```
그런데 각 목록의 순서는 다음처럼 listidOrders에 담겨있따.
```typescript
const listidOrders = useSelector<AppState, LO.State>(({listidOrders})=>listidOrders)
```
결국 List[] 타입 배열은 다음처럼 listidOrders를 통해 uuid의 순서를 결정한 다음, 각 uuid에 해당하는 목록을
listEntities에서 얻어올 수 있다.
```typescript
const lists = useSelector<AppState, List[]>(({listidOrders, listEntities})=> {
  listidOrders.map(uuid=>listEntities[uuid])
})
```
이제 src/pages/Board/index.tsx 에 BoardList 컴포넌트를 반영한다. 여기까지 작성하면 더하기 아이콘으로
새로운 목록을 만들고, 빼기 아이콘으로 목록을 삭제할 수 있다.

## 🎈리덕스 기능을 커스텀 훅으로 만들기
Board 컴포넌트는 현재 리덕스 기능을 그대로 구현하고 있어서 코드가 복잡하다. 좀 더 간결하게 하고자 src/store 디렉터리에
useLists.ts 파일을 만든다. 그리고 Board.tsx 파일의 코드를 useLists 란 이름의 커스텀 훅으로 만든다.

##  🎈 ListCard 컴포넌트 구현하기
BoadList 에 카드를 추가하는 기능을 구현하겠따. 05-2 절에서 구현한 src/pages/CardsTest 디렉터리의 Card.tsx 파일을 src/pages/ListCard
디렉터리에 index.tsx 파일로 저장한다.

️
## 🎈 cardEntities 멤버 상태 구현하기
src/store/cardEntities 디렉터리의 types.ts 파일에 코드를 작성한다. 이 코드는 엔티티 타입의 State를 선언하고 2개의 액션 타입을
선언하고 있다. 이 내용은 List 타입 대신 Card 타입을 사용했을 뿐 앞서 구현한 listEntities의 내용과 같다.  
이어서 해당 디렉터리의 액션 생성기및 리듀서 코드를 작성한다.


## 🎈 listidCardidOrders 멤버 상태 구현하기
카드는 각각 특정 목록에 소속되어 있으며 드래그 앤 드롭으로 순서를 바꿀 수 있다. 따라서 특정 목록이 어떤 카드를 어떤 순서로 가지고 있는지를
나타내는 정보가 필요하다. listidCardidOrders 멤버 상태는 `Record<리스트_uuid, 카드_uuid[]>` 타입의 엔티티를 가진다.
src/store/listidCardidOrders 디렉터리의 types.ts, actions.ts 를 작성한다.  
그리고 이런 액션들이 왜 필요한지 리듀서를 구현하면서 알아보겠다. 먼저 **@listidCardids/set** 액션은 목록 uuid의 속성에
카드 uuid의 배열을 추가하려고 할 때 사용한다. **@listidCardids/remove** 액션은 listidOrders에서 특정 목록이 삭제되면
listidCardidOrders에서도 `state[삭제된_리스트_uuid]` 부분을 삭제해 메모리가 낭비되지 않도록 한다.
그리고 **lisdidCardids/prependCardid** 액션은 다음 코드 형태로 특정 목록이 가지고 있는 카드 uuid 들 앞에 새로운
카드 uuid 를 삽입하는 용도이다.
```typescript
const cardIds = state[리스트_uuid]  // 기존 카드_uuid들
return {...state, [리스트_uuid]: [새_카드_uukd, ... cardIds]}
```
**@listidCardids/appendCardid** 액션은 다음 코드 형태로 특정 목록이 가지고 있는 카드 uuid들 맨 뒤에
새로운 카드 uuid를 삽입하는 용도이다.
```typescript
const cardIds = state[리스트_uuid] // 기존 카드_uuid들
return {...state, [리스트_uuid]:[...cardIds, 새_카드_uuid,]}
```
**listidCardids/removeCardid** 특정 카드가 삭제될 때 목록에 있는 카드 uuid를 지우는 용도이다.
```typescript
const cardIds = state[리스트_uuid] // 기존 카드_uuid들
return {
  ...state, // listidCardids 상태 보존
  [action.payload.listid]:cardIds.filter(id => id !== 제거할_카드_uuid)
}
```
이러한 내용을 바탕으로 reducers.ts 코드를 작성한다. 그리고 useLists 훅에 cardEntities 와 listidCardidOrders 기능을 반영한다.

## 🎈useCards 커스텀 훅 만들기
앞서 useLists 커스텀 훅 제작으로 Board의 내용이 간결해졌다. 이제 useCards 커스텀 훅을 작성하여 카드 관련 코드가 간결해지도록 하겠다.
먼저 src/store/useCards.ts 파일을 생성하고 코드를 작성한다. 그리고 src/pages/BoardList/index.tsx 파일에 useCards 훅을 호출하여
카드 기능 구현에 필요한 cards 와 onPrependCard 등의 함수를 얻고 있다. 여기까지 구현하면 목록에서 카드를 추가혹 삭제할 수 있다.

## 🎈react-dnd의 useDrop 훅 알아보기
react-dnd 패키지는 useDrop훅을 제공한다. useDrop 훅의 기본 사용법은 다음처럼 튜플 타입 반환값에서 두 번째 멤버인 drop 함수를 얻는 것이다.
참고로 accept 는 'card', 'list' 등 드래그 앤 드롭 대상을 구분하는 용도로 사용할 문자열이다.
```typescript
const [,drop] = useDrop(()=>({
  accept: 'card'
}))
```
그리고 이 drop 함수를 드롭을 원하는 HTML 요소의 ref에 설정해 준다.
```typescript jsx
<div ref={(node)=>drop(node)}/>
```
또는 다음처럼 drop 함수를 호출하는 방식으로 구현할 수도 있다.
```typescript jsx
const divRef = useRef<HTMLDivElement>(null)
drop(divRef)
```

## 🎈 react-dnd 의 useDrag 훅 알아보기
react-dnd 는 useDrag 훅도 제공한다. useDrag 훅의 사용법은 다음의 샘플 코드에서 찾을 수 있다. 이 절에서는 useDrop, useDrag 훅을 함께 사용한다.
```javascript
const [{isDragging}, drag] = useDrag({
    type: 'card',
    item: ()=> {
        return {id,index}
    },
    collect: (monitor:any) => ({
        isDragging:monitor.isDragging(),
    }),
})

const opacity = isDragging ? 0: 1
drag(ref)
return(
    <div ref={ref} style={{...style, opacity}} data-handler-id={handlerId}>
        {text}
    </div>
)

```
## 🎈 ListDraggable 컴포넌트 구현하기
앞의 샘플 코드를 바탕으로 ListDraggable 컴포넌트를 만들어보겠다. 먼저 src/components 디렉터리에 ListDraggable.tsx 파일을 생성하고 코드를 작성한다.
그리고 같은 디렉터리의 index.ts 에 코드를 반영한다.  
이어서 src/pages/BoardList/index.tsx 파일에 ListDraggable 컴포넌트를 반영한다. ListDraggable 이 요구하는 index 와 onMoveList 함수를 Board 로부터
받기 위해 이 2개의 속성을 추가로 설정하고 있다.  
하지만 컴파일 오류가 발생한다. 이제 useLists 커스텀 훅을 수정하여 Board 쪽에 발생하는 컴파일 오류를 해결한다.
ListDraggable에 추가한 onMoveList 속성을 Board로부터 얻으려면 useLists 훅의 코드를 수정해야 한다. 그리고 src/pages/Board/index.tsx 코드를 수정한다.  
여기까지 작성하면 드래그 앤 드롭으로 목록을 이동할 수 있는 상태가 된다.


## 🎈 react-beautiful-dnd 패키지 이해하기
react-beautiful-dnd 패키지 기능을 사용하여 카드를 드래그 앤 드롭으로 옮길 수 있게 해보겠다. 해당 패키지는 DragDropContext 와 
Draggable, Droppable 컴포넌트를 제공한다.

```typescript jsx
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
```
이 패키지 또한 컨텍스트를 기반으로 하고 있으며 기본 사용법은 다음과 같다.
```typescript jsx
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import type {DropResult} from 'react-beautiful-dnd'

const onDragEnd = (resul:DropResult) => {}

<DragDropContext onDragEnd={onDragEnd}>
// Droppable과 Draggable을 사용하는 컴포넌트
</DragDropContext>

```
src/pages/Board/index.tsx 파일에 react-beautiful-dnd 가 동작할 수 있도록 DragDropContext 컴포넌트를 추가한다. 이 컴포넌트가 동작하려면
onDragEnd 라는 콜백 함수를 onDragEnd 속성에 추가해야 한다. 그런데 onDragEnd는 useLists 훅에서 가져오므로 useLists 훅을 수정하기 전까지는 오류가 발생한다.

## 🎈 CardDraggable 컴포넌트 구현하기
react-beautiful-dnd 패키지의 Draggable 컴포넌트는 사용법이 독특하므로 src/components 디렉터리에 CardDraggable.tsx 파일을 만들고
새롭게 구현하겠다. 이 코드의 draggableId는 카드의 uuid, index 는 카드가 담긴 배열에서의 특정 위치(즉 색인)를 의미한다.
CardDraggable.tsx 를 같은 디렉터리의 index.ts 에 포함시킨다. 이제 ListCard 컴포넌트에 CardDraggable 컴포넌트를 적용한다.
react-beautiful-dnd 관련 코드가 없어서 코드가 간결해졌다.

## 🎈 CardDroppable 컴포넌트 구현하기
react-beautiful-dnd 패키지의 Droppable 컴포넌트를 이용하여 CardDroppable 컴포넌트를 만들어 보겠다. 이 컴포넌트 또한
사용법이 독특하므로 src/components 디렉터리에 CardDroppable.tsx 를 만들고 코드를 작성한다. 여기서 droppableId는
목록의 uuid를 설정하는 속성이다. index.ts 에도 해당 코드를 반영한다.  
그리고 BoardList 컴포넌트에 CardDroppable 컴포넌트를 적용한다.


## 🎈 배열 관련 유틸리티 함수 구현하기
이제 DragDropContext 컴포넌트가 요구하는 onDragEnd 속성에 설정할 콜백 함수를 구현할 차례이다. 잠시 이 콜백 함수를 구현할 때
필요한 유틸리티 함수들을 src/utils 디렉터리에 구현하겠다.  
src/utils/arrayUtil.ts 파일을 생성한다. 그리고 함수 3개를 구현한다. 이 함수들은 순수 함수 형태로 배열에서 아이템의 순서를
변경하거나 제거, 삽입하는 기능을 수행한다.

## 🎈 onDragEnd 콜백 함수 구현하기
react-beautiful-dnd 패키지의 DragDropContext가 요구하는 onDragEnd 콜백 함수를 구현하려면 먼저 DropResult 타입의 실제
값을 이해해야 한다. 만약 useLists.ts 파일에 다음 내용을 구현하면 onDragEnd 에서 result 매개변숫값을 관찰할 수 있다.

다음은 같은 목록에서 드래그 앤 드롭을 했을 때 result 값의 내용이다. source와 destination의 droppableId 값은 같은 목록에서
옮겼기 때문에 같은 값을 갖는다. 하지만 index를 보면 source 가 1 이고 dest 가 0 이다 이것은 두 번째 카드가 첫 번째로 이동했다는
의미이다.

<img src="../../images/05-04.png">

그런데 타입스크립트로 result 의 destination 속성은 undefined 일 수 있다. 타입스크립트에서 string 타입과 string | undefined 타입은 전혀 다르다.
이를 해결하려면 다음처럼 if 문으로 undefined 일 때는 아무 작업을 하지 않는 코드가 필요하다. 그러면 타입스크립트는 if 문
이후의 값들은 더 이상 undefined 여부를 체크하지 않는다.

```typescript jsx
const onDragEnd = useCallback((result: DropResult) => {
  console.log('onDragEnd', result)
  const destinationListid = result.destination?.droppableId
  const destinationCardIndex = resul.destination?.index
  if (destinationListid === undefined || destinationCardIndex === undefined) return
} , [])
```
같은 목록에서 카드를 옮길 때는 카드의 두 색인값 source.index 와 destination.index 를 교체해 줘야 한다.
그리고 이 작업은 arrayUtil.ts 파일에서 swapItemInArray 함수를 사용하면 된다.  
카드를 다른 목록으로 옮길 때는 source 쪽 listid 부분에서 카드의 uuid를 삭제하고, destination 쪽 listid 부분에는 
해당 index 에 카드의 uuid를 추가해 줘야 한다.  
이런 내용을 useLists.ts 파일에 onDragEnd 콜백 함수를 구현한다. 이로써 칸판 보드 앱이 완성된다.







