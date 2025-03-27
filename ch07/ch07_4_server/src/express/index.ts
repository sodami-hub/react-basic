import express from 'express'
import cors from 'cors'
import {setupRouters} from './setupRouters'

export const createExpressApp = (...args: any[]) => {
  const app = express()
  app
    .use((req, res, next) => {
      console.log(`url=${req.url}, method=${req.method.toUpperCase()}`)
      next()
    })
    .use(express.static('public'))
    .use(cors())
    .use(express.json())
    .get('/', (req, res) => {
      res.json({message: 'hello world!!!'})
    })

  return setupRouters(app, ...args)
}
