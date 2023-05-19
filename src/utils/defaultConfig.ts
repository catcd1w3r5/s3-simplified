import {MB, Minute} from "./constants";
import {OptionalConfig} from "../interfaces/config";
import {defaultHashFn} from "./defaultHashFnFallback";

export const defaultConfig: OptionalConfig = {

    signedUrl: {
        expiration: 5 * Minute,
    },

    objectCreation: {
        multiPartUpload: {
            maxPartSize: 100 * MB,
            enabledThreshold: 100 * MB,
        },
        appendFileTypeToKey: true,
        hash: {
            function :defaultHashFn,
            requireBuffer: false,
            requireMetadata: false,
        }
    }
}
