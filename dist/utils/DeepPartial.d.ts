export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;
/**
 *
 * remove all properties with undefined or null values from nested objects
 * @param defaultValue
 * @param customValue
 */
export declare function pruneAndMerge(defaultValue: any, customValue: any): any;
