/// <reference types="node" />
/// <reference types="node" />
import { Readable } from "stream";
import { Metadata } from "../misc/metadata";
import { IMetadata } from "../../interfaces";
type AcceptedDataTypes = Readable | ReadableStream | Blob | string | Uint8Array | Buffer;
export declare class S3ObjectBuilder {
    private data;
    private metadata;
    constructor(data: AcceptedDataTypes, metadata?: Metadata);
    get Body(): AcceptedDataTypes;
    get Metadata(): IMetadata;
    get DataSize(): number;
    get Type(): string | undefined;
    get Extension(): string | undefined;
    private generateExtension;
    get UUID(): string;
    private set UUID(value);
    get Id(): string;
    private generateIdentifier;
    AsBuffer(): Promise<Buffer>;
}
export {};
