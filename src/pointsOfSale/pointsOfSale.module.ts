import { Module } from '@nestjs/common';
import { PointsOfSaleAdminController } from './pointsOfSale.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { POS, POSSchema } from './models/pointsOfSale.schema';
import { ImageHandlerModule } from 'src/image-handler/image-handler.module';
import { PointsOfSaleService } from './pointsOfSale.service';
import { BusinessOwnersModule } from 'src/businessOwners/businessOwners.module';
import { PosAdress, PosAdressSchema } from './models/posadress.schema';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import {
  Organizations,
  OrganizationsSchema,
} from 'src/organizations/models/organization.schema';

@Module({
  providers: [PointsOfSaleService],
  controllers: [PointsOfSaleAdminController],
  imports: [
    AuthModule,
    OrganizationsModule,
    ImageHandlerModule,
    BusinessOwnersModule,
    MongooseModule.forFeature([
      { name: Organizations.name, schema: OrganizationsSchema },
      { name: POS.name, schema: POSSchema },
      { name: PosAdress.name, schema: PosAdressSchema },
    ]),
  ],
  exports: [PointsOfSaleService],
})
export class PointsOfSaleModule { }
