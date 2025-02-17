# 02-3 컴포넌트 이해하기
컴포넌트는 가상 DOM, JSX와 함께 리액트의 핵심 기능이다. 그런데 리액트 컴포넌트는 두 종류로 클래스 컴포넌트와 함수 컴포넌트가 있다.<br>
이 절에서는 리액트 컴포넌트의 기본 개념과 두 종류의 컴포넌트 구현 방법을 알아보겠다.

## 🎈컴포넌트란?
컴포넌트(component)는 객체지향 언어의 원조인 스몰토크(Smalltalk)에서 유래한 매우 오래된 용어이다. 스몰토크의 컴포넌트는 화면 UI를 처리하는 클래스를 의미한다.
스몰토크 설계 이론에 따르면 컴포넌트는 모델-뷰-컨트롤러(MVC) 설계 지침에 따라 구현된 클래스여야 한다.<br>
리액트에서 컴포넌트 또한 스몰토크의 컴포넌트와 개념적으로 같다. 다만 리액트는 16.8 버전 이후 리액트 훅(react hooks)라는 새로운 메커니즘을 고안해 내면서 
객체지향 언어에서 의미하는 클래스가 아니라 단숙한 함수 형태로도 컴포넌트를 구현할 수 있게 되었다. 또한 리액트 팀은 가능한 함수 컴포넌트와 리액트 훅을 사용하라고 권한다.

## 🎈리액트 컴포넌트와 사용자 컴포넌트
리액트 컴포넌트라는 용어는 구체적으로 리액트 프레임워크가 제공하는 리액트 제공 컴포넌트(리액트 컴포넌트)와 사용자가 구현하는 사용자 정의 컴포넌트(상요자 컴포넌트)라는 2가지 의미를 포함한다.
리액트 컴포넌트의 이름은 div, h1 처럼 첫 글자를 소문자로 시작하는 반면, 사용자 컴포넌트의 이름은 MyComponent 처럼 첫 글자를 대문자로 시작하는 파스칼 표기법을 따른다.

### 🕸️리액트 컴포넌트
리액트는 각 태그에 대응하는 리액트 컴포넌트를 제공한다. 다음 JSX 문에서 h1은 HTML 태그가 아니라 리액트 프레임워크가 제공하는 h1 컴포넌트이다.
```typescript jsx
const h1 = <h1>Hello world!</h1>
```
그런데 리액트가 제공하는 컴포넌트를 React.createElement 로 생성할 때는 컴포넌트 타임에 'h1'과 같은 문자열을 입력해야 한다.
```typescript jsx
const h1 = React.createElement('h1',null,'hello world!')
```

### 🕸️사용자 컴포넌트
앞서 살펴본 React.createElement 함수 선언문을 다시한번 보겠다. 이 선언문은 첫 번째 매개변수인 type의 타입이 string일 수도 있지만 FunctionComponent<P> 또는
ComponentClass<P> 타입일 수도 있다.
```typescript jsx
function createElement<P extends {}>(
    type: FunctionComponent<P> | ComponentClass<P> | string,
    props?: Attributes & P | null,
...children: ReactNode[]
): FunctionComponentElement<P>;
```
리액트에서 함수 방식 컴포넌트의 타입은 FunctionComponent<P> 이고 클래스 방식 컴포넌트의 타입은 ComponentClass<P>이다. 
여기서 타입 변수 P는 Property의 머리글자로서, 속성은 잠시 후에 알아보겠다.

