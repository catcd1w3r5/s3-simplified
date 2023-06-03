import { IS3Object, S3BucketService } from '../../interfaces';
import {ExistingObject, InvalidBucketName, MissingObject} from '../errors';
import { S3BucketInternal } from './s3BucketInternal';
import { S3ObjectBuilder } from '../objects/s3ObjectBuilder';
import { Config } from '../../interfaces/config';


function validateBucketName(bucketName: string): void {
  //Naming rules
  // https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html

  //Define Rules (rules below have more restrictions than the ones listed in the link above e.g. periods are allowed but not recommended for optimal performance, so they're simply not allowed here)
  if (!(bucketName.length >= 3 && bucketName.length <= 63))
throw new InvalidBucketName(bucketName, `${bucketName} must be between 3 and 63 characters long`);
if (!(/^[a-z0-9]/.test(bucketName)))
  throw new InvalidBucketName(bucketName, `${bucketName} must start with a letter or number`);
if (!(/[a-z0-9]$/.test(bucketName)))
  throw new InvalidBucketName(bucketName, `${bucketName} must end with a letter or number`);
if (bucketName.includes('.') || bucketName.includes('_'))
  throw new InvalidBucketName(bucketName, `${bucketName} must not contain "." or "_"`);
if (bucketName !== bucketName.toLowerCase())
  throw new InvalidBucketName(bucketName, `${bucketName} must not contain any uppercase characters`);
if (bucketName.endsWith('-s3alias') || bucketName.endsWith('--ol-s3'))
  throw new InvalidBucketName(bucketName, `${bucketName} must not end with be -s3alias or --ol-s3`);
if (bucketName.startsWith('xn--'))
  throw new InvalidBucketName(bucketName, `${bucketName} must not start with be xn--`);
}

export class S3Bucket implements S3BucketService {
  private internal: S3BucketInternal;
  private readonly config: Config;


  public constructor(internal: S3BucketInternal, config: Config) {
    this.internal = internal;
    this.config = config;
    validateBucketName(this.internal.bucketName);
  }

  public async getObjectId(s3Object: S3ObjectBuilder): Promise<string> {
    return await this.internal.getS3ObjectId(s3Object, this.config.objectCreation);
  }

  public async getOrCreateObject(s3Object: S3ObjectBuilder): Promise<IS3Object> {
    const s3ObjectId = await this.internal.getS3ObjectId(s3Object, this.config.objectCreation);
    if (await this.internal.containsObject(s3ObjectId)) {
      return this.internal.getObject(s3ObjectId, this.config);
    }
    return this.createObject(s3Object);
  }

  public async createObject(s3Object: S3ObjectBuilder): Promise<IS3Object> {
    const s3ObjectId = await this.internal.getS3ObjectId(s3Object, this.config.objectCreation);
    await this.assertNoConflicts(s3ObjectId);
    const size = await s3Object.DataSize;
    if (size === undefined) throw new Error('Data size is undefined');
    return size <= this.config.objectCreation.multiPartUpload.enabledThreshold ?
      this.internal.createObject_Single(s3Object, this.config) :
      this.internal.createObject_Multipart(s3Object, this.config);
  }

  public async getObject(key: string): Promise<IS3Object> {
    await this.assertExists(key);
    return this.internal.getObject(key, this.config);
  }

  public async getObjects(keys: string[]): Promise<IS3Object[]> {
    return Promise.all(keys.map(key => this.getObject(key)));
  }

  public async deleteObject(key: string): Promise<void> {
    await this.assertExists(key);
    return this.internal.deleteObject(key);
  }

  public async deleteObjects(keys: string[]): Promise<void> {
    await Promise.all(keys.map(key => this.deleteObject(key)));
  }

  public async renameObject(oldKey: string, newKey: string): Promise<void> {
    await Promise.all([this.assertNoConflicts(newKey), this.assertExists(oldKey)]);
    return this.internal.renameObject(oldKey, newKey);
  }

  public async getAllObjects(): Promise<IS3Object[]> {
    const objectKeys = await this.internal.listContents();
    const promises = objectKeys.map(key => this.internal.getObject(key, this.config));
    return Promise.all(promises);
  }

  public async contains(key: string): Promise<boolean> {
    return this.internal.containsObject(key);
  }

  public async listContent(): Promise<Array<string>> {
    return this.internal.listContents();
  }

  protected async assertExists(key: string): Promise<void> {
    if (!await this.internal.containsObject(key)) throw new MissingObject(key, this.internal.bucketName);
  }

  protected async assertNoConflicts(key: string): Promise<void> {
    if (await this.internal.containsObject(key)) throw new ExistingObject(key, this.internal.bucketName);
  }
}
