import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Offer } from './models/offer.schema';
import { Model, Types } from 'mongoose';
import { FileUtils } from 'src/Utils/FileUtils';
import { OfferDTO } from './models/offer.dto';
import { OfferCats } from './models/offerCats.schema';
import { CartItem } from 'src/users/models/cart.schema';
import { POS } from 'src/pointsOfSale/models/pointsOfSale.schema';
import { IOffer } from './models/offer.type';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer.name) private readonly offer: Model<Offer>,
    @InjectModel(OfferCats.name) private readonly cats: Model<OfferCats>,
    @InjectModel(POS.name) private readonly POS: Model<POS>,
  ) { }
  i = 0;
  async getAllActiveOffers(lang: string) {
    try {
      const now = new Date().getTime();
      const response = await this.offer.find({
        $and: [{ startsAt: { $lt: now }, lang }, { endsAt: { $gt: now } }],
      });
      return response.reverse();
    } catch (error) {
      throw new HttpException('Error getting offers', HttpStatus.NO_CONTENT, {
        cause: error.message,
      });
    }
  }

  async getFreshOffers(lang: string) {
    try {
      const now = new Date().getTime();
      const twoDaysAgo = now - 2 * 24 * 60 * 60 * 1000; // Two days in milliseconds
      const response = await this.offer.find({
        $and: [
          { lang, startsAt: { $gt: twoDaysAgo, $lt: now } },
          { endsAt: { $gt: now } },
          // You can include other conditions if needed
        ],
      });
      return response.reverse();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }

  async searchOfferQuery(lang: string, query: string) {
    try {
      const now = new Date().getTime();
      const results = await this.offer.find({
        $and: [
          { lang, startsAt: { $lt: now } },
          { endsAt: { $gt: now } },
          // You can include other conditions if needed
        ],
        $or: [
          {
            lang,
            title: { $regex: query, $options: 'i' },
          },
          {
            lang,
            description: { $regex: query, $options: 'i' },
          },
        ],
      });
      return results;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  };

  async getAllOffersById(id: string) {
    try {
      const now = new Date().getTime();
      const response = await this.offer.find({
        $and: [
          {
            $or: [
              { id: id }, // Assuming "id" is a field in your offer model
              { _id: id },
            ],
          },
          { startsAt: { $lt: now } },
          { endsAt: { $gt: now } },
        ],
      });
      return response;
    } catch (error) {
      throw new HttpException('Error getting offers', HttpStatus.NO_CONTENT, {
        cause: error.message,
      });
    }
  }

  async getOfferById(id: string) {
    const now = new Date().getTime();
    try {
      const response = await this.offer.findOne({
        $and: [{ startsAt: { $lt: now }, _id: id }, { endsAt: { $gt: now } }],
      });
      return response;
    } catch (error) {
      throw new HttpException('Error getting offer', HttpStatus.NO_CONTENT, {
        cause: error.message,
      });
    }
  }

  async incrementSalesOf(id: string, count: number) {
    try {
      const response = await this.offer.findOneAndUpdate(
        { id },
        { $inc: { totalSold: count } },
      );
      return response;
    } catch (error) {
      throw new HttpException('Error getting offer', HttpStatus.NO_CONTENT, {
        cause: error.message,
      });
    }
  }

  async getOfferByRegexp(id: string, lang: string) {
    try {
      const offer = await this.offer
        .findOne({ id: { $regex: id }, lang: lang || 'ru' })
        .lean();
      console.log('id: ' + id);
      console.log('offer: ' + offer);
      console.log('lang: ' + lang);
      return offer;
    } catch (error) {
      throw new HttpException('Error getting offer', HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }

  async getItemsTotalPrice(items: CartItem[]) {
    let price = 0;
    if (items?.length > 0)
      for (const item of items) {
        const offer = await this.offer
          .findOne({
            $or: [{ _id: new Types.ObjectId(item.id) }, { id: item.id }],
          })
          .lean();

        if (!offer) throw new Error('Hacking attempt');

        if (item.caption != offer?.title) {
          const buyOption = offer.buyOptions.find((option) => {
            return (
              option.caption == item.caption && option.offerPrice == item.price
            );
          });

          if (!buyOption) throw new Error('Hacking attempt');
          else {
            price += buyOption.offerPrice * item.qty;
          }
        } else {
          if (item.price !== offer.offerPrice)
            throw new Error('Hacking attempt');
          price += offer.offerPrice * item.qty;
        }
      }

    console.log('price:' + price);
    return price;
  }

  async getAllActiveOffersByCat(lang: string, cat: string) {
    try {
      const now = new Date().getTime();
      const response = await this.offer.find({
        $and: [
          { lang },
          { startsAt: { $lt: now } },
          { endsAt: { $gt: now } },
          { category: { $eq: cat } },
        ],
      });
      return response;
    } catch (error) {
      throw new HttpException('Error getting offers', HttpStatus.NO_CONTENT, {
        cause: error.message,
      });
    }
  }

  async getCats(lang, key?: string) {
    try {
      const aggregationPipeline = [
        ...(key ? [{ $match: { key: key } }] : []),
        {
          $lookup: {
            from: 'offers',
            let: { catKey: '$key' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$category', '$$catKey'] },
                      { $lt: ['$startsAt', new Date().getTime()] },
                      { $gt: ['$endsAt', new Date().getTime()] },
                      { $eq: ['$lang', lang] },
                    ],
                  },
                },
              },
            ],
            as: 'offersCount',
          },
        },
        {
          $addFields: {
            count: { $size: '$offersCount' },
          },
        },
        {
          $project: {
            offersCount: 0,
          },
        },
      ];

      const response = await this.cats.aggregate(aggregationPipeline);
      return response;
    } catch (error) {
      throw new HttpException('Cats fetching error', HttpStatus.NO_CONTENT, {
        cause: error.message,
      });
    }
  }

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

  async updateOffer(offer, ownerId: string) {
    try {
      const { organization, owner, ...newOffer } = offer;
      console.log(organization, owner);
      const response = await this.offer.findOneAndUpdate(
        { _id: offer._id, owner: ownerId },
        newOffer,
        { new: true },
      );
      console.log(newOffer);
      return response;
    } catch (error) {
      console.log(error);
      throw new HttpException('Offer creation error', HttpStatus.NO_CONTENT, {
        cause: error.message,
      });
    }
  }

  async deleteOffer(offer: IOffer, ownerId) {
    try {
      const response = await this.offer.findOneAndDelete({
        _id: offer._id,
        owner: ownerId,
      });
      if (offer.avaliableIn?.length > 0) {
      }
      for (const el of offer.avaliableIn) {
        await this.POS.findOneAndUpdate(
          { _id: el },
          { $pull: { offers: offer._id } },
        );
      }
      if (offer.homeDeliveryIn?.length > 0)
        for (const el of offer.homeDeliveryIn) {
          await this.POS.findOneAndUpdate(
            { _id: el },
            { $pull: { homeDeliveryOffers: offer._id } },
          );
        }
      return response;
    } catch (error) {
      console.log(error);
      throw new HttpException('Offer creation error', HttpStatus.NO_CONTENT, {
        cause: error.message,
      });
    }
  }

  async create(offer: OfferDTO, ownerId: string, organization?: string) {
    console.log(offer);
    try {
      const response = await this.offer.create({
        ...offer,
        owner: new Types.ObjectId(ownerId),
        offerValue: (
          100 -
          (Number(offer.offerPrice) * 100) / Number(offer.initialPrice)
        ).toFixed(0),
        organization: organization
          ? new Types.ObjectId(organization)
          : undefined,
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      throw new HttpException('Offer creation error', HttpStatus.NO_CONTENT, {
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

  uploadOfferImages = async (files, dirname) => {
    await FileUtils.createTempUploadFolder('uploads/offers/' + dirname);
    files.images.map((image) => {
      FileUtils.moveFile(
        image.path,
        'uploads/offers/' + dirname + '/' + image.filename,
      );
    });
  };
}
