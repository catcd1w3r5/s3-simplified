import {randomUUID} from 'crypto';


export const defaultHashFn = async (buffer: Buffer | undefined, metadata: Record<string, string>|undefined): Promise<string> => {
    return randomUUID();
}
