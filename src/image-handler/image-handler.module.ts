import { Module } from '@nestjs/common';
import { ImageHandlerController } from './imageHandler.controller';
import { ImageHandlerService } from './image-handler.service';

@Module({
  controllers: [ImageHandlerController],
  providers: [ImageHandlerService],
  exports: [ImageHandlerService],
})
export class ImageHandlerModule {}
