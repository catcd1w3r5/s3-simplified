import crypto from 'crypto';
import {IMetadata} from "../interfaces";


export const generateUUID = async (buffer: Buffer | undefined, metadata: Record<string, string>|undefined): Promise<string> => {
    return crypto.randomBytes(16).toString('hex');
}
