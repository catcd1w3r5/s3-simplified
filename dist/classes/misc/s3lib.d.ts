import { S3 } from "@aws-sdk/client-s3";
import { IS3, S3BucketService } from "../../interfaces";
import { Regions } from "../../types";
export declare class S3Lib implements IS3 {
    static readonly Default: IS3;
    readonly s3: S3;
    readonly region: Regions;
    constructor(region?: Regions, accessKeyId?: string, secretAccessKey?: string);
    createBucket(bucketName: string): Promise<S3BucketService>;
    deleteBucket(bucketName: string): Promise<void>;
    listBuckets(): Promise<Array<string>>;
    getBucket(bucketName: string): Promise<S3BucketService>;
    getOrCreateBucket(bucketName: string): Promise<S3BucketService>;
    containsBucket(bucketName: string): Promise<boolean>;
    private getBucketInternal;
}
