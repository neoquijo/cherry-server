import { Module } from '@nestjs/common';
import { PointsOfSaleAdminController } from './pointsOfSale.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { POS, POSSchema } from './models/pointsOfSale.schema';
import { ImageHandlerModule } from 'src/image-handler/image-handler.module';
import { PointsOfSaleService } from './pointsOfSale.service';
import { BusinessOwnersModule } from 'src/businessOwners/businessOwners.module';
import { PosAdress, PosAdressSchema } from './models/posadress.schema';

@Module({
  providers: [PointsOfSaleService],
  controllers: [PointsOfSaleAdminController],
  imports: [
    AuthModule,
    ImageHandlerModule,
    BusinessOwnersModule,
    MongooseModule.forFeature([
      { name: POS.name, schema: POSSchema },
      { name: PosAdress.name, schema: PosAdressSchema },
    ]),
  ],
  exports: [PointsOfSaleService],
})
export class PointsOfSaleModule {}
