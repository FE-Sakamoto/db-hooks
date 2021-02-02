import React from 'react'
import { useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
import {Cell} from '../index'

const Index: React.FC = () => {
  const id = parseInt(useRouter().params.id!, 10)
  return (
    <View>
      <Cell id={id}/>
    </View>
  )
}

export default React.memo(Index)
