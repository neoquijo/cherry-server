import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Orders } from './models/orders.schema';
import { Model, Types } from 'mongoose';
import { CreateOrderDto } from './models/orders.dto';
import { CuponsService } from 'src/cupons/cupons.service';
import { OffersService } from 'src/offers/offers.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders.name) readonly orders: Model<Orders>,
    private readonly cupons: CuponsService,
    private readonly offers: OffersService,
  ) { }

  async createOrder(data: CreateOrderDto) {
    try {
      const order = await this.orders.create(data);
      return order;
    } catch (error) {
      throw new HttpException('error creating order', HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }

  async getUserOrders(userId: string) {
    try {
      const response = await this.orders
        .find({ user: userId })
        .populate('issuedCupons')
        .lean();
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }

  async getUserOrder(userId: string, id: string) {
    try {
      const response = await this.orders
        .findOne({ user: userId, _id: id })
        .populate('issuedCupons')
        .lean();
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }

  async deliverOrder(orderId) {
    try {
      this.orders.findOne({});
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }

  async completeOrder(orderId) {
    try {
      const order = await this.orders.findById(orderId);

      if (order.status === 'complete') {
        throw new Error('This order is completed');
      }
      await Promise.all(
        order.items.map(async (el) => {
          console.log(el.id);
          const item = await this.offers.getOfferById(String(el.id));
          const allItems = await this.offers.getAllOffersById(
            item.isTranslation ? item.id : item._id,
          );
          for (const singleItem of allItems) {
            await this.offers.incrementSalesOf(singleItem.id, el.qty);
          }
          // this.offers.incrementSalesOf(item.id, el.qty);
          for (let i = 0; i < el.qty; i++) {
            const cupon = await this.cupons.createCupon({
              caption: item.title,
              option: item.title != el.caption ? el.caption : undefined,
              value: el.price,
              expireDate: item.endsAt + 1209600000,
              itemId: item._id,
              businessOwner: item.owner,
              status: 'active',
              createdAt: new Date().getTime(),
            });
            order.issuedCupons.push(cupon._id);
          }
        }),
      );
      // Save the order after issuing coupons
      order.status = 'complete';
      await order.save();
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }

  async addPaymentIntent(orderId: string, paymentId: string) {
    try {
      const order = await this.orders.findOneAndUpdate(
        {
          $or: [{ _id: orderId }, { id: orderId }],
        },
        { $push: { paymentIntents: new Types.ObjectId(paymentId) } },
        { new: true },
      );
      return order;
    } catch (error) {
      throw new HttpException('error creating order', HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }

  async gotSuccessPayment(orderId: string, paymentId: string) {
    try {
      const order = await this.orders.findOneAndUpdate(
        {
          $or: [{ _id: orderId }, { id: orderId }],
        },
        {
          $set: {
            successPayment: new Types.ObjectId(paymentId),
            status: 'gotPayment',
          },
        },
        { new: true },
      );
      return order;
    } catch (error) {
      throw new HttpException('error creating order', HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }
}
