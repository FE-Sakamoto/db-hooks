import { useState, useEffect } from 'react'
import { Tables, DB, AllID, ID } from './types'
import produce, { Draft } from 'immer'
import {merge} from 'lodash'

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
        if (allID[tableName][id] === 0 && db[tableName][id]) {
          delete db[tableName][id]
        }
        updaters.delete(key)
      }
    }, [])
    return data
  }

  function snapshotDB<T extends TableName>(tableName: T, id: ID){
    return db[tableName][id]
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
    db = produce(db, draft => {
      merge(draft, dbData)
    })
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
    snapshotDB,
  }
}

