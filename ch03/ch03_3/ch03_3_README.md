# 03-3 CSS 상자 모델 이해하기
HTML 요소는 화면에 표시될 때 모두 상자처럼 보인다고 해서 상자 모델 이라는 CSS 표준이 생겼다.
이 절에서는 CSS 상자 모델과 관련된 테일윈드 CSS의 기능을 알아본다.

실습에 필요한 src/copy/CopyMe.tsx 를 준비하고 src/pages/... 으로 복사한다. 그리고 App.tsx를 수정하고 코드를 실행한다.

## 🎈상자 모델이란?
상자 모델은 HTML 태그가 웹 브라우저 화면에 모두 상자 모댱으로 보이는 것을 모델링한 것으로, 이 모델에 따라 HTML 요소는 width와 height라는 스타일 속성을 가진다.
`<html>`요소의 상자에는 크기 이외에도 padding, border, margin과 같은 것들이 있다.

### 🕸️width와 height 스타일 속성
두 속성은 auto, inherit, initial, unset 등의 CSS 키워드값을 설정하거나 숫자 뒤에 픽셀을 의미하는 px, 퍼센트, em, rem 등의 단위를 붙인다.
만약 단위를 생략하면 px로 간주한다.  
width, height 와 관련된 테일윈드CSS의 클래스를 알아볼겠다. 그 전에 width와 height라는 속성을 제공하는 Div 컴포넌트를 src/component 디렉터리에 만들겠다.

## 🎈Div 컴포넌트 구현하기
src/components 디렉터리에 WidthHeight.ts와 Div.tsx 파일을 생성한다.  
먼저 WidthHeight.ts 에 WidthHeight 타입을 구현한다. 그리고 Div.tsx에 타입을 적용한다.  
components 디렉터리의 index.ts 에 Div 컴포넌트를 반영한다.    
src/Pages/DivTest.tsx 에 Div 컴포넌트를 사용하는 코들르 작성한다. 코드에서 Div 컴포넌트의 height 속성에 6rem,
즉 'M'문자 높이의 6배 높이를 설정했다.  
Div의 height를 명시적으로 설정하지 않는 대신 브라우저의 높이 결정 메커니즘을 적용해보겠다. DivTest.tsx 파일의 height="6rem" 을 생략한다.
이렇게 새로고침하면 `<div>`는 콘텐츠를 정확하게 감싸는 높이로 계산된 값을 가지고 있다. 
CSS에서는 높이를 명시적으로 설정하지 않고 브라우저가 계산하도록 구현하는 것이 바람직하다.

## 🎈컨테이너와 콘텐츠, 그리고 box-sizing 스타일 속성
HTML 에서는 부모 요소, 자식 요소로 관계를 표현하지만 CSS 에서는 부모 요소를 컨테이너, 자식 요소를 콘텐츠라고 표현한다.
CSS 관점에서 중요한 것은 HTML 요소의 렌더링이기 때문이다.  
콘텐츠를 구성하는 HTML 요소가 차지하는 영역을 콘텐츠 영역이라고 할 때, 컨테이너는 자신의 테두리와 패딩이라고 부르는 콘텐츠 영역 간의 간격으로 구성된다.
이럴 때 컨테이너의 크기가 무엇인지 혼란스럽다.  
전통적으로 CSS에서는 테두리와 패딩을 무시한 콘텐츠 영역의 크기만을 컨테이너 크기로 보아 왔다. 이 때문에 CSS 표준은 box-sizing 이란 스타일 속성을 제공하여 
컨테이너 크기를 결정하게 한다. box-sizing 의 설정값은 아래 처럼 4가지 가운데 하나이며 기본값은 content-box 이다.
```
box-sizing: content-box | padding-box | border-box | inherit
```
테일윈드는 box-sizing: border-box 에 대응하는 box-border 클래스와 box-sizing: content-box 에 대응하는 box-content 클래스를 제공한다.

