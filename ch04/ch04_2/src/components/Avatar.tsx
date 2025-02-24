import type {FC} from 'react'
import {Div} from './Div'
import type {DivProps} from './Div'

export type AvatarProps = DivProps & {
  size?: string
}

// prettier-ignore
export const Avatar: FC<AvatarProps> = ({
    className: _className, src, style, size, ...props
}) => {
    const w_or_h = size ?? '5rem'
    const className = ['rounded-full bg-cover bg-gray-300', _className].join(' ')
    return (
        <Div {...props} className={className} src={src} width={w_or_h} height={w_or_h} style={style}/>
    )
}
