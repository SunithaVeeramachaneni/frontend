import { MediaType } from 'plyr';

export interface FileInfo {
  filePath: string;
  fileType: MediaType;
}

export interface RenameFileInfo {
  filePath: string;
  newFilePath: string;
}

export interface CopyFilesPathInfo {
  folderPath: string;
  newFolderPath: string;
  copyFiles?: string[];
  recursive?: boolean;
}
