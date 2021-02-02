import { schema } from 'normalizr'

type SchemaID = number

export interface Article {
  id: number
  title: string
  user: SchemaID
  like: boolean
  likeNum: number
}

export interface User {
  id: number
  nickname: string
}

export const user = new schema.Entity('user')
export const article = new schema.Entity('article', {
  user
})

