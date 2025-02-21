# 02-4 key와 children 속성 이해하기
모든 리액트 컴포넌트는 key와 ref라는 속성을 포함하고 있다. 그리고 children이라는 속성을 선택적으로 포함한다. key,ref,children 속성은 리액트에서 특별한 의미가 있다.
먼저 key, children 속성을 알아보고 ref는 4장에서 살펴보겠다.

## 🎈key 속성 설정하기
리액트는 `<p>`와 같은 리액트 컴포넌트뿐 아니라 사용자 컴포넌트에도 key 속성을 제공한다. 리액트가 key 속성을 왜 제공하는지 이해하기위해서 src/App.tsx파일을 작성한다.
```typescript jsx
export default function App() {
    const texts = [<p>hello</p>, <p>world</p>]
    return <div>{texts}</div>
}
```
코드를 실행하고 개발자 도구를 열어보면 key 속성이 없다는 경고 메시지가 출력된다.<br>
이 메시지는 `<p>` 요소 2개에 서로 중복되지 않는 키값을 설정해 주면 해결할 수 있다.
```typescript jsx
export default function App() {
    const texts = [<p key={'1'}>hello</p>, <p key={'2'}>world</p>]
    return <div>{texts}</div>
}
```
다음은 key 속성의 타입이다. key 속성은 반드시 설정하지 않아도 되는 선택 속성임을 알 수 있다.
```typescript
interface Attributes {
        key?: Key | null | undefined;
    }
```
이어서 key 타입의 선언문으로 key 속성에는 문자열이나 숫자를 설정해야 된다는것을 보여준다. 앞선 App 컴포넌트에는 문자열을 설정했지만 숫자를 설정해도 된다.
```typescript
type Key = string | number | bigint;
```

key 속성은 같은 이름의 컴포넌트가 여러 개일 때 이들을 구분하려고 리액트 프레임워크가 만든 속성이다. App은 `<p>` 요소 2개를 사용하므로 이 둘을 구분하려고 key 속성값을 요구하는 것이다.<br>
key가 고유한 값을 요구하므로 앞선 코드보다는 다음처럼 데이터를 배열에 담은 뒤 map 메서드의 2번째 매개변수에서 얻을 수 있는 아이템의 인덱스값을 key값으로 설정하는 방식을 사용한다.
```typescript jsx
const useMap = ['type', 'script'].map((text, index) => <p key={index}>{text}</p>)
```

## 🎈children 속성 설정하기
모든 리액트 컴포넌트와 사용자 컴포넌트는 children 속성을 사용할 수 있다. children 속성의 타입은 값을 설정하지 않아도 되는 선택 속성이다.
```
children?: ReactNode | undefined;
```
다만 children은 `<div>` 처럼 자식 요소를 포함할 수 있는 컴포넌트만 사용할 수 있다. 즉, `<img>`, `<input>` 처럼 자식 요소를 포함할 수 없는 컴포넌트에서는 사용할 수 없다.
다음 코드는 `<p>`와 `<div>` 요소의 children 속성에 자식 요소를 설정했다.
```typescript jsx
export default function App() {}
    const useChildren = ['use', 'child'].map((text, index) => (<p key={index} children={text}></p>))
return <div children={useChildren}></div>
}
```

### 🕸컴포넌트 내부에서 children 속성 사용하기
사용자 컴포넌트에서 children 속성을 상요하는 방법을 알아보겠다. src/P.tsx를 생성하고 코드를 작성한다. 이 코드에서 children 타입이 ReactNode 였던 것을 이용한다.
이어서 src/App.tsx 파일 내용을 P 컴포넌트를 사용하는 방식으로 바꾼다.

### 🕸️JSX{...props} 구문
JSX는 다음 코드에서 보는{...props} 구문을 제공한다. 이 구문은 props에 담긴 다양한 속성을 마치 타입스크립트의 전개 연산자처름 `<p>` 에 함꺼번에 전달하는 역할을 한다.
```typescript jsx
const P:FC<PProps> = props => {
    return <p {...props}/>
}
```

### 🕸️PropsWithChildren 타입과 children 속성
PropsWithChildren 이라는 제네릭 타입을 통해서 children?: ReactNode 부분을 대체할 수 있다.

```typescript jsx
import {FC, PropsWithChildren} from "react";

export type PProps = {}
const P: FC<PropsWithChildren<PProps>> = props => {
    return <p {...props}/>
}
export default P
```
위의 코드는 앞의 코드와 같은 결과를 보여준다. 즉, 함수 컴포넌트를 정의할 때 PropsWithChildren 타입을 사용하면 Props 타입에 반복해서
children 속성을 추가할 필요가 없어지므로 코드를 좀 더 깔끔하게 유지할 수 있다.