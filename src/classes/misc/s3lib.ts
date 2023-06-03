import {IS3, S3BucketService, UserConfig} from "../../interfaces";
import {InvalidBucketName} from "./errors";
import {bucketStatus} from "../../types";
import {S3libInternal} from "./s3libInternal";
import {S3Bucket} from "../buckets/s3Bucket";

export class S3Lib implements IS3 {
    private readonly internal: S3libInternal;

    constructor(config: UserConfig) {
        this.internal = new S3libInternal(config);
    }

    public async createBucket(bucketName: string): Promise<S3BucketService> {
        const bucketInternal = await this.internal.createBucket(bucketName);
        return new S3Bucket(bucketInternal, this.internal.config)
    }

    public async deleteBucket(bucketName: string): Promise<void> {
        await this.assetBucketOwnership(bucketName);
        return this.internal.deleteBucket(bucketName);
    }

    public async listBuckets(): Promise<Array<string>> {
        return await this.internal.listBuckets();
    }

    public async getBucket(bucketName: string): Promise<S3BucketService> {
        await this.assetBucketOwnership(bucketName);
        const bucketInternal = await this.internal.getBucket(bucketName);
        return new S3Bucket(bucketInternal, this.internal.config)
    }

    public async getOrCreateBucket(bucketName: string): Promise<S3BucketService> {
        const bucketStatus = await this.getBucketStatus(bucketName);
        if(bucketStatus === 'not owned')
            throw new InvalidBucketName(bucketName, `${bucketName} is owned by another user`);
        const bucketInternal = (bucketStatus === 'owned') ?
            await this.internal.getBucket(bucketName) :
            await this.internal.createBucket(bucketName);
        return new S3Bucket(bucketInternal, this.internal.config)
    }

    public async getBucketStatus(bucketName: string): Promise<bucketStatus> {
        return this.internal.getBucketStatus(bucketName);
    }

    private async assetBucketOwnership(bucketName: string): Promise<void> {
        const bucketStatus = await this.getBucketStatus(bucketName);
        if (bucketStatus !== 'owned') {
            throw new InvalidBucketName(bucketName, `${bucketName} is not accessible by the user`);
        }
    }
}

