import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cupons, cuponSchema } from './models/cupons.schema';
import { CuponsService } from './cupons.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cupons.name, schema: cuponSchema }]),
  ],
  providers: [CuponsService],
  exports: [CuponsService],
})
export class CuponsModule {}
