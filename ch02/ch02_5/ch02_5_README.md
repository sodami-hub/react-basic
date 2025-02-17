# 02-5 이벤트 속성 이해하기
모든 HTML 요소는 onmouseenter, onmouseover 처럼 'on'으로 시작하는 속성을 제공한다. 이를 이벤트 속성(event property)라고 한다. 
<br>
src/copy 디렉터리를 만들고 sr/copy/CopyMe.tsx 파일을 만들어서 간단한 메서드를 작성한다. 
그리고 src 디렉터리에 pages라는 디렉터리를 만들고 CopyMe.tsx 파일을 이름을 바꿔 11개 파일로 복사한다.
<br>
src/App.tsx 파일을 열고 코드를 작성한다. 이 코드에서는 src/pages 디렉터리의 11개 컴포넌트를 사용한다.
이번 절은 EventListener 부터 역순으로 올라가면서 FileDrop 컴포넌트까지 차례로 구현하는 방식으로 진행하겠다.

## 🎈이벤트란?
리액트를 비롯해 화면 UI를 다루는 모든 프레임워크는 사용자가 화면 UI에서 버튼을 누르거나 텍스트를 입력하는 등의 행위가 발생하면 이를 화면 UI를 구현한 코드 쪽에 알려 줘야 한다.
이처럼 사용자 행위가 일어날 때 '이벤트가 발생했다'고 표현한다.

### 🕸Event 타입
웹 브라우저의 자바스크립트 엔진은 Event 타입을 제공한다. 아래 표는 Event의 주요 속성과 의미를 정리한 것이다.

<img src="../../images/02-10.jpg" alt="" width="700">

다음 코드는 이름이 click(type 속성값이 'click')인 Event 객체를 생성하는 예이다. 이렇게 생성된 Event 타입 객체를 어떻게 처리하는지 알아보겠다.

```typescript
new Event('click',{ bubbles:true})
```

### 🕸️EventTarget 타입
모든 HTML 요소는 HTMLElement 상속 타입을 가진다고 했다. 모든 HTML 요소는 EventTarget 타입이 정의하는 속성과 메서드를 포함하고 있다.
물론 브라우저 객체 모델의 Window 타입도 EventTarget 에서 상속하는 타입니다.

<img src="../../images/02-06.jpg" alt="" width="300">

### 🕸️이벤트 처리기
EventTarget 은 addEventListener, removeEventListener, dispatchEvent 라는 메서드를 제공한다. 
addEventListener 메서드는 '이벤트를 듣는다'라는 의미로 콜백 함수를 메커니즘으로 사용한다. 이 이벤트를 기다리는 콜백 함수는 좀 더 간결하게
이벤트 처리기(event handler)라고 한다.<br>
이벤트 처리기는 이벤트가 발생할 때까지 기다리다가 이벤트가 발생하면 해당 이벤트를 코드 쪽으로 알려주는 역할을 한다.
'add'의 의미까지 같이 생각하면 addEventListener 메서드는 이벤트 처리기를 추가한다는 의미이며, 하나의 이벤트에 이벤트 처리기를 여러개 부착할 수 있다.
```
[addEventListener 사용법]
DOM_객체.addEventListner(이벤트_이름: string, 콜백_함수: (e: Event)=>void)
```
브라우저 객체 모델의 window 객체는 Window 타입이고 Window 타입은 EventTarget 타입을 상속한다.
즉, window 객체는 addEventListener 메서드를 제공하므로 코드를 다음처럼 작성 할 수 있다.
```typescript
window.addEventListener('click',(e:Event)=>console.log('mouse click occurs.'))
```
또한 리액트 프로젝트는 항상 public 디렉터리의 index.html 파일에 <div id='root'> 태그를 포함하고 있으므로 다음과 같이 작성할 수 있다.
```typescript
document.getElementById('root')?.addEventListener('click',(e:Event)=>{
    const {isTrusted, target, bubbles} =e
    console.log('mouse click occurs.', isTrusted, target,bubbles)
})
```
이 코드에서 타입스크립트의 옵셔널 체이닝 연산자 ?. 를 사용하는데, 이는 getElementById 메서드가 null값을 반환할 수 있기 때문이다.
값이 null이면 옵셔널 체이닝 연산자는 addEventListener를 호출하지 않는다.

