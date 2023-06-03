import {ProvidedConfig} from "../interfaces/config";
import {defaultHashFn} from "./defaultHashFnFallback";

export const defaultConfig: ProvidedConfig = {
    signedUrl: {
        expiration: 300, // 5 minutes
    },
    objectCreation: {
        multiPartUpload: {
            maxPartSize: 250 * 1024 * 1024, // upload in 250MB chunks
            enabledThreshold: 250 * 1024 * 1024, // enable multipart upload for files larger than 500MB
        },
        appendFileTypeToKey: true,
        hash: {
            function :defaultHashFn,
            requireBuffer: false,
            requireMetadata: false,
        }
    }
}
