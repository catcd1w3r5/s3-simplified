"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pruneAndMerge = void 0;
/**
 *
 * remove all properties with undefined or null values from nested objects
 * @param defaultValue
 * @param customValue
 */
function pruneAndMerge(defaultValue, customValue) {
    if (defaultValue === undefined || defaultValue === null)
        return undefined;
    if (customValue === undefined || customValue === null)
        return defaultValue;
    if (typeof defaultValue !== "object")
        return customValue;
    if (Array.isArray(defaultValue))
        return defaultValue.map(pruneAndMerge);
    var result = {};
    for (var _i = 0, _a = Object.keys(defaultValue); _i < _a.length; _i++) {
        var key = _a[_i];
        var value = pruneAndMerge(defaultValue[key], customValue[key]);
        if (value !== undefined)
            result[key] = value;
    }
    return result;
}
exports.pruneAndMerge = pruneAndMerge;