이제 src/pages 디렉터리의 EventListener.tsx 파일에 코드를 작성한다.<br>

브라우저를 새로고침하고 EventListener 텍스트를 클릭하면 개발자 도구의 콘솔 창에 이벤트 내용이 출력된다.
![img.png](../../images/02-11.png)
click 이벤트는 브라우전에서 발생했으므로 isTrusted 속성값은 true, 마우스 클릭이 발생한 이벤트가 <div>EventListner<div> 에서 일어났으므로 target은 div 요소가 되며,
bubbles 는 true 임을 알려준다.

## 🎈물리 DOM 객체의 이벤트 속성
addEventListener 메서드는 사용법이 조금 번거롭다. 이 때문에 window를 포함한 대부분의 HTML 요소는 onclick 처럼 'on' 뒤에 이벤트 이름을 붙인 속성을 제공한다.
이벤트 속성은 add EventListener의 사용법을 간결하게 하는 것이 목적이므로 이벤트 속성값에는 항상 이벤트 처리기를 설정해야 한다.<br>
앞선 코드를 onclick 이벤트 속성으로 다시 구현한 예이다.
```typescript
window.onclick=(e:Event) =>console.log('mouse click occurs.')
```
또한 <div id='root'> 에서 DOM 객체의 onclick 속성값을 다음처럼 구현할 수도 있다. 
```typescript
const rootDiv = document.getElementById('root')
if (rootDiv) {
    rootDiv.onclick=(e:Event)=>console.log('mouse click occurs.')
    
}
```
이제 src/pages 디렉터리의 OnClick.tsx 파일을 열고 코드를 작성한다.<br>
웹 브라우저에서 OnClick 텍스트를 마우스로 클릭하면 10행의 내용은 출력이 되지만 5행의 내용은 출력되지 않는다.
이는 addEventListener와 달리 OnClick은 가장 마지막에 설정된 콜백 함수를 호출한다는 것을 의미한다.<br><br>

지금까지 리액트와 상관없는 물리 DOM 객체를 대상으로 한 이벤트 처리 방법을 살펴보았다.
이제 리액트 방식으로 이벤트를 처리하는 방법을 알아보겠다.

## 🎈리액트 프레임워크의 이벤트 속성
리액트 컴포넌트도 on이벤트명 형태로 된 HTML 요소의 이벤트 속성들을 제공한다. 그런데 한 가지 큰 차이는 HTML 요소의 이벤트 속성은 모두 소문자지만, 
리액트 코어 컴포넌트의 속성은 onClick, onMouseEnter 처럼 카멜 표기법을 사용한다.<br>
그리고 리액트 컴포넌트의 이벤트 속성에 설정하는 콜백 함수는 매개변수 e의 타입이 Event가 아니라 리액트가 제공하는 SyntheticEvent 타입을 설정해야 한다.
SyntheticEvent 의 정의를 찾아보면 다음과 같다.
```typescript
interface SyntheticEvent<T = Element, E = Event> 
    extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {}
```
SyntheticEvent 는 BaseSyntheticEvent 를 상속하는 타입으로서, BaseSyntheticEvent 의 주요 내용만 추리면 다음과 같다.
```typescript
interface BaseSyntheticEvent<E=object, C=any, T=any> {
    nativeEvent: E;
    currentTarget: C;
    target: T;
    preventDefault(): void;
    stopPropagation(): void;
}
```
리액트는 물리 DOM에서 일어나는 이벤트를 네이티브 이벤트라고 한다. 
nativeEvent 속성은 물리 DOM에서 발생하는 Event의 세부 타입인 PointerEvent와 같은 이벤트 객체를 저장하는데 사용한다.
currentTarget 속성은 이벤트 버블링 과정에서 현재 이벤트를 수신한 DOM 객체를 알고 싶을 때 사용하며, 
target 속성은 이벤트를 처음 발생시킨 DOM 객체를 알고 싶을 때 사용한다.<br>
src/pages/ReactOnClick.tsx 파일에 코드를 작성하겠다. 프로젝트를 실행하고 Click Me 버튼을 클릭하면 콘솔창에 이벤트 내용이 출력된다.
물리 DOM 의 이벤트 처리와 크게 다르지 않다.

