declare abstract class S3Error extends Error {
}
export declare class MissingBucket extends S3Error {
    constructor(bucketName: string);
}
export declare class InvalidBucketName extends S3Error {
    constructor(bucketName: string, message?: string);
}
export declare class MissingObject extends S3Error {
    constructor(key: string, bucketName: string);
}
export declare class ExistingObject extends S3Error {
    constructor(key: string, bucketName: string);
}
export {};
