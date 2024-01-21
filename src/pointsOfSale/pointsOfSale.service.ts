import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { POS } from './models/pointsOfSale.schema';
import { Model, Types } from 'mongoose';
import { ImageHandlerService } from 'src/image-handler/image-handler.service';
import { Organizations } from 'src/organizations/models/organization.schema';

@Injectable()
export class PointsOfSaleService {
  constructor(
    @InjectModel(POS.name) readonly posService: Model<POS>,
    @InjectModel(Organizations.name)
    readonly organizationService: Model<Organizations>,
    private readonly imageService: ImageHandlerService,
  ) { }

  getTempImage(): string {
    return 'lol';
  }

  async create(data, owner) {
    try {
      const response = await this.posService.create({ ...data, owner });
      console.log(`owner: ${owner}`);
      await this.organizationService.findOneAndUpdate(
        { owner: new Types.ObjectId(owner) },
        { $push: { pointsOfSale: new Types.ObjectId(response._id) } },
      );
      return response;
    } catch (error) {
      console.log(error)
      throw new HttpException(error, HttpStatus.NOT_ACCEPTABLE, {
        cause: error?.message,
      });
    }
  }

  async addOfferToPos(
    offerId: Types.ObjectId,
    pos: Types.ObjectId | Types.ObjectId[],
  ) {
    try {
      if (Array.isArray(pos)) {
        for (const el of pos) {
          try {
            await this.posService.findByIdAndUpdate(el, {
              $push: { offers: offerId },
            });
          } catch (innerError) {
            console.error(`Error updating pos ${el}: ${innerError.message}`);
          }
        }
      } else if (typeof pos === 'string') {
        await this.posService.findByIdAndUpdate(pos, {
          $push: { offers: offerId },
        });
      }
    } catch (error) {
      throw new HttpException('addOfferToPos', HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }

  async addHomeDeliveryToPos(
    offerId: Types.ObjectId,
    pos: Types.ObjectId | Types.ObjectId[],
  ) {
    try {
      if (Array.isArray(pos)) {
        for (const el of pos) {
          try {
            await this.posService.findByIdAndUpdate(el, {
              $push: { homeDeliveryOffers: offerId },
            });
          } catch (innerError) {
            console.error(`Error updating pos ${el}: ${innerError.message}`);
          }
        }
      } else if (typeof pos === 'string') {
        await this.posService.findByIdAndUpdate(pos, {
          $push: { homeDeliveryOffers: offerId },
        });
      }
    } catch (error) {
      throw new HttpException('addOfferToPos', HttpStatus.BAD_REQUEST, {
        cause: error.message,
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
