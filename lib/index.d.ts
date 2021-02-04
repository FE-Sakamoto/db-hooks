import { Tables, DB, AllID, ID } from './types';
import { Draft } from 'immer';
export declare function createDB<T extends Tables>(initDB: DB<T>, initId: AllID<T>): {
    useDB: (tableName: keyof T, id: ID) => T[keyof T];
    editDB: (edit: (db: Draft<DB<T>>) => void) => void;
    updateDB: (dbData: any) => void;
};
export declare function merge(target: object, ...arg: object[]): object;
