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

## 🎈리액트 `<input>` 컴포넌트에 훅 사용하기
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
RadioInputTest.tsx의 내용을 HigherOrderRadioInputTest.tsx 에 복사한다. 앞에서 작성한 RadioInputTest 컴포넌트는 value 속성을 사용해
선택 로직을 구현했지만, 고차 함수를 사용할 때는 다음처럼 라디오 버튼의 인덱스로 어떤 버튼을 선택했는지 알 수 있다.
```typescript jsx
//인덱스로 선택 값 가져오기
const [selectedIndex, setSelectedIndex] = useState<number>(0)
```
그리고 onChange 이벤트 처리 콜백 함수를 고차 함수 형태로 구현한다.
```typescript jsx
const onChange = useCallback((index: number)=>()=>setSelectedIndex(notUsed=>index),[])
```
그리고 input 의 onChange 이벤트 속성에 index 값을 넘겨 주는 고차 함수를 설정한다.
```typescript jsx
<input onChange={onChange(index)}
```
HigherOrderRadioInputTest.tsx 파일에 코드를 작성한다. 앞서 구현한 RadioInputTest 컴포넌트와 결과는 같지만 코드가 훨씬 간결하다.  
코드에서 name 속성값을 jobs 가 아닌 higher jobs 로 설정했다. 만약 jobs로 하면 RadioInputTest 컴포넌트와 같은 그룹으로 묶여서 취급하게 된다.

## 🎈HTML `<form>` 요소
서버에서 HTML을 생성해 웹 브라우저 쪽에 전송하는 전통 방식의 웹 개발에서는 사용자에게 데이터를 입력받을 대 <form> 요소를 사용한다.
이때 <form> 요소는 method 속성에 데이터를 전송항 GET과 같은 HTTP 메소드를 설정하고, action 속성에는 폼 데이터를 전송한 뒤 전환할 화면의 URL을
설정하는 방식으로 사용한다. 만일 method 설정값이 POST 이면 폼 데이터를 암호화하는 다음 3가지 방식 중 하나를 encType 속성에 설정한다.
1. application/x-www-form-urlencoded(기본값)
2. multipart/form-data
3. text/plain

하지만 리액트와 같은 SPA 방식 프런트엔드 프레임워크를 사용할 때는 백엔드 웹 서버가 API 방식으로 동작하므로 굳이 `<form>`요소와
action, method, encType 등의 속성을 설정할 필요가 없다. 다만 관습적으로 사용자 입력을 받는 부분을 `<form>` 요소로 구현한다. 
다음은 리액트로 `<form>` 을 구현할 때 코드 패턴이다.
```typescript jsx
<form>
  <input type={"submit"} value={"버튼_텍스트"}/>
</form>
```
그리고 사용자가 `<input type="submit">` 버튼을 눌렀을 때 이벤트 처리는 form 요소의 onSubmit 이벤트 송성을 다음처럼 사용한다.
참고로 FormEvent 타입 대신 ChangeEvent 나 SyntacticEvent 타입을 사용해도 된다.
```typescript jsx
// 버튼 이벤트 처리
import type {FormEvent} from 'react'
// .. 생략 ..
const onSubmit = (e:FormEvent<HTMLFormElement>) => {
  e.preventDefault() // 매우중요!!!!
}
<form onSubmit={onSubmit}>
  <input type={"submit"} value={"버튼"}/>
</form>
```
그런데 onSubmit 을 구현할 때 한 가지 주의할 점은 웹 브라우저는 onSubmit 이벤트가 발생하면 form이 있는 웹 페이지를 다시 렌더링한다는 것이다.
이 때문에 onSubmit 을 구현할 때는 바드시 e.preventDefault()를 호출해 웹 페이지가 다시 렌더링되지 않도록 해야 한다.

## 🎈FormData 클래스
FormData는 자바스크립트 엔진이 기본으로 제공하는 클래스로서, 사용자가 입력한 데이터들을 웹 서버에 전송할 목적으로 사용한다. 
FormData 클래스는 다양한 메서드들을 제공하는데 보통은 append() 메서드만으로 충분하다.
다음은 FormData 의 append() 메서드를 호출해 (키,값) 형태의 데이터를 추가하는 코드 예이다.
```typescript jsx
const formData = new FormData()
formData.append('name','jack')
formData.append('email','aaa@aaa.com')
```
만일 FormData의 내용을 JSON 포맷으로 바꾸고 싶다면 자바스크립트 엔진이 기본으로 제공하는 Object.fromEntries() 함수를 다음처럼 호출하면 된다.
```typescript jsx
const json = object.fromEntries(formData)
```
src/pages/BasicForm/tsx 에 코드를 작성한다. 앞서 배운 내용에 daisyui 의 폼 관련 CSS 컴포넌트들을 적용했다.

