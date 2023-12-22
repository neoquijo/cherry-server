import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';

import { UsersModule } from 'src/users/users.module';
import { PaymentModule } from 'src/payment/payment.module';
import { OrderController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Orders, ordersSchema } from './models/orders.schema';
import { AuthModule } from 'src/auth/auth.module';
import { OffersModule } from 'src/offers/offers.module';
import { CuponsModule } from 'src/cupons/cupons.module';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => PaymentModule),
    UsersModule,
    forwardRef(() => OffersModule),
    CuponsModule,
    MongooseModule.forFeature([{ name: Orders.name, schema: ordersSchema }]),
  ],
  providers: [OrdersService],
  controllers: [OrderController],
  exports: [OrdersService],
})
export class OrdersModule { }
