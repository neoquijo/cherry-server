import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, userSchema } from './models/users.schema';
import { Cart, cartSchema } from './models/cart.schema';
import { UserController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      { name: Users.name, schema: userSchema },
      { name: Cart.name, schema: cartSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
