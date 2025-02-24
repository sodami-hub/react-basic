# 03-5 daisyui CSS 컴포넌트 이해하기
프로젝트에 설치한 daisyui 플러그인의 주요 CSS 컴포넌트를 알아본다.  
이 절의 src/pages 디렉터리는 서브 디렉터리를 만드는 방식으로 구성한다. 이때 문제는 '../components' 처럼 상대 경로를 사용하면 컴파일 오류가 발생한다는 점이다.
따라서 src/copy/CopyMe.tsx 파일 내용을 수정해서 상대 경로 문제가 발생하지 않도록 한다.  
src/pages 디렉터리에 특정 컴포넌트를 구현하다 보면, 이 컴포넌트를 다시 여러 개 서브 컴포넌트로 나누어 구현할 필요가 생긴다.
이때 '컴포넌트.tsx' 파일보다는 '컴포넌트/index.tsx' 파일을 만둘고, 이 컴포넌트 디렉터리 안에 해당 컴포넌트를 구현하는 데 필요한
서브 컴포넌트 파일들을 만드는 것이 코드 관리에 유리하다.

## 🎈CSS 컴포넌트란?
03-1 에서 잠시 알아본 부트스트랩 등 거의 모든 CSS 프레임워크는 btn btn-primary 형태로 원하는 HTML 요소의 스타일링을 쉽게 하는 CSS 클래스를 제공한다.
이들 CSS 프레임워크(혹은 CSS라이브러리)를 'CSS 컴포넌트'라고 부른다.

## 🎈색상 테마
웹 디자인에서는 웹 페이지에서 가장 많이 사용되는 색상을 주 색상이라고 한다. 그런데 웹 페이지의 성격에 따라 주 색상은 각기 다를 수 있다.
그리고 두 번째로 많이 사용되는 색상을 보조 색상이라고 한다.  
그런데 색상은 주 색상과 보조 색상만으로 구분하지 않고 필요에 따라서 좀 더 다양한 색상을 사용할 수 있다. daisyui 플러그인의 색상 테마로는
강조, 정보, 경고나 오류 색상 등을 제공한다. 보통 이런 색상들을 한꺼번에 부를 때 '색상 테마'라고 한다.

## 🎈 Button 컴포넌트 구현하기
daisyui의 button CSS 컴포넌트는 다음과 같은 형태로 사용한다.
```typescript jsx
<button className="btn btn-primary">button</button>
```
그런데 만일 Button 이란 리액트 컴포넌트가 있어서 다음처럼 사용할 수 있다면, 좀 더 쉽게 사용할 수 있다.
```typescript jsx
<Button className={"btn-primary"}>button</Button>
```
한 걸음 더 나아가 아무런 설정도 하지 않으면 기본값이 적용되도록 한다면 좀 더 간결할게 사용할 수 있다.
```typescript jsx
<Button>button</Button>
```
src/theme/daisyui 디렉터리를 만들고 여기에 daisyui CSS 컴포넌트를 쉽게 사용할 수 있는 다양한 테마 컴포넌트를 구현해보겠다.
해당 디렉터리에 index.ts, Button.tsx 파일을 만들고 Button.tsx 코드를 작성하겠다.

### 🕸️서브 컴포넌트 만들기
src/pages/ButtonTest 디렉터리에 Basic.tsx, Size.tsx, IconTest.tsx 파일을 추가한다. 각가의 파일에 코드를 작성한다.
먼저 Basic.tsx 코드를 작성하고 웹 브라우저에서 확인하면 daisyui의 button 컴포넌트와 theme/daisyui 디렉터리의 Button 컴포넌트가 똑같다는 것을 알 수 있다.
물론 같은 클래스로 만들어서 그렇다.

### 🕸️'btn' 부분 생략하기
daisyui의 button 컴포넌트는 항상 btn btn-primary 형태로 btn 클래스를 명시해 줘야 하므로 조금 불편하다.
theme/daisyui/Button.tsx의 className에 btn 클래스를 기본으로 설정해 주어 이런 불편을 해소한다.

### 🕸️ 버튼의 크기 설정하기
daisyui의 button 컴포넌트는 다음처럼 크기를 설정하는 4가지 클래스를 제공한다. src/pages/ButtonTest/Size.tsx 에 코드를 작성한다.

## 🎈 Icon 컴포넌트 구현하기
src/components 의 Icon 컴포넌트를 구현했다. 이 컴포넌트는 본질적으로 `<span>`요소이므로 아이콘을 클릭했을 때 효과가 매끄럽지 못하다.
이 단점은 daisyui 버튼 CSS 컴포넌트로 Icon을 감싸면 해결할 수 있는데, 코드를 작성하기가 조금 번거롭다.
```typescript jsx
import {Icon} from '../components';

<button className="btn btn-primary btn-circle btn-lg" onClick={onClick}>
  <Icon className="text-5xl" name="close"/>
</button>
```
이 코드를 좀 더 간결하게 할 수 있도록 src/theme/daisyui 디렉터리에 Icon.tsx 파일을 만들고 코드를 작성한다.
이 코드는 앞서 작성한 Button과 src/components 디렉터리의 Icon 컴포넌트를 앞선 코드 형태로 동작하도록 구현한 것이다.
그런데 여기서 주의할 점은 Button의 크기에 따라 아이콘의 크기가 자동으로 조절되지 않는다는 것이다. 코드를 작성하고 index.ts 파일에 컴포넌트를 반영한다.  
그리고 테스트를 위해 src/pages/ButtonTest 디렉터리의 IconTest.tsx파일에 코드를 작성한다. 버튼의 크기에 따라 아이콘의 텍스트 크기가 자동으로 설정되도록 iconClassName 클래스에 설정한다.

