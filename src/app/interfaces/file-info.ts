export interface FileInfo {
  filePath: string;
  fileType: string;
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
