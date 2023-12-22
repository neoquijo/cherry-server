import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { OffersService } from './offers.service';

@Controller('/offers')
export class OffersPublicController {
  constructor(private readonly offers: OffersService) { }

  @Get('/search')
  async simpleSearch(@Query() query) {
    return await this.offers.searchOfferQuery(query.lang, query.title);
  }

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
  async getAllActive(@Query('lang') lang, @Req() req) {
    try {
      console.log(lang);
      console.dir(JSON.stringify(req.cookies));
      const result = await this.offers.getAllActiveOffers(lang);
      return result;
    } catch (error) {
      throw new HttpException('Error fetching offers', HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }
}
