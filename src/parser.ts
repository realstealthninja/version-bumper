import { Version, FileType } from "./version.js";
import * as SemVer from "semver";

interface ParseTable {
  [Key: string]: (file: ProjectFile) => Version;
}

interface ProjectFile {
  name: string;
  content: string;
}

export default class Parser {
  private projectFile: ProjectFile;
  private parseTable: ParseTable = {
    "package.json": (file: ProjectFile) => {
      let parsedFile = JSON.parse(file.content);
      return {
        version: SemVer.parse(parsedFile["version"]),
        fileType: FileType.JSON,
        key: "",
      };
    },
  };

  constructor(fileName: string, fileContent: string) {
    this.projectFile = {
      name: fileName,
      content: fileContent,
    };
  }

  parse(): Version {
    return this.parseTable[this.projectFile.name](this.projectFile);
  }
}
