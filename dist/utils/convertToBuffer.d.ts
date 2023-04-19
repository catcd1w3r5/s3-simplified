/// <reference types="node" />
/// <reference types="node" />
import { Readable } from "stream";
export declare function blobToBuffer(blob: Blob): Promise<Buffer>;
export declare function readableToBuffer(stream: Readable): Promise<Buffer>;
export declare function readableStreamToBuffer(stream: ReadableStream): Promise<Buffer>;