## 🎈객체 타입 값일 때 useState 훅 사용하기
앞서 작성한 BasicForm 은 name 과 email 을 상탯값으로 만들었는데 다음처럼 객체의 속성 형태로도 구현할 수 있다.
```typescript jsx
type FormType = {
  name:string
  email:string
}
```
그리고 다음처럼 FormType 객체를 상태로 만들 수 있다. 그런데 이처럼 객체를 상태로 만들면 onChangeNAme, onChangeEmail 과 같은 콜백함수를 구현해야 한다.
그러려면 깊은 복사와 얕은 복사, 그리고 타입스크립트의 전개 연산자 구문을 알아야 한다.
```typescript jsx
// 객체를 상태로 만들기
const [form, setForm] = useState<FormType>({name:'',email:''})
```

### 🕸️깊은 복사와 얕은 복사, 그리고 의존성 목록
대다수 프로그래밍 언어에서 어떤 변수에 담긴 값을 다른 변수에 복사할 때는 깊은 복사와 얕은 복사 라는 2가지 방식을 지원한다.
복사 방식은 값의 타입에 따라 각기 다르게 적용된다. 만일 number, boolean 등 값의 메모리 크기를 컴파일 타임 때 알 수 있는 타입은 항상 깊은 복사가 일어난다.
반면에 객체, 배열 등 값의 메모리 크기를 런타임 때 알 수 있는 타입은 얕은 복사가 일어난다. 한 가지 예외 상황은 string 타입인데,
타입스크립트에서 문자열은 항상 읽기 전용이므로 메모리 크기를 컴파일 타임 때 알 수 있다. 따라서 문자열은 깊은 복사가 일어난다.  
리액트 훅 프로그래밍에서 깊은 복사 여부가 중요한 이유는 대다수 훅 함수에 필요한 의존성 목록 때문이다.
다음 코드에서 setForm()을 호출할 때 e.target.value로 얻은 name값을 어떻게 사용할지 고민된다.
```typescript jsx
const onChangeName = useCallback((e:ChangeEvent<HTMLInputElement>)=> {
  const name = e.target.value
  setForm(/* 구현 필요 */)
},[form])
```
예를 들어 setForm()을 다음처럼 구현한다고 가정하겠다. 이 코드는 객체를 복사하므로 얕은 복사가 적용된다.
```typescript jsx
// 복사방식 비교
const onChangeName= useCallback((e:ChangeEvent<HTMLInputElement>)=> {
  const newForm = form // 얕은 복사
  // const newForm = Object.assign({},form) // 깊은 복사
  newForm.name = e.target.value
  setForm(newForm)
},[form])
```
리액트 프레임워크는 내부적으로 form 상태에 변화가 생겼는지를 form === newForm 형태로 비교한다. 그런데 객체 타입의 복사는 항상 얕은 복사이므로
이 비굣값은 항상 true 이다. 따라서 리액트는 form에 아무런 변화가 없다고 간주한다. 따라서 리액트는 웹 페이지를 다시 렌더링하지 않으므로
`<input>`에 값을 입력해도 form에 반영되지 않는다.  
이 얕은 복사 문제는 코드에 주석으로 해놓은 Object.assign() 함수를 사용하면 깊은 복사가 일어나 form ===newForm 이 항상 false가 되어 웹 페이지를
다시 렌더링한다. 따라서 웹 페이지는 정상으로 동작한다. 그런데 한 가지 문제는 코드를 이런 형태로 작성하는 것이 번거롭다는 것이다.
이제 타입스크립트의 전개 연산자 구문으로 코드를 좀 더 간결하게 구현하는 방법을 알아보겠다.

### 🕸️객체에 적용하는 타입스크립트 전개 연산자 구문
다음 코드에서 첫 줄은 두 객체 앞에 점 3개(...)가 붙었는데, 이 연산자를 사용하는 코드의 위치에 따라 잔여 연산자 또는 전개 연산자라고 한다.
다음 코드는 전개 연산자를 사용해 두 객체를 병합하는 예이다.
```typescript jsx
//전개연산자
let coord ={...{x:0},...{y:0}};
console.log(coord); // {x:0, y:0}
```
다음 코드는 앞에서 살펴본 깊은 복사가 일어나는 코드에서 Object.assign 호출을 전개 연산자로 간결하게 구현한 것이다.
```typescript jsx
const onChangeName= useCallback((e:ChangeEvent<HTMLInputElement>)=> {
  const newForm = {...form} // 깊은복사(전개연산자 사용)
  newForm.name = e.target.value
  setForm(newForm)
},[form])
```
또한 타입스크립트 전개 연산자는 다음처럼 객체의 속성값 가운데 일부를 변경할 수 있다.
```typescript jsx
const onChangeName= useCallback((e:ChangeEvent<HTMLInputElement>)=> {
  // 깊은 복사아 name 속성값 변경이 동시에 발생
  const newForm = {...form, name: e.target.value}
  newForm.name = e.target.value
  setForm(newForm)
},[form])
```

