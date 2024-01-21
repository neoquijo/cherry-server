/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { OwnerGuard } from 'src/auth/businessOwner.guard';
import { Organizatios, User } from 'src/auth/owner.decorator';
import { OffersService } from './offers.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  Images5mbOnlyPipe,
  createStorage,
} from 'src/image-handler/multerStorages';
import { MulterFile } from 'src/image-handler/types';
import { OfferDTO } from './models/offer.dto';
import { PointsOfSaleService } from 'src/pointsOfSale/pointsOfSale.service';
import { FileUtils } from 'src/Utils/FileUtils';
import { query } from 'express';
import { Types } from 'mongoose';

@Controller('/admin/offers')
@UseGuards(OwnerGuard)
export class AdminOffersController {
  constructor(
    private readonly offerService: OffersService,
    private readonly posService: PointsOfSaleService,
  ) { }


  @Get('/')
  async getAll(@Organizatios() organizations) {
    return await this.offerService.getOffersByOrganization(
      organizations[0]._id,
    );
  }

  @Post('/update')
  async updateOffer(@Body() offer, @User() user) {
    const updatedOffer = await this.offerService.updateOffer(offer, user._id)
    return updatedOffer
  }

  @Post('/delete')
  async deleteOffer(@Body() offer, @User() user) {
    const response = await this.offerService.deleteOffer(offer, user._id)
    return response
  }

  @Post('/create')
  async createOffer(@Body() offer: OfferDTO, @User() user) {

    const createdOffer = await this.offerService.create(
      offer,
      user._id,
      user.organizations[0]._id,
    );
    await this.posService.addHomeDeliveryToPos(
      createdOffer._id,
      createdOffer.homeDeliveryIn,
    );
    await FileUtils.moveDir(
      'uploads/offers/' + user.id.slice(-10),
      'uploads/offerCards/' + createdOffer.id.slice(-10),
    );
    await FileUtils.copyFile(
      'uploads/offerCards/' +
      createdOffer.id.slice(-10) +
      '/' +
      createdOffer.mainImage,
      'uploads/covers/' + createdOffer.mainImage,
    );
    this.posService.addOfferToPos(createdOffer._id, createdOffer.avaliableIn);
    return createdOffer;
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
    this.offerService.uploadOfferImages(images, request.user.id.slice(-10));
    return { images: images };
  }
}
