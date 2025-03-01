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
자바스크립트 엔진은 File 타입 객체를 읽을 수 있도록 FileReader라는 클래스를 기본으로 제공한다. FileReader 클래스는 다음처럼
readAsDataUrl() 메서드를 제공한다.
```typescript jsx
// const file: File
const fileReader = new FileReader
fileReader.readAsDataURL(file)
```
readAsDataUrl() 메서드는 File 타입 객체를 읽어서 다음과 같은 문자열로된 이미지를 제공하는데 이런 방식을 base64 인코딩이라고 한다.

<img src="../../images/04-06.png" width="550">

그런데 File 타입 객체에 담긴 데이터는 바이너리 데이터이므로 base64 인코딩을 진행할 때 시간이 걸린다. 따라서 FileReader는 다음처럼 사용하는 onload 이벤트 속성을 제공한다.
참고로 코드에 사용한 ProgressEvent는 자바스크립트가 기본으로 제공하는 타입이다.
```typescript jsx
// onload 이벤트 속성
const fileReader = new FileReader()
fileReader.onload = (e:ProgressEvent<FileReader>) => {
  if (e.target) {
    const result = e.target.result // base64 인코딩 결과
  }
}
fileReader.readAsDataURL(file)
```

### 🕸️imageFileReaderP 유틸리티 함수 만들기
그런데 FileReader의 이런 코드 패턴은 여러 파일을 읽으려고 할 때 구현이 매우 어렵다. 이제 FileReader를 좀 더 간단하게
사용할 수 있도록 src/utils 디렉터리를 만들고 index.ts, imageFileReaderP.ts 파일을 추가한다.
imageFileReaderP 에서 P는 Promise 객체를 반환하는 함수라는 의미이다. 다음은 앞서 본 FileReader 사용법을 imageFileReaderP.ts 파일에 구현한다.

### 🕸️FileDrop 컴포넌트 만들기
imageFileReaderP를 사용하는 FileDrop 컴포넌트를 만든다. 이 컴포넌트는 이미지 파일을 표시하는데, [열기] 대화 상자를 띄워 이미지 파일을
선택하거나 웹 페이지에 이미지 파일을 끌어다 놓을 수 있도록 한다. 이 컴포넌트를 구현할 때 핵심은 JSX 코드에 있는 이벤트 처리기 4개를 구현하는 것이다.  
onDivClick 이벤트 처리기는 앞서 클릭 테스트 때 구현한 기법을 사용해 프로그래밍으로 `<input type="file">` 의 클릭 메서드를 호출한다. 그리고 사용자가 [열기] 대화 상자에서
여러 개의 이미지 파일을 선택하면 onInputChange 이벤트 처리기가 호출된다. 그런데 onInputChange를 쉽게 구현하고자 imagesUrls 상태와
makeImageUrls 도움 함수를 먼저 구현한다.  
참고로 코드에 사용한 Promise.all 함수는 Promise 객체의 배열을 입력받아 배열에 담긴 Promise 객체의 then 메소드를 모두 호출해 준다.
즉, 결괏값 배열을 then 콜백 함수에 넘겨주는 역할을 한다.  
이제 onInputChange 이벤트 처리기를 구현할 수 있다.  
그리고 이렇게 만든 imageUrls 는 03장에서 만든 Div 컴포넌트를 사용해 <div> 요소의 배경이미지 형태로 화면에 나타나게 한다. Div 컴포넌트의 src={url} 에서 url은
웹상의 이미지 주소나 파일 경로도 가능하지만, 이미지 데이터를 Base64 인코딩 문자열로 직접 포함할 수도 있다. 여기서는 Base64 인코딩 문자열을 사용했다.
또한 02-5 에서 알아본 것처럼 이미지 파일을 해당 영역에 떨어뜨리면 onDivDrop이 호출되고, e.dataTransfer?.files 형태로 FileList 타입의 files 객체를 얻으면
makeImageUrls 도움 함수로 imageUrls에 떨어뜨린 파일을 추가할 수 있다.  
  
src/pages/FileDrop.tsx 파일에 지금까지 작성한 코드를 종합해서 작성한다. 코드를 실행한 후 이미지를 선택하거나
떨어뜨리면 웹 페이지에 표시된다.

