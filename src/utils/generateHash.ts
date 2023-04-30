import crypto from 'crypto';
import {IMetadata} from "../interfaces";


export const generateHash = (buffer: Buffer, metadata: IMetadata): string => {
    const hash = crypto.createHash('sha512');
    const record = metadata.asRecord();
    Object.keys(record).sort().forEach(key => {
        hash.update(key);
        hash.update(record[key]);
    });
    hash.update(buffer);
    return hash.digest('hex');
}