### 🕸️사용자 컴포넌트는 왜 구현하는가?
"사용자 컴포넌트를 왜 구현해야하는가?" 에 대한 해답을 찾기 위해서 앞서 02-2절의 src/index.tsx 코드를 가져오겠다. 아래 코드에서 주목할 부분은 이 부분 때문에 파일 내용이 복잡해 보인다는 것이다.
```typescript jsx
const virtualDOM = (
    <ul>
        <li>
            <a href="http://www.google.com" target="_blank">
                <p>go to google</p>
            </a>
        </li>
    </ul>
)
```
이 코드를 src/App.tsx 파일로 옮기겠다. 리액트에서는 이런 형태의 컴포넌트를 함수 컴포넌트라고 한다. 자세한 설명은 잠시 후에 하겠다.
코드를 옮기고 나면 index.tsx는 매우 간결해진다. 즉, 복잡한 JSX 부분을 App과 같은 새로운 컴포넌트 쪽에 옮겨 구현하면 App을 사용하는 쪽 코드(index.tsx)를 단순화할 수 있다.

## 🎈클래스 컴포넌트 만들기
리액트에서 컴포넌트는 클래스 기반 컴포넌트와 함수형 컴포넌트가 있다. 먼저 클래스 기반 컴포넌트를 구현하는 방법을 알아보겠다.
리액트에서 클래스 컴포넌트는 반드시 react 패키지가 제공하는 Component 클래스를 상속해야 한다.

```typescript jsx
import React, {Component} from "react";
export default class ClassComponent extends Comment {}
```

그리고 Component 를 상속한 클래스 컴포넌트는 render 라는 이름의 메서드를 포함해야 하며, render 메서드는 null 이나 React.createElement 호출로 얻은 반환값, 
또는 JSX 문 등으로 가상 DOM 객체를 반환해야 한다. 여기서 null 은 반환할 가상 DOM 객체가 없다는 의미이다.<br>
아래 코드는 클래스 컴포넌트를 컴파일 오류만 나지 않도록 가장 간소하게 구현한 예이다.

```typescript jsx
import {Component, Coponent} from "react";

export default class ClassComponent extends Component {
    render() {return null}
}
```

### 🕸️App.tsx 를 클래스 컴포넌트 방식으로 구현하기

### 🕸️JSX 구문만으로는 부족한 로직 추가하기
컴포넌트 개념을 도임하면 render 메서드에 JSX 구문뿐만 아니라 다양한 로직을 타입스크립트 코드와 함께 구현할 수 있다.
ch02_2에서 배열에 컴포넌트를 담아서 화면을 구성할 때 "식이 필요합니다" 라는 오류 메시지를 봤다. 이 오류를 어떻게 해결하는지 보겠다.<br>
App.tsx 의 63,64행은 JSX 구문이 아니라 일반적인 타입스크립트 코드이다. 이처럼 타입스크립트 코드와 JSX 구문을 함께 사용할 수 있게 하는 것이 사용자 컴포넌트를 제작하는 다른 이유이다.<br>
이 코드의 또 다른 구현 방법은 단축 평가(short circuit)형태로 구현하는 것이다. App.tsx의 93, 94행을 단축평가를 사용해서 구현했다.<br>
마지막으로 또 다른 방법은 JSX 문은 결국 React.createElement 호출의 반환값이므로 앞선 2가지 방법을 결함하여 isLoading값에 따라 분기하는 JSX 문 2개를 children 같은 변수에 담아 해결하는 것이다.<br>
이번엔 App 컴포넌트에서 render 부분의 110~114행 내용을 ClassComponent 라는 사용자 컴포넌트로 만들어 옮겨 보겠다.
src 디렉터리에 ClassComponent.tsx 파일을 생성하고 코드를 작성한다. 그리고 src/App.tsx 파일을 열고 ClassComponent를 사용하는 형태로 수정한다.
해당 코드는 앞서 작성한 ClassComponent를 2번 사용한다. 실행 결과를 보면 go to Google 링크가 2번 나타난다.<br>
그런데 만약 ClassComponent를 사용하는 쪽 코드를 다음처럼 구현할 수 있다면 좀 더 융통성있을 것이다(App.tsx 140~151행). 리액트 프레임워크는 사용자 컴포넌트를 이처럼 구현할 수 있게 하는 '속성' 이라는 기능을 제공한다.
ClassComponent 에 속성을 구현하여 이 코드가 정상으로 동작하도록 해보겠다.

