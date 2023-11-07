import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Organizations,
  OrganizationsSchema,
} from './models/organization.schema';
import { OrganizationsController } from './organizations.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organizations.name, schema: OrganizationsSchema },
    ]),
  ],
  providers: [OrganizationService],
  exports: [OrganizationService],
  controllers: [OrganizationsController],
})
export class OrganizationsModule {}
