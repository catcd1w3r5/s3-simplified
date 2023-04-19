"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
var configTemplate_1 = require("./configTemplate");
try {
    // noinspection ES6ConvertVarToLetConst
    var userConfig = require("/s3.config"); //purposely used var here, its intentional
}
catch (e) {
    var err = new Error("s3.config.ts is missing, please create one and add it to the root directory");
    err.stack = undefined; // Remove the stack trace to make it look cleaner, the stack trace is not needed for this error anyway
    throw err;
}
var combined;
var getConfig = function () {
    if (!combined) {
        var temp = __assign(__assign({}, configTemplate_1.defaultConfig), userConfig.config);
        if (!temp.accessKey) {
            throw new Error("Access key is required");
        }
        if (!temp.region) {
            throw new Error("Region is required");
        }
        combined = temp;
    }
    return combined;
};
exports.getConfig = getConfig;
