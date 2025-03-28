import {MongoDB} from '../mongodb'
import {stringToObjectId} from "../mongodb";
import {Router} from 'express'
import * as U from '../utils'

export const authRouter = (...args:any[])=> {
  const db: MongoDB = args[0]
  const user = db.collection('user')
  const router = Router()

  return router.post('/signup', async(req,res)=> {
    const {body} = req

    try {
      console.log('/signup', body)
      const exists = await user.findOne({email:body.email})

      if (exists) {
        res.json({ok:false, errorMsg:'Email already exists'})
      } else {
        const {email, password} = body
        const hashed = await U.hashPasswordP(password)
        const newBody = {email, password:hashed}
        const {insertedId} = await user.insertOne(newBody)
        const jwt = await U.jwtSignP({userId:insertedId})

        res.json({ok:true, body:jwt})
      }
    } catch (error) {
      if (error instanceof Error) {
        res.json({ok:false, errorMsg:error.message})
      }
    }
  })
    .post('/login', async(req,res)=> {
      const {authorization} = req.headers || {}
      if (!authorization) {
        res.json({ok:false, errorMsg:'No token provided'})
        return
      }
      try {
        const tmp = authorization.split(' ')
        if (tmp.length !== 2) {
          res.json({ok:false, errorMsg:'No token in headers'})
        } else {
          const jwt = tmp[1]
          const decode = (await U.jwtVerifyP(jwt)) as {userId:string}
          const result = await user.findOne({_id:stringToObjectId(decode.userId)})
          if (!result) {
            res.json({ok:false, errorMessage:'등록되지 않은 사용자입니다.'})
            return
          }

          const {email, password} = req.body
          if (email !== result.email) {
            res.json({ok:false, errorMsg:'Email 주소가 틀립니다.'})
            return
          }
          const same = await U.comparePasswordP(password, result.password)
          if (!same) {
            res.json({ok:false, errorMessage:'비밀번호가 틀립니다.'})
            return
          }

          res.json({ok:true})
        }
      } catch (e) {
        if (e instanceof Error) res.json({ok:false, errorMsg:e.message})
      }
    })
}