## 🎈캐스케이딩 알아보기
'cascading' 이라는 단어는 "위에서 아래로 물이 흘러내린다"라는 의미로 해석 할 수 있다. color 스타일 속성값을 명시적으로 설정하지 않으면
부모 요소에 설정한 color 속성값이 물이 흘러 내리듯이 적용된다.  
이러한 캐스케이딩은 width와 같은 스타일 속성에도 적용된다. 콘텐츠의 width 값을 설정하지 않으면 부모 요소 가운데 가장 가까운 부모의 송성값으로 설정된다.
결국 가까운 부모부터 먼 부모까지 올라 가면서 width 값이 설정된 부모의 값으로 설정된다.

## 🎈뷰포트 알아보기
뷰포트(viewport)는 웹 페이지에서 사용자가 볼 수 있는 영역이다. 뷰포트는 모바일, 테블릿, 데스크톱 등 웹 브라우저가 동작하는 장치의 화면 크기가 달라서 생긴 개념이다.
뷰포트 관점에서 HTML 요소의 넓이는 'viewport width'라는 의미로 vw, 높이는 'viewport height'라는 의미의  vh라는 단위를 사용한다.  
vw, vh는 각각 1~100까지의 값을 가지며 퍼센트 개념과 같다. 테일윈드는 뷰포트 크기를 지정하는 클래스 2개를 제공한다. w-screen은 width:100vw 를 의미하고,
h-screen 은 height: 100vh 를 의미한다.  
src/pages/ViewportTest.tsx 를 작성해보겠다. 코드에서 w-screen, h-screen 클래스를 사용했으므로 웹 브라우저의 바탕색은 짙은 보라색으로 보인다.
또한 개발자 도구 창에서 상자 모델을 보면 높이가 0이 아니라 브라우저의 높이로 표시된다. 뷰포트 값은 퍼센트처럼 동작하므로 
웹 브라우저의 크기를 임의로 조정해도 항상 바탕색으로 가득 찬 모습으로 보인다.    
앞서 w-screen과 h-screen 클래스를 사용해봤다. 테일윈드는 vw, vh 단위 대신 퍼센트 단위를 사용하는 w-full, h-full 클래스도 제공한다.
w-full과 h-full은 부모 요소를 기준으로 100%로 설정된다. 

## 🎈테일윈드CSS의 길이 관련 클래스
테일윈드는 이들 외에도 넓이와 높이에 관련된 여러 클래스를 제공한다. width를 의미하는 w 뒤, height를 의미하는 h 뒤에 숫자를 쓰는 표기법을 가진 클래스들을 제공한다.
```
w-숫자
w-분자/분모
h-숫자
h-분자/분모
```
숫자의 단위는 rem이다. 그리고 숫자의 기준은 4로서, w-4는 1rem, h-4는 1rem 이다. 즉, w-4, w-h는 문자 M의 넓이와 높이를 의미한다.  
숫자는 1씩 증가하거나 감소할 때 0.25rem씩 증감한다. w-5 는 1.25rem, w-80 은 20rem 이다. 테일윈드는 w-1/2 형태로 퍼센트 단위 길이를 표현할 수 있다.  
길이 관련 클래스를 테스트해 보겠다. src/pages/HeightTest.tsx 에 코드를 작성해보겠다.

## 🎈padding 스타일 속성
테일윈드의 패팅 관련 클래스는 padding을 의미하는 'p-' 뒤에 숫자를 붙인다. 다만 분수로 표현하지는 않는다.
예를들어 p-4는 padding: 1rem; 을 의미한다. 또한 pt(padding-top),pl(padding-left),pr,pb를 사용할 수도 있다.  
padding 스타일 속성을 테스트 해보겠다. src/pages/PaddingTest.tsx 에 코드를 작성한다.

