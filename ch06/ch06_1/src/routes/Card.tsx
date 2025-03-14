import {useCallback, useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {useParams, useLocation, useNavigate, useSearchParams} from 'react-router-dom'
import {Button} from '../theme/daisyui'
import {Div, Avatar} from '../components'

import type {AppState} from '../store'
import type {Card as CardType} from '../store/commonTypes'
import * as CE from '../store/cardEntities'

export default function Card() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const [search] = useSearchParams()

  const goBack = useCallback(() => navigate(-1), [navigate])

  const [card, setCard] = useState<CardType | null>(null)
  const {cardid} = params
  const cardEntities = useSelector<AppState, CE.State>(({cardEntities}) => cardEntities)

  useEffect(() => {
    if (!cardEntities || !cardid) return
    /*
    1. cardEntities 또는 cardid가 존재하지 않으면 아무 작업도 수행하지 않는다.
    2. cardEntities 객체에 cardid에 해당하는 카드가 존재하면, setCard 함수를 호출하여 해당 카드를 상태로 설정한다.
    이 코드는 방어적인 코딩 패턴을 사용하여, cardEntities나 cardid가 유효하지 않은 경우를 처리하고 있습니다.
     */
    cardEntities[cardid] && setCard(notUsed => cardEntities[cardid])
  }, [cardEntities, cardid])

  if (!card) {
    return (
      <div>
        <p>location: {JSON.stringify(location, null, 2)}</p>
        <p>params: {JSON.stringify(params, null, 2)}</p>
        <p>cardid: {params['cardid']}</p>
        <p>
          from: {search.get('from')}, to: {search.get('to')}
        </p>
        <p></p>
        <Button className={'mt-4 btn-primary btn-xs'} onClick={goBack}>
          GO BACK
        </Button>
      </div>
    )
  }

  return (
    <div className={'p-4'}>
      <Div src={card.image} className={'w-full'} minHeight={'10rem'} height={'10rem'} />
      <Div className={'flex flex-row mt-4'}>
        <Avatar src={card.writer.avatar} size={'2rem'} />
        <Div className={'ml-2'}>
          <p className={'text-xs font-bold'}>{card.writer.name}</p>
          <p className={'text-xs text-gray-500'}>{card.writer.jobTitle}</p>
        </Div>
      </Div>
      <Button className={'mt-4 btn-primary btn-xs'} onClick={goBack}>
        GO BACK
      </Button>
    </div>
  )
}
