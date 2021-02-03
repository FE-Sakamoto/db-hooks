export interface Schema {
    id: number;
}
export declare type Tables = {
    [key: string]: Schema;
};
export declare type DB<T extends Tables> = {
    [key in keyof T]: {
        [id: number]: T[key];
    };
};
export declare type AllID<T extends Tables> = {
    [key in keyof T]: {
        [key: number]: number;
    };
};
