import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { UserGuard } from 'src/auth/userAuth.guard';
import { User } from 'src/auth/owner.decorator';

@Controller('/offers')
export class OffersPublicController {
  constructor(private readonly offers: OffersService) { }

  @Get('/cats')
  async getAllCats() {
    return await this.offers.getCats();
  }

  @Get('/get/:id')
  async getOfferById(@Param('id') id) {
    return await this.offers.getOfferByRegexp(id, 'ru');
  }

  @Get('/:cat')
  async getOffersByCat(@Param('cat') cat: string) {
    try {
      const result = await this.offers.getAllActiveOffersByCat(cat);
      return result;
    } catch (error) {
      throw new HttpException('Error fetching offers', HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }

  @Get('/')
  async getAllActive() {
    try {
      const result = await this.offers.getAllActiveOffers();
      return result;
    } catch (error) {
      throw new HttpException('Error fetching offers', HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }
}