### 🕸 EventTarget 의 dispatchEvent 메서드️
DOM의 최상위 타입인 EventTarget은 다음과 같은 dispatchEvent 메서드를 제공한다.
```typescript
dispatchEvent(event: Event):boolean;
```
앞서 Event 타입 객체를 다음처럼 만들 수 있다고 했다.
```typescript
new Event('click',{ bubbles:true})
```
이렇게 생성된 Event 타입 객체는 다음처럼 Event나 SyntheticEvent의 target 속성값이 되는 타깃_DOM_객체의 dispatchEvent 메서드를 호출하여 이벤트를 발생시킬 수 있다.
```typescript
타깃_DOM_객체.dispatchEvent(new Event('click'),{bubbles:true})
```
그리고 다음 코드는 앞의 코드와 완전히 똑같이 동작한다. 이는 click 메서드가 dispatchEvent 코드로 구현되었음을 짐작하게 한다.
```typescript
타깃_DOM_객체.click()
```
src/pages/DispatchEvent.tsx 에 코드를 작성한다. 웹 브라우저에 실행 결과가 출력되면 작성한 버튼을 클릭해서 콘솔 창을 확인한다.
dispatcherEvent와 click 메서드로 발생한 이벤트는 isTrusted값이 false인 것을 볼 수 있다. 즉 이 메서드들은 웹 브라우저에서 발생한 이벤트가 아닌 코드상에서 이벤트를 발생시켜주는 것이다.

### 🕸️이벤트 버블링
이벤트 버블링(event bubbling)이란 자식 요소에서 발생한 이벤트가 가까운 부모 요소에서 가장 먼 부모요소까지 계속 전달되는 현상을 의미한다.<br>
src/pages/EventBubbling.tsx 파일에 코드를 작성한다. 이 코드는 Event의 target은 물로 currentTarget 속성까지 출력한다.<br>
Click Me 버튼을 클릭하면, 27행에 부착된 onClick 이벤트가 25행에 부착된 onClick 이벤트 처리기 까지 전달된다.
target 값은 button 이지만 currentTarget 값은 div 로 서로 다르다는 것을 확인할 수 있다. currentTarget은 이벤트의 현재 대상, 
즉 이벤트 버블링 중 현재 이벤트가 위치한 객체를 가리킨다.

### 🕸️stopPropagation 메서드와 이벤트 전파 막기
이번트 버블링은 간혹 중단하고 싶을 때가 있다. 이때 SyntheticEvent의 부모인 BaseSyntheticEvent 타입이 제공하는 stopPropagation 메서드를 사용한다.
이 메서드는 이벤트가 전파되는 것을 멈춘다. 이를 이벤트 전파 막기라고 한다.<br>
StopPropagation.tsx 파일을 열고 코드를 작성한다. 코드를 실행하고 버튼을 클릭해보면 button이 stopPropagation을 호출하여 이벤트가 전파되는 것을 막는 것을 확인할 수 있다.

## 🎈 input 요소의 이벤트
input은 button과 함께 이벤트 처리기를 빈번하게 작성해야 하는 대표 요소이다. 그런데 input은 type 속성값에 따라 화면에 나타나는 모습과 
사용자 입력을 얻는 방법이 조금 다르다.<br>
VariousInputs.tsx 파일을 열고 코드를 작성한다. 이 코드에서는 이벤트 처리 부분을 구현했지만 type 속성값을 다양하게 설정했다.

##### ✨tip - button , input type="button" 의 차이
두가지 모두 click 이벤트를 발생시킨다 그러나 button은 아래와 같이 자식 요소를 가질 수 있지만, 
```html
<button><span>Button</span></button>
```
  
input 은 자식 요소를 가질 수 없다.

### 🕸️ input 의 onChange 이벤트 속성
input 요소에 마우스 클릭이 일어나면 button과 마찬가지로 click 이벤트가 발생한다. 그런데 만약 사용자의 입력이 텍스트라면 change 이벤트가 발생하며,
이 change 이벤트는 onChange 이벤트 속성으로 얻을 수 잇다.
다음은 제네릭 타입 ChangeEvent의 선언문으로 SyntheticEvent에 target이란 이름의 속성을 추가한 타입임을 알 수 있다. 
여기서 타입 변수는 HTMLElement나 HTMLInputElement와 같은 DOM 타입이어야 한다.