### 🕸️속성이란?
객체지향 프로그래밍에서 속성은 클래스의 멤버 변수를 의미한다. 컴포넌트 또한 화면 UI를 담당하는 클래스이므로 속성을 가질 수 있따. 그리고 클래스의 속성은 그 값이 수시로 바뀔 수 있다. 
이처럼 수시로 값이 바뀔 수 있는 것을 가변(mutable)하다 라고 한다. 값이 바뀌지 않는 것을 불변(immutable)하다고 한다. 그런데 리액트 프레임워크에서 속성은 객체지향 언어의 속성과는 다른 부분이 있어서 주의가 필요하다.<br>
리액트에서 속성은 부모 컴포넌트가 자식 컴포넌트 쪽에 정보를 전달하는 목적으로 사용된다. 앞서 부모 컴포넌트 App은 자식 컴포넌트인 ClassComponent에 href와 text라는 2개의 정보를 전달했다.<br>
React.createElement의 함수 선언문을 다시 살펴보겠다. 
```typescript jsx
function createElement<P extends {}>(
    type: FunctionComponent<P>| ComponentClass<P> | string,
    props?: Attributes & P | null,
...children: ReactNode[]
): FunctionComponentElement<P>;
```
두 번째 매개변수 props는 properties, 속성을 의미한다. 그런데 선언문에서 속성 P는 {}를 확장한다는 타입 제약이 걸려있는데, 이는 리액트 속성은 객체여야 함을 의미한다.
또한 props 뒤에 ? 기호가 붙었으므로 선택 속성이다. 즉, 컴포넌트의 속성은 없어도 된다는 의미이다.<br>
리액트에서 속성은 부모 컴포넌트에서 자식 컴포넌트 쪽으로 전달되는 객체 타입의 데이터를 의미한다. 또한 리액트에서의 속성은 값이 변하면 해당 컴포넌트를 다시 렌더링하여 수정된 속성값을 화면에 반영하는 기능도 한다.
즉, <b>리액트 컴포넌트 관점에서 속성은 객체지향 프로그래밍의 속성 + 재렌더링을 의미하는 객체 타입 변수<b>이다.

### 🕸️JSX 속성 설정 구문
JSX는 XML이므로 모든 속성은 작은따옴표로 감싸야 된다. 즉, XML 관점에서 속성은 모두 string 타입이다. 속성은 XML과 같은 마크업 언어에서는 'attribute', 타입스크립트 같은 프로그래밍언어에서는 'property'를 의미한다.<br>
JSX는 XML을 확장한 것이므로 문자열은 ''로 값을 설정하고, age 같은 number 타입 문자열은 {}로 감싸야 된다.
```typescript jsx
<Person name={'jack'} age={22}/>
```
또한 속성 설정값이 객체이면 아래와 같이 작성해야 된다. 이때 안쪽 {}은 객체를 만드는 구문이고 바깥쪽 {}는 JSX 구문이다.
```typescript jsx
<Person person={{name:'Jack', age:32}}/>
```

### 🕸️ClassComponent에 속성 구현하기
App.tsx 에서는 다음 형태로 정보 2개를 전달했다.
```typescript jsx
<ClassComponent href={'http://www.google.com'} text={'go to Google'} />
```
하지만 리액트 관점에서는 href, text가 유효한 속성 이름인지 알 수 없다. 그래서 리액트는 Component 타입에 속성 이름과 타입을 기입한 Props와 같은 속성 타입을 새로 만들어 넘겨 줄 것을 요구한다.
앞서 컴포넌트의 속성은 객체 타입이어야 한다는 타입 제약이 있다고 했는데, 다음 코드에서 Props는 타입스크립트에서 객체 타입을 만들 때 사용하는 type 키워드로 Props라는 이름의 객체 타입을 만들었으므로 이 조건에 만족한다.

