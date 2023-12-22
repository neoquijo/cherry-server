/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly secret: string;

  constructor() {
    this.secret =
      'whsec_297955ebe7f3ac40c37c5d45aca41ff329b26d598bc15ba2bdee19077aedd02b';
    this.stripe = new Stripe(
      'sk_test_51OKDEiAuumY82jTBWlqLn91aDyu4emXJ45NdAKvvT82XEUoyvSRpdsN4zNPUxm2dSspZVmIMGz9wxCeOo88omLdp00XO9hldds',
    );
  }

  async createStripePayment(amount: number, userId: string, orderId) {
    try {
      console.log('userId: ' + userId);
      const metadata = {
        userId: String(userId),
        orderId,
        amount,
      };
      const stripePayment = await this.stripe.paymentIntents.create({
        amount: amount,
        currency: 'eur',
        metadata: metadata,
      });
      return stripePayment;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'payment creation error',
        HttpStatus.BAD_REQUEST,
        { cause: error.message },
      );
    }
  }

  async getStripePayment(intent: string) {
    try {
      const payment = await this.stripe.paymentIntents.retrieve(intent);
      return payment;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }

  async checkPayment() {
    console.log(await this.stripe.balance.retrieve());
    return await this.stripe.paymentIntents.retrieve(
      'pi_3ONJOIAuumY82jTB16EC5RoS',
    );
  }
}
