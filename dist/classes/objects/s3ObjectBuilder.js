"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3ObjectBuilder = void 0;
var stream_1 = require("stream");
var metadata_1 = require("../misc/metadata");
var generateUUID_1 = require("../../utils/generateUUID");
var fileTypeParser_1 = require("../../utils/fileTypeParser");
var convertToBuffer_1 = require("../../utils/convertToBuffer");
var config_1 = require("../../utils/config");
var S3ObjectBuilder = /** @class */ (function () {
    function S3ObjectBuilder(data, metadata) {
        if (metadata === void 0) { metadata = new metadata_1.Metadata(); }
        this.data = data;
        this.metadata = metadata;
        if (this.UUID === undefined)
            this.UUID = (0, generateUUID_1.generateUUID)();
    }
    Object.defineProperty(S3ObjectBuilder.prototype, "Body", {
        get: function () {
            return this.data;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(S3ObjectBuilder.prototype, "Metadata", {
        get: function () {
            return this.metadata;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(S3ObjectBuilder.prototype, "DataSize", {
        get: function () {
            var sizeStr = this.metadata.get("Content-Length");
            if (sizeStr === undefined)
                throw new Error("Content-Length is undefined");
            return parseInt(sizeStr);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(S3ObjectBuilder.prototype, "Type", {
        get: function () {
            return this.metadata.get("Content-Type");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(S3ObjectBuilder.prototype, "Extension", {
        get: function () {
            var ext = this.metadata.get("File-Type");
            if (ext)
                return ext;
            return this.generateExtension();
        },
        enumerable: false,
        configurable: true
    });
    S3ObjectBuilder.prototype.generateExtension = function () {
        var type = this.Type;
        if (type === undefined)
            return undefined;
        var fileType = (0, fileTypeParser_1.FileTypeParser)(type);
        this.metadata.set("File-Type", fileType);
        return fileType;
    };
    Object.defineProperty(S3ObjectBuilder.prototype, "UUID", {
        get: function () {
            var uuid = this.metadata.get("Content-Disposition");
            if (uuid)
                return uuid;
            var newUuid = (0, generateUUID_1.generateUUID)();
            this.UUID = newUuid;
            return newUuid;
        },
        set: function (value) {
            if (value)
                this.metadata.set("Content-Disposition", value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(S3ObjectBuilder.prototype, "Id", {
        get: function () {
            var id = this.metadata.get("identifier");
            if (id)
                return id;
            return this.generateIdentifier();
        },
        enumerable: false,
        configurable: true
    });
    S3ObjectBuilder.prototype.generateIdentifier = function () {
        var uuid = this.UUID;
        var ext = this.Extension; // This will generate the extension if it doesn't exist, so we call it even if we don't need it.
        var newId = ((0, config_1.getConfig)().appendFileTypeToKey) ? uuid + "." + ext : uuid;
        this.metadata.set("identifier", newId);
        return newId;
    };
    // Some of the methods results in the data being "casted" to a Buffer, while others copy the data directly to a buffer.
    S3ObjectBuilder.prototype.AsBuffer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                data = this.data;
                if (Buffer.isBuffer(data))
                    return [2 /*return*/, data];
                if (data instanceof Uint8Array)
                    return [2 /*return*/, Buffer.from(data.buffer)];
                if (typeof data === 'string')
                    return [2 /*return*/, Buffer.from(data)];
                if (data instanceof Blob)
                    return [2 /*return*/, (0, convertToBuffer_1.blobToBuffer)(data)];
                if (data instanceof stream_1.Readable)
                    return [2 /*return*/, (0, convertToBuffer_1.readableToBuffer)(data)];
                if (data instanceof ReadableStream)
                    return [2 /*return*/, (0, convertToBuffer_1.readableStreamToBuffer)(data)];
                throw new Error("Invalid data type");
            });
        });
    };
    return S3ObjectBuilder;
}());
exports.S3ObjectBuilder = S3ObjectBuilder;
