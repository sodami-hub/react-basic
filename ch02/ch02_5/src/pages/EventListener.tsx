// 물리 DOM 객체를 대상으로 한 이벤트 처리 방식

document.getElementById('root')?.addEventListener('click', (e: Event) => {
  const {isTrusted, target, bubbles} = e
  console.log('EL01 mouse click occurs.', isTrusted, target, bubbles)
})

document.getElementById('root')?.addEventListener('click', (e: Event) => {
  const {isTrusted, target, bubbles} = e
  console.log('EL02 mouse click occurs.', isTrusted, target, bubbles)
})

export default function EventListener() {
  return <div>EventListener</div>
}
