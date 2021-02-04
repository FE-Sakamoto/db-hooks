export type ID = number | string

export interface Schema {
  id: ID
}

export type Tables = {
  [key: string]: Schema
}

export type DB<T extends Tables> = {
  [key in keyof T]: {
    [id in ID]: T[key]
  }
}

export type AllID<T extends Tables> = {
  [key in keyof T]: {
    [key in ID]: number
  }
}
  