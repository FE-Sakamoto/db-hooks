import {createDB} from './dbhooks'
import {Article, User} from './types'

export const {useDB, updateDB, updateRow} = createDB<{
  article: Article,
  user: User
}>({
  article: {},
  user: {}
}, {
  article: {},
  user: {}
})