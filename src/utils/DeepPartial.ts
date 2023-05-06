export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

/**
 *
 * remove all properties with undefined or null values from nested objects
 * @param obj
 */
export function prune(obj: any): any {
    if (obj === undefined) return undefined;
    if (obj === null) return undefined;
    if (typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(prune);
    const result: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
        const value = prune(obj[key]);
        if (value !== undefined) result[key] = value;
    }
    return result;
}
