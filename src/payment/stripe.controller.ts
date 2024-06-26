import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { UserOrGuestGuard } from 'src/auth/userAuth.guard';
import { User } from 'src/auth/owner.decorator';
import { Response } from 'express';
import { OrdersService } from 'src/orders/orders.service';

@Controller('/payment/stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly orders: OrdersService,
  ) { }

  @Post('/callback')
  async callback(@Req() req) {
    console.log(req.body);
    return { message: 'ok' };
  }

  @Get('/confirmPayment')
  async confirmStripe(@Req() req, @Res() res: Response, @Query() params) {
    try {
      console.log(params);
      const { status, metadata, amount } =
        await this.stripeService.getStripePayment(params.payment_intent);
      if (status === 'succeeded') {
        await this.orders.completeOrder(metadata.orderId);
        res.redirect(
          `https://cupipon.com/paymentSuccess?payment=${metadata.orderId}&amount=${amount}`,
        );
      } else res.redirect('https://cupipon.com/rejectPayment');
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.PAYMENT_REQUIRED, {
        cause: error.message,
      });
    }
  }

  @UseGuards(UserOrGuestGuard)
  @Post('/create')
  async createStripePayment(@Body('items') data, @User() user) {
    const response = await this.stripeService.createStripePayment(
      200,
      user._id || user,
      data,
    );
    return response;
  }

  @Get('/confirm')
  async confirm() {
    const response = await this.stripeService.checkPayment();
    return response;
  }
}