## 🎈margin 스타일 속성
CSS 의 'margin-방향'은 인접한 HTML 요소와의 간격을 결정하는 스타일 속성이다. 테일윈드의 마진 관련 클래스는 margin을 의미하는 m- 뒤에 숫자를 붙인다.
분수로 표현하지 않는다. m-4는 margin: 1rem; 을 의미한다.  
margin도 padding과 마찬가지로 mt(margin-top),ml,mb,mr 과 같이 표현할 수 있다. margin 스타일 속성을 테스트해보겠다.
src/pages/MarginTest.tsx 파일에 코드를 작성한다. <div> 10개를 박스처럼 보이게 만든 뒤 m-4 클래스를 사용한다.
실행 결과를 보면 상자들이 2글자만큼의 간격으로 떨어져 보인다.

## 🎈background-image 스타일 속성
`<img>`는 HTML 요소 중 유일하게 width와 height 속성이 있다. 이 속성은 이미지를 가로 세로 화면 비율에 맞춰 화면에 표시한다. ImageTest.tsx 파일에 코드를 작성한다.  
코드에서는 이미지 크기와 무관하게 width와 height 속성을 각각 400px로 설정했다. 또한 바탕색을 bg-gray-300 으로 설정했다. 따라서 이미지가 로딩되기 전에는 400x400 영역에 바탕색이 보이지만,
실제 이미지가 로딩되면 이미지 높이가 줄어드는 현상을 볼 수 있다. 이는 이미지가 왜곡되어 보이지 않도록 웹 브라우저가 화면 비율을 고려해 height 값을 계산했기 때문이다.  
`<img>`의 이런 특성은 이미지를 특정 높이로 고정하기 어렵게 하므로 디자이너들은 대부분 CSS의 background-image 스타일 속성을 선호한다.  
CSS의 background-image 스타일 속성은 CSS 함수에 이미지의 URL을 매개변수로 사용하는 형태로 사용한다. 그런데 이 형태는 URL 부분을 타입스크립트
코드에서 결정하려고 할 때 조금 번거롭다. 이제 앞서 구현한 Div 컴포넌트에 src 속성을 추가하여 background-img 스타일 속성을 좀 더 쉽게 사용할 수 있게 만들겠다.

### 🕸️Div 컴포넌트에 src 속성 추가
src/components/Div.tsx 파일에 Div 컴포넌트에 background-image 스타일 속성을 추가한다. 다음 코드는 src 속성을 추가하고 url(src) 형태가 되도록
backgroundImage를 구현한다.  
src 속성값이 있을 때 bg-gray-300 클래스를 추가한 것은 네트워크 장애나 아바타 제공 서버에 문제가 생겨 이미지를 얻을 수 없을 때 화면에 아무것도 나타나지 않는 것보다는 바탕색이 보이도록 하기 위함이다.  
이제 src 속성을 테스트 해보겠다. src/pages/BackgroundImage.tsx 파일을 작성한다.  
background-image 스타일 속성의 이름이 '백그라운드 이미지'인 이유는 실행 결과처럼 background-image 스타일 속성을 사용하는 `<div>` 같은
컨테이너의 배경 이미지로 사용할 수 있기 때문이다.

## 🎈background-size 스타일 속성
위의 결과의 백그라운드 이미지는 전체 크기가 아니라 일부분만 보인 것이다. CSS는 전체 이미지를 볼 수 있게 background-size를 제공하며,
테일윈드는 이에 대응하는 클래스를 제공한다. bg-auto(background-size:auto;), bg-cover(background-size:cover;), bg-contain,
앞선 결과는 기본값인 bg-cover가 적용된 것으로 bg-contain 으로 하면 전체 이미지를 볼 수 있다.  
하지만 화면과 이미지의 크기가 다르면 이미지가 반복해서 나타난다. 따라서 보통은 bg-cover(기본값)로 설정한다.

## border 스타일 속성
CSS의 border 스타일 속성은 border-width, -style, -color 의 단축 속성이다. 예를들어 border: 1px solid red; 는 테두리 굵기가 1이고 타입은 직성, 색은 빨강으로 만드는 스타일이다.
테일윈드는 테두리 굵기와 관련된 다음의 클래스를 제공한다. [border-(방향 t,l,b,r, 없으면 전체)-(굵기 0,2,4,8)] 또한 테두리 스타일과 관련하여 다음과 같은 클래스가 있다.
border-solid, -dashed, -dotted, -double, -none 또한 테두리 색상과 관련하여 다음과 같은 클래스를 제공한다.
border-transparent, -black, -white 그리고 bg-red-500 형태에서 bg 접두사만 border로 바꾼 패턴의 클래스도 사용할 수 있다.
```
border-색상_이름-색상_번호
```

