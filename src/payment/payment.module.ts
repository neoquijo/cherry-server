import { Module, forwardRef } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { OffersModule } from 'src/offers/offers.module';
import { AuthModule } from 'src/auth/auth.module';
import { PaymentService } from './payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Payments, paymentSchema } from './models/payment.schema';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [
    forwardRef(() => OrdersModule),
    OffersModule,
    AuthModule,
    MongooseModule.forFeature([{ name: Payments.name, schema: paymentSchema }]),
  ],
  providers: [StripeService, PaymentService],
  controllers: [StripeController],
  exports: [PaymentService, StripeService],
})
export class PaymentModule { }
