import {Router} from 'express'
import type {MongoDB} from '../mongodb'

export const testRouter = (...args: any[]) => {
  const db: MongoDB = args[0]
  const test = db.collection('test')

  const router = Router()

  return router
    .get('/', async (req, res) => {
      try {
        const findResult = await test.find({}).toArray()
        res.json({ok: true, body: findResult})
      } catch (e) {
        if (e instanceof Error) {
          res.json({ok: false, message: e.message})
        }
      }
    })
    .get('/:id', async (req, res) => {
      const {id} = req.params
      console.log('1', id)
      try {
        const findOneResult = (await test.findOne({id})) || {}
        res.json({ok: true, findOneResult})
      } catch (e) {
        if (e instanceof Error) {
          res.json({ok: false, message: e.message})
        }
      }
    })
    .post('/', async (req, res) => {
      const {body} = req
      try {
        try {
          // 항상 id: '1234' 인 문서가 단 하나만 있도록
          // 과거 문서를 모두 지움(보통은 필요없는 코드)
          await test.drop()
        } catch (e) {
          // 오류 무시
        }

        const insertResult = await test.insertOne({id: '1234', ...body})
        const {insertedId} = insertResult
        const findResult = await test.findOne({_id: insertedId})
        res.json({ok: true, findResult})
      } catch (e) {
        if (e instanceof Error) {
          res.json({ok: false, message: e.message})
        }
      }
    })
    .put('/:id', async (req, res) => {
      // id 값을 가진 데이터의 수정을 요청하는 경우
      const {id} = req.params
      const {body} = req
      try {
        const updateResult = await test.findOneAndUpdate(
          {id},
          {$set: body},
          {returnDocument: 'after'}
        )
        res.json({ok: true, body: updateResult && updateResult})
      } catch (e) {
        if (e instanceof Error) {
          res.json({ok: false, message: e.message})
        }
      }
    })
    .delete('/:id', async (req, res) => {
      const {id} = req.params
      try {
        await test.deleteOne({id})
        res.json({ok: true, id})
      } catch (e) {
        if (e instanceof Error) {
          res.json({ok: false, message: e.message})
        }
      }
    })
}
