# 04-5 useRef 와 useImperativeHandle 훅 이해하기
useRef 와 useImperativeHandle 은 ref 라는 속성에 적용하는 값을 만들어 주는 훅이다. 사실 리액트와 리액트 네이티브가 제공하는 컴포넌트는 모두 ref 라는
이름의 속성을 가지고 있다. 이 절에서는 ref 속성과 관련된 두 가지 훅과 forwardRef() 함수에 관해 알아보겠다.

## 🎈Ref 속성이란?
모든 리액트 컴포넌트는 reference의 앞 글자를 딴 ref 속성을 제공한다. 이 속성은 사용자가 설정하는 것이 아니라 초기에는 null 이었다가
마운트 되는 시점에서 물리 DOM 객체의 값이 된다. 즉, `ref는 물리 DOM 객체의 참조이다.`  
HTML 요소들은 모두 HTMLElement의 상속 타입이다. 그리고 HTMLElement 타입은 click(), blur(), focus() 메서드를 제공한다.
이 메서드들은 가상 DOM 상태일 때는 호출할 수 없고, 물리 DOM 상태일 때만 호출가능하다. 즉, ref 로 얻은 값(즉, DOM 객체)을 사용해
해당 메서드를 호출할 수 있는 것이다.  
다음 ref 속성의 정의에서 타입이 Ref<T> 임을 알 수 있다. 여기서 타입 변수 T는 HTMLElement 와 같은 DOM 타입을 뜻한다.
```typescript jsx
interface RefAttributes<T> extends Attributes {
  ref?: Ref<T>;
}
```
그리고 Ref<T>는 다시 current라는 읽기 전용 속성을 가진 RefObject<T> 타입이다. current는 null일 수 있다. 이는 리액트 요소가
마운트되기 전인 가상 DOM 타입일 때는 null이기 때문이다. 또한 current 는 리액트 내부에서 설정해 주는 값이므로 사용자 코드에서 리액트가 설정한 값을
임의로 바꿀 수 없아야 한다. 따라서 current는 읽기 전용이다.
```typescript jsx
interface RefObject<T> {
  readonly current: T | null;
}

type Ref<T> = RefCallback<T> | RefObject<T> | null;
```

## 🎈useRef 훅 알아보기
react 패키지는 useRef 훅을 제공한다. 다음 코드는 useRef 훅으로 얻은 값을 ref 속성값으로 설정하는데, 이것은 이 훅의 이름이 왜 useRef인지 말해준다.
```typescript jsx
const divRef = useRef<HTMLDivElement | null>(null)
<div ref={divRef}>
```
그런데 useRef 훅의 반환값 타입은 MutableRefObject<T> 이다.
이 타입은 앞서 본 ref 속성의 타입인 RefObject<T> 처럼 current라는 속성을 가지고 있다.

### 🕸️`<input>` 의 클릭 메서드 호출하기
`<input>`은 type 속성값이 'file'일 때 마우스로 클릭하면 [열기] 대화 상자가 나타난다. 
```typescript jsx
<input type={"file"} accept={"image/*"}/>
```
만일 프로그래밍으로 [열기] 대화 상자를 화면에 나타나게 하고 싶다면 `<input>` 요소의 물리 DOM 객체, 즉 ref값을 다음처럼 얻어야 한다.
```typescript jsx
const inputRef = useRef<HTMLInputElement>(null);

<input ref={inputRef} type="file" accept="image/*"/>
```
그리고 다음처럼 `<button>`요소를 하나 만든 뒤 이 버튼을 클릭했을 때 `<input>` 을 클릭하는 효과를 주려면 다음처럼 작성한다.
```typescript jsx
const onClick = useCallback(()=> {
  const input = inputRef.current
  if (!input) return
  
  input.click()
},[]);

<button onClick={onClick}>Click Me</button>

```
useRef를 사용해서 ref 값을 저장하는 inputRef는 초깃값을 null로 설정했다가 리액트에서 값을 바꾸므로 useCallback 훅의 의존성에 inputRef.current 를 추가해야 될 것 같다.
하지만 useRef 훅 호출로 얻은 inputRef의 current 속성은 그 값이 변해도 다시 렌더링되지 않도록 설계되었으므로 의존성 목록에 포함하지 않는다.
즉, useCallback 의존성 목록에 추가하지 않아도 null이 아닌 inputRef.current 값을 얻을 수 있다.  
그리고 이 코드는 타입스크립트의 옵셔널 체이닝 연산자인 `?.` 를 사용하면 좀 더 간결하게 구현할 수 있다.

```typescript jsx
const onClick = useCallback(()=>inputRef.current?.click(), [])
```

그런데 `<input>`의 click 메서드를 프로그래밍으로 호출하는 방식을 사용하면 다음처럼 `<input>` 요소를 화면에 나타나지 않게 해도 된다.
참고로 다음 코드에서 hidden 은 테일윈드 CSS 클래스로 CSS의 display: none 에 해당한다.
```typescript jsx
<input ref={inputRef} className={"hidden"} type={"file"} accept={"image/*"}/>
```

이제 src/pages/ClickTest.tsx 파일에 지금까지 내용을 종합해서 코드를 작성한다.

### 🕸️FileList 클래스와 Array.from() 함수
다음코드는 02-5 에서 작성한 FileInput.tsx 파일의 내용이다. 이 코드는 onChange 이벤트 처리기에서 FileList 타입의
files 값을 얻고 있다.
```typescript jsx
const onChange = (e: ChangeEvent<HTMLInputElement>) => {
  const files: FileList | null = e.target.files
}
```
FileList는 File 타입의 리스트이다. 그런데 FileList는 자바스크립트 배열이 아니다. 자바스크립트에서는 FileList와 같은 클래스들을 유사 배열 객체라고 부른다.
자바스크립트에서 유사 배열 객체는 다음처럼 Array.from() 함수를 사용해 배열로 변환할 수 있다.
```typescript jsx
const fileArray: File[] = Array.from(files)
```

### 🕸️FileReader 클래스로 File 타입 객체 읽기



























































