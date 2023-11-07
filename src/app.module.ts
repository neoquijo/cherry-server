import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ReviewsModule } from './reviews/reviews.module';
import { GoodsModule } from './goods/goods.module';
import { MessagesModule } from './messages/messages.module';
import { OffersModule } from './offers/offers.module';
import { PointsOfSaleModule } from './pointsOfSale/pointsOfSale.module';
import { BusinessOwnersModule } from './businessOwners/businessOwners.module';
import { ManagersModule } from './managers/managers.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    MongooseModule.forRoot(
      'mongodb://root:root@localhost',
      // 'mongodb+srv://admin:admin@cherry-server.l2c5jct.mongodb.net/?retryWrites=true&w=majority',
    ),
    UsersModule,
    OrganizationsModule,
    ReviewsModule,
    GoodsModule,
    MessagesModule,
    OffersModule,
    PointsOfSaleModule,
    BusinessOwnersModule,
    ManagersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { };
