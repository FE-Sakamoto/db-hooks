import { Tables, DB, AllID } from './types';
export declare function createDB<T extends Tables>(initDB: DB<T>, initId: AllID<T>): {
    useDB: <TableName extends keyof T>(tableName: TableName, id: number) => T[TableName];
    updateDB: (data: any) => void;
    updateRow: <TableName_1 extends keyof T>(tableName: TableName_1, id: number, data: Partial<DB<T>[TableName_1][number]>) => void;
};
export declare function merge(target: object, ...arg: object[]): object;
