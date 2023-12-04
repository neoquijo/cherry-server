import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { OwnerGuard } from 'src/auth/businessOwner.guard';
import { Organizatios, User } from 'src/auth/owner.decorator';
import { OffersService } from './offers.service';
import { IOffer } from './models/offer.type';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import {
  Images5mbOnlyPipe,
  createStorage,
} from 'src/image-handler/multerStorages';
import { MulterFile } from 'src/image-handler/types';

@Controller('/admin/offers')
@UseGuards(OwnerGuard)
export class AdminOffersController {
  constructor(private readonly offerService: OffersService) { }

  @Get('/')
  getAll(@Organizatios() organizations) {
    return this.offerService.getOffersByOrganization(organizations[0]._id);
  }

  @Post('/create')
  createOfferBulk(offeers: IOffer[]) {
    offeers.forEach((offer) => {
      this.offerService.create(offer);
    });
  }

  @Get('/tempUploads')
  async getTempUploads(@User() user) {
    const images = await this.offerService.getTempUploads(user.id.slice(-10));

    return {
      dir: user.id.slice(-10),
      images,
    };
  }

  @Post('/deleteTempUpload')
  deleteTempUpload(@User() user, @Body('id') name) {
    return this.offerService.deleteTempUpload(user.id.slice(-10), name);
  }

  @Post('/offerTempUpload')
  @UsePipes(Images5mbOnlyPipe)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], {
      storage: createStorage('tempOfferUploads'),
    }),
  )
  offerUpload(@UploadedFiles() images: MulterFile, @Req() request) {
    console.log(request.user.id);
    this.offerService.uploadOfferImages(images, request.user.id.slice(-10));
    return { images: images };
  }
}
