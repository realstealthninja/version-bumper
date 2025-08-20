'use strict';
import * as semver from "semver";
import * as toml from "smol-toml";

export default class Parser {
    #parserTable = {
        "package.json": (file) => {
            let parsedFile = JSON.parse(file);
            
            return {
                "type": "json",
                "key": "",
                "version": semver.parse(parsedFile["version"])
            }
        },

        "pyproject.toml": (file) => {
            let parsedFile = toml.parse(file);

            return {
                "type": "toml",
                "key": "project",
                "version": semver.parse(parsedFile["project"]["version"])
            }
        },

        "cargo.toml": (file) => {
            let parsedFile = toml.parse(file);


            return {
                "type": "toml",
                "key": "package",
                "version": semver.parse(parsedFile["package"]["version"])
            }
        },
    }

    constructor(projfile) {
        this.projfile = projfile;
    }
    
    /**
     * @brief Parses a given file
     *
     */
    parse() {
        if (!this.projfile.name in this.#parserTable) {
            throw "invalid project file type";
        } 
        
        let versionObject = this.#parserTable[this.projfile.name](this.projfile.content);
        if (versionObject["version"] === null) {
            throw "Invalid version";
        }
    }

}
