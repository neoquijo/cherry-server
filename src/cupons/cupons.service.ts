import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cupons } from './models/cupons.schema';
import { Model } from 'mongoose';
import { CreateCuponDto } from './models/createCupon.dto';

@Injectable()
export class CuponsService {
  constructor(@InjectModel(Cupons.name) readonly cupons: Model<Cupons>) {}

  async createCupon(cuponData: CreateCuponDto) {
    try {
      const cupon = await this.cupons.create(cuponData);
      return cupon;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }

  async activateCupon(cuponId) {}
}
