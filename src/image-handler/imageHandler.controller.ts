import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { tempProfileImageStorage } from './multerStorages';

@Controller('/admin/uploads')
export class ImageHandlerController {
  @Post('/profileUrlTemp')
  @UseInterceptors(
    FileInterceptor('image', { storage: tempProfileImageStorage }),
  )
  profileUrlTemp(@UploadedFile() image) {
    console.log(image);
  }
}
