import { S3 } from "@aws-sdk/client-s3";
import { IS3Object } from "../../interfaces";
import { S3Lib } from "../misc/s3lib";
import { S3ObjectBuilder } from "../objects/s3ObjectBuilder";
/**
 * An unsafe version of S3 bucket with no validation.
 */
export declare class S3BucketInternal {
    readonly bucketName: string;
    readonly bucketUrl: string;
    protected readonly s3: S3;
    private isPublic_cache?;
    /**
     * @internal
     * @param lib
     * @param bucketName
     */
    constructor(lib: S3Lib, bucketName: string);
    /**
     * Fetches the bucket ACL and bucket policy to determine if the bucket is public.
     * @param bucket The bucket to check
     * @see {@link isPublic} for a cached version of this function
     */
    protected static fetchPublicStatus(bucket: S3BucketInternal): Promise<boolean>;
    isPublic(): Promise<boolean>;
    generateSignedUrl(key: string): Promise<string>;
    generatePublicUrl(key: string): string;
    createObject_Single(s3ObjectBuilder: S3ObjectBuilder): Promise<IS3Object>;
    createObject_Multipart(s3ObjectBuilder: S3ObjectBuilder): Promise<IS3Object>;
    getBucketACL(): Promise<import("@aws-sdk/client-s3").GetBucketAclCommandOutput>;
    getBucketPolicies(): Promise<import("@aws-sdk/client-s3").GetBucketPolicyCommandOutput>;
    getObject(key: string, requireBody?: boolean): Promise<IS3Object>;
    deleteObject(key: string): Promise<void>;
    renameObject(oldKey: string, newKey: string): Promise<void>;
    listContents(): Promise<Array<string>>;
    containsObject(key: string): Promise<boolean>;
}
