import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { FileUtils } from 'src/Utils/FileUtils';

export const tempProfileImageStorage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/tempProfileUploads');
  },
  filename: (req, file, cb) => {
    cb(null, v4() + '.' + file.mimetype.split('/')[1]);
  },
});

export const createStorage = (dir: string) =>
  diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${dir}`);
    },
    filename: (req, file, cb) => {
      cb(null, v4() + '.' + file.mimetype.split('/')[1]);
    },
  });

@Injectable()
export class Images5mbOnlyPipe implements PipeTransform {
  transform(value: any) {
    try {
      const oneKb = 1024;
      const maxFileSize = 5 * oneKb * oneKb;
      if (value['images']) {
        // If value is an array, validate each file in the array
        for (const file of value.images) {
          this.validateFile(file, maxFileSize);
        }
      } else {
        this.validateFile(value, maxFileSize);
      }
    } catch (error) {
      if (value['images']) {
        // If value is an array, validate each file in the array
        for (const file of value.images) {
          FileUtils.deleteFile(file.path);
        }
        throw new BadRequestException(error.message);
      } else {
        FileUtils.deleteFile(value.path);
        throw new BadRequestException(error.message);
      }
    }

    return value;
  }

  private validateFile(file: any, maxFileSize: number): void {
    if (file.size > maxFileSize) {
      throw new BadRequestException(
        'File size exceeds the allowed limit (5 MB)',
      );
    }
    const allowedFileTypes = ['jpg', 'jpeg', 'webp', 'png', 'svg'];
    const fileExtension = file.originalname.split('.').pop().toLowerCase();

    if (!allowedFileTypes.includes(fileExtension)) {
      throw new BadRequestException(
        'Invalid file type. Allowed types: jpg, jpeg, webp, png, svg',
      );
    }
  }
}