```typescript
interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
}
```
다음 코드는 input 의 onChange 이벤트 속성에 onChange 라는 이름의 이벤트 처리기를 설정했는데,
이벤트 처리기의 매개변수 e의 타입을 `ChangeEvent<HTMLInputElement>`로 설정했다.
이 코드에 따라 HTMLInputElement 타입의 물리 DOM 객체 값을 e.target 형태로 얻을 수 있다.
```typescript jsx
import type {ChangeEvent} from 'react'

export default function OnChange() {
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log('onChange', e.target.value)
    }
    return <input type="text" onChange={onChange}/>
}
```

### 🕸️ `<input>` 요소의 이벤트 관련 속성들
input 요소의 정의 내용을 살펴보면 `<input>` 요소가 제공하는 속성들은 'React.InputHTMLAttributes<HTMLInputElement>'형태로 얻을 수 있다는 것을 알 수 있다.<br>
그리고 'InputHTMLAttributes<T>'의 속성 가운데 onChange 이벤트와 관련된 속성을 보면 type 속성값이 'checkbox'이거나 'radio' 이면 checked 속성값으로, 
'text','email','password','range' 이면 value 속성값으로, 'file'이면 files 속성값으로 사용자가 입력한 구체적인 내용을 얻을 수 있다.

### 🕸️ `<input>` 의 defaultValue와 defaultChecked 속성
`<input>` 요소는 value와 checked 속성 외에 defaultValue와 defaultChecked 속성도 제공한다. value와 checked 는 사용자가 `<input>`에 입력한 값을 얻을 때 사용하고,
defaultValue와 defaultChecked는 어떤 초깃값을 설정하고 싶을 때 사용한다.<br>
다음은 코드의 초깃값 "Hello"를 defaultValue가 아닌 value 속성에 설정한 예이다.
```html
<input type="text" value="Hello"/>
```
이렇게 하면 콘솔 창에는 경고 메시지가 나타난다. 이 경고 메시지는 value 대신 초깃값을 설정하는 용도로 제공하는 defaultValue를 사용하면 없앨 수 있다.

### 🕸️OnChange 컴포넌트 구현하기
지금까지의 내용을 바탕으로 src/pages/OnChange.tsx 파일을 열고 코들르 작성한다. 코드는 `<input>`의 type 설정값이 'text' 종류일 때는 e.target.value,
'checkbox' 종류일 때는 e.target.checked, 'file' 종류일 때는 e.target.files 형태로 사용자가 입력한 내용을 얻는다.<br>
웹 브라우저에 실행 결과가 출력되면 input 값을 바꿔본다. 콘솔 창에 `<input>`의 type 유형에 따라서 속성값이 출력된다.

##### ✨tip - multiple과 accept속성
`<input>` type의 값이 file 일때는 multiple 과 accept 속성을 사용할 수 있다. multiple의 기본값은 false이고 사용자는 1개의 파일을 선택할 수 있지만,
true로 하면 여러개의 파일을 동시에 선택할 수 있다.<br>
accept 속성은 사용자가 선택할 수 있는 파일 확장자를 제한하는 데 사용한다. 예를 들어 "image/*"로 설정하면 이미지 파일로 제한하고, 
"text/plain"으로 설정하면 텍스트 파일로 제한한다.