## 🎈border-radius 스타일 속성
테일윈드는 CSS의 border-radius 스타일 속성에 대응하는 다음과 같은 클래스를 제공한다.

<img src="../../images/02-15.jpg" width="200" alt="">

또한 위쪽이나 아래쪽 모서리만 둥글게 하는 다음과 같은 패턴의 클래스도 제공한다.
```
rounded-(t|b)-(sm | md | lg | xl | 2xl ...)
```
한쪽 모서리만 둥글게 하는 클래스도 제공한다.
```
rounded-(tl | tr | bl | br)-(sm | md | lg | xl )
```

## 🎈 Avatar 컴포넌트 만들기
rounded 클래스를 활용해 아바타 이미지를 동그란 원 모양으로 만들어보겠다. src/component/Avatar.tsx 파일을 만든다.
다음처럼 rounded-full 클래스를 적용하는 방법으로 동그란 원 모양 이미지를 만들어보겠다.
```
<div className="rounded-full" />
```
Avatar.tsx 파일에 코드를 작성한다. PropsWithChildren 제네릭 타입이 적용된 Div 타입을 사용하므로 굳이 PropsWithChildren 타입을 명시하지 않고 className 속성을 사용한다.
Avatar 컴포넌트를 index.tsx 파일에 반영하고 src/pages/AvatarTest.tsx 에 코드를 작성한다.  랜던함 아바타 이미지 10개를 Avatar 컴포넌트로 화면에 출력하는 코드이다.
margin 스타일 속성에는 음수를 설정할 수 있으며, 테일윈드는 -ml-6 처럼 마이너스 기호를 붙여 음수 margin 값을 설정할 수 있다.
또한 아바타의 테두리를 흰색(border-white)으로 칠하는데, border의 기본 넓이는 0이므로 크기를 설정해야 한다.
따라서 border의 넓이를 문자 1개 넓이로 설정한다.


## 🎈display 스타일 속성
CSS의 display 스타일 속성은 HTML 요소의 배치(layout)를 결정하는 중요한 속성이다. display에 설정할 수 있는 값은 많지만, 테일윈드에서는 다음과 같은 클래스를 자주 사용한다.

<img src="../../images/02-16.jpg" width="240" alt="">

사람은 수평으로 글을 쓰다가 공간이 없으면 줄을 바꾼다. 수평으로 쓰는 대표적인 HTML 요소로는 `<span>`이 있으며, span 처럼 수평으로 배치되는 HTML 요소들을 inline 요소라고 한다.
inline 요소는 width와 height 스타일 속성값을 명시적으로 설정할 수 없다. 즉, 설정할 수 있지만 반영되지 않는다.  
block 요소는 수직으로 배치되는 HTML 요소들을 의미하며 `<div>`가 대표적이다. block 요소는 width와 height 스타일 속성값을 명시적으로 설정할 수 있고,
이 설정에 따라 자신의 넓이와 높이를 설정할 수 있다.  
inline-block 요소는 inline과 block의 특성을 결합한 것이다. inline이므로 수평으로 배치되고, block이므로 w,h 속성을 설정할 수 있다.  
src/pages/DisplayTest.tsx 에 코드를 작성한다.

