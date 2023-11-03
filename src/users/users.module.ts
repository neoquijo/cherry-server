import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, userSchema } from './models/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: userSchema }]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
