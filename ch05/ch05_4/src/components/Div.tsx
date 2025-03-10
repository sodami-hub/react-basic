import {FC, DetailedHTMLProps, HTMLAttributes, PropsWithChildren} from 'react'
import type {WidthHeight} from './WidthHeight'
import type {LeftRightTopBottom} from './LeftRightTopBottom'
import {MinMaxWidthHeight} from "./MinMaxWidthHeight";

export type ReactDivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>
/*
export type DivProps = ReactDivProps & WidthHeight
ReactDivProps에 children 요소가 포함되어 있기 때문에 위에처럼 작성해도 동일한 결과 얻는다.
 */
export type DivProps = ReactDivProps &
  PropsWithChildren<WidthHeight> &
  LeftRightTopBottom &
  MinMaxWidthHeight & {
    src?: string
  }

//prettier-ignore
export const Div: FC<DivProps> = ({
    width, height, style: _style, src, className:_className,
        left,right,top,bottom, minWidth,minHeight,maxWidth,maxHeight, ...props
}) => {
    /*
    자바스크립트 단축구문. 속성이름과 변수 이름이 동일할 때 변수 이름 width만 적으며 width:width 로 값이 들어간다.
    */
    const style = {..._style, width, height, backgroundImage: src && `url(${src})`,
    left,right,top,bottom,minWidth,minHeight,maxWidth,maxHeight}
    const className = ['box-border',src && 'bg-gray-300', _className].join(' ')
    return <div {...props} style={style} className={className}/>
}
