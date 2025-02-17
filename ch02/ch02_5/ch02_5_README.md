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
