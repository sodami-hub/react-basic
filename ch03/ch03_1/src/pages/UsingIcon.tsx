// Icon 사용자 컴포넌트 사용
import {Icon} from '../components'

export default function UsingIcon() {
  return (
    <div>
      <br />
      <br />
      <h3>UsingIconComponent</h3>
      <Icon name={'home'} style={{color: 'blue'}} />
      <Icon name={'check_circle_outline'} style={{fontSize: '50px', color: 'red'}} />
    </div>
  )
}
