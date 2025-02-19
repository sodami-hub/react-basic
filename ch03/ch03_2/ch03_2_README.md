# 테일윈드 CSS 리액트 프로젝트 만들기
리액트 개발에서 CSS는 컴포넌트 스타일링의 가장 핵심적인 요소이다.
최근 주목받는 테일윈드CSS 프레임워크를 리액트 프레임워크와 함께 사용하는 방법을 알아본다. 

## 🎈PostCSS가 탄생한 배경
PostCSS는 웹팩이 1차로 만든 CSS를 가공하여 최종 CSS를 생성해 내는 방법으로 동작한다.
즉, PostCSS는 웹팩의 플러그인이면서 그 자체는 자신의 PostCSS 플러그인을 동작시키는 프로그램이다.
PostCSS가 발전을 거듭하자 CSS 디자이너들은 점차 Sass/SCSS 보다 PostCSS를 선호하기 시작했다. 
테일윈드CSS는 PostCSS 플러그인 방식으로 동작하는 진보된 CSS 프레임워크이다.

## 🎈테일윈드CSS 사용하기
테일윈드는 현재 부트스트랩과 함께 가장 많이 사용되는 CSS 프레임워크이다. 테일윈드는 PostCSS 버전 8의 플러그인 형태로 동작한다.
테일윈드는 그 자체로도 훌륭하지만 테일윈드를 바탕으로 한 약 16종의 고수준 CSS 프레임워크가 있다는 장점이 있다.
실제 개발에서는 이런 고수준 CSS 프레임워크를 사용해 컴포넌트 스타일링을 좀 더 쉽게 할 수 있다.

### 🕸️ PostCSS와 autoprefixer, 그리고 테일윈드CSS 설치하기
CSS 관점에서 브라우저 호환성 문제는 -webkit, -moz, -ms 등으로 대표되는 벤더 접두사 문제이다.
즉, CSS 표준은 linear-gardient지만, 구글 크롬이나 애플 사파리 브라우저에서는 -webkit-linear-gradient를, 
마이크로소프트 브라우저에서는 -ms-linear-gradient와 같은 이름으로 사용해야 한다.  
autoprefixer는 대표적인 PostCSS 플러그인으로 이런 벤더 접두사 문제를 해결해 주는 역할을 한다. 
사용자가 벤더 접두사를 붙이지 않더라도 후처리 과정에서 자동으로 벤더 접두사가 붙은 CSS를 생성해준다.  
autoprefixer는 테일윈드CSS와 마찬가지로 PostCSS의 플러그인 형태로 동작하므로 autoprefixer를 사용하려면
PostCSS도 설치해야한다. 

✨ tailwindcss 의경우 CRA(create react-project)로 생성한 프로젝트인 경우 3버전을 사용하는게 안전한다.
현재 4버전 으로는 초기화(init)가 안됨...
```
> yarn add -D postcss autoprefixer tailwindcss@3
```
그리고 PostCSS와 테일윈드CSS가 동작하려면 각각의 구성 파일이 있어야 한다. 이제 이것들을 만들어보겠다.

### 🕸️구성파일 만들기
테일윈드CSS는 PostCSS의 플러그인 형태로 동작하며 PostCSS가 테일윈드CSS를 플러그인으로 동작시키려면 postcss.config.js 파일에 테일윈드CSS를 등록해야 한다.
그리고 테일윈드CSS는 PostCSS와는 별도로 자신만의 구성 파일이 있어야 한다.  
테일윈드CSS는 이처럼 2가지 구성 파일을 쉽게 생성할 수 있도록 다음 명령을 제공한다.
```
> yarn tailwindcss init -p 
```
위 명령을 실행하면 postcss.config.js, tailwind.config.js 파일이 생성된다.

### 🕸️daisyui 패키지 설치하기
테일윈드는 부트스트랩과 같은 CSS 프레임워크를 쉽게 개발할 수 있게 해주는 저수준 프레임워크이다. 이에 따라 
테일윈드 자체에는 btn btn-primary 처럼 사용하는 소위 CSS 컴포넌트들을 제공하지 않는다.  
하지만 테일윈드를 사용해 부트스트랩처럼 CSS 컴포넌트를 제공하는 다양한 테일윈드 컴포넌트가 있으며 이들은 모두 테일윈드CSS의 플러그인 형태로 동작한다.
이 중 무료로 제공하는 컴포넌트가 가장 많은 daisyui 플러그인이 있다. 
```
> yarn add -D daisyui
```

### 🕸️tailwindcss/line-clamp 플러그인 설치하기
테일윈드는 기본으로 제공하는 기능 외에도 다양한 새 기능을 추가할 수 있게 하는 플러그인 시스템도 제공한다.
그리고 테일윈드CSS의 플러그인 이름에 '@tailwindcss/'라는 접두사가 붙은 패키지는 테일윈드CSS 제작사가 직접 만들어 제공하는 것이다.
이 페키지들은 테일윈드CSS 기본에는 없는 기능을 추가로 사용할 수 있게 한다.  
여러 줄의 텍스트를 지정한 줄 수로 잘라서 표시해 주는 @tailwindcss/line-clamp 플러그인을 사용한다.(3.3버전 부터는 기본으로 포함되므로 설치하지 않아도 된다.)
```
> yarn add -D @tailwindcss/line-clamp
```


### 🕸️테일윈드 구성 파일 수정하기
테일윈드 기능 가운데 사용하지 않는 기능은 yarn start 명령 때 제거해 CSS 크기를 최소화할 수 있다. 
이 기능을 사용하려면 tailwind.config.js 파일을 설정해야 한다. 그리고 line-clamp 플러그인과 daisyui 플러그인을 등록한다.

### 🕸️테일윈드CSS 기능 반영하기
테일윈드를 사용하려면 src/index.css 파일에 다음 3줄을 추가해야 한다. 이후 학습에도 이 index.css 파일을 사용할 것이다.
이제 테일윈드를 사용하기 위한 준비가 끝난다. src/App.tsx 파일에 테스트 코드를 작성해서 정상적으로 동작하는지 확인해보자.

### 🕸️테일윈드CSS 테스트 코드 작성하기
src/pages/TailwindcssTest.tsx 파일에 코드를 작성한다. 이 코드는 테일윈드가 정상적으로 동작하는지 알아보기위한 목적이다. 
리액트에서 테일윈드를 사용하는 방법은 컴포넌트의 className 속성에 bg-black/70, line-clamp-3과 같은 CSS 클래스 이름을 설정하는 방식으로 한다.  
실행해 보면 결과를 볼 수 있다. line-clamp 플러그인을 설치했는데, 이 플러그인은 line-clamp3에서 보는 CSS 클래스들을 제공한다.
line-clamp-3의 의미는 텍스트가 아무리 길어도 3줄을 넘지 말라는 의미이다. 이 클래스 덕분에 텍스트가 3줄을 넘지 않고 있다.  
또한 bg-black/70 으로 바탕색은 불투명도가 70%인 검정으로, text-gray-50으로 텍스트 색상은 약간 회색빛이 나는 흰색으로 표시된다.
그리고 daisyui 플러그인이 동작하여 버튼이 예쁘게 표시된다. 테일윈드CSS가 정상으로 동작하고 있음을 보여준다.

## 🎈색상을 설정하는 방법