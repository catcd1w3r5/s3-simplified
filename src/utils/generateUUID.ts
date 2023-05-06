import crypto from 'crypto';
import {IMetadata} from "../interfaces";


export const generateUUID = (buffer: Buffer | undefined, metadata: Record<string, string>|undefined): string => {
    return crypto.randomBytes(16).toString('hex');
}
