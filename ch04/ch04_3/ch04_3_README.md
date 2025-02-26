# 04-3 useState 훅 이해하기
리액트 훅 함수 중에서 가장 많이 사용되는 useState 훅을 알아본다.

## 🎈가변 상태를 캐시하는 useState 훅
앞 절에서 알아본 useMemo 훅은 불변 상태를 캐시하지만, useState 훅은 가변 상태를 캐시한다. 사용법은 다음과 같다.
useState 훅이 반환한 세터 함수는 리액트가 컴포넌트 내부의 상태 변화를 쉽게 감지할 수 있게 해준다. 즉, 리액트 프레임워크는
세터 함수가 호출되면 컴포넌트의 상태에 변화가 있는 것으로 판단하고 즉시 해당 컴포넌트를 다시 렌더링한다.
```
const [값, 값을_변경하는_세터_함수] = useState(초깃값)
```
그런데 상태에는 타입이 있다. 즉, 상태는 number, boolean, string 같은 원시 타입일 수 도 있고, 객체, 배열, 튜플 타입일 수도 있다.
useState 훅의 선언문을 보면 상태의 타입이 S일 때 초깃값을 매개변수로 받는 제네릭 함수임을 알 수 있다. 또한 S 타입의 값과
`Dispatch<SetStateAction<S>>` 타입 함수를 튜플 형태로 반환한다.
```
  function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>]
```
여기서 Dispatch와 SetStateAction 타입은 다음과 같다. 이 두 타입이 결함된 `Dispatch<SetStateAction<S>>` 타입은
setter(newValue) 또는 setter(previousValue => newValue) 둘 중 하나의 함수 타입을 의미한다.

## 🎈 number 타입일 때 useState 훅 사용하기
먼저 상태가 number 타입일 때 useState 훅을 어떻게 사용하는지 알아보겠다. 다음 코드는 초깃값을 0으로 설정하므로 이 코드가 실행된 시점에 count는 0으로 설정된다.
```typescript
const [count,setCount] = useState<number>(0)
```
만일 count값을 1만큼 증가시키고 싶다면 다음처럼 구현할 수 있다.
```typescript jsx
const increment = () => setCount(count+1)
<button onClick={increment}>+</button>
```
그리고 다른 방법은 `(prevState: S) =>S`방식으로 다음처럼 구현하는 것이다. 이 코드는 현재 count 값에 1만큼 더한 새로운 count값을 반환한다.
```typescript jsx
const increment=() =>setCount(count=>count+1)
```
그런데 increment 콜백 함수를 다음 코드처럼 useCallback 훅으로 캐시하면 count에 의존성 문제가 발생한다.

```typescript jsx
// count에 의존성 문제 발생
const increment = useCallback(()=> {
  setCount(count+1) // 캐시된 함수 내의 count는 항상 0
}, []) // 의존성 목록에 count를 등록하지 않음
```
count 가 초깃값 0일 때 increment가 호출되면 count는 1이 되지만, useCallback 함수 내부에서 count 는 여전히 0이다.
즉, count를 의존성 목록에 등록하지 않으면 리액트는 useCallback 훅의 콜백 함수 내부에서 count값을 갱신하지 않으므로 항상 0이 된다.
하지만 count를 ㅡ이존성 목록에 넣으면 리액트는 변경된 count값 1이 반영된 새로운 콜백 함수를 캐시한다.
```typescript jsx
// count에 의존성 문제 해결
const increment = useCallback(()=> {
  setCount(count+1)
},[count])
```
그런데 흥미로운 것은 increment를 다음처럼 구현하면 count에 의존성 문제가 발생하지 않는다. 코드에서 setCount의 입력 변수 `count => count+1`은 함수이다.
리액트는 세터 함수의 입력 변수가 함수일 때는 현재 유지되고 있는 값을 매개변수로 하여 세터 함수를 호출한다.
그리고 세터 함수가 반환한 값을 새로운 count값으로 설정하므로 count에 의존성 문제가 발생하지 않는다.
```typescript jsx
const increment = useCallback(()=> {
  setCount = (count=>count+1)  // 함수를 입력 변수로 세터 호출
},[]) // 의존성 목록에 count 넣지 않아도 됨
```
지금까지의 내용을 종합하여 src/pages/NumberState.tsx 파일에 코드를 작성한다. count에 의존성 문제가 발생하지 않도록 세터 함수
setCount의 매개변수를 콜백 형태로 호출한다.

## 🎈리액트 <input> 컴포넌트에 훅 사용하기
리액트의 `<input>` 컴포넌트는 type 속성을 제공하며, 이 속성은 기본값 'text' 외에도 'checkbox', 'radio' 와 같은 값을 가질 수 있다.
`<input>`은 boolean 타입의 checked 속성과 string 이나 number 타입의 value 속성 2가지를 제공한다. 그리고 두 속성 중 값이 바뀌면 onChange 이벤트 속성에 설정한 콜백 함수를 호출한다.  
그런데 리액트의 `<input>` 요소와 HTML의 `<input>` 요소는 사용법에 차이가 있다. HTML의 input 요소는 기본값을 설정하려면 다음처럼 표현할 수 있다.
```html
<input type="text" value="default value"/>
<input type="checkbox" checked="checked"/>
```
하지만 리액트는 checked 속성은 타입이 boolean 이므로 위 코드의 두 번째 줄은 타입 오류가 발생한다. 다음처럼 구현해야 한다.
```typescript jsx
<input type={"checkbox"} checked={true}/> 
```
그런데 이처럼 value나 checked 속성에 기본값을 설정하면 웹 브라우저의 콘솔 창에는 경고 메시지가 나타난다. 이 문제를 해결하려면
다음처럼 defaultValue 와 defaultChecked 속성을 사용해야 한다.
```typescript jsx
<input type={"text"} defaultValue={"default value"} />
<input type={"checkboc"} defaultChecked={true}/>
```
src/pages/InputTest.tsx 에 기본 코드를 작성한다. 그리고 onChange 이벤트 설정을 어떻게 구현해야 하는지 알아보겠다.  
이제 `<input>`요소에 onChange 이벤트 처리 콜백 함수를 설정한다. 다음 코드는 텍스트 박스를 구현할 때의 이벤트 설정 방식이다.
만약 체크 박스나 라디오 버튼을 구현할 때는 e.target.value 대신 e.target.checked 속성을 사용해야 한다.