### 🕸️`<input>` 요소의 ref 속성 사용하기
`<input>`요소는 JSX 코드에서는 보통 다음처럼 사용된다.
```typescript jsx
<input className={"input input-primary"} placeholder={"enter some text"}/> 
```
이렇게 구현한 입력 상자에 사용자가 값을 넣으려고 클릭하면 포커싱이 된다. 그런데 `<input>` 의 ref 속성으로 사용자가 입력 상자를 클릭하지 않아도
포커싱되게 할 수 있다. src/pages/InputFocus.tsx 파일에 다음 코드를 작성한다. `<input>` 의 ref 속성으로 얻은 inputRef.current 값이 물리 DOM 객체이므로
이 객체의 focus 메서드를 호출하는 방법으로 구현한다. 코드를 실행해 보면 웹 페이지가 열리자마자 입력 상자가 포커싱되는 것을 볼 수 있다.

### 🕸️useState 호출 없이 `<input>`의 value 속성값 얻기
리액트는 항상 `<input>`의 value 속성과 관련해 다음과 같은 패턴으로 코드를 작성하라고 요구한다. 그런데 이런 패턴은 조금 번거롭다.
```typescript jsx
const [value, setValue] = useState<string>(' ');
const onChange = (e:ChangeEvent<HTMLInputElement>) => setValue(notUsed=>e.target.value);

<input value={value} onChange={onChange}/>
```
리액트가 이런 패턴의 코드를 요구하는 것은 가상 DOM 환경에서 빠른 리렌더링을 위해서이다. 하지만 ref 속성이 유효한 값, 즉 물리 DOM 객체가 만들어지면
이 객체의 value 속성값을 곧바로 얻을 수 있다.  
여기서는 useState 훅을 사용하지 않고서도 `<input>` 의 value 속성값을 가져오는 실습을 진행해보겠다. src/pages/InputValueTest.tsx 파일에 다음 코드를 작성한다.
이 코드는 `<input>`의 물리 DOM 객체로부터 value 값을 얻는다. 코드를 실행하고 입력 상자에 값을 입력한 후 `<GET VALUE>`를 클릭하면 입력한 값을 표시하는 창이 나타난다.

## 🎈forwardRef() 함수 이해하기
forwardRef 함수는 이름대로 부모 컴포넌트에서 생성한 ref를 자식 컴포넌트로 전달해 주는 역할을 한다. 

```typescript jsx
forwardRef<RefType, PropsType>((props, ref) => {
  // 컴포넌트 구현
})
```

여기서 RefType은 ref를 통해 노출되는 메서드나 속성의 타입을 정의하고, PropsType은 컴포넌트가 받을 수 있는 props의 타입을 정의한다. 
이를 통해 타입 안전성을 높이고, 코드의 가독성을 향상시킬 수 있습니다.


### 🕸️forwardRef 함수가 필요한 이유 알기
03-5 절에서 src/theme/daisyui 디렉터리에 다음과 같은 Input.tsx 파일을 만든 적이 있다.
```typescript jsx
import {FC, DetailedHTMLProps, InputHTMLAttributes} from 'react'

export type ReactInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

export type InputProps = ReactInputProps & {}

export const Input: FC<InputProps> = ({className: _className, ...inputProps}) => {
  const className = ['input', _className].join(' ')
  return <input {...inputProps} className={className} />
}
```
그런데 다음처럼 Input 컴포넌트의 ref 속성에 inputRef 를 설정할 수 있을까? 즉, 리액트가 제공하는 기본 컴포넌트인 `<input>`은 ref 속성에 값을 설정할 수 있지만,
Input 과 같은 사용자 컴포넌트에도 똑같이 ref 속성에 값을 설정할 수 있을지 궁금하다. ref는 물리 DOM 객체를 얻으로겨 사용하는 건데,
Input은 사용자 컴포넌트이므로 물리 DOM 객체를 얻을 수 없기 때문이다.  
이 내용을 실습해 보겠다. ForwardRefTest.tsx에 코드를 작성한다. 전체적인 맥락은 InputValueTest.tsx 와 같지만, Input 컴포넌트를 사용했다.

***`✨ 내 버전에서는 Input 사용자 컴포넌트에 ref 속성값을 설정이 그냥 된다... 
이전 버전에서는 타입이 달라서 속성(props)에 ref 값이 전달이 되지 않았던 것 같다. 일단 교제의 내용과 같게 Input.tsx 컴포넌트를 구현하겠다.`***

## 🎈useImperativeHandle 훅이란?
useImperativeHandle 훅은 컴포넌트 기능을 JSX가 아니라 타입스크립트 코드에서 사용한다.

