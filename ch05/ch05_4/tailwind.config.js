/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {}
  },
  safelist: [{pattern: /^line-clamp-(\d+)$/}], // line-clamp- 로 시작하는 클래스 이름을 동적으로 조합하더라도 정상으로 동작하도록 트리 쉐이킹 대상에서 제거하는 코드
  plugins: [require('@tailwindcss/line-clamp'), require('daisyui')]
}
