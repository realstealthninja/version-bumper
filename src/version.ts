import { SemVer } from "semver"

export enum FileType {
    JSON,
    TOML,
}

export interface Version {
    fileType: FileType;
    key: string;
    version: SemVer | null;
}