## 🎈Input 컴포넌트 구현하기
src/theme/daisyui 디렉터리에 Input.tsx 파일을 만든다. 해당 파일에 코드를 작성한다. daisyui 의 input CSS 컴포넌트를 사용하려면 항상
input 클래스를 설정해야 하는 번거로움을 줄이고자 className에 'input'을 기본으로 설정하는 내용을 포함한다.  
copy.CopyMe 파일을 pages/InputTest 디렉터리에 4개 복사한다. 먼저 Basic.tsx 파일에 코드를 작성한다.

### 🕸️색상 설정하기
input CSS 컴포넌트는 button CSS 컴포넌트처럼 primay, secondary, accent, onfo, success, warning, error 등 7개 색상으로 경계를 표현할 수 있다.
src/pages/InputTest 디렉터리의 Color.tsx 파일에 색상을 설정하는 코드를 작성한다.

### 🕸️테두리 설정하기
Input 컴포넌트에 테두리를 설정하는 코드이다. src/pages/InputTest 디렉터리에 있는 Border.tsx 파일에 테두리를 설정하는 코드를 작성한다.

### 🕸️크기 설정하기
input CSS 컴포넌트는 button 때와 마찬가지로, lg, md, sm, xs 등 4가지 크기를 설정할 수 있다. src/pages/InputTest 디렉터리에 있는 Size.tsx 파일에 코드를 작성한다.
실행결과를 보면 입력 상자의 크기는 물론 글자 크기까지 입력 상자의 크기에 맞춰 조정되는 것을 볼 수 있다.


## 🎈모달 컴포넌트 구현하기
사용자의 선택을 입력받는 대화 상자는 크게 모덜리스와 모달 2가지 종류가 있다. 모덜리스 대화 상자는 영역 바깥 쪽을 클릭할 수 있지만,
모달 대화 상자는 영역 바깥 쪽의 UI가 동작하지 않는다. 그런데 웹 페이지는 모두 모달 대화 상자이다.  
daisyui는 다음처럼 동작하는 모달 대화 상자 CSS 컴포넌트를 제공한다. 모달 대화 상자는 크게 modal, modal-box, modal-action 등 3가지 클래스로 구성하며,
modal 클래스에 modal-open 클래스를 추가하면 대화 상자가 화면에 나타난다.
```typescript jsx
<div className={"modal modal-open"}>
  <div className={"modal-box"}>
    <p>modal contents</p>
    <div className={"modal-action"}>
      <button className={"btn btn-primary"}>Accept</button>
      <button className={"bnt"}>Close</button>
    </div>
  </div>
</div>
```
모달 대화 상자를 띄우는 Modal 컴포넌트를 구현해보겠다. src/theme/daisyui 디렉터리에 Modal.tsx 파일을 생성한다.
daisyui 의 모달 컴포넌트는 최상위 컴포넌트에 modal 클래스를 부여해야 하고, 모달 대화 상자를 오픈하려면 추가로 modal-open 클래스를 부여해야 한다.
다음은 이에 맞춰 구현해 본 Modal 컴포넌트이다.

```typescript jsx
import {className} from "postcss-selector-parser";

export type ModalProps = ReactDivProps & {
  open?: boolean
}
export const Modal: FC<ModalProps> = ({open, className: _className, ...props}) => {
  cosnt
  className = ['modal', open ? 'modal-open' : '', _className].join(' ')
  return <div {...props} className={className()}/>
    }
```
daisyui 의 모달 컴포넌트는 최상위 컴포넌트의 첫 번째 자식 컴포넌트로 modal-box 클래스를 부여해야 하는데,
ModalBox 라는 이름 보다는 ModalContent라는 이름이 더 자연스럽게 느껴진다.  
또한 잠시 후 보일 ModalContent 컴포넌트의 소성에 다음처럼 onCloseIconClicked 와 closeIconClassName을 추가했는데,
onCloseIconClecked 속성에 콜백함수를 설정하면 화면 위 오른쪽에 대화 상자를 닫는 아이콘이 표시되고, 콜백 함수를 설정하지 않으면 닫기 아이콘이 나타나지 않는다.
```typescript jsx
//닫기 아이콘 표시
export type ModalContentProps = ReactDivProps & {
  onCloseIconClicked?: ()=>void
  closeIconClassName?:string
}
```
이런 내용을 src/theme/daisyui 디렉터리의 Modal.tsx 에 코드를 작성하고, Index.ts 에 반영한다.  
그리고 src/pages/ModalTest.tsx 파일에 코들르 작성한다. 실행해보면 모달 대화 상자가 웹 페이지에 나타난다.