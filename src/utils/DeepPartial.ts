export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export function prune(obj: any): any {
    // remove all properties with undefined values from nested objects
    return JSON.parse(JSON.stringify(obj));
}
