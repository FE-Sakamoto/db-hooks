import { Draft } from 'immer';
import { Tables, DB, AllID, ID } from './types';
export declare function createDB<T extends Tables>(initDB: DB<T>, initId: AllID<T>): {
    useDB: <K extends keyof T>(tableName: K, id: ID) => T[K];
    editDB: (edit: (db: Draft<DB<T>>) => void) => void;
    updateDB: (dbData: any) => void;
    snapshotDB: <K_1 extends keyof T>(tableName: K_1, id: ID) => T[K_1];
};
export declare function merge(target: object, ...arg: object[]): object;
