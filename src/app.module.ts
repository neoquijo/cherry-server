import { Module, forwardRef } from '@nestjs/common';
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
import { ImageHandlerModule } from './image-handler/image-handler.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PaymentModule } from './payment/payment.module';
import { OrdersModule } from './orders/orders.module';
import { CuponsModule } from './cupons/cupons.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads', 'tempProfileUploads'),
      serveRoot: '/u/profile',
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads', 'offers'),
      serveRoot: '/u/offers',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads', 'offerCards'),
      serveRoot: '/img/offers',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads', 'covers'),
      serveRoot: '/img/covers',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads', 'client'),
      serveRoot: '/img/client',
    }),
    ConfigModule.forRoot(),
    forwardRef(() => AuthModule),
    MongooseModule.forRoot(
      'mongodb://root:sommePassword@clubcherry.shop:27017',
      // 'mongodb://root:root@localhost',
      { dbName: 'cupiponDev' },
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
    ImageHandlerModule,
    PaymentModule,
    OrdersModule,
    CuponsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { };
