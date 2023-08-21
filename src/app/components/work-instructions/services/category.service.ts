import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private deleteFiles = [];

  constructor() {}

  setDeleteFiles = (file: string) => {
    if (file && !this.deleteFiles.includes(file)) {
      this.deleteFiles = [...this.deleteFiles, file];
    }
  };

  getDeleteFiles = () => this.deleteFiles;

  removeDeleteFiles = (file: string) => {
    this.deleteFiles = this.deleteFiles.filter(
      (deleteFile) => deleteFile !== file
    );
  };

  resetDeleteFiles = () => {
    this.deleteFiles = [];
  };
}
