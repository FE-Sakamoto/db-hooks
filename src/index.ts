import { useState, useEffect } from 'react'
import { Tables, DB, AllID, ID } from './types'
import produce, { Draft } from 'immer'

export function createDB<T extends Tables>(initDB: DB<T>, initId: AllID<T>){
  type TableName = keyof T
  let db = initDB
  const allID = initId
  const updaters = new Map<number, [TableName, ID, any, React.Dispatch<React.SetStateAction<any>>]>()
  let index = 0
  function useDB<T extends TableName>(tableName: T, id: ID) {
    const [data, setData] = useState(db[tableName][id])

    useEffect(()=>{
      // @ts-ignore
      allID[tableName][id] = allID[tableName][id] || 0; allID[tableName][id] += 1

      const key = index++
      updaters.set(key, [tableName, id, data, setData])

      return ()=> {
        // @ts-ignore
        allID[tableName][id] -= 1
        if (allID[tableName][id] === 0) {
          delete db[tableName][id]
        }
        updaters.delete(key)
      }
    }, [])
    return data
  }

  function reRender(){
    updaters.forEach(updater => {
      const newData = db[updater[0]][updater[1]]
      if (newData !== updater[2]) {
        updater[3](newData)
      }
    })
  }

  function updateDB(dbData: any){
    merge(db, dbData)
    reRender()
  }


  function editDB(edit: (db: Draft<DB<T>>)=>void){
    db = produce(db, edit)
    reRender()
  }

  return {
    useDB,
    editDB,
    updateDB,
  }
}


export function merge(target: object, ...arg: object[]) {
  return arg.reduce((acc, cur: any) => {
    return Object.keys(cur).reduce((subAcc: any, key) => {
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
