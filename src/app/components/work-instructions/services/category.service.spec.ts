import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: []
    });
    service = TestBed.inject(CategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('deleteFiles', () => {
    it('should define variable', () => {
      expect(service['deleteFiles']).toBeDefined();
    });

    it('should be empty array', () => {
      expect(service['deleteFiles']).toEqual([]);
    });
  });

  describe('setDeleteFiles', () => {
    it('should define function', () => {
      expect(service.setDeleteFiles).toBeDefined();
    });

    it('should set delete files', () => {
      const file = 'test.jpg';
      service.setDeleteFiles(file);
      expect(service['deleteFiles']).toEqual([file]);
    });

    it('should not set delete files if provided file already exists in delete files', () => {
      const file = 'test.jpg';
      service['deleteFiles'] = [file];
      service.setDeleteFiles(file);
      expect(service['deleteFiles']).toEqual([file]);
    });
  });

  describe('getDeleteFiles', () => {
    it('should define function', () => {
      expect(service.getDeleteFiles).toBeDefined();
    });

    it('should return delete files', () => {
      const file = 'test.jpg';
      service['deleteFiles'] = [file];
      expect(service.getDeleteFiles()).toEqual([file]);
    });
  });

  describe('removeDeleteFiles', () => {
    it('should define function', () => {
      expect(service.removeDeleteFiles).toBeDefined();
    });

    it('should remove file from delete files', () => {
      const file = 'test.jpg';
      service['deleteFiles'] = [file];
      service.removeDeleteFiles(file);
      expect(service.getDeleteFiles()).toEqual([]);
    });
  });

  describe('resetDeleteFiles', () => {
    it('should define function', () => {
      expect(service.resetDeleteFiles).toBeDefined();
    });

    it('should reset delete files to default', () => {
      const file = 'test.jpg';
      service['deleteFiles'] = [file];
      service.resetDeleteFiles();
      expect(service.getDeleteFiles()).toEqual([]);
    });
  });
});
