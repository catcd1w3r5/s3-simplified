import { S3 } from "@aws-sdk/client-s3";
import { Config, UserConfig } from "../../interfaces/config";
import { bucketStatus } from "../../types";
import { S3BucketInternal } from "../buckets/s3BucketInternal";
export declare class S3libInternal {
    protected readonly s3: S3;
    readonly config: Config;
    constructor(config: UserConfig);
    createBucket(bucketName: string): Promise<S3BucketInternal>;
    deleteBucket(bucketName: string): Promise<void>;
    listBuckets(): Promise<Array<string>>;
    getBucket(bucketName: string): Promise<S3BucketInternal>;
    getBucketStatus(bucketName: string): Promise<bucketStatus>;
}
