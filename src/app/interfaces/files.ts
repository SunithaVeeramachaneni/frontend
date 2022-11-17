export interface Files {
  Key: string;
  LastModified: string;
  ETag: string;
  Size: string;
  StorageClass: string;
  Owner: any;
  MimeType?: string;
}

export interface MediaFile {
  fileNameWithExtension: string;
  fileName: string;
  filePath: string;
  originalFileName: string;
  fileType: string;
  updatedAt: string;
}
