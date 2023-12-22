import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/auth/owner.decorator';
import { PaymentService } from 'src/payment/payment.service';
import { UserOrGuestGuard } from 'src/auth/userAuth.guard';
import { Types } from 'mongoose';
import { CartItem } from 'src/users/models/cart.schema';

@UseGuards(UserOrGuestGuard)
@Controller('/orders')
export class OrderController {
  constructor(
    private readonly orders: OrdersService,
    private readonly users: UsersService,
    private readonly payments: PaymentService,
  ) { }

  @Get('/')
  async getOrders(@User() user) {
    try {
      if (user == 'guest') throw new Error('not auth');
      const response = await this.orders.getUserOrders(user._id);
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }

  @Post('/createCheckout')
  async createCheckoutOrder(@Body() data, @User() user) {
    if (!data.items)
      return new HttpException('no items provided', 400, { cause: 'noItems' });
    if (user !== 'guest') {
      const order = await this.orders.createOrder({
        createdAt: new Date().getTime(),
        user: user?._id || undefined,
        status: 'pending',
        orderType: 'offers',
        items: data.items,
        deliverTo: data.deliverTo,
        deliveryMethod: data.deliveryMethod,
      });
      const paymentIntent = await this.payments.createPayment(
        data.method,
        data.items,
        String(order._id),
        user._id || undefined,
      );
      order.paymentIntents.push(new Types.ObjectId(paymentIntent.id));
      await order.save();
      await this.users.deleteFromCart(data.items, user.cart);
      return {
        secret: paymentIntent.secret,
      };
    }
  }

  @Post('/create')
  async createOrder(@Body() data, @User() user) {
    const cart = await this.users.getUserCart(user.cart);
    if (!data.items)
      return new HttpException('no items provided', 400, { cause: 'noItems' });
    if (user !== 'guest') {
      const order = await this.orders.createOrder({
        createdAt: new Date().getTime(),
        user: user?._id || undefined,
        status: 'pending',
        orderType: 'offers',
        items: cart.items,
        deliverTo: data.deliverTo,
        deliveryMethod: data.deliveryMethod,
      });
      const paymentIntent = await this.payments.createPayment(
        data.method,
        cart.items,
        String(order._id),
        user._id || undefined,
      );
      order.paymentIntents.push(new Types.ObjectId(paymentIntent.id));
      await order.save();
      await this.users.clearCart(user.cart);
      return {
        secret: paymentIntent.secret,
      };
    }
  }
}
