import React, {useState, useCallback} from 'react'
import { View, Input, Button } from '@tarojs/components'
import {useDB, updateRow} from '../../db'

const Index: React.FC = () => {
  const userId = 22
  const user = useDB('user', userId)
  const [nickName, setNickName] = useState(user?.nickname)
  const editNickName = useCallback(()=>{

    updateRow('user', userId, {
      nickname: nickName
    })
  }, [nickName])
  return (
    <View>
      <Input value={nickName} onInput={e=>{
        setNickName(e.detail.value)
      }}></Input>
      <Button onClick={editNickName}>修改</Button>
    </View>
  )
}

export default React.memo(Index)
