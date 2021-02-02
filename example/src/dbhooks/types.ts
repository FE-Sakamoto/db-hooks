export interface Schema {
  id: number
}

export type Tables = {
  [key: string]: Schema
}

export type DB<T extends Tables> = {
  [key in keyof T]: {
    [id: number]: T[key]
  }
}

export type AllID<T extends Tables> = {
  [key in keyof T]: {
    [key: number]: number
  }
}
  