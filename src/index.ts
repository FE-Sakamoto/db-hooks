import { useState, useEffect } from 'react'
import {DeepPartial, Tables, DB, AllID} from './types'

export function createDB<T extends Tables>(initDB: DB<T>, initId: AllID<T>){
  const db = initDB
  const allID = initId
  const updaters = new Map<number, ()=>void>()
  let index = 0
  function useDB<TableName extends keyof T>(tableName: TableName, id: number) {
    const [data, setData] = useState(db[tableName][id])

    function updater() {
      const newData = db[tableName][id]
      if (newData !== data) {
        setData(newData)
      }
    }

    useEffect(()=>{
      allID[tableName][id] = allID[tableName][id] || 0
      allID[tableName][id] += 1

      const key = index++
      updaters.set(key, updater)

      return ()=> {
        allID[tableName][id] -= 1
        if (allID[tableName][id] === 0) {
          delete db[tableName][id]
        }
        updaters.delete(key)
      }
    }, [])
  }

  function updateDB(data: DeepPartial<DB<T>>){
    merge(db, data)
    updaters.forEach(updater => updater())
  }

  return {
    useDB,
    updateDB
  }
}


export function merge(target: object, ...arg: object[]) {
  return arg.reduce((acc, cur) => {
    return Object.keys(cur).reduce((subAcc, key) => {
      const srcVal = cur[key]
      if (Array.isArray(srcVal)) {
        // series: []，下层数组直接赋值
        subAcc[key] = srcVal.map((item, idx) => {
          if (Object.prototype.toString.call(item) === '[object Object]') {
            const curAccVal = subAcc[key] ? subAcc[key] : []
            return merge({}, curAccVal[idx] ? curAccVal[idx] : {}, item)
          }
          return item
        })
      } else if (srcVal !== null && typeof srcVal === 'object') {
        subAcc[key] = merge({}, subAcc[key] ? subAcc[key] : {}, srcVal)
      } else {
        subAcc[key] = srcVal
      }
      return subAcc
    }, acc)
  }, target)
}