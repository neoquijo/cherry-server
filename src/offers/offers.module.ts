import { Module } from '@nestjs/common';
import { AdminOffersController } from './offers.controller';
import { AuthModule } from 'src/auth/auth.module';
import { BusinessOwnersModule } from 'src/businessOwners/businessOwners.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Offer, OfferSchema } from './models/offer.schema';
import { OffersService } from './offers.service';
import { PointsOfSaleModule } from 'src/pointsOfSale/pointsOfSale.module';
import { OffersPublicController } from './offersPublic.controller';
import { OfferCats, OfferCatsSchema } from './models/offerCats.schema';
import { POS, POSSchema } from 'src/pointsOfSale/models/pointsOfSale.schema';

@Module({
  providers: [OffersService],
  imports: [
    AuthModule,
    PointsOfSaleModule,
    BusinessOwnersModule,
    MongooseModule.forFeature([
      { name: Offer.name, schema: OfferSchema },
      { name: OfferCats.name, schema: OfferCatsSchema },
      { name: POS.name, schema: POSSchema },
    ]),
  ],
  controllers: [AdminOffersController, OffersPublicController],
  exports: [OffersService],
})
export class OffersModule { }
