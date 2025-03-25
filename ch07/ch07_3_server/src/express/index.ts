import express from 'express'

export const createExpressApp = (...agrs: any[]) => {
  const app = express()
  app
    .use((req, res, next) => {
      console.log(`url=${req.url}, method=${req.method.toUpperCase()}`)
      next()
    })
    .get('/', (req, res) => {
      res.json([
        {
          message: 'hello express world!!'
        },
        {
          myAddr: {
            1: '고등로57',
            2: '고등어린이집',
            3: '사랑반',
            4: '지혜반'
          }
        }
      ])
    })
  return app
}
