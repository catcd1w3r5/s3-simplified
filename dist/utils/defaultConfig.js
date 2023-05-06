"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
var constants_1 = require("./constants");
var generateUUID_1 = require("./generateUUID");
exports.defaultConfig = {
    signedUrl: {
        expiration: 5 * constants_1.Minute,
    },
    objectCreation: {
        multiPartUpload: {
            maxPartSize: 100 * constants_1.MB,
            enabledThreshold: 100 * constants_1.MB,
        },
        appendFileTypeToKey: true,
        hash: {
            function: generateUUID_1.generateUUID,
            requireBuffer: true,
            requireMetadata: true,
        }
    }
};
