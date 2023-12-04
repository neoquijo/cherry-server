import { Module } from '@nestjs/common';
import { AdminOffersController } from './offers.controller';
import { AuthModule } from 'src/auth/auth.module';
import { BusinessOwnersModule } from 'src/businessOwners/businessOwners.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Offer, OfferSchema } from './models/offer.schema';
import { OffersService } from './offers.service';

@Module({
  providers: [OffersService],
  imports: [
    AuthModule,
    BusinessOwnersModule,
    MongooseModule.forFeature([{ name: Offer.name, schema: OfferSchema }]),
  ],
  controllers: [AdminOffersController],
})
export class OffersModule { }
