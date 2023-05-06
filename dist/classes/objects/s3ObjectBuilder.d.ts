/// <reference types="node" />
/// <reference types="node" />
import { Readable } from "stream";
import { Metadata } from "../misc/metadata";
import { IMetadata } from "../../interfaces";
import { ObjectCreationConfig } from "../../interfaces/config";
type AcceptedDataTypes = Readable | ReadableStream | Blob | string | Uint8Array | Buffer;
export declare class S3ObjectBuilder {
    private metadata;
    private data;
    constructor(data: AcceptedDataTypes, metadata?: Metadata);
    get Body(): Promise<Buffer>;
    get Metadata(): IMetadata;
    get DataSize(): Promise<number>;
    get Type(): string | undefined;
    get Extension(): string | undefined;
    private generateExtension;
    getUUID(config: ObjectCreationConfig): Promise<string>;
    private generateUUID;
    AsBuffer(): Promise<Buffer>;
}
export {};
