import crypto from 'crypto';
import {S3ObjectBuilder} from "../classes";


export const generateUUID = (obj:S3ObjectBuilder): string => {
    return crypto.randomBytes(16).toString('hex');
}
