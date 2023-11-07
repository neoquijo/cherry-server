import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './models/users.schema';
import { Model } from 'mongoose';
import { ICreateUserDto } from './models/dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private readonly users: Model<Users>) {}
  async createNew(user: ICreateUserDto) {
    return await this.users.create(user);
  }
  async findUserById(id: string) {
    try {
      const result = await this.users
        .findOne({
          $or: [
            {
              id,
            },
            {
              email: id,
            },
            {
              phone: id,
            },
          ],
        })
        .lean();
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'user lookup error',
        HttpStatus.EXPECTATION_FAILED,
        { cause: 'wrong input params' },
      );
    }
  }
}
