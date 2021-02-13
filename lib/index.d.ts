import { Tables, DB, AllID, ID } from './types';
import { Draft } from 'immer';
export declare function createDB<T extends Tables>(initDB: DB<T>, initId: AllID<T>): {
    useDB: <T_1 extends keyof T>(tableName: T_1, id: ID) => T[T_1];
    editDB: (edit: (db: Draft<DB<T>>) => void) => void;
    updateDB: (dbData: any) => void;
    snapshotDB: <T_2 extends keyof T>(tableName: T_2, id: ID) => T[T_2];
};
export declare function merge(target: object, ...arg: object[]): object;
