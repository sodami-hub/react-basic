// 물리 DOM 객체를 대상으로 한 이벤트 처리 방식

const rootDiv = document.getElementById('root')
if (rootDiv) {
  rootDiv.onclick = (e: Event) => {
    const {isTrusted, target, bubbles} = e
    console.log('mouse click occurs on rootDiv-1.', isTrusted, target, bubbles)
  }
  rootDiv.onclick = (e: Event) => {
    const {isTrusted, target, bubbles} = e
    // prettier-ignore
    console.log('mouse click occurs on rootDiv-2.',isTrusted,target,bubbles)
  }
}
export default function Onclick() {
  return <div>OnClick</div>
}
