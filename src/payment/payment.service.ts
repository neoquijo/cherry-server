import { Injectable } from '@nestjs/common';
import { PaymentMethod, Payments } from './models/payment.schema';
import { StripeService } from './stripe.service';
import { CartItem } from 'src/users/models/cart.schema';
import { OffersService } from 'src/offers/offers.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { v4 } from 'uuid';

type Method = keyof typeof PaymentMethod;

@Injectable()
export class PaymentService {
  constructor(
    private readonly stripe: StripeService,
    private readonly offers: OffersService,
    @InjectModel(Payments.name) readonly payments: Model<Payments>,
  ) { }

  async createPayment(
    method: Method,
    items: CartItem[],
    orderId: string,
    userId: string,
  ) {
    if (method === 'stripe') {
      const amount = (await this.offers.getItemsTotalPrice(items)) * 100;
      const stripePayment = await this.stripe.createStripePayment(
        amount,
        userId,
        orderId,
      );
      const payment = await this.payments.create({
        paymentMethod: method,
        paymentId: stripePayment.id,
        status: 'created',
        user: userId,
        orderId: orderId,
      });
      return { id: payment._id, secret: stripePayment.client_secret };
    }
  }
}