### 🕸️ `<input type ="file">`에서의 onChange 이벤트 처리
`<input>`의 type속성값이 'file' 일 때 change 이벤트가 발생한다. 이 이벤트는 다음처럼 e.target.files 속성값으로 사용자가 선택한 파일 목록을 얻을 수 있다.
e.target.files 속성의 타입은 Filelist이며 리액트가 아니라 웹 브라우저의 자바스크립트 엔진이 제공한다.
```javascript
interface FileList {
    readonly length: number;
    item(index: number): File | null;
    [index: number]: File;
}
```
FileList의 item과 인덱스 연산자 []는 다음처럼 File 타입 속성값을 얻을 수 있도록 고안되었다.
```javascript
const files:FileList | null = e.target.files
if (files) {
    for(let i=0;i<files.length; i++) {
        const file: File| null = files.item(i)
        console.log(`file[${i}]:`, file)
    }
}
```
또한 자바스크립트 엔지은 Blob 타입과 Blob 타입을 확장한 File 타입도 제공한다.<br>
이제 FileInput.tsx 파일에 코드를 작성한다. 작성을 완료하고 웹 브라우저를 새로고침한다.
FileInput 아래에 있는 '파일 선택'을 눌러 아무 파일이나 선택하면, 콘솔 창에 File 타입 데이터의 세부 내용이 출력된다.

## 🎈드래그 앤 드롭 이벤트 처리
모든 HTMLElement 상속 요소는 draggable 이라는 boolean 타입 속성을 제공한다. 다음 코드는 `<h1>`요소에 draggable 속성값을 설정한 예이다.
```html
<h1 draggable=true>Drag Me<h1>
```
HTML 요소에 draggable을 설정하면 드래그 앤 드롭 관련 이벤트가 발생한다. 다음은 드래그 앤 드롭과 관련된 이베트이다. 이 드래그 앤 드롭과 관련되 이벤트 처리기들은 DragEvent 타입을 매개변수의 타입으로 사용한다.

<img src="../../images/02-12.jpg" alt="" width="600">

리액트는 드래그 앤 드롭 효과와 관련하여 DragEvent 타입을 제공한다. DragEvent 타입에서 가장 중요한 속성은 dataTransfer 이다.<br>
dataTransfer 속성은 DataTransfer 타입을 가지는데, 파일을 드롭했을 때는 files 속성으로 드롭한 파일의 정보를 알 수 있다.<br>
그런데 드래그 앤 드롭 이벤트를 처리하려면 EventTarget 타입이 제공하는 preventDefault 메서드를 알아야 한다. 이 메서드는 어떤 사용자 액션에 따라 이벤트가 발생 했을 때
이 이벤트와 관련된 ***웹 브라우저의 기본 구현 내용을 실행하지 않게 한다.***<br>
웹 브라우저는 기본으로 drop 이벤트가 발생하지 않도록 설계되었다. 이에 따라 drop 이벤트가 발생하려면 다음처럼 dragover 이벤트 처리기에서 preventDefault 메서드를 호출해야 한다.

```typescript
const onDragOver = (e: DragEvent) {
    e.preventDefault()
}
```
또한 onDrop 처리기에도 preventDefault 메서드를 호출해 주는 것이 좋다. 만일 파일을 드롭할 때 웹 브라우저는 드롭한 파일을 새로운 창을 열어 보여주기 때문이다.

### 🕸️DragDrop 컴포넌트 구현하기
DragDrop.tsx 파일을 열고 코드를 작성한다. 이 코드는 draggable 속성값이 설정된 `<div>`에는 onDragStart와 onDragEnd를,
무엇인가 데이터를 드롭받을 `<div>`에는 onDragOver와 onDrop 이벤트 처리기를 설정한다.<br>
웹 브라우저에 실행 결과가 출력되면 drag Me 를 드래그 하면서 콘솔창의 메시지를 확인할 수 있다.

### 🕸️FileDrop 컴포넌트 구현하기
FileDrop.tsx 파일을 열고 코드를 작성한다. 파일이 웹 브라우저 바깥에서 안쪽으로 떨어지므로 `<div draggable>`과 같은 요소는 필요 없다.
다만 onDrop이 호출되도록 onDragOver에 preventDefault 메서드 호출이 필요하다. 코드에서 8행은 FileInput 컴포넌트와 비교해 보면 FileInput은 e.target.files로 files 객체를 얻지만,
FileDrop은 드롭한 파일을 가져와야 하므로 e.dataTransfer.files에서 files 객체를 얻는다는 차이만 있다.<br>
웹 브라우저에 실행 결과가 출력되면 이미지 파일 2개를 끌어다가 drop image files... 위치에 놓는다. 그러면 콘솔 창에 onDrop 이벤트가 처리되어 파일 정보가 출력되는 것을 확인할 수 있다.