### 🕸️타입스크립트 객체 반환 구문
앞 코드에서 setForm() 호출은 다음처럼 콜백 함수로 구현할 수 있다. 이렇게 하면 form 을 useCallback의 의존성 목록에 추가하지 않아도 되므로
useCallback 을 호출할 때 선호하는 방식이다.
```typescript jsx
const onChangeName = useCallback((e:ChangeEvent<HTMLInputElement>)=> {
  setForm(form => {return {...form, name: e.target.value}})
},[])
```
그런데 이 코드에서 return 키워드는 불필요하다. 다음은 return 키워드를 생략하고 form 객체를 밴환하도록 구현한 예이다.
그런데 한 가지 문제는 타입스크립트 컴파일러가 {...form, name:e.target.value}코드를 객체 구문이 아니라 복합 실행문으로 인식한다는 것이다.
```typescript jsx
const onChangeName = useCallback((e:ChangeEvent<HTMLInputElement>)=> {
  setForm(form => {...form, name: e.target.value} ) // 복합 실행문으로 인식
},[])
```

타입스크립트에서 객체를 반환하는 구문은 객체를 의미하는 중괄호 {}를 다시 소괄호로 감싼 ({}) 형태로 사용해야 한다.
이는 복합 실행문은 소괄호로 감쌀 수 없다는 특성을 활용한 것이다.
```typescript jsx
// 객체반환 구문
const onChangeName = useCallback((e:ChangeEvent<HTMLInputElement>)=> {
  setForm(form => ({...form, name: e.target.value}) ) // 복합 실행문으로 인식
},[])
```

### 🕸️ObjectState.tsx 파일 구현하기
ObjectState.tsx 파일에 앞서 살펴본 내용을 종합해 코드를 작성한다. 앞서 구현한 기본 폼 코드와 결과는 같지만 리액트 훅 호출 코드가
훨씬 이해하기 쉬워졌다. 또한 FormType에 다른 멤버 속성을 추가해도 같은 코드 패턴으로 구현하면 되므로 확장성도 좋아졌다.

## 🎈배열 타입 값일 때 useState 훅 사용하기
아래 그림은 잠시 후 만들 ArrayState 컴포넌트의 실행 결과이다. 처음에는 버튼 2개만 보이지만 더하기 버튼을 누르면 이미지가 추가된다.

<img src="../../images/04-04.jpg" width="450">

이런 화면은 배열을 컴포넌트의 상태로 만들면 쉽게 구현할 수 있다. 즉, 배열 또한 타입이므로 useState 훅을 사용해 상태로 만들 수 있다.
```typescript jsx
// 배열을 상태로 만들기
const [images,setImages] = useState<string[]>([])
```
두 버튼의 inClick 이벤트 속성에는 addImages와 clearImages라는 콜백 함수를 설정한다. 이 콜백 함수들을 구현할 때 배열에 적용하는 타입스크립트의
전개 연산자 구문을 알면 코드를 좀 더 간결하게 작성할 수 있다.

### 🕸️배열에 적용하는 타입스크립트 전개 연산자 구문
객체에 적용하는 전개 연산자 구문을 알아봤다. 다음처럼 배열에도 적용할 수 있다. 전개 연산자는 깊은 복사를 일으키므로 numbers === newNumbers 는 항상 false이다.
즉, numbers === newNumbers 는 리액트 의존성 목록 아이템으로 사용할 수 있다.
```typescript jsx
// 전개연산자 배열에 사용
const number = [1,2,3]
const newNumbers = [...number, 4] // [1,2,3,4]
```

다음은 배열에 적용하는 전개 연산자 구문을 활용해 addImage 콜백 함수를 구현한 예이다. 이 코드는 전개 연산자가 뒤쪽에 있으므로
새로 생성되는 이미지 정보가 배열 맨 앞에 위치한다.
```typescript jsx
const addImage = useCallback(()=>setImages(images => [D.randomImage(),...images]),[])
```
다음은 clearImages 콜백 함수를 구현한 예이다. images를 초기화하는 방법은 images를 빈 배열로 [] 설정하면 된다.
```typescript jsx
const clearImages = useCallback(()=>setImages(notUsed => []),[])
```

### 🕸️ArrayState 컴포넌트 만들기
ArrayState.tsx 에 지금까지의 내용을 종합해서 코드를 작성한다.