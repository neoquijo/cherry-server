import { Module } from '@nestjs/common';
import { BusinessOwnersService } from './businessOwners.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BusinessOwner,
  BusinessOwnerSchema,
} from './models/businessOwners.schema';
import { BusinesOwnersController } from './businessOwners.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusinessOwner.name, schema: BusinessOwnerSchema },
    ]),
  ],
  providers: [BusinessOwnersService],
  exports: [BusinessOwnersService],
  controllers: [BusinesOwnersController],
})
export class BusinessOwnersModule { }
