import {Readable} from "stream";
import {Metadata} from "../misc/metadata";
import {generateUUID} from "../../utils/generateUUID";
import {IMetadata} from "../../interfaces";
import {FileTypeParser} from "../../utils/fileTypeParser";
import {ConvertToBuffer} from "../../utils/convertToBuffer";
import {getConfig} from "../../utils/config";

type AcceptedDataTypes = Readable | ReadableStream | Blob | string | Uint8Array | Buffer

export class S3ObjectBuilder {
    private data: BufferManager

    constructor(data: AcceptedDataTypes, private metadata: Metadata = new Metadata()) {
        if (this.UUID === undefined) this.UUID = generateUUID();
        this.data = new BufferManager(data);
    }

    public get Body(): Promise<Buffer> {
        return this.data.getBuffer();
    }

    public get Metadata(): IMetadata {
        return this.metadata;
    }

    public get DataSize(): Promise<number> {
        const sizeStr = this.metadata.get("Content-Length");
        if (sizeStr !== undefined) return new Promise<number>(resolve => resolve(parseInt(sizeStr)));
        return this.data.getBuffer().then(buffer => {
            const size = buffer.length;
            this.metadata.set("Content-Length", size.toString());
            return size;
        });

    }

    public get Type(): string | undefined {
        return this.metadata.get("Content-Type");
    }

    public get Extension(): string | undefined {
        const ext = this.metadata.get("File-Type");
        if (ext) return ext;
        return this.generateExtension();
    }

    private generateExtension(): string | undefined {
        const type = this.Type;
        if (type === undefined) return undefined;
        const fileType = FileTypeParser(type);
        this.metadata.set("File-Type", fileType);
        return fileType;
    }

    public get UUID(): string {
        const uuid = this.metadata.get("Content-Disposition");
        if (uuid) return uuid;
        const newUuid = generateUUID();
        this.UUID = newUuid;
        return newUuid;
    }

    private set UUID(value: string) {
        if (value) this.metadata.set("Content-Disposition", value);
    }

    public get Id(): string {
        const id = this.metadata.get("identifier");
        if (id) return id;
        return this.generateIdentifier();
    }

    private generateIdentifier(): string {
        const uuid = this.UUID;
        const ext = this.Extension; // This will generate the extension if it doesn't exist, so we call it even if we don't need it.
        const newId = (getConfig().appendFileTypeToKey) ? uuid + "." + ext : uuid;
        this.metadata.set("identifier", newId);
        return newId;
    }

    public async AsBuffer(): Promise<Buffer> {
        return await this.data.getBuffer();
    }


}

class BufferManager {
    private buffer?: Buffer
    private readonly promise: Promise<Buffer>

    constructor(data: AcceptedDataTypes) {
        this.promise = ConvertToBuffer(data)
    }

    public async getBuffer(): Promise<Buffer> {
        if (this.buffer) return this.buffer;
        this.buffer = await this.promise;
        return this.buffer;
    }
}
