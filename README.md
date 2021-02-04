

<div align="center">
<a href="https://www.npmjs.com/db-hooks" target="_blank"><img src="https://img.shields.io/npm/v/db-hooks" alt="Npm Version" /></a>
<a href="https://www.npmjs.com/db-hooks" target="_blank"><img src="https://img.shields.io/npm/l/db-hooks?style=flat-square" alt="Package License" /></a>
<a href="https://www.npmjs.com/db-hooks" target="_blank"><img src="https://img.shields.io/npm/dm/db-hooks" alt="Downloads" /></a>
</div>

## 概览

`db-hooks`是一款小巧的[范式化State](https://redux.js.org/faq/organizing-state#organizing-state)管理工具(推荐使用[normalizr](https://github.com/paularmstrong/normalizr)范式化数据)，完美解决的本地数据不同步的问题。如果你厌烦了不停处理项目中各种数据同步问题，那么不妨来试试`db-hooks`能完美满足你的需求。

## 场景

常见数据不同步场景如下

```jsx
// PageA (article list)
data: [{article1}, {article2}, {article3}...]
```

```jsx
// 点击article2进入 article2详情页面 PageB(artice2 detail)
data: {article2}
```

这时候在pageB对article2进行点赞(点赞数+1)等副作用操作只会影响当前PageB里的article数据

返回PageA article2显示的点赞数及点赞状态都与PageB中的不一致，**产生这种现象的原因就是同一个article数据存在了多份，副作用操作只能影响到当前page的article。**

解决这种问题的思路就是将所有视为统一类型的数据仅保留一份。实现方式如下：

1. 本地维护一个对象充当数据库
2. 页面获取数据后不直接持有数据，而是拿着数据去更新数据库，然后仅保留id，用id去数据库查找数据。
3. 不同组件编辑数据会直接修改数据库中的数据，所有引用该数据的组件都会触发更新。

## 特性
1.  使用hooks实现，零依赖，零学习成本。
2.  结构简单，核心代码不足100行。
3.  完整的Typescript支持

## 安装
```javascript
npm i db-hooks --save
```



## 使用

#### 1.定义模型
```javascript
// 服务器返回的json
[
  {
    id: 42,
    title: '宇宙终极答案',
    like: false,
    likeNum: 233,
    user: {
      id: 22,
      nickname: '22娘'
    }
  },
  {
    id: 89757,
    title: '编号:89757',
    like: true,
    likeNum: 9,
    user: {
      id: 33,
      nickname: '33娘'
    }
  }
]


// 类型声明
type SchemaID = number // SchemaID表示 表关系

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

// 创建schema
export const user = new schema.Entity('user')
export const article = new schema.Entity('article', {
  user
})

// 初始化数据库
import {createDB} from 'db-hooks'

export const {useDB, updateDB, editDB} = createDB<{
  article: Article,
  user: User
}>({
  article: {},
  user: {}
}, {
  article: {},
  user: {}
})

```



```typescript
const [ids, setIds] = useState([])

fetchData().then(res=>{ // 服务器返回的json
  const data = normalize(res, [article]) // normalizr范式化数据
  updateDB(data.entities) // 会对db进行merge操作
  setIds(data.result)
})
```



```tsx

const Cell: React.FC<{id: number}> = ({id}) => {
  const article = useDB('article', id)
  const user = useDB('user', article.user)
  const onLikeClick = useCallback((event: ITouchEvent)=>{
    event.stopPropagation()
    editDB(db=>{
      db.article[id].likeNum = article.like? article.likeNum - 1: article.likeNum + 1,
      db.article[id].like = !article.like
    })
  }, [article])
  return <View className='article-cell' style={{fontSize: '20px', color:'#666666', marginBottom: '20px'}}>
    <View>发布者: {user.nickname}</View>
    <View>{article.title}</View>
    <View>
      <Text onClick={onLikeClick} style={{color: article.like? 'red' : ''}}>{article.like? '已赞' : '点赞'}: </Text>
      <Text>{article.likeNum}</Text>
    </View>
  </View>
}

<View>
   {ids.map(id=><Cell id={id} />)}
</View>
```



## 示例

```shell
cd example
npm i
npm run dev:h5
```



![Kapture 2021-02-03 at 09.19.27](https://tva1.sinaimg.cn/large/008eGmZEly1gna30cb7h8g308c0cjqi2.gif)