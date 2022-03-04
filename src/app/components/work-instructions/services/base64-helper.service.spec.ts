import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';
import { InstructionService } from './instruction.service';

import { Base64HelperService } from './base64-helper.service';

describe('Base64HelperService', () => {
  let service: Base64HelperService;
  let instructionServiceSpy: InstructionService;
  let sanitizerSpy: DomSanitizer;

  beforeEach(() => {
    instructionServiceSpy = jasmine.createSpyObj('InstructionService', ['getFile']);
    sanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);
    TestBed.configureTestingModule({
      providers: [
        { provide: InstructionService, useValue: instructionServiceSpy },
        { provide: DomSanitizer, useValue: sanitizerSpy }
      ]
    });
    service = TestBed.inject(Base64HelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getExtention', () => {
    it('should define function', () => {
      expect(service.getExtention).toBeDefined();
    });

    it('should return file extension', () => {
      const result = service.getExtention('test-image.png');
      expect(result).toBe('.png');
    });

    it(`should return false if filename doesn't have extension`, () => {
      const result = service.getExtention('test-image');
      expect(result).toBe('');
    });
  });

  describe('getBase64ImageFromSourceUrl', () => {
    it('should define function', () => {
      expect(service.getBase64ImageFromSourceUrl).toBeDefined();
    });
  });

  describe('getBase64Image', () => {
    it('should define function', () => {
      expect(service.getBase64Image).toBeDefined();
    });

    it('should get base64 image', () => {
      const file = 'image.jpg';
      const value = 'aW1hZ2UuanBn';
      const path = 'path';
      (instructionServiceSpy.getFile as jasmine.Spy)
        .withArgs(`${path}/${file}`)
        .and.returnValue(of({ base64Response: value }))
        .and.callThrough();
      (sanitizerSpy.bypassSecurityTrustResourceUrl as jasmine.Spy)
        .withArgs(`data:image/jpg;base64, ${value}`)
        .and.returnValue(`data:image/jpg;base64, ${value}`)
        .and.callThrough();
      service.getBase64Image(file, path);
      expect(instructionServiceSpy.getFile).toHaveBeenCalledWith(`${path}/${file}`);
      expect(sanitizerSpy.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(`data:image/jpg;base64, ${value}`);
      expect(service.getBase64ImageData(file, path)).toBe(`data:image/jpg;base64, ${value}`);
    });
  });

  describe('getImageContents', () => {
    it('should define function', () => {
      expect(service.getImageContents).toBeDefined();
    });
  });

  describe('getBase64ImageDetails', () => {
    it('should define function', () => {
      expect(service.getBase64ImageDetails).toBeDefined();
    });

    it('should get base64Details with given key', () => {
      const file = 'image.jpg';
      const value = 'aW1hZ2UuanBn';
      const path = 'path';
      (sanitizerSpy.bypassSecurityTrustResourceUrl as jasmine.Spy)
        .withArgs(value)
        .and.returnValue(value)
        .and.callThrough();
      service.setBase64ImageDetails(file, value, path);
      expect(service.getBase64ImageDetails()).toEqual({ [`${path}/${file}`]: 'aW1hZ2UuanBn' });
    });
  });

  describe('getBase64ImageData', () => {
    it('should define function', () => {
      expect(service.getBase64ImageData).toBeDefined();
    });

    it('should get base64Details with given key', () => {
      const file = 'image.jpg';
      const value = 'aW1hZ2UuanBn';
      const path = 'path';
      (sanitizerSpy.bypassSecurityTrustResourceUrl as jasmine.Spy)
        .withArgs(value)
        .and.returnValue(value)
        .and.callThrough();
      service.setBase64ImageDetails(file, value, path);
      expect(service.getBase64ImageData(file, path)).toBe('aW1hZ2UuanBn');
    });
  });

  describe('setBase64ImageDetails', () => {
    it('should define function', () => {
      expect(service.setBase64ImageDetails).toBeDefined();
    });

    it('should set base64Details with given key', () => {
      const file = 'image.jpg';
      const value = 'aW1hZ2UuanBn';
      const path = 'path';
      (sanitizerSpy.bypassSecurityTrustResourceUrl as jasmine.Spy)
        .withArgs(value)
        .and.returnValue(value)
        .and.callThrough();
      service.setBase64ImageDetails(file, value, path);
      expect(sanitizerSpy.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(value);
      expect(service['base64ImageDetails']).toEqual({ [`${path}/${file}`]: 'aW1hZ2UuanBn' });
    });
  });

  describe('deleteBase64ImageDetails', () => {
    it('should define function', () => {
      expect(service.deleteBase64ImageDetails).toBeDefined();
    });

    it('should delete specified key from the object', () => {
      service.setBase64ImageDetails('image.jpg', 'aW1hZ2UuanBn', 'path');
      service.deleteBase64ImageDetails('image.jpg', 'path');
      expect(service['base64ImageDetails']).toEqual({});
    });
  });

  describe('resetBase64ImageDetails', () => {
    it('should define function', () => {
      expect(service.resetBase64ImageDetails).toBeDefined();
    });

    it('should reset base64ImageDetails', () => {
      service.resetBase64ImageDetails();
      expect(service['base64ImageDetails']).toEqual({});
    });
  });

});
