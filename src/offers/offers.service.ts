import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Offer } from './models/offer.schema';
import { Model } from 'mongoose';
import { IOffer } from './models/offer.type';
import { FileUtils } from 'src/Utils/FileUtils';

@Injectable()
export class OffersService {
  constructor(@InjectModel(Offer.name) private readonly offer: Model<Offer>) {}
  async getOffersByOrganization(id) {
    try {
      const response = await this.offer.find({ organization: id }).lean();
      return response;
    } catch (error) {
      throw new HttpException('Ofers fetching error', HttpStatus.NO_CONTENT, {
        cause: error.message,
      });
    }
  }

  async create(offer: IOffer) {
    try {
      const response = await this.offer.create(offer);
      return response;
    } catch (error) {
      throw new HttpException('Ofers fetching error', HttpStatus.NO_CONTENT, {
        cause: error.message,
      });
    }
  }

  async createBulk(offers: IOffer[]) {
    try {
      const operations = offers.map((offer) => ({
        insertOne: {
          document: offer,
        },
      }));
      const response = await this.offer.bulkWrite(operations);
      return response.insertedIds;
    } catch (error) {
      throw new HttpException('Ofers fetching error', HttpStatus.NO_CONTENT, {
        cause: error.message,
      });
    }
  }

  getTempUploads(dir) {
    return FileUtils.readDir('uploads/offers/' + dir);
  }

  async deleteTempUpload(dir: string, name: string) {
    try {
      return await FileUtils.deleteFile(`uploads/offers/${dir}/${name}`);
    } catch (error) {
      throw new HttpException('Delete file error', HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }

  uploadOfferImages = (files, dirname) => {
    FileUtils.createTempUploadFolder('uploads/offers/' + dirname);
    files.images.map((image) => {
      console.log(image);
      FileUtils.moveFile(
        image.path,
        'uploads/offers/' + dirname + '/' + image.filename,
      );
    });
  };
}
