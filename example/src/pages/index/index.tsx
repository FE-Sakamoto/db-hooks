import React, {useEffect, useCallback} from 'react'
import Taro from '@tarojs/taro'
import { View, ITouchEvent, Button, Text } from '@tarojs/components'
import {normalize} from 'normalizr'
import {db} from '../../mock'
import {article} from '../../types'
import { useDB, updateDB, editDB } from '../../db'
import { useState } from 'react';


function fetchData(){
  return new Promise(resolve=>{
    setTimeout(()=>{
      resolve(db)
    }, 1000)
  })
}

export const Cell: React.FC<{id: number}> = ({id}) => {
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

const Index: React.FC = () => {
  const [ids, setIds] = useState([])
  useEffect(()=>{
    fetchData().then(res=>{
      const data = normalize(res, [article])
      updateDB(data.entities)
      setIds(data.result)
    })
  }, [])
  return (
    <View>
      {ids.map(id=>(
        <View key={id} onClick={()=>{
          Taro.navigateTo({
            url: `/pages/detail/index?id=${id}`
          })
        }}>
          <Cell id={id} />
        </View>
      ))}

      <Button onClick={()=>{
        Taro.navigateTo({
          url: '/pages/mine/index'
        })
      }}>编辑个人信息</Button>
    </View>
  )
}

export default React.memo(Index)
