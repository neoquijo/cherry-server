import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OwnerGuard } from 'src/auth/businessOwner.guard';
import { User } from 'src/auth/owner.decorator';
import {
  Images5mbOnlyPipe,
  tempProfileImageStorage,
} from 'src/image-handler/multerStorages';
import { PointsOfSaleService } from './pointsOfSale.service';
import { MulterFile } from 'src/image-handler/types';
import { BusinessOwnersService } from 'src/businessOwners/businessOwners.service';
import { ImageHandlerService } from 'src/image-handler/image-handler.service';

@UseGuards(OwnerGuard)
@Controller('/admin/pos')
export class PointsOfSaleAdminController {
  constructor(
    private readonly posService: PointsOfSaleService,
    private readonly ownersService: BusinessOwnersService,
    private readonly imageService: ImageHandlerService,
  ) {}

  @Get('/')
  async getPointsOfSale(@User() user) {
    const posList = await this.posService.getPOSByOwnersId(user._id);
    return posList;
  }

  @Post('/create')
  async createPos(@Body() data, @User() user) {
    const pos = await this.posService.create(data, user._id);
    await this.ownersService.addPos(user.id, pos);
    if (data.profileImage)
      await this.imageService.extractProfileImageFromTemp(data.profileImage);
    return { message: 'ok' };
  }

  @Post('/delete')
  async deletePos(@Body() data, @User() user) {
    await this.ownersService.pullPos(user._id, data.id);
    await this.posService.deletePos(data.id);
    return { message: 'ok' };
  }

  @Post('/profileUrlTemp')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: tempProfileImageStorage,
    }),
  )
  @UsePipes(Images5mbOnlyPipe)
  profileUrlTemp(@UploadedFile() image: MulterFile) {
    console.log(image);
    return { image: image.filename };
  }
}