### 🕸️ useImperativeHandle 훅 동작 원리
다음 코드가 성립할 수 있는 이유는 TextInput 코어 컴포넌트가 focus 라는 메서드를 제공한다는 사실을 우리가 미리 아록 있기 때문이다.
```typescript jsx
const textInputRef =useRef<TextInput | null>(null)
const setFocus =() => testInputRef.current?.focus()
```
그런데 다음과 같은 타입의 객체가 있다고 가정해 보겠다.
```typescript jsx
export type TextInputMethods = {
  focus: ()=> void
  dismiss: ()=> void
}
```
이때 앞선 코드에서 `useRef<TextInput |null>(null)` 부분을 다음처럼 TextInput 대신 TextInputMethods 를 사용하면 어떨까 하는 것이
useImperativeHandle 훅의 탄생 배경이다.
```typescript jsx
const methodsRef = useRef<TextInputMethods |null>(null)
const setFocus = () => methodsRef.current?.focus()
const dismissKeyboard = () => methodsRef.current?.dismiss()
```

`✨ useImperativeHandle 훅은 forwardRef로 가져온 부모 객체의 ref 값으로 부모 객체의 속성을 사용하기 위해서 사용하는 훅이다.`

### 🕸️useImperativeHandle 훅의 타입
먼저 useImperativeHandle 훅의 타입 정보를 살펴보면 다음과 같다.
```typescript jsx
function useImperativeHandle<T, R extends T>(ref: Ref<T> | undefined, init: () 
  => R, deps?: DependencyList): void;
```
첫 번째 매개변수 ref는 forwardRef 호출로 얻는 값을 입력하는 용도이고, 두 번째 매개변수 init 는 useMemo 훅 때와 유사하게 '()=> 메서드_객체'
형태의 함수를 입력하는 용도이다. 다음 코드는 useMemo와 useImperativeHandle 훅의 코드 사용법이 유사하다는 것을 보여준다.
```typescript jsx
const object= useMemo(()=>({}),[])
const handle= useImperativeHandle(ref, ()=>({}),[])
```
그런데 첫 번째 매개변수인 ref는 forwardRef 함수를 호출해 얻은 값을 사용해야 한다. 이는 useImperativeHandle 훅은 다른 훅과 달리 앞서 만든
Input 같은 컴포넌트 내부에서만 사용해야 한다는 것을 의미한다. 이제 ValidatableInput 컴포넌트를 구현해 보면서 useImperativeHandle 훅의 사용법을 알아보겠다.


### 🕸️ ValidatableInput 컴포넌트 만들기
먼저  src/theme/daisyui 디렉터링 ValidatableInput.tsx 파일을 만들고 코드를 작성한다.

ValidatableInput 컴포넌트가 ValidatableInputMethods 라는 타입을 내보낸 것을 다음처럼 가져왔다고 생각하겠다.

```typescript jsx
import type {ValidatableInputMethods} from "../theme/daisyui";
```
이대 HTMLInputElement가 아닌 ValidatableInputMethods 타입에 대해 useRef 훅의 타입 변수를 설정한다.
```typescript jsx
const methodsRef = useRef<ValidatableInputMethods>(null)
```
그리고 ValidatableInput 컴포넌트의 ref에 이 methodsRef를 설정한다.

```typescript jsx
<ValidatableInput type={"email"} ref={methodsRef} className={"input input-primary"} />
```

ValidatableInputMethods 는 `<input>` 에 입력된 이메일 주소가 유효하면 [true, `<input>`의_value_속성값]을 반환하지만,
유효하지 않으면 [false, '틀린 이메일 주소이다']와 같은 오류 메시지를 반환하는 튜플 타입이다.  
이렇게 ValidatableInputMethods 타입에 validate 메서드를 추가하면 useImperativeHandle 훅의 두 번째 매개변수도 다음처럼 validate 메서드가 있는
객체를 반환해 준다. 이제 남은 문제는 valid 변숫값이 true인지 false 인지 결정하는 코드를 작성하는 것이다.  
그런데 현재는 `<ValidatableInput type={"email"}>`형태로 이메일 주소 검증만 하므로 유효성은 type 속성값이 email일 때만 판별해야 한다. 따라서
설정된 type값을 알 수 있도록 코드를 수정해야 한다.  
지금까지 내용을 바탕으로 이메일용 정규 표현식을 적용해 이메일 형식이 바른지 판별하는 컴포넌트를 작성하겠다. 그리고 index.ts 에 컴포넌트를 반영한다.

마지막으로 src/pages/ValidatableInputTest.tsx 파일에 코드를 작성한다. 코드를 실행하면 이메일이 주소 형식에 맞는지 판별해서 알려준다.





































