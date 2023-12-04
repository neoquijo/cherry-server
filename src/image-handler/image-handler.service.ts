import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { Crop } from './types';
import { v4 } from 'uuid';
import { FileUtils } from 'src/Utils/FileUtils';

@Injectable()
export class ImageHandlerService {
  extractProfileImageFromTemp(name: string) {
    FileUtils.moveFile(
      'uploads/tempProfileUploads/' + name,
      'uploads/businessProfile/' + name,
    );
  }

  async cropImage(filename: string, crop: Crop) {
    try {
      const { width, height, x, y } = crop;
      const newFilename = v4();
      sharp(filename)
        .png()
        .extract({
          width: width + 100,
          height: height + 100,
          left: x,
          top: y,
        })
        .toFile(`tempProfileUploads/${newFilename}.${filename.split('.')[1]}`);
      return newFilename;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'error processing file',
        HttpStatus.UNPROCESSABLE_ENTITY,
        { cause: 'Ошибка' },
      );
    }
  }
}
