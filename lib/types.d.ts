export declare type ID = string | number;
export interface Schema {
    id: ID;
}
export declare type Tables = {
    [key: string]: Schema;
};
export declare type DB<T extends Tables> = {
    [key in keyof T]: {
        [id in ID]: T[key];
    };
};
export declare type AllID<T extends Tables> = {
    [key in keyof T]: {
        [id in ID]: number;
    };
};
