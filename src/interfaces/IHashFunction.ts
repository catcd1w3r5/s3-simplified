import {S3ObjectBuilder} from "../classes";

export type IHashFunction = (obj: S3ObjectBuilder) => string;