```typescript jsx
import {Component, PureComponent} from 'react'

type ClassComponentProps = {
    href: string
    text: string
}
export default class ClassComponent extends Component<ClassComponentProps>  {
    render() { return null}
}
```
클래스 컴포넌트가 이렇게 구현되었으면 아래 코드에서 보듯 내부에스는 this.props 형태로 외부에서 넘어온 속성을 사용할 수 있다.

```typescript jsx
export default class ClassComponent extends Component<ClassComponentProps> {
    render() {
        const href = this.props.href
        const text = this.props.text
        return null
    }
}
```
이러한 방식으로 ClassComponent.tsx 파일을 최종적으로 구현한다.

## 🎈함수 컴포넌트 만들기

```typescript jsx
import {Component} from "react";

export default class App extends Component {
    render() {
        return <h1>class component</h1>
    }
}
```
위의 코드는 클래스 방식의 App 컴포넌트 코드를 단순화한 것이다. 이 코드는 사실 render 메서드만 의미가 있고 나머지 코드는 render 메서드를 구현하기 위한 문법을 갖추는 코드이다.<br>
리액트 개발 팀은 이에 주목하여 클래스 컴포넌트의 render 메서드 부분을 다음처럼 간단히 함수로 만들 수 있게 했고, 이를 클래스 방식 컴포넌트와 구분해서 함수형 컴포넌트라고 이름 붙였다.

```typescript jsx
export default function App() {
    return <h1>function component</h1>
}
```
타입스크립트에서 함수를 만드는 구문은 2가지인데, 하나는 function 키워드로 만드는 방법이고 나머지 하나는 화살표 기호=>를 사용해서 만든느 방법이다.

### 🕸️function 키워드 방식 함수 컴포넌트 만들기
클래스 컴포넌트의 역할은 render 메서드를 통해 리액트 프레임워크가 가상 DOM 객체를 생성하여 전달하는 것이다. 함수 컴포넌트 또한 자신의 반환값으로 가상 DOM 객체를 생성하여 전달한다.<br>
아래 코드는 function 키워드로 함수 컴포넌트를 작성한 뒤 <div> 요소를 JSX 구문으로 반환하고 있다. 코드가 클래스 컴포넌트보다 훨씬 간결해졌다.
이런 장점 때문에 함수 컴포넌트를 선호한다.
```typescript jsx
export default function App() {
    return <div>hello funcion-keyword component</div>
}
```

### 🕸️화살표 방식 함수 컴포넌트 만들기
타입스크립트의 화살표 함수는 이름을 가질 수 없는 익명 함수 이다. 따라서 아래 코드에서처럼 App이라는 변수에 익명 함수를 설정하는 방식으로 구현해야 한다.
그런데 타입스크립트 문법은 첫번째 행과 같은 형태는 export default 를 붙이지 못하므로 마지막 행이 필요하다.
```typescript jsx
const App =()=> {
    return <h1>function component</h1>
}
export default App
```

### 🕸️함수 컴포넌트의 타입
앞서 살펴본 React.createElement 선언문의 첫 번째 매개변수인 type의 타입은 FunctionComponent<P>, ClassComponent<P>, string 중 하나이다.
여기서 함수 컴포넌트의 타입은 FunctionComponent<P> 이다. 그런데 FunctionComponent 라는 이름이 너무 길어서 FC라는 이름의 타입을 제공한다.
결국 함수 컴포넌트의 타입은 FC<P> 이다.

### 🕸️화살표 함수 방식으로 동작하는 ArrowComponent 구현하기
src/ArrowComponent.tsx를 생성하고 코드를 작성한다. 앞서 작성한 ClassComponent와의 차이점은 함수 몸통이 render 메서드 역할을 한다는 것과 
속성을 this.props가 아니라 함수의 매개변수로 얻는다는 점이 다르다.<br>
이어서 src/App.tsx에 코드를 작성한다. function 키워드 방식으로 App 컴포넌트를 구현했으며 ArrowComponent를 사용한다.