```typescript jsx
//텍스트 타입일 때 이벤트 설정 방법
import type {ChangeEvent} from "react";

export default function OnChange() {
  const onChange = (e:ChangeEvent<HTMLInputElement>) => {
    // console.log('onChange', e.target.value)
  }
  return <input type={"text"} onChange={onChange}/>
}
```
지금까지의 내용을 종합해 InputTest.txs 파일을 작성한다. type 설정값이 각기 다른 input 에 대해 useState 훅으로 세터 함수를 얻은 뒤,
이를 onChange 이벤트 처리기에서 각기 다르게 사용한다. useState 훅은 컴포넌트가 자신만의 상태를 유지하려고 할 때 사용하는 중요한 함수이다.

## 🎈useToggle 커스텀 훅 만들기
앞의 checked, value 와 같은 패턴으로 코드를 작성하는 것은 조금 번거롭다. 이런 번거로움을 줄이기 위해 src/hooks/ 디렉터리에 useToggle.ts 파일을 생성하고
여기에 useToggle 커스텀 훅을 구현한다. 이 코드는 boolean 값은 언제나 true, false 이므로 굳이 ChangeEvent의 target.checked 속성을 사용하지 않고,
! 연산자로 value값이 false일 때는 true로, true일 때는 false로 값을 바꾸는 방식을 사용한다.  
useToggle.ts 에 코드를 작성하고 index.ts에 반영한다.  
이제 useToggle 훅을 daisyui 의 Modal 컴포넌트에 적용해 보겠다. src/pages 디렉터리의 ShowHideModal.tsx 에 코드를 작성한다.
이 코드는 ModalTest.tsx 파일 내용을 복사해서 useToggle 커스텀 훅을 적용한 것이다. 

## 🎈라디오 버튼 구현 방법
여러 값 중에서 하나만 고를 수 있께 할 때 라디오 버튼을 사용한다. 그런데 라디오 버튼은 구현이 조금 까다롭다. 먼저 라디오 버튼을 여러 개 사용하려면
name 속성에 모두 같은 이름을 부여해야 한다. 그러면 웹 브라우저는 자동으로 같은 이름의 라디오 버튼 중 하나만 선택해 화면에 보여준다.  
그런데 라디오 버튼이나 체크 박스는 value(혹은 defaultValue) 속성값을 화면에 보이게 하지 않는다. 이 때문에 라디오 버튼 옆에 텍스트를 함께 보이려면
`<label>` 등을 추가해야 한다.  
src/pages/RadioInputTest.tsx 파일에 코드를 작성한다. 코드는 daisyui 라디오 버튼 관련 CSS 컴포넌트를 사용한다. 이제 이 코드에 특정 라디오 버튼을 선택하는
각기 다른 2가지 방식의 로직을 구현하겠다.

### 🕸️value 속성으로 라디오 버튼 선택 로직 구현하기
사용자가 선택한 라디오 버튼을 코드에서 알려면 checked 속성값에 다음과 같은 형태의 코드를 작성해야 한다. 그런데 '값 === selectedValue'에서
값 부분을 구체적으로 어떻게 작성해야 할지 고민이다.
```typescript jsx
const [selectedValue, setSelectedValue] = useState<string>('초기 선택 값')
<input type={"radio"} name={"same name"} checked={값===selectedValue}/>
<input type={"radio"} name={"same name"} checked={값===selectedValue}/>
<input type={"radio"} name={"same name"} checked={값===selectedValue}/>
```
만약 고차 함수를 사용하고 싶지 않다면 값 부분은 다음처럼 defaultValue 속성을 사용해서 설정해야 한다.
```typescript jsx
const [selectedValue, setSelectedValue] = useState<string>('초기 선택 값')
<input type={"radio"} name={"same name"} checked={값===selectedValue} defaultValue='값1' />
<input type={"radio"} name={"same name"} checked={값===selectedValue} defaultValue='값2' />
<input type={"radio"} name={"same name"} checked={값===selectedValue} defaultValue='값3' />
```
그려면 onChange 이벤트 콜백 함수는 다음의 형태로 구현하게 된다.
```typescript jsx
const onChange = (e:ChangeEvent<HTMLInputElement>) => {
  setSelectedValue(notUsed => e.target.value)
}
```
RadioInputTest.tsx 컴포넌트 초기 내용에 특정 라디오 버튼을 선택하는 로직을 추가한다.

### 🕸️고차 함수로 라디오 버튼 선택 로직 구현하기