## 🎈visibility 스타일 속성
웹 페이지를 인터렉티브하게 구현하다 보면 어떤 HTML 요소를 화면에 나타나지 않게 해야할 때가 있다. 이때 CSS의 visibility 속성을 이용한다.
visibility 스타일 속성은 visible 이나 hidden 두 값 가운데 하나를 설정할 수 있다. visibility 값이 visible이면 화면에 보이고 hidden 이면 나타나지 않는다.  
display 속성에서 none 이라는 값을 설정할 수 있는데, 이 대 해당 요소는 화면에 나타나지 않는다. 그런데 display: none인 요소의 크기는 화면에 반영되지 않지만,
visibility: hidden 은 화면에 보이지 않아도 요소의 크기는 그대로 반영이 된다.  
테일윈드는 visibility 속성과 관련해서 visible, invisivle 클래스를 제공한다. src/pages/DisplayNoneTest.tsx 에 코드를 작성한다.
개발자 도구를 통해서 요소들을 확인해보면 display:none 일 때 텍스트가 있는데도 크기가 나타나지 않는 것을 확인할 수 있다.

## 🎈position과 left, top, right, bottom 스타일 속성
CSS는 left, right, top, bottom 등 HTML 요소의 위치를 표현하는 스타일 속성을 제공한다.
그런데 그냥 사용할 수 없고 position 스타일 속성에 absolute라는 값이 설정되어야 한다. 테일윈드는 position에 설정할 수 있는 2개 클래스를 제공한다.
absolute(position: absolute;), relative(position:relative;)  
그런데 absolute 를 설정한 요소의 위치는 기준이 되는 자표가 있어야 된다. 만약 absolute 만 사용하는 HTML 요소만 있다면 해당 요소는 최상위 요소인 `<html>`태그를 기준으로 한다.
하지만 해당 요소의 여러 부모 컨테이너 중 position:relative를 설정한 컨테이너가 있다면, 해당 요소의 가장 가까운 컨테이너 영역이 기준이 된다.  
이제 Div 컴포넌트에 left,right, top, bottom 속성을 추가하여 기준이 되는 그림의 각 위치에 아이콘 박스가 있는 화면을 구현하겠다.
먼저 src/component 디렉터리에 LeftRightTopBottom.ts를 생성하고 타입을 구현한다. 그리고 Div.tsx에 관련 타입을 추가하고 코드를 추가한다.  
이를 테스트하기 위해서 src/pages/PositionTest.tsx 파일을 열고 코드를 작성한다.  
이 코드는 Div 컨테이너에 표시할 absolute 클래스 4개를 가진 Div로 구성되었다. relative 클래스로 설정한 Div는 absolute로 설정한 Div의 위치 기준이 된다.

## 🎈z-index 스타일 속성

## 🎈Overlay 컴포넌트 만들기
웹 페이지를 디자인하다 보면 사용자에게 대화 상자를 보여 주고 대화 상자 영역 밖의 버튼을 클릭할 수 없게 해야 할 때가 있다.
이런 기능을 하는 대화 상자를 모달 대화 상자라고 한다. 모달 대화 상자가 나타나면 웹 페이지의 다른 곳을 사용자가 임의로 클릭할 수
없게 하는 화면 UI를 오버레이라고 한다.  
이러한 오버레이 기능을 테스트해보겠다. src/components/Overlay.tsx를 만든다. 오버레이를 구현하는 원리는 일단 웹 페이지를 꽉 채우는 Div를 만드는 것으로 시작한다.
```
<Div className="w-screen h-screen"/>
```
그리고 이 Div의 position을 absolute로 설정하고 z-index를 다른 HTML 요소보다 높게 설정한다. 그러면 이 Div가 웹페이지의 최상단에 위치하므로
사용자의 마우스 클릭을 모두 흡수한다. 따라서 사용자는 이 Div아래쪽에 있는 버튼 등을 클리할 수 없게 된다.
```
<Div className="bg-black/70 absolute z-50 w-screen h-screen"/>
```
마지막으로 플렉스 레이아웃을 적용해 자식 요소가 화면 가운데에 오도록 한다.
```
<Div className="flex items-center justify-center ... (생량)" />
```
이러한 방식으로 Overlay.tsx 를 구현하겠다.  
마지막으로 src/pages/OverlayTest.tsx 에 코드를 작성하면 오버레이 화면을 볼 수 있다.
