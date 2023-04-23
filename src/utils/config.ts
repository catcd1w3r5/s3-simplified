import {ConfigTemplate, defaultConfig} from "./configTemplate";
import {Regions} from "../types";

class ConfigWrapper implements ConfigTemplate {
    private config: ConfigTemplate;

    constructor(userConfig: Partial<ConfigTemplate>) {
        this.config = {
            ...defaultConfig,
            ...userConfig,
        } as ConfigTemplate;
    }

    get accessKey(): { id: string; secret: string; } {
        if (!this.config.accessKey) {
            const e = new Error("Access key is required but is missing. Was it set in the config file?");
            e.stack = undefined;
            throw e;
        }
        return this.config.accessKey;
    }

    get appendFileTypeToKey(): boolean {
        return this.config.appendFileTypeToKey;
    }

    get multiPartUpload(): { maxPartSize: number; enabledThreshold: number } {
        return this.config.multiPartUpload;
    }

    get region(): Regions {
        if (!this.config.region) {
            const e = new Error("Region is required but is missing. Was it set in the config file?");
            e.stack = undefined;
            throw e;
        }
        return this.config.region;
    }

    get signedUrl(): { expiration: number } {
        return this.config.signedUrl;
    }

}


let cachedConfig: ConfigWrapper;


const rootDir = require('path').resolve('./');
try {
    // noinspection ES6ConvertVarToLetConst
    const userConfig: Partial<ConfigTemplate> | { config: Partial<ConfigTemplate> } = require(rootDir + "/s3.config"); //purposely used var here, its intentional
    //check if userConfig is a configTemplate or a {config: configTemplate}
    const config = userConfig as { config: Partial<ConfigTemplate> };
    cachedConfig = new ConfigWrapper(config.config ? config.config : userConfig as Partial<ConfigTemplate>);
} catch (e) {
    //check if the error is because the file is missing or because the file is invalid
    const fs = require('fs');
    if (fs.existsSync(rootDir + "/s3.config")) throw e;
    console.warn('\x1b[33m%s\x1b[0m', "s3.config.ts/s3.config.js is missing, some functionality will not work.\nFor all features, please create one and add it to the root directory (" + rootDir + ")");
    cachedConfig = new ConfigWrapper({});
}

export const getConfig = (): ConfigTemplate => {
    return cachedConfig;
}
