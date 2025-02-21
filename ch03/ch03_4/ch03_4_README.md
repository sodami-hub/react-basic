# 03-4 플렉스 레이아웃 이해하기
플렉스 레이아웃은 다양한 HTML 요소를 화면에 간편하게 배치할 수 있게 하는 표준이다. 

## 🎈플렉스박스 레이아웃이란?
플렉스박스 레이아웃이란 display 스타일 속성에 flex라고 설정하고 그 안에 콘텐츠 아이템을 배치한 것을 의미한다.
이때 플렉스 컨테이너는 콘텐츠 아이템의 inline과 block 성질을 완전히 무시한다.  
어떤 HTML요소에 display:flex;로 설정하면(테일윈드는 flex) 해당 요소를 플렉스 컨테이너로 만들 수 있다.

## 🎈flex-direction 스타일 속성
flex-row(default), flex-row-reverse, flex-col, flex-col-reverse 에 대해서 코드를 작성해보겠다.  
src/pages/DirectionTest.tsx 에 코드를 작성한다.

## 🎈overflow 스타일 속성
컨테이너의 크기가 고정되었을 때 콘텐츠의 크기가 컨테이너보다 크면 오버플로가 발생한다. 이럴 때 CSS에서는 콘텐츠가 컨테이너의 크기를 넘지 않도록
hidden값을 설정하거나, 컨테이너를 넘어도 표시되게 visible값을 설정하거나, 스크롤해서 볼 수 있게 scroll 값을 설정한다.  
테일윈드도 이에 대응하는 클래스를 제공한다. overflow-auto, -hidden, -visible, -scroll

## 🎈flex-wrap 스타일 속성
어떤 스타일 속성을 wrap으로 설정하면 콘텐츠를 더이상 수평으로 배치할 수 없을 때 자동으로 다음 줄에 배치한다.

<img src="../../images/02-17.jpg" width="200">

다음 그림은 수평 방향의 플렉스 컨테이너에 flex-wrap 효과를 준 예이다.

<img src="../../images/02-18.jpg" width="450">

다음 그림은 수직 방향의 flex-wrap 효과이다. 그런데 수직 방향으로 flex-wrap을 동작시키려면
컨테이너의 height와 height의 최소 크기를 나타내는 min-height 스타일 속성값을 똑같이 설정해 줘야 한다.

<img src="../../images/03-01.jpg" width="700">

src/pages/WrapTest.tsx 에 코드를 작성해보겠다.

## 🎈min-width와 max-width 스타일 속성
웹 브라우저의 크기를 변경하면 넓이를 '100%'처럼 퍼센트 단위를 사용하는 컨테이너들은 이에 맞춰 자신의 넓이를 늘리거나 줄여서 브라우저 폭의 100%를 유지한다.
CSS는 이런 상황을 조정할 수 있도록 min-width와 max-width, min-height와 max-height 스타일 속성을 제공한다.
즉, 부모 컨테이너의 크기에 대응하는 콘텐츠의 최소, 최대 크기를 설정하는 용도이다.  
테일윈드는 이에 대응하여 'min-w-숫자','max-w-숫자','min-h-숫자','max-h-숫자' 클래스를 다양하게 제공한다.
그중에서 minWidth,maxWidth,minHeight,maxHeight 스타일 속성을 직접 구현해보겠다. 먼저 src/components 에 MinMaxWidthHeight.ts 파일을 만들고 타입을 구현한다.  
그리고 Div.tsx 파일의 Div 컴포넌트에 MinMaxWidthHeight 타입을 반영한다. 마지막으로 src/pages/MinMaxTest.tsx 파일에 코드를 작성한다.  
작성한 코드를 저장하면 웹 브라우저에서 파란색 배경이 w-1/2로 적용된 것을 확인할 수 있다. 하지만 웹 브라우저의 크기를 바꿔보면 파란색 배경이 minWidth~maxWidth 까지만 값이 바뀐다.

## 🎈justify-content와 align-items 스타일 속성
어떤 요소를 display:flex; 로 설정하면, 컨테이너 영역내부의 콘텐츠를 구성하는 요소들을 조정할 수 있다.
그런데 이 조정에서 방향을 구분해야 한다.  
CSS의 justify-content 스타일 속성으로 플렉스 컨테이너의 콘텐츠 요소들을 수평으로 조정한다. 속성값은 다음과 같고, 기본값은 flex-start이다.
또한 align-items 스타일 속성으로 플렉스 컨테이너의 콘텐츠 요소들을 수직으로 조정한다. 테일윈드는 이에 대응하는 클래스를 다음과 같이 제공한다.

<div style="display: flex;">
<img src="../../images/03-02.jpg" width="250px"/>
<img src="../../images/03-03.jpg" width="250px"/>
</div>

그런데 justify- 와 items- 클래스는 플렉스 컨테이너의 방향에 따라 적용되는 방향이 반대인다. 즉, 수평 방향 플렉스 컨테이너에서 justify- 는 콘텐츠 아이템을 수평으로 정렬하지만,
items- 는 수직으로 정렬한다. 또한 수직 방향 플렉스 컨테이너에서 justify- 는 수직으로 정렬하지만, items- 는 수평으로 정렬한다.  
예제를 통해서 살펴보겠다. src/pages/JustifyCenterTest.tsx 에 코드를 작성한다. 코드에서 공통으로 justify-center를 사용하지만
앞선 Div는 flex-row, 그 다음 Div는 flex-col을 사용하고 있다.
