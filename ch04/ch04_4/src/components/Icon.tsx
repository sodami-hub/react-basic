import {FC, DetailedHTMLProps, HTMLAttributes} from 'react'

/*
export type IconProps = {
  name: string
  style?: CSSProperties // name은 꼭 설정해야 되지만, style은 선탟속성 이므로 이름 뒤에 ? 를 붙인다.
}

export const Icon: FC<IconProps> = ({name, style}) => {
  return (
    <span className={'material-icons'} style={style}>
      {name}
    </span>
  )
}
*/

// 컴포넌트 개선하기
/*
export type IconProps = {
  name: string
  style?: CSSProperties
}

export const Icon: FC<IconProps> = ({name, ...props}) => {
  return (
    <span className={'material-icons'} {...props}>
      {name}
    </span>
  )
}
*/

// 완성된 Icon 컴포넌트
type ReactSpanProps = DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>

export type IconProps = ReactSpanProps & {
  name: string
}

// prettier-ignore
export const Icon :FC<IconProps> = ({name,className:_className,...props}) => {
  // span.material-icons.text-blue : 이런식으로 두개의 클래스를 값게 된다.
  const className = ['material-icons', _className].join(' ')
  return <span {...props} className={className}>{name}</span>
}
