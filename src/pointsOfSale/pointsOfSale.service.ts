import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { POS } from './models/pointsOfSale.schema';
import { Model } from 'mongoose';
import { ImageHandlerService } from 'src/image-handler/image-handler.service';

@Injectable()
export class PointsOfSaleService {
  constructor(
    @InjectModel(POS.name) readonly posService: Model<POS>,
    private readonly imageService: ImageHandlerService,
  ) {}

  getTempImage(): string {
    return 'lol';
  }

  async create(data, owner) {
    try {
      const response = await this.posService.create({ ...data, owner });
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_ACCEPTABLE, {
        cause: error?.message,
      });
    }
  }

  async getPOSByOwnersId(id: string) {
    try {
      const response = await this.posService.find({ owner: id });
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.METHOD_NOT_ALLOWED, {
        cause: error?.message,
      });
    }
  }

  async deletePos(id: string) {
    try {
      const response = await this.posService.findOneAndDelete({
        $or: [{ id }, { _id: id }],
      });
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.METHOD_NOT_ALLOWED, {
        cause: error?.message,
      });
    }
  }
